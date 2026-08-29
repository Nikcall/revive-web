import { isProductionSite } from '#shared/site-env'

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
  const fallbackUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`
  const path = reqUrl.pathname

  const canonical = seo.canonical || path
  const absoluteCanonical = canonical.startsWith('http') ? canonical : `${fallbackUrl}${canonical}`

  const ogImage = seo.ogImage || '/og.jpg'
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${fallbackUrl}${ogImage}`

  // На не-production окружении (preview, localhost) принудительно noindex,
  // независимо от переданного seo.robots — запекается в HTML на build time,
  // поэтому работает и для prerendered страниц (X-Robots-Tag middleware
  // их не видит, т.к. они отдаются как статика).
  const robots = seo.robots || (!isProductionSite(siteUrl) ? 'noindex, nofollow' : undefined)

  useHead({
    title: seo.title,
    meta: [
      { name: 'description', content: seo.description },
      ...(robots ? [{ name: 'robots', content: robots }] : []),
      { property: 'og:title', content: seo.ogTitle || seo.title },
      { property: 'og:description', content: seo.ogDescription || seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: absoluteCanonical },
      { property: 'og:image', content: absoluteOgImage },
    ],
    link: [{ rel: 'canonical', href: absoluteCanonical }],
  })
}
