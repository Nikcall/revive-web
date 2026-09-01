<script setup lang="ts">
import type { CmsService } from '~/types/cms'

const ICONS: Record<string, { title: string; icon: string }> = {
  'remont-kompyuterov': { title: 'КОМПЬЮТЕРЫ', icon: '/images/icons/pc.svg' },
  'remont-noutbukov': { title: 'НОУТБУКИ', icon: '/images/icons/laptop.svg' },
  'remont-planshetov': { title: 'ПЛАНШЕТЫ', icon: '/images/icons/tablet.svg' },
  'remont-smartfonov': { title: 'СМАРТФОНЫ', icon: '/images/icons/phone.svg' },
}

const props = defineProps<{ services: CmsService[] }>()

const catalog = computed(() => {
  const source = props.services.length
    ? [...props.services].sort((a, b) => (a.sort || 0) - (b.sort || 0))
    : Object.keys(ICONS).map((slug) => ({
        slug,
        name: ICONS[slug].title,
        price_from: 0,
        diagnostic_price: 0,
        sort: 0,
      } as CmsService))
  return source.map((item) => {
    const meta = ICONS[item.slug]
    return {
      slug: item.slug,
      title: meta?.title || item.name,
      icon: meta?.icon || '/images/icons/pc.svg',
      from: formatPrice(item.price_from),
      diagnostic: item.diagnostic_price ? formatPrice(item.diagnostic_price) : 'диагностика бесплатно',
    }
  })
})
</script>

<template>
  <section class="sec" id="services">
    <div class="wrap">
      <h2 class="ol">УСЛУГИ</h2>
      <div class="grid">
        <NuxtLink v-for="item in catalog" :key="item.slug" :to="`/${item.slug}`" class="card">
          <img :src="item.icon" :alt="item.title" width="88" height="88" />
          <h3>{{ item.title }}</h3>
          <p class="from">{{ item.from }}</p>
          <p class="diag">{{ item.diagnostic }}</p>
        </NuxtLink>
      </div>
      <div class="cta-row">
        <a class="price-btn" href="#price">Стоимость услуг</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  padding: 88px 0 72px;
  background: #fff;
}
.ol {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 40px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 18px 24px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: rgba(253, 81, 25, 0.45);
  box-shadow: 0 10px 28px rgba(253, 81, 25, 0.08);
}
.card img {
  width: 88px;
  height: 88px;
  object-fit: contain;
  margin-bottom: 14px;
}
h3 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}
.from {
  font-size: 18px;
  font-weight: 700;
  color: var(--brand);
}
.diag {
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}
.cta-row {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.price-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: 2px solid var(--brand);
  border-radius: 10px;
  font-weight: 700;
  color: #000;
  transition: 0.2s;
}
.price-btn:hover {
  background: var(--brand);
  color: #fff;
}
@media (max-width: 1100px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 700px) {
  .grid { grid-template-columns: 1fr; }
  .sec { padding: 64px 0 40px; }
}
@media (max-width: 480px) {
  .sec { padding: 48px 0 32px; }
  .ol { font-size: 22px; margin-bottom: 28px; }
  .card { padding: 20px 16px; }
  .card img { width: 64px; height: 64px; }
  h3 { font-size: 17px; }
  .from { font-size: 16px; }
  .cta-row { margin-top: 28px; }
}
</style>
