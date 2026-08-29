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

useBreadcrumb([
  { name: 'Главная', href: '/' },
  { name: 'Контакты', href: '/contacts' },
])

const { public: { siteUrl } } = useRuntimeConfig()
const reqUrl = useRequestURL()
const baseUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'RepairService',
  name: 'REVIVE',
  description: 'Сервисный центр по ремонту компьютеров, ноутбуков, смартфонов и планшетов в Сургуте',
  url: `${baseUrl}/contacts`,
  telephone: '+79952431995',
  email: s.value.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: s.value.address,
    addressLocality: s.value.city,
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 61.25,
    longitude: 73.38,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '21:00',
  },
  priceRange: '$$',
  areaServed: {
    '@type': 'City',
    name: 'Сургут',
  },
  sameAs: [s.value.telegram, s.value.whatsapp, s.value.vk].filter(Boolean),
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
