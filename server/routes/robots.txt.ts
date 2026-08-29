import { PRODUCTION_SITE_URL, isProductionSite } from '#shared/site-env'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  // Пока NUXT_PUBLIC_SITE_URL не равен боевому домену (preview, localhost, staging
  // и т.д.) — полностью закрываем сайт от индексации. Это защищает от ситуации,
  // когда Яндекс/Google проиндексируют preview-домен как отдельное зеркало сайта.
  // После cutover (NUXT_PUBLIC_SITE_URL=https://revive.su) правило снимается
  // автоматически, без ручного вмешательства.
  if (!isProductionSite(config.public.siteUrl)) {
    return 'User-agent: *\nDisallow: /\n'
  }

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /track',
    'Disallow: /qr',
    'Disallow: /api/',
    '',
    `Sitemap: ${PRODUCTION_SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
})
