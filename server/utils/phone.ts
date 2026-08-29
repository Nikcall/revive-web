import { EMPTY_ATTRIBUTION, type AttributionSnapshot } from '#shared/lead-contract'

export function normalizeRuPhone(value = '') {
  const digits = String(value || '').replace(/\D+/g, '')
  if (!digits) return ''
  if (digits.length === 11 && digits.startsWith('8')) return `+7${digits.slice(1)}`
  if (digits.length === 11 && digits.startsWith('7')) return `+${digits}`
  if (digits.length === 10) return `+7${digits}`
  return ''
}

export function isRuMobile(phone: string) {
  return /^\+7\d{10}$/.test(phone)
}

export function clip(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max)
}

export function parseAttributionCookie(raw = ''): AttributionSnapshot {
  try {
    const parsed = JSON.parse(raw) as Partial<AttributionSnapshot>
    return {
      ...EMPTY_ATTRIBUTION,
      utm_source: clip(parsed.utm_source, 200),
      utm_medium: clip(parsed.utm_medium, 200),
      utm_campaign: clip(parsed.utm_campaign, 200),
      utm_content: clip(parsed.utm_content, 200),
      utm_term: clip(parsed.utm_term, 200),
      yclid: clip(parsed.yclid, 200),
      landing_page: clip(parsed.landing_page, 300),
      referrer: clip(parsed.referrer, 500),
    }
  } catch {
    return { ...EMPTY_ATTRIBUTION }
  }
}
