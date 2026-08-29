export default defineEventHandler(() => {
  const urls = [
    { loc: '/', lastmod: new Date().toISOString(), priority: 1.0, changefreq: 'weekly' as const },
    { loc: '/prices', lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'weekly' as const },
    { loc: '/contacts', lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'monthly' as const },
    { loc: '/remont-noutbukov', lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'weekly' as const },
    { loc: '/remont-kompyuterov', lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'weekly' as const },
    { loc: '/remont-smartfonov', lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'weekly' as const },
    { loc: '/remont-planshetov', lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' as const },
    { loc: '/remont-iphone', lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'weekly' as const },
    { loc: '/chistka-noutbuka', lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'monthly' as const },
  ]

  return urls
})
