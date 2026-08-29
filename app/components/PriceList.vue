<script setup lang="ts">
type PriceRow = {
  category: string
  group: string
  name: string
  price_label: string
  price_min: number | null
  urgent_multiplier?: number
}

const props = defineProps<{
  prices: PriceRow[]
  terms: string
}>()

const urgent = ref(false)
const device = ref('')
const group = ref('')
const service = ref('')
const tab = ref('')

const devices = computed(() => [...new Set(props.prices.map((p) => p.category))])
const groups = computed(() =>
  [...new Set(props.prices.filter((p) => p.category === device.value).map((p) => p.group))],
)
const services = computed(() =>
  props.prices.filter((p) => p.category === device.value && p.group === group.value),
)
const selected = computed(() => services.value.find((p) => p.name === service.value))
const displayPrice = computed(() => {
  if (!selected.value) return '— ₽'
  if (selected.value.price_min == null) return selected.value.price_label
  const n = Math.round(selected.value.price_min * (urgent.value ? (selected.value.urgent_multiplier || 1.3) : 1))
  if (n === 0) return 'бесплатно'
  return `от ${n.toLocaleString('ru-RU')} ₽`
})
const resultHint = computed(() => (selected.value ? 'Без стоимости запчастей · Точная цена после диагностики' : 'Выберите услугу выше'))

watch(device, () => {
  group.value = ''
  service.value = ''
})
watch(group, () => {
  service.value = ''
})

onMounted(() => {
  tab.value = devices.value[0] || ''
})

const grouped = computed(() => {
  const map = new Map<string, PriceRow[]>()
  for (const item of props.prices) {
    const list = map.get(item.category) || []
    list.push(item)
    map.set(item.category, list)
  }
  return [...map.entries()]
})

const activeTable = computed(() => grouped.value.find(([cat]) => cat === tab.value) || grouped.value[0])
</script>

<template>
  <section class="price" id="price">
    <div class="wrap">
      <p class="ol"><span class="dot" />Прозрачные цены</p>
      <h2 class="brand-title">Прайс-лист — <span class="re">RE</span>VIVE</h2>
      <p class="lead">Ориентировочные цены на все виды работ. Точная стоимость — после бесплатной диагностики.</p>
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
            <a class="btn-fill" href="#order">Записаться на ремонт</a>
          </div>
        </div>
      </div>
      <p class="section-label">Полный прайс-лист</p>
      <div class="tabs">
        <button
          v-for="[cat] in grouped"
          :key="cat"
          type="button"
          :class="{ active: tab === cat }"
          @click="tab = cat"
        >{{ cat }}</button>
      </div>
      <div v-if="activeTable" class="table">
        <h3>{{ activeTable[0] }}</h3>
        <ul>
          <li v-for="item in activeTable[1]" :key="item.name">
            <span>{{ item.name }}</span>
            <b>{{ item.price_label }}</b>
          </li>
        </ul>
      </div>
      <div class="conditions">
        <h3>Условия оказания услуг</h3>
        <p>Цены указаны без стоимости комплектующих. Точная сумма согласовывается после диагностики.</p>
        <ul>
          <li>Диагностика бесплатна при Вашем согласии на ремонт. В случае отказа Вы оплачиваете только диагностику и получаете подробный акт с результатами проверки.</li>
          <li>Гарантия на все виды работ — до 6 месяцев.</li>
          <li>Срок выполнения: обычно 1–3 дня (при наличии запчастей).</li>
          <li>Срочный ремонт — доступен за +30% к стоимости.</li>
          <li>Оплата: наличными, картой, СБП, безналичный расчёт для юр. лиц.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.price {
  padding: 80px 0;
  background: #f6f6f6;
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
}
h3 { margin-bottom: 12px; }
li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  list-style: none;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.conditions {
  margin-top: 28px;
  color: #555;
  font-size: 14px;
  line-height: 1.7;
}
.conditions ul {
  margin: 12px 0 0 18px;
}
.conditions li {
  display: list-item;
  list-style: disc;
  border: 0;
  padding: 4px 0;
  font-size: 14px;
}
@media (max-width: 980px) {
  .calc { grid-template-columns: 1fr; }
  .result strong { font-size: 36px; }
}
</style>
