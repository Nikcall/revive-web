import { normalizeSiteHero, SITE_HERO_FALLBACK, type SiteHeroSettings } from '#shared/site-hero'

export { SITE_HERO_FALLBACK }
export type { SiteHeroSettings }

type SiteSettingsResponse = { data?: SiteHeroSettings | null }

export async function useSiteSettings() {
  const { data, error } = await useFetch<SiteSettingsResponse>('/api/site-settings', {
    key: 'site-settings',
  })

  const settings = computed<SiteHeroSettings>(() => normalizeSiteHero(data.value?.data))
  const fromCms = computed(() => Boolean(data.value?.data && !error.value))

  return { settings, error, fromCms }
}
