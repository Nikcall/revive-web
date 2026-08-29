<script setup lang="ts">
const { content, pageBySlug } = await useCms()
const page = computed(() => pageBySlug('home'))
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Главная не найдена' })

useHead({
  title: page.value.seo_title,
  meta: [
    { name: 'description', content: page.value.seo_description },
    { property: 'og:title', content: 'Ремонт компьютеров, ноутбуков, смартфонов с выездом по Сургуту — REVIVE' },
    { property: 'og:description', content: 'Ремонт компьютерной, мобильной и цифровой техники в Сургуте. Бесплатная диагностика, выезд мастера, гарантия на все работы. Быстро, честно, удобно!' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: page.value.canonical || 'https://revive.su/' },
    { property: 'og:image', content: page.value.og_image || '/og.jpg' },
  ],
  link: [{ rel: 'canonical', href: page.value.canonical || '/' }],
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
