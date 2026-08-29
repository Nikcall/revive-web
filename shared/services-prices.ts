export const PRICE_TYPES = ['fixed', 'from', 'range', 'free', 'on_request'] as const

export type PriceType = (typeof PRICE_TYPES)[number]

export type ServiceCategory = {
  id?: number
  name: string
  slug: string
  description?: string | null
  sort?: number
  is_active?: boolean
}

export type Service = {
  id?: number
  category_id?: number | ServiceCategory
  name: string
  slug: string
  landing_path?: string
  short_description?: string | null
  description?: string | null
  icon?: string | null
  image?: string | null
  is_featured?: boolean
  is_active?: boolean
  sort?: number
}

export type PriceItem = {
  id?: number
  service_id?: number | Service
  key?: string
  name: string
  group?: string | null
  description?: string | null
  price_type: PriceType
  price_from?: number | null
  price_to?: number | null
  price_fixed?: number | null
  unit?: string | null
  note?: string | null
  is_active?: boolean
  sort?: number
}

const RUB = new Intl.NumberFormat('ru-RU')

function rub(value: number) {
  return `${RUB.format(value)} ₽`
}

/** Человекочитаемая цена собирается на фронте. В CMS хранятся только type + числа. */
export function formatPriceItem(item: Pick<PriceItem, 'price_type' | 'price_from' | 'price_to' | 'price_fixed'>) {
  switch (item.price_type) {
    case 'free':
      return 'Бесплатно'
    case 'on_request':
      return 'По результатам диагностики'
    case 'fixed':
      return item.price_fixed == null ? 'По результатам диагностики' : rub(item.price_fixed)
    case 'from':
      return item.price_from == null ? 'По результатам диагностики' : `от ${rub(item.price_from)}`
    case 'range': {
      if (item.price_from != null && item.price_to != null) return `${RUB.format(item.price_from)}–${RUB.format(item.price_to)} ₽`
      if (item.price_from != null) return `от ${rub(item.price_from)}`
      if (item.price_to != null) return rub(item.price_to)
      return 'По результатам диагностики'
    }
    default:
      return 'По результатам диагностики'
  }
}
