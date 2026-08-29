import type { CmsContent, CmsPage, CmsPrice, CmsQrLink, CmsService } from '~/types/cms'
import fallbackJson from '../../cms/seed/content.json'
import extraJson from '../../cms/seed/extra.json'

const extra = extraJson as { pages: CmsPage[]; qr_links: CmsQrLink[] }

function mergePages(base: CmsPage[], added: CmsPage[]) {
  const map = new Map(base.map((p) => [p.slug, p]))
  for (const page of added) {
    map.set(page.slug, { ...map.get(page.slug), ...page })
  }
  return [...map.values()]
}

const fallback: CmsContent = {
  ...(fallbackJson as CmsContent),
  pages: mergePages((fallbackJson as CmsContent).pages, extra.pages),
  qr_links: extra.qr_links,
}

type Box<T> = { data: T }

function item<T extends object>(payload: Box<T> | T | null | undefined, backup: T): T {
  if (!payload) return backup
  const data = typeof payload === 'object' && 'data' in payload ? (payload as Box<T>).data : (payload as T)
  if (!data || typeof data !== 'object') return backup
  return { ...backup, ...data }
}

function list<T>(payload: Box<T[]> | T[] | null | undefined, backup: T[]): T[] {
  if (!payload) return backup
  if (Array.isArray(payload)) return payload.length ? payload : backup
  const data = (payload as Box<T[]>).data
  return data?.length ? data : backup
}

function priceSlug(row: CmsPrice) {
  if (row.service_slug) return row.service_slug
  if (row.service && typeof row.service === 'object') return row.service.slug || ''
  return ''
}

export function formatPrice(from?: number | null, to?: number | null) {
  if (from == null) return 'уточняйте'
  if (from === 0) return 'бесплатно'
  const a = from.toLocaleString('ru-RU')
  if (to == null) return `от ${a} ₽`
  if (to === from) return `${a} ₽`
  return `${a}–${to.toLocaleString('ru-RU')} ₽`
}

export function pricesForService(prices: CmsPrice[], slug?: string) {
  const active = prices.filter((p) => p.active !== false)
  if (!slug) return active
  return active.filter((p) => priceSlug(p) === slug)
}

export async function useCms() {
  // Остальной контент пока из seed. Цены услуг — /api/catalog → Directus price_items.
  const { data } = await useAsyncData('cms', async (): Promise<CmsContent> => fallback)

  const content = computed(() => data.value || fallback)

  function pageBySlug(slug: string) {
    return content.value.pages.find((p) => p.slug === slug)
  }

  function serviceBySlug(slug: string) {
    return content.value.services.find((s) => s.slug === slug)
  }

  return { content, pageBySlug, serviceBySlug, fallback }
}
