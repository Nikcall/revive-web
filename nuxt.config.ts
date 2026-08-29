export default defineNuxtConfig({
  compatibilityDate: '2026-08-28',
  srcDir: 'app',
  ssr: true,
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Oswald:wght@700&family=Rubik:wght@300;400;500;600;700;800;900&display=swap',
        },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
  runtimeConfig: {
    crmLeadsUrl: process.env.NUXT_CRM_LEADS_URL || '',
    crmLeadsKey: process.env.NUXT_CRM_LEADS_KEY || '',
    crmPublicPricelistUrl: process.env.NUXT_CRM_PUBLIC_PRICELIST_URL || 'https://crm.revive.su/api/public/pricelist',
    crmTrackUrl: process.env.NUXT_CRM_TRACK_URL || 'https://crm.revive.su',
    // Только сервер. Браузер ходит в /api/site-settings, не в CMS.
    directusUrl: process.env.NUXT_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
  routeRules: {
    '/': { prerender: false },
    '/prices': { prerender: false },
    '/track': { prerender: false },
    '/contacts': { prerender: true },
    '/remont-noutbukov': { prerender: false },
    '/remont-kompyuterov': { prerender: false },
    '/remont-smartfonov': { prerender: false },
    '/remont-planshetov': { prerender: false },
    '/qr': { prerender: true, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/privacy': { prerender: true },
    '/oferta': { prerender: true },
    '/return': { prerender: true },
    '/api/**': { prerender: false },
  },
})
