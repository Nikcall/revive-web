export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
] as const

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number]

export type AttributionSnapshot = {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
  yclid: string
  landing_page: string
  referrer: string
}

export type WebsiteLeadPayload = {
  name: string
  phone: string
  message: string
  service: string
  page_url: string
  landing_page: string
  referrer: string
  source: 'website'
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  yclid: string | null
  company?: string
}

export const EMPTY_ATTRIBUTION: AttributionSnapshot = {
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
  utm_term: '',
  yclid: '',
  landing_page: '',
  referrer: '',
}

export const ATTR_COOKIE = 'rv_attr'
export const ATTR_STORAGE = 'rv_attr'

export function emptyToNull(value: string | null | undefined) {
  const text = String(value || '').trim()
  return text || null
}
