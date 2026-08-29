import { normalizeSiteHero, SITE_HERO_FALLBACK } from '#shared/site-hero'

type DirectusItem = { data?: Parameters<typeof normalizeSiteHero>[0] }

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const base = String(config.directusUrl || '').replace(/\/$/, '')
  if (!base) {
    return { data: SITE_HERO_FALLBACK }
  }

  try {
    const body = await $fetch<DirectusItem>(`${base}/items/site_settings`, {
      timeout: 5000,
    })
    return { data: normalizeSiteHero(body?.data) }
  } catch {
    return { data: SITE_HERO_FALLBACK }
  }
})
