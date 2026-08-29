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

usePageSeo({
  title: service.value.seo_title,
  description: service.value.seo_description,
  canonical: `/${service.value.slug}`,
})

const { public: { siteUrl } } = useRuntimeConfig()
const reqUrl = useRequestURL()
const baseUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.value.h1,
  description: service.value.hero_description || service.value.short_description,
  url: `${baseUrl}/${service.value.slug}`,
  provider: {
    '@type': 'RepairService',
    name: 'REVIVE',
    url: baseUrl,
  },
  areaServed: {
    '@type': 'City',
    name: 'Сургут',
  },
  offers: {
    '@type': 'Offer',
    price: service.value.price_from,
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
  },
})
</script>

<template>
  <main v-if="service" class="page">
    <div class="hero">
      <div class="wrap hero-inner">
        <div class="hero-text">
          <p class="ol">Услуга</p>
          <h1>{{ service.h1 }}</h1>
          <p class="hero-desc">{{ service.hero_description || service.short_description }}</p>
          <div class="hero-meta">
            <span class="meta-chip">от {{ service.price_from.toLocaleString('ru-RU') }} ₽</span>
            <span class="meta-chip">диагностика {{ service.diagnostic_price ? service.diagnostic_price.toLocaleString('ru-RU') + ' ₽' : 'бесплатно' }}</span>
            <span class="meta-chip">гарантия {{ service.warranty }}</span>
          </div>
          <a class="hero-cta" href="#order">Оставить заявку</a>
        </div>
        <div v-if="service.icon" class="hero-icon">
          <img :src="service.icon" :alt="service.name" width="180" height="180" />
        </div>
      </div>
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
.page { padding-top: var(--header-h); }
.hero {
  background: linear-gradient(135deg, #171717 0%, #2a2a2a 100%);
  color: #fff;
  padding: 56px 0 64px;
}
.hero-inner {
  display: flex;
  align-items: center;
  gap: 48px;
}
.hero-text { flex: 1; min-width: 0; }
.ol { color: var(--brand); font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; font-size: 13px; }
h1 { font-size: clamp(28px, 4vw, 44px); margin-bottom: 16px; line-height: 1.15; }
.hero-desc { font-size: 17px; line-height: 1.65; opacity: 0.85; max-width: 540px; margin-bottom: 20px; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.meta-chip {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.hero-cta {
  display: inline-block;
  background: var(--brand);
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}
.hero-cta:hover { background: #e04410; }
.hero-icon {
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  background: rgba(255,255,255,0.05);
  border-radius: 24px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255,255,255,0.08);
}
.hero-icon img { width: 100px; height: 100px; opacity: 0.9; }
@media (max-width: 768px) {
  .hero { padding: 40px 0 48px; }
  .hero-inner { flex-direction: column-reverse; gap: 28px; text-align: center; }
  .hero-desc { max-width: none; }
  .hero-meta { justify-content: center; }
  .hero-cta { display: block; text-align: center; }
  .hero-icon { width: 120px; height: 120px; }
  .hero-icon img { width: 70px; height: 70px; }
}
@media (max-width: 480px) {
  .hero { padding: 32px 0 40px; }
  .hero-inner { gap: 20px; }
  .hero-meta { gap: 8px; }
  .meta-chip { font-size: 12px; padding: 5px 12px; }
}
</style>
