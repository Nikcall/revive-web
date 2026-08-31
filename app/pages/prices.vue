<script setup lang="ts">
const { content, pageBySlug } = await useCms()
const { priceItems } = await useCatalog()
const page = computed(() => pageBySlug('prices'))
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Страница цен не найдена' })

usePageSeo({
  title: page.value.seo_title,
  description: page.value.seo_description,
  canonical: page.value.canonical,
})

useBreadcrumb([
  { name: 'Главная', href: '/' },
  { name: 'Цены', href: '/prices' },
])

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
</script>

<template>
  <main v-if="page" class="page">
    <h1 class="sr">{{ page.h1 }}</h1>
    <PageBlocks
      :blocks="page.blocks"
      :h1="page.h1"
      :services="content.services"
      :prices="content.prices"
      :faq="content.faq"
      :catalog-prices="priceItems"
      :show-all-prices="true"
    />
  </main>
</template>

<style scoped>
.page { padding-top: calc(var(--header-h) + 8px); }
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
