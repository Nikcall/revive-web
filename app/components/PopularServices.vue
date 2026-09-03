<script setup lang="ts">
const props = defineProps<{
  slug?: string
}>()

interface PopularItem {
  name: string
  price: string
}

const POPULAR: Record<string, PopularItem[]> = {
  'remont-smartfonov': [
    { name: 'Диагностика смартфона', price: 'Бесплатно' },
    { name: 'Замена дисплейного модуля', price: 'от 1 990 ₽' },
    { name: 'Замена аккумулятора', price: 'от 1 490 ₽' },
    { name: 'Ремонт разъёма зарядки', price: 'от 1 990 ₽' },
    { name: 'Замена задней крышки / корпуса', price: 'от 1 490 ₽' },
    { name: 'Замена камеры', price: 'от 1 990 ₽' },
    { name: 'Ремонт динамика / микрофона', price: 'от 1 490 ₽' },
    { name: 'Ремонт кнопок / SIM / аудио', price: 'от 1 490 ₽' },
    { name: 'Компонентный ремонт материнской платы', price: 'от 5 900 ₽' },
    { name: 'Перенос данных на другое устройство', price: 'от 1 490 ₽' },
  ],
  'remont-planshetov': [
    { name: 'Диагностика планшета', price: 'Бесплатно' },
    { name: 'Замена аккумулятора', price: 'от 1 490 ₽' },
    { name: 'Ремонт разъёма зарядки', price: 'от 2 490 ₽' },
    { name: 'Замена дисплейного модуля', price: 'от 3 490 ₽' },
    { name: 'Замена сенсорного стекла / тачскрина', price: 'от 3 990 ₽' },
    { name: 'Ремонт динамика', price: 'от 1 990 ₽' },
    { name: 'Ремонт кнопок / шлейфов', price: 'от 1 990 ₽' },
    { name: 'Компонентный ремонт материнской платы', price: 'от 5 900 ₽' },
  ],
  'remont-noutbukov': [
    { name: 'Диагностика ноутбука', price: 'Бесплатно' },
    { name: 'Чистка и обслуживание офисного ноутбука', price: 'от 2 900 ₽' },
    { name: 'Замена накопителя HDD / SSD', price: 'от 1 490 ₽' },
    { name: 'Замена матрицы', price: 'от 2 990 ₽' },
    { name: 'Замена клавиатуры', price: 'от 1 990 ₽' },
    { name: 'Замена аккумулятора', price: 'от 1 990 ₽' },
    { name: 'Ремонт разъёма питания', price: 'от 3 990 ₽' },
    { name: 'Ремонт корпуса и петель', price: 'от 3 990 ₽' },
    { name: 'Ремонт цепей питания', price: 'от 5 900 ₽' },
    { name: 'Компонентный ремонт материнской платы', price: 'от 6 900 ₽' },
  ],
  'remont-kompyuterov': [
    { name: 'Диагностика системного блока', price: 'Бесплатно' },
    { name: 'Комплексная чистка ПК', price: 'от 1 990 ₽' },
    { name: 'Замена / установка SSD, HDD или RAM', price: 'от 990 ₽' },
    { name: 'Замена блока питания', price: 'от 1 490 ₽' },
    { name: 'Замена системы охлаждения процессора', price: 'от 1 490 ₽' },
    { name: 'Прошивка BIOS', price: 'от 1 190 ₽' },
    { name: 'Прошивка BIOS программатором', price: 'от 3 490 ₽' },
    { name: 'Компонентный ремонт материнской платы', price: 'от 4 990 ₽' },
    { name: 'Сборка домашнего / офисного ПК', price: 'от 4 990 ₽' },
    { name: 'Сборка игрового ПК', price: 'от 7 990 ₽' },
  ],
  'remont-monorolikov': [
    { name: 'Диагностика моноблока', price: 'от 1 490 ₽' },
    { name: 'Замена SSD / HDD', price: 'от 1 490 ₽' },
    { name: 'Установка / увеличение оперативной памяти', price: 'от 1 190 ₽' },
    { name: 'Комплексное обслуживание системы охлаждения', price: 'от 2 490 ₽' },
    { name: 'Замена матрицы', price: 'от 3 990 ₽' },
    { name: 'Замена блока питания', price: 'от 3 490 ₽' },
    { name: 'Ремонт подсветки', price: 'от 4 990 ₽' },
    { name: 'Компонентный ремонт материнской платы', price: 'от 5 900 ₽' },
  ],
}

const popularItems = computed<PopularItem[]>(() => {
  return POPULAR[props.slug || ''] || []
})
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
            <span class="card-price">{{ item.price }}</span>
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
      <p class="note">Цены указаны за работу. Стоимость запчастей и комплектующих рассчитывается отдельно.</p>
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
.note {
  margin-top: 16px;
  font-size: 13px;
  color: var(--dim);
  text-align: center;
  line-height: 1.5;
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 580px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
