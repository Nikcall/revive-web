import { isProductionSite } from '#shared/site-env'

export async function useLegalPage(slug: string) {
  const nuxtApp = useNuxtApp()
  const { pageBySlug } = await useCms()

  return nuxtApp.runWithContext(() => {
    const page = computed(() => pageBySlug(slug))
    if (!page.value) {
      throw createError({ statusCode: 404, message: 'Страница не найдена' })
    }

    const { public: { siteUrl } } = useRuntimeConfig()
    const reqUrl = useRequestURL()
    const fallbackUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`
    const canonicalPath = page.value.canonical || `/${slug}`
    const absoluteCanonical = canonicalPath.startsWith('http') ? canonicalPath : `${fallbackUrl}${canonicalPath}`

    // См. usePageSeo.ts — тот же принцип: noindex запекается в HTML на build
    // time, чтобы работать и для prerendered страниц (contacts/oferta/privacy/return).
    const robots = !isProductionSite(siteUrl) ? 'noindex, nofollow' : undefined

    useHead({
      title: page.value.seo_title || page.value.title,
      meta: [
        { name: 'description', content: page.value.seo_description || page.value.title },
        ...(robots ? [{ name: 'robots', content: robots }] : []),
      ],
      link: [{ rel: 'canonical', href: absoluteCanonical }],
    })

    return page
  })
}
