export const PRODUCTION_SITE_URL = 'https://revive.su'

export function isProductionSite(siteUrl: string | undefined | null) {
  return String(siteUrl || '').trim() === PRODUCTION_SITE_URL
}
