<script setup lang="ts">
const route = useRoute()
const { content, serviceBySlug } = await useCms()
const reserved = new Set(['prices', 'contacts', 'api', 'qr', 'privacy', 'oferta', 'return'])
const slug = String(route.params.slug || '')
const { priceItems } = await useCatalog(slug)

if (reserved.has(slug)) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}

const service = computed(() => serviceBySlug(slug))
if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Услуга не найдена' })
}

useHead({
  title: service.value.seo_title,
  meta: [{ name: 'description', content: service.value.seo_description }],
  link: [{ rel: 'canonical', href: `/${service.value.slug}` }],
})
</script>

<template>
  <main v-if="service" class="page">
    <div class="wrap head">
      <p class="ol">Услуга</p>
      <h1>{{ service.h1 }}</h1>
      <p>{{ service.short_description }}</p>
      <p class="meta">от {{ service.price_from.toLocaleString('ru-RU') }} ₽ · диагностика {{ service.diagnostic_price ? service.diagnostic_price.toLocaleString('ru-RU') + ' ₽' : 'бесплатно при ремонте' }} · гарантия {{ service.warranty }}</p>
    </div>
    <PageBlocks
      :blocks="service.blocks"
      :h1="service.h1"
      :services="content.services"
      :prices="content.prices"
      :faq="content.faq"
      :service-slug="service.slug"
      :catalog-prices="priceItems"
    />
  </main>
</template>

<style scoped>
.page { padding-top: calc(var(--header-h) + 8px); }
.head { padding: 48px 0 12px; }
.ol { color: var(--brand); font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; }
h1 { font-size: clamp(32px, 5vw, 48px); margin-bottom: 12px; }
.meta { margin-top: 12px; color: #666; }
</style>
