export default defineEventHandler(() => {
  const urls = [
    { loc: '/', lastmod: new Date().toISOString(), priority: 1.0 },
    { loc: '/prices', lastmod: new Date().toISOString(), priority: 0.9 },
    { loc: '/contacts', lastmod: new Date().toISOString(), priority: 0.8 },
    { loc: '/remont-noutbukov', lastmod: new Date().toISOString(), priority: 0.9 },
    { loc: '/remont-kompyuterov', lastmod: new Date().toISOString(), priority: 0.9 },
    { loc: '/remont-smartfonov', lastmod: new Date().toISOString(), priority: 0.9 },
    { loc: '/remont-planshetov', lastmod: new Date().toISOString(), priority: 0.8 },
  ]

  return urls.map((url) => ({
    ...url,
    loc: url.loc,
    changefreq: 'weekly',
  }))
})
