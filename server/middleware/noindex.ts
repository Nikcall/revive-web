import { isProductionSite } from '#shared/site-env'

/**
 * Пока сайт крутится не на боевом домене (preview.revive.su, localhost и т.д.),
 * ставим X-Robots-Tag: noindex на все ответы. Это подстраховка на случай, если
 * поисковик уже закэшировал старый robots.txt или проигнорировал его — HTTP-
 * заголовок действует мгновенно и не зависит от robots.txt.
 * Снимается автоматически после смены NUXT_PUBLIC_SITE_URL на боевой домен.
 * Работает только для динамических (SSR) запросов — prerendered страницы
 * получают noindex через <meta name="robots"> в usePageSeo/useLegalPage,
 * т.к. они отдаются как статика и этот middleware для них не вызывается.
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  if (!isProductionSite(config.public.siteUrl)) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
