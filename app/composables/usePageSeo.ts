interface PageSeo {
  title: string
  description: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  robots?: string
}

export function usePageSeo(seo: PageSeo) {
  const { public: { siteUrl } } = useRuntimeConfig()
  const reqUrl = useRequestURL()
  const baseUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`
  const path = reqUrl.pathname

  const canonical = seo.canonical || path
  const absoluteCanonical = canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`

  const ogImage = seo.ogImage || '/og.jpg'
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`

  useHead({
    title: seo.title,
    meta: [
      { name: 'description', content: seo.description },
      ...(seo.robots ? [{ name: 'robots', content: seo.robots }] : []),
      { property: 'og:title', content: seo.ogTitle || seo.title },
      { property: 'og:description', content: seo.ogDescription || seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: absoluteCanonical },
      { property: 'og:image', content: absoluteOgImage },
    ],
    link: [{ rel: 'canonical', href: absoluteCanonical }],
  })
}
