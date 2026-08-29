import type { CatalogService, CatalogPrice } from '#shared/catalog'
import type { PriceType } from '#shared/services-prices'

/**
 * Mapping CRM-категорий → страниц сайта.
 * Ключ — точное имя категории в service-price-v4.json.
 * Значение — slug страницы (совпадает с файлом в app/pages/).
 */
const CATEGORY_LANDING: Record<string, { slug: string; landing: string; serviceName: string }> = {
  'Смартфоны (Samsung, Xiaomi, Android)': {
    slug: 'remont-smartfonov',
    landing: '/remont-smartfonov',
    serviceName: 'Ремонт смартфонов',
  },
  'Планшеты Android': {
    slug: 'remont-planshetov',
    landing: '/remont-planshetov',
    serviceName: 'Ремонт планшетов',
  },
  'ПО / Windows / macOS': {
    slug: 'remont-kompyuterov',
    landing: '/remont-kompyuterov',
    serviceName: 'Ремонт компьютеров',
  },
  iPhone: {
    slug: 'remont-iphone',
    landing: '/remont-iphone',
    serviceName: 'Ремонт iPhone',
  },
  iPad: {
    slug: 'remont-planshetov',
    landing: '/remont-planshetov',
    serviceName: 'Ремонт планшетов',
  },
  MacBook: {
    slug: 'remont-noutbukov',
    landing: '/remont-noutbukov',
    serviceName: 'Ремонт ноутбуков',
  },
  iMac: {
    slug: 'remont-kompyuterov',
    landing: '/remont-kompyuterov',
    serviceName: 'Ремонт компьютеров',
  },
  Ноутбуки: {
    slug: 'remont-noutbukov',
    landing: '/remont-noutbukov',
    serviceName: 'Ремонт ноутбуков',
  },
  'Системные блоки / ПК': {
    slug: 'remont-kompyuterov',
    landing: '/remont-kompyuterov',
    serviceName: 'Ремонт компьютеров',
  },
  Моноблоки: {
    slug: 'remont-kompyuterov',
    landing: '/remont-kompyuterov',
    serviceName: 'Ремонт компьютеров',
  },
  'Дополнительные услуги': {
    slug: 'prices',
    landing: '/prices',
    serviceName: 'Дополнительные услуги',
  },
}

type CrmPricelist = {
  version?: string
  effectiveMonth?: string
  title?: string
  terms?: string | null
  serviceFormat?: string | null
  categories?: Array<{
    name: string
    items?: Array<{
      sku?: string
      group?: string | null
      name?: string
      pricingMode?: string | null
      priceMin?: number | null
      priceMax?: number | null
    }>
  }>
}

type CrmApiResponse = {
  success?: boolean
  data?: CrmPricelist
}

function toPriceType(mode?: string | null): PriceType {
  switch (mode) {
    case 'free':
      return 'free'
    case 'from':
      return 'from'
    case 'range':
      return 'range'
    default:
      return 'fixed'
  }
}

function mapCrmToServices(pricelist: CrmPricelist): CatalogService[] {
  const categories = pricelist.categories || []
  const serviceMap = new Map<string, CatalogPrice[]>()

  for (const category of categories) {
    const mapping = CATEGORY_LANDING[category.name] || {
      slug: 'prices',
      landing: '/prices',
      serviceName: category.name,
    }
    const serviceKey = mapping.slug

    if (!serviceMap.has(serviceKey)) {
      serviceMap.set(serviceKey, [])
    }

    for (const item of category.items || []) {
      const priceType = toPriceType(item.pricingMode)
      serviceMap.get(serviceKey)!.push({
        sku: item.sku || '',
        key: item.sku || '',
        name: item.name || '',
        group: item.group || '',
        description: '',
        price_type: priceType,
        price_from: item.priceMin ?? null,
        price_to: item.priceMax ?? null,
        price_fixed: priceType === 'fixed' ? (item.priceMin ?? null) : null,
        unit: '',
        note: '',
        is_active: true,
        sort: 0,
        category_name: category.name,
        service_slug: mapping.slug,
        service_name: mapping.serviceName,
        landing_path: mapping.landing,
      })
    }
  }

  const services: CatalogService[] = []
  for (const [slug, items] of serviceMap) {
    const first = items[0]
    services.push({
      slug,
      name: first?.service_name || slug,
      landing_path: first?.landing_path || `/${slug}`,
      category_name: first?.category_name || '',
      price_items: items,
    })
  }

  return services
}

/**
 * Nuxt не кэширует прайс — CRM уже кэширует 5 минут.
 * Единственное исключение: при ошибке CRM отдаём последний известный
 * набор данных, чтобы сайт не падал полностью.
 * Свежий lastGood хранится ≤24 часа; при большей давности — 503.
 */
let lastGood: { services: CatalogService[]; fetchedAt: number } | null = null
const STALE_MAX_MS = 24 * 60 * 60 * 1000

export default defineEventHandler(async (event) => {
  const slug = String(getQuery(event).slug || '').trim()
  const config = useRuntimeConfig()
  const crmUrl = String(config.crmPublicPricelistUrl || '').replace(/\/$/, '')

  if (!crmUrl) {
    throw createError({ statusCode: 500, statusMessage: 'CRM pricelist URL not configured' })
  }

  try {
    const response = await $fetch<CrmApiResponse>(crmUrl, { timeout: 10000 })
    if (!response?.success || !response?.data) {
      throw new Error('Invalid CRM response')
    }
    const services = mapCrmToServices(response.data)
    lastGood = { services, fetchedAt: Date.now() }
    return { services: slug ? services.filter((s) => s.slug === slug) : services }
  } catch (err) {
    if (lastGood) {
      const ageMs = Date.now() - lastGood.fetchedAt
      const ageMin = Math.round(ageMs / 60_000)
      if (ageMs > STALE_MAX_MS) {
        console.error(`[catalog] CRM unavailable, stale data >24h (age ${ageMin}m) — returning 503`)
        throw createError({
          statusCode: 502,
          statusMessage: 'Прайс-лист временно недоступен. Попробуйте позже.',
        })
      }
      console.warn(`[catalog] CRM unavailable — serving stale pricelist (age ${ageMin}m)`)
      return { services: slug ? lastGood.services.filter((s) => s.slug === slug) : lastGood.services }
    }
    throw createError({
      statusCode: 502,
      statusMessage: `Pricelist unavailable: ${err instanceof Error ? err.message : 'unknown'}`,
    })
  }
})
