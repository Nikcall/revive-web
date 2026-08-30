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

  // Приватные поля НЕ читаются через process.env.* вручную — Nuxt сам
  // подставляет значения из переменных окружения NUXT_* в рантайме
  // (build-time только для public.siteUrl, см. Dockerfile ARG).
  runtimeConfig: {
    crmLeadsUrl: '',
    crmLeadsKey: '',
    crmPublicPricelistUrl: '',
    crmTrackUrl: process.env.NUXT_CRM_TRACK_URL || 'https://crm.revive.su',
    directusUrl: '',
    public: {
      siteUrl: '',
      yandexMetrikaId: '',
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
    '/remont-iphone': { prerender: false },
    '/qr': { prerender: true, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/privacy': { prerender: true },
    '/oferta': { prerender: true },
    '/return': { prerender: true },
    '/api/**': { prerender: false },
  },

  modules: ['@nuxtjs/sitemap'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://revive.su',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: [
      '/track',
      '/qr',
      '/privacy',
      '/oferta',
      '/return',
      '/api/**',
    ],
    canonical: false,
  },
})
