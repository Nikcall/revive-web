<script setup lang="ts">
import type { CatalogPrice } from '#shared/catalog'

const props = defineProps<{
  catalogPrices?: CatalogPrice[]
}>()

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

const urgent = ref(false)
const device = ref('')
const group = ref('')
const service = ref('')

const items = computed(() => props.catalogPrices || [])

const devices = computed(() => [...new Set(items.value.map((p) => p.category))])
const groups = computed(() =>
  [...new Set(items.value.filter((p) => p.category === device.value).map((p) => p.group))],
)
const services = computed(() =>
  items.value.filter((p) => p.category === device.value && p.group === group.value),
)
const selected = computed(() => services.value.find((p) => p.name === service.value))

const displayPrice = computed(() => {
  if (!selected.value) return '— ₽'
  if (selected.value.price_type === 'free') return 'Бесплатно'
  if (selected.value.price_fixed != null) return `${selected.value.price_fixed.toLocaleString('ru-RU')} ₽`
  if (selected.value.price_from != null) {
    const n = Math.round(selected.value.price_from * (urgent.value ? (selected.value.urgent_multiplier || 1.3) : 1))
    return `от ${n.toLocaleString('ru-RU')} ₽`
  }
  return 'уточняйте'
})

const resultHint = computed(() =>
  selected.value ? 'Без стоимости запчастей · Точная цена после диагностики' : 'Выберите услугу выше',
)

watch(device, () => {
  group.value = ''
  service.value = ''
})
watch(group, () => {
  service.value = ''
})
</script>

<template>
  <section class="price" id="price">
    <div class="wrap">
      <p class="ol"><span class="dot" />Прозрачные цены</p>
      <h2 class="brand-title">Прайс-лист — <span class="re">RE</span>VIVE</h2>
      <p class="lead">Ориентировочные цены на все виды работ. Точная стоимость — после бесплатной диагностики.</p>

      <div v-if="items.length">
        <p class="section-label">Калькулятор стоимости</p>
        <h3 class="calc-title">Узнайте стоимость ремонта</h3>
        <p class="calc-lead">Выберите устройство, тип проблемы и конкретную услугу — получите ориентировочную цену</p>
        <div class="calc-card">
          <div class="calc-stripe" aria-hidden="true" />
          <div class="calc">
            <label>
              <span class="step"><i>1</i> Устройство</span>
              <select v-model="device">
                <option value="">— выберите —</option>
                <option v-for="d in devices" :key="d" :value="d">{{ d }}</option>
              </select>
            </label>
            <label>
              <span class="step"><i>2</i> Тип проблемы</span>
              <select v-model="group" :disabled="!device">
                <option value="">— сначала устройство —</option>
                <option v-for="g in groups" :key="g" :value="g">{{ g }}</option>
              </select>
            </label>
            <label>
              <span class="step"><i>3</i> Услуга</span>
              <select v-model="service" :disabled="!group">
                <option value="">— сначала тип —</option>
                <option v-for="s in services" :key="s.name" :value="s.name">{{ s.name }}</option>
              </select>
            </label>
            <div class="result" :class="{ ready: Boolean(selected) }">
              <span>Ориентировочная стоимость работ</span>
              <strong>{{ displayPrice }}</strong>
              <small>{{ resultHint }}</small>
              <label class="urgent"><input v-model="urgent" type="checkbox" /> Срочный ремонт +30%</label>
              <a class="btn-fill btn-sm" href="#order">Записаться на ремонт</a>
            </div>
          </div>
        </div>
      </div>

      <p class="section-label">Прайс-лист</p>
      <div class="table">
        <div v-for="item in prices" :key="item.name" class="row">
          <span>{{ item.name }}</span>
          <b>{{ item.price }}</b>
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
.price {
  padding: 80px 0;
  background: #f6f6f6;
}
.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.ol {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--brand);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
  font-size: 12px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand);
}
.brand-title {
  font-size: clamp(36px, 6vw, 56px);
  margin-bottom: 12px;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.re { color: var(--brand); }
.lead {
  color: var(--dim);
  margin-bottom: 36px;
  max-width: 560px;
}
.section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--dim);
  margin: 8px 0 8px;
}
.calc-title {
  font-size: 28px;
  margin-bottom: 8px;
}
.calc-lead {
  color: var(--dim);
  margin-bottom: 20px;
  max-width: 640px;
}
.calc-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 8px;
}
.calc-stripe {
  height: 6px;
  background: var(--brand);
}
.calc {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 24px;
}
.calc .result {
  grid-column: 1 / -1;
}
label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}
.step {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.step i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand);
  color: #fff;
  display: grid;
  place-items: center;
  font-style: normal;
  font-size: 11px;
}
select {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  font-weight: 500;
}
.result {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  justify-self: stretch;
}
.result strong {
  font-size: 40px;
  line-height: 1.05;
  color: var(--brand);
  letter-spacing: -0.03em;
  font-weight: 800;
}
.result.ready strong {
  color: var(--brand);
}
.result small {
  color: var(--dim);
  font-weight: 400;
}
.urgent {
  flex-direction: row;
  align-items: center;
  font-weight: 600;
}
.btn-sm {
  padding: 10px 20px;
  font-size: 13px;
  border-radius: 8px;
  box-shadow: none;
  width: fit-content;
}
.table {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid var(--border);
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  list-style: none;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.row:last-child {
  border-bottom: 0;
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
@media (max-width: 980px) {
  .calc { grid-template-columns: 1fr; }
  .result strong { font-size: 36px; }
}
@media (max-width: 480px) {
  .price { padding: 48px 0; }
  .wrap { padding: 0 16px; }
  .calc-title { font-size: 22px; }
  .result strong { font-size: 28px; }
  .result { padding: 12px; }
}
</style>
