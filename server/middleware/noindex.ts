const PRODUCTION_SITE_URL = 'https://revive.su'

/**
 * Пока сайт крутится не на боевом домене (preview.revive.su, localhost и т.д.),
 * ставим X-Robots-Tag: noindex на все ответы. Это подстраховка на случай, если
 * поисковик уже закэшировал старый robots.txt или проигнорировал его — HTTP-
 * заголовок действует мгновенно и не зависит от robots.txt.
 * Снимается автоматически после смены NUXT_PUBLIC_SITE_URL на боевой домен.
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || '').trim()

  if (siteUrl !== PRODUCTION_SITE_URL) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
