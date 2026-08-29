export async function useLegalPage(slug: string) {
  const nuxtApp = useNuxtApp()
  const { pageBySlug } = await useCms()

  return nuxtApp.runWithContext(() => {
    const page = computed(() => pageBySlug(slug))
    if (!page.value) {
      throw createError({ statusCode: 404, message: 'Страница не найдена' })
    }

    useHead({
      title: page.value.seo_title || page.value.title,
      meta: [
        { name: 'description', content: page.value.seo_description || page.value.title },
      ],
      link: [{ rel: 'canonical', href: page.value.canonical || `/${slug}` }],
    })

    return page
  })
}
