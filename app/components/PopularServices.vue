<script setup lang="ts">
import type { CatalogPrice } from '#shared/catalog'

const props = defineProps<{
  slug?: string
}>()

const POPULAR: Record<string, string[]> = {
  'remont-noutbukov': [
    'Профилактика / замена кулера',
    'Замена дисплейного модуля (в сборе)',
    'Замена клавиатуры',
    'Замена аккумулятора',
    'Модернизация накопителя HDD / SSD',
    'Восстановление после попадания жидкости',
  ],
  'remont-smartfonov': [
    'Замена дисплея',
    'Замена аккумулятора',
    'Замена сенсорного стекла / тачскрина',
    'Ремонт разъёма питания',
    'Замена камеры / вибромотора / датчиков',
    'Восстановление прошивки / обновление ПО',
  ],
  'remont-kompyuterov': [
    'Установка и настройка Windows 10/11',
    'Комплексная настройка компьютера «под ключ»',
    'Установка и настройка Microsoft Office',
    'Установка и настройка драйверов / устройств',
    'Установка графических / инженерных / видеопрограмм',
    'Обновление Windows и системных компонентов',
  ],
  'remont-planshetov': [
    'Замена LCD матрицы',
    'Замена тачскрина',
    'Замена аккумулятора',
    'Ремонт разъёма зарядки',
    'Замена кнопок питания / громкости',
    'Компонентный ремонт платы',
  ],
}

const { data } = await useFetch<{ services: { price_items: CatalogPrice[] }[] }>('/api/catalog', {
  key: `popular:${props.slug}`,
  query: props.slug ? { slug: props.slug } : undefined,
})

const popularItems = computed(() => {
  const names = POPULAR[props.slug || ''] || []
  const allItems = data.value?.services?.[0]?.price_items || []
  return allItems
    .filter((p) => names.includes(p.name))
    .sort((a, b) => {
      const ia = names.indexOf(a.name)
      const ib = names.indexOf(b.name)
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
    })
    .slice(0, 6)
})

function priceLabel(item: CatalogPrice) {
  if (item.price_type === 'free') return 'Бесплатно'
  if (item.price_fixed != null) return `${item.price_fixed.toLocaleString('ru-RU')} ₽`
  if (item.price_from != null) return `от ${item.price_from.toLocaleString('ru-RU')} ₽`
  return 'уточняйте'
}
</script>

<template>
  <section v-if="popularItems.length" class="popular">
    <div class="wrap">
      <h2 class="title">Популярные услуги</h2>
      <p class="subtitle">Что чаще всего заказывают наши клиенты</p>
      <div class="grid">
        <div v-for="item in popularItems" :key="item.name" class="card">
          <div class="card-head">
            <span class="card-name">{{ item.name }}</span>
            <span class="card-price">{{ priceLabel(item) }}</span>
          </div>
          <div class="card-meta">
            <span class="meta">Гарантия до 6 мес.</span>
          </div>
          <a class="card-cta" href="#order">Заказать</a>
        </div>
      </div>
      <NuxtLink to="/prices" class="all-link">
        Посмотреть все цены
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.popular {
  padding: 0 0 72px;
}
.title {
  text-align: center;
  font-size: clamp(22px, 3.5vw, 30px);
  font-weight: 800;
  margin-bottom: 8px;
}
.subtitle {
  text-align: center;
  font-size: 15px;
  color: var(--dim);
  margin-bottom: 32px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.card {
  background: var(--soft);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: rgba(253, 81, 25, 0.3);
  box-shadow: 0 4px 16px rgba(253, 81, 25, 0.06);
}
.card-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.card-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}
.card-price {
  font-size: 16px;
  font-weight: 800;
  color: var(--brand);
}
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.meta {
  font-size: 11px;
  font-weight: 600;
  color: var(--dim);
  background: #fff;
  border: 1px solid var(--border);
  padding: 3px 10px;
  border-radius: 100px;
}
.card-cta {
  display: block;
  text-align: center;
  background: var(--brand);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 0;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}
.card-cta:hover {
  background: #e04410;
}
.all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
  font-size: 15px;
  font-weight: 700;
  color: var(--brand);
  text-decoration: none;
  transition: opacity 0.2s;
}
.all-link:hover {
  opacity: 0.8;
}
.all-link svg {
  width: 16px;
  height: 16px;
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 580px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
