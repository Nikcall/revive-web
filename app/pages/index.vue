<script setup lang="ts">
const { content, pageBySlug } = await useCms()
const page = computed(() => pageBySlug('home'))
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Главная не найдена' })

usePageSeo({
  title: page.value.seo_title,
  description: page.value.seo_description,
  canonical: page.value.canonical,
  ogTitle: 'Ремонт компьютеров, ноутбуков, смартфонов с выездом по Сургуту — REVIVE',
  ogDescription: 'Ремонт компьютерной, мобильной и цифровой техники в Сургуте. Бесплатная диагностика, выезд мастера, гарантия на все работы. Быстро, честно, удобно!',
  ogImage: page.value.og_image,
})

const { public: { siteUrl } } = useRuntimeConfig()

if (content.value.faq?.length) {
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.value.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  })
}

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'REVIVE',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})
</script>

<template>
  <main v-if="page">
    <PageBlocks
      :blocks="page.blocks"
      :h1="page.h1"
      :services="content.services"
      :prices="content.prices"
      :faq="content.faq"
    />
  </main>
</template>
