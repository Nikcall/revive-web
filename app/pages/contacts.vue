<script setup lang="ts">
const { content, pageBySlug } = await useCms()
const page = computed(() => pageBySlug('contacts'))
const s = computed(() => content.value.settings)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Контакты не найдены' })

usePageSeo({
  title: page.value.seo_title,
  description: page.value.seo_description,
  canonical: page.value.canonical,
})
</script>

<template>
  <main v-if="page" class="page">
    <div class="wrap">
      <h1>{{ page.h1 }}</h1>
      <ul>
        <li>Тел.: <a :href="s.phone_href">{{ s.phone }}</a></li>
        <li>E-mail: <a :href="`mailto:${s.email}`">{{ s.email }}</a></li>
        <li>Адрес мастерской: {{ s.address }}</li>
        <li>Юридический адрес: {{ s.address }}</li>
        <li>Режим работы: {{ s.hours }}</li>
      </ul>
      <p>{{ s.legal_name }} · ИНН {{ s.inn }} · ОГРНИП {{ s.ogrnip }}</p>
    </div>
    <PageBlocks :blocks="page.blocks" :h1="page.h1" :services="content.services" :prices="content.prices" :faq="content.faq" />
  </main>
</template>

<style scoped>
.page { padding-top: calc(var(--header-h) + 32px); padding-bottom: 40px; }
h1 { font-size: clamp(28px, 6vw, 48px); margin-bottom: 20px; }
ul { list-style: none; font-size: 18px; line-height: 1.9; margin-bottom: 16px; }
p { color: #666; }
</style>
