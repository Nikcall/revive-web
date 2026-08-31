<script setup lang="ts">
import type { CatalogPrice } from '#shared/catalog'
import { catalogPriceLabel } from '#shared/catalog'

const props = defineProps<{
  catalogPrices?: CatalogPrice[]
  serviceSlug?: string
}>()

const DEVICE_TABS = [
  { id: 'notebook', label: 'Ноутбуки', categories: ['Ноутбуки'] },
  { id: 'pc', label: 'Системные блоки', categories: ['Системные блоки / ПК'] },
  { id: 'monoblock', label: 'Моноблоки', categories: ['Моноблоки'] },
  { id: 'smartphone', label: 'Смартфоны', categories: ['Смартфоны (Samsung, Xiaomi, Android)'] },
  { id: 'tablet', label: 'Планшеты', categories: ['Планшеты Android'] },
  { id: 'apple', label: 'Apple', categories: ['iPhone', 'iPad', 'MacBook', 'iMac'] },
  { id: 'software', label: 'ПО', categories: ['ПО / Windows / macOS'] },
  { id: 'additional', label: 'Доп. услуги', categories: ['Дополнительные услуги'] },
]

const activeTab = ref('notebook')
const items = computed(() => props.catalogPrices || [])

const activeCategories = computed(() =>
  DEVICE_TABS.find((t) => t.id === activeTab.value)?.categories || [],
)

const activeItems = computed(() =>
  items.value.filter((p) => activeCategories.value.includes(p.category_name)),
)

const groupedByGroup = computed(() => {
  const map = new Map<string, CatalogPrice[]>()
  for (const item of activeItems.value) {
    const g = item.group || ''
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(item)
  }
  return map
})

const urgent = ref(false)
const device = ref('')
const group = ref('')
const service = ref('')

const devices = computed(() => [...new Set(items.value.map((p) => p.category_name))])
const groups = computed(() =>
  [...new Set(items.value.filter((p) => p.category_name === device.value).map((p) => p.group))],
)
const services = computed(() =>
  items.value.filter((p) => p.category_name === device.value && p.group === group.value),
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

watch(device, () => { group.value = ''; service.value = '' })
watch(group, () => { service.value = '' })
</script>

<template>
  <section class="price" id="price">
    <div class="wrap">
      <p class="ol"><span class="dot" />Прозрачные цены</p>
      <h2 class="brand-title">Прайс-лист — <span class="re">RE</span>VIVE</h2>
      <p class="lead">Ориентировочные цены на все виды работ. Точная стоимость — после бесплатной диагностики.</p>

      <div v-if="items.length">
        <p class="section-label">Калькулятор стоимости</p>
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
              <label class="urgent-cb"><input v-model="urgent" type="checkbox" /> Срочный ремонт +30%</label>
              <a class="btn-fill btn-sm" href="#order">Записаться на ремонт</a>
            </div>
          </div>
        </div>
      </div>

      <p class="section-label">Прайс-лист</p>
      <div class="tabs">
        <button
          v-for="tab in DEVICE_TABS"
          :key="tab.id"
          type="button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >{{ tab.label }}</button>
      </div>
      <div class="table">
        <h3>{{ DEVICE_TABS.find((t) => t.id === activeTab)?.label }}</h3>
        <template v-for="[groupName, groupItems] in groupedByGroup" :key="groupName">
          <p v-if="groupName" class="group-label">{{ groupName }}</p>
          <ul>
            <li v-for="item in groupItems" :key="item.key || item.name">
              <span>{{ item.name }}</span>
              <b :class="{ free: item.price_type === 'free' }">{{ catalogPriceLabel(item) }}</b>
            </li>
          </ul>
        </template>
      </div>

      <p class="note">
        Цены указаны за работу. Стоимость запчастей и комплектующих рассчитывается отдельно после диагностики и согласования.
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
.calc-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 40px;
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
.result small {
  color: var(--dim);
  font-weight: 400;
}
.urgent-cb {
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
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.tabs button {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tabs button.active,
.tabs button:hover {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}
.table {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid var(--border);
  margin-bottom: 16px;
}
.table h3 {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 14px;
}
.group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
  margin: 16px 0 6px;
  padding: 4px 0;
  border-bottom: 1px solid var(--border);
}
.group-label:first-child {
  margin-top: 0;
}
.table li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  list-style: none;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.table li:last-child {
  border-bottom: 0;
}
.table b {
  color: var(--brand);
  white-space: nowrap;
}
.table b.free {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 12px;
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
@media (max-width: 580px) {
  .price { padding: 48px 0; }
  .wrap { padding: 0 16px; }
  .result strong { font-size: 28px; }
  .result { padding: 12px; }
  .tabs { display: none; }
  .table li { font-size: 13px; }
}
</style>
