import { formatPriceItem, type PriceItem, type PriceType } from './services-prices'

export type CatalogPrice = PriceItem & {
  category_name: string
  service_slug: string
  service_name: string
  landing_path: string
}

export type CatalogService = {
  slug: string
  name: string
  landing_path: string
  category_name: string
  price_items: CatalogPrice[]
}

type DirectusService = {
  id?: number
  name?: string
  slug?: string
  landing_path?: string | null
  is_active?: boolean
  category_id?: number | { name?: string; slug?: string } | null
  price_items?: DirectusPrice[] | null
}

type DirectusPrice = {
  id?: number
  key?: string
  name?: string
  group?: string | null
  description?: string | null
  price_type?: PriceType
  price_from?: number | null
  price_to?: number | null
  price_fixed?: number | null
  unit?: string | null
  note?: string | null
  is_active?: boolean
  sort?: number
}

function categoryName(value: DirectusService['category_id']) {
  if (value && typeof value === 'object') return String(value.name || '')
  return ''
}

export function normalizeLandingPath(path?: string | null, slug?: string | null) {
  const raw = String(path || '').trim()
  if (raw) return raw.startsWith('/') ? raw : `/${raw}`
  return slug ? `/${String(slug).replace(/^\//, '')}` : ''
}

export function matchesLanding(item: Pick<CatalogPrice, 'landing_path' | 'service_slug'>, pageSlug?: string) {
  if (!pageSlug) return true
  const want = normalizeLandingPath('', pageSlug)
  return item.landing_path === want || item.service_slug === pageSlug
}

export function mapCatalog(services: DirectusService[]): CatalogService[] {
  return (services || [])
    .filter((service) => service.is_active !== false && service.slug)
    .map((service) => {
      const slug = String(service.slug)
      const name = String(service.name || '')
      const landing = normalizeLandingPath(service.landing_path, slug)
      const cat = categoryName(service.category_id)
      const items = (service.price_items || [])
        .filter((item) => item.is_active !== false)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map((item) => ({
          id: item.id,
          key: String(item.key || ''),
          name: String(item.name || ''),
          group: item.group || '',
          description: item.description || '',
          price_type: (item.price_type || 'on_request') as PriceType,
          price_from: item.price_from ?? null,
          price_to: item.price_to ?? null,
          price_fixed: item.price_fixed ?? null,
          unit: item.unit || '',
          note: item.note || '',
          is_active: item.is_active !== false,
          sort: item.sort || 0,
          category_name: cat,
          service_slug: slug,
          service_name: name,
          landing_path: landing,
        }))
      return { slug, name, landing_path: landing, category_name: cat, price_items: items }
    })
}

export function catalogPriceLabel(item: Pick<PriceItem, 'price_type' | 'price_from' | 'price_to' | 'price_fixed'>) {
  return formatPriceItem(item)
}
