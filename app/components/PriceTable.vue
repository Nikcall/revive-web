<script setup lang="ts">
const prices = [
  { name: 'Установка Windows', price: 'от 3 000 ₽' },
  { name: 'Установка Windows с сохранением данных', price: 'от 3 800 ₽' },
  { name: 'Восстановление запуска Windows после сбоя', price: 'от 1 500 ₽' },
  { name: 'Клонирование системы на SSD / HDD', price: 'от 1 500 ₽' },
  { name: 'Установка и настройка драйверов', price: 'от 800 ₽' },
  { name: 'Установка и настройка пользовательского ПО', price: 'от 800 ₽' },
  { name: 'Установка Microsoft Office', price: 'от 900 ₽' },
  { name: 'Удаление вредоносного и рекламного ПО', price: 'от 1 200 ₽' },
  { name: 'Настройка и оптимизация Windows', price: 'от 1 500 ₽' },
  { name: 'Перенос пользовательских данных', price: 'от 1 500 ₽' },
  { name: 'Восстановление удалённых данных', price: 'от 2 000 ₽' },
  { name: 'Комплексная настройка компьютера', price: 'от 2 500 ₽' },
]
</script>

<template>
  <section class="prices">
    <div class="wrap">
      <span class="eyebrow">Прозрачные цены</span>
      <h2 class="title">Прайс-лист — <span>RE</span>VIVE</h2>
      <p class="subtitle">Ориентировочные цены на работы. Точная стоимость — после бесплатной диагностики.</p>
      <div class="table">
        <div v-for="item in prices" :key="item.name" class="row">
          <span class="name">{{ item.name }}</span>
          <span class="price">{{ item.price }}</span>
        </div>
      </div>
      <p class="note">
        Стоимость указана за работу. Лицензии на Windows, Microsoft Office, антивирусы и другое платное программное обеспечение приобретаются клиентом отдельно.
      </p>
      <NuxtLink to="/prices" class="all-link">
        Посмотреть все цены
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.prices {
  padding: 72px 0;
  background: #f6f6f6;
}
.wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 48px;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 12px;
}
.eyebrow::before {
  content: '';
  width: 24px;
  height: 2px;
  background: var(--brand);
}
.title {
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.title span {
  color: var(--brand);
}
.subtitle {
  font-size: 16px;
  color: var(--dim);
  margin-bottom: 32px;
}
.table {
  background: #fff;
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.row:last-child {
  border-bottom: 0;
}
.row:hover {
  background: rgba(253, 81, 25, 0.03);
}
.name {
  flex: 1;
  font-weight: 500;
}
.price {
  font-weight: 700;
  color: var(--brand);
  white-space: nowrap;
}
.note {
  margin-top: 20px;
  font-size: 13px;
  color: var(--dim);
  line-height: 1.6;
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
@media (max-width: 580px) {
  .wrap { padding: 0 16px; }
  .prices { padding: 48px 0; }
  .row { padding: 12px 16px; font-size: 13px; }
}
</style>
