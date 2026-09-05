<script setup lang="ts">
import type { CatalogPrice } from '#shared/catalog'
import { catalogPriceLabel } from '#shared/catalog'

const props = defineProps<{
  catalogPrices?: CatalogPrice[]
  serviceSlug?: string
  showAll?: boolean
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

const FEATURED_GROUPS: Record<string, string[]> = {
  notebook: ['Диагностика', 'Модули и комплектующие', 'Экран / клавиатура / корпус', 'Чистка и охлаждение', 'BIOS / разъёмы', 'Материнская плата'],
  pc: ['Диагностика', 'Ремонт материнской платы', 'Замена комплектующих', 'Сборка и обслуживание'],
  monoblock: ['Диагностика', 'Замена', 'Компонентный ремонт', 'BGA-ремонт', 'Профилактика охлаждения', 'Ремонт блока питания'],
  smartphone: ['Диагностика', 'Типовой ремонт', 'Компонентный ремонт'],
  tablet: ['Диагностика', 'Замена', 'Ремонт', 'Компонентный ремонт', 'Разборка'],
  apple: ['Диагностика', 'Типовой ремонт', 'Компонентный ремонт', 'Чистка', 'Замена'],
  software: ['Установка', 'Настройка', 'Восстановление', 'Перенос', 'Обновление', 'Сброс'],
  additional: ['Данные', 'Услуги', 'Сборка', 'Настройка', 'Выезд', 'Игровые'],
}

const FEATURED_LIMIT: Record<string, number> = {
  notebook: 20,
  pc: 10,
  monoblock: 10,
  smartphone: 10,
  tablet: 10,
  apple: 10,
  software: 10,
  additional: 10,
}

const route = useRoute()

const SLUG_TO_TAB: Record<string, string> = {
  'remont-noutbukov': 'notebook',
  'remont-kompyuterov': 'pc',
  'remont-smartfonov': 'smartphone',
  'remont-planshetov': 'tablet',
  'remont-iphone': 'apple',
  'chistka-noutbuka': 'notebook',
}

const APPLE_SUB_TABS = [
  { id: 'iPhone', label: 'iPhone' },
  { id: 'iPad', label: 'iPad' },
  { id: 'MacBook', label: 'MacBook' },
]

const appleSubTab = ref('iPhone')

const IPHONE_MODELS = [
  { id: '7', label: 'iPhone 7', suffix: 'До 8' },
  { id: '8', label: 'iPhone 8', suffix: 'До 8' },
  { id: 'SE2', label: 'iPhone SE 2', suffix: 'До 8' },
  { id: 'X', label: 'iPhone X', suffix: 'X–13' },
  { id: 'XS', label: 'iPhone XS', suffix: 'X–13' },
  { id: 'XR', label: 'iPhone XR', suffix: 'X–13' },
  { id: 'SE3', label: 'iPhone SE 3', suffix: 'X–13' },
  { id: '11', label: 'iPhone 11', suffix: 'X–13' },
  { id: '12', label: 'iPhone 12', suffix: 'X–13' },
  { id: '13', label: 'iPhone 13', suffix: 'X–13' },
  { id: '14', label: 'iPhone 14', suffix: '14–15' },
  { id: '15', label: 'iPhone 15', suffix: '14–15' },
  { id: '16', label: 'iPhone 16', suffix: '16 / 16 Plus' },
  { id: '16pro', label: 'iPhone 16 Pro', suffix: '16 Pro' },
  { id: '17', label: 'iPhone 17', suffix: '17 / 17e' },
  { id: '17pro', label: 'iPhone 17 Pro', suffix: '17 Pro' },
]

const defaultTab = computed(() => {
  if (route.query.device === 'iphone') return 'apple'
  return (props.serviceSlug && SLUG_TO_TAB[props.serviceSlug]) || 'notebook'
})

const iphoneModel = ref('')

const activeTab = ref('notebook')
watch(defaultTab, (v) => { activeTab.value = v }, { immediate: true })
watch(activeTab, (v) => { if (v !== 'apple') appleSubTab.value = 'iPhone' })
watch(appleSubTab, () => { iphoneModel.value = '' })

if (route.query.device === 'iphone') {
  appleSubTab.value = 'iPhone'
} else if (route.query.device === 'ipad') {
  appleSubTab.value = 'iPad'
} else if (route.query.device === 'macbook') {
  appleSubTab.value = 'MacBook'
}
const items = computed(() => props.catalogPrices || [])

const expandedGroups = ref<Set<string>>(new Set())

function toggleGroup(g: string) {
  if (expandedGroups.value.has(g)) {
    expandedGroups.value.delete(g)
  } else {
    expandedGroups.value.add(g)
  }
}

const activeCategories = computed(() => {
  if (activeTab.value === 'apple') {
    return [appleSubTab.value]
  }
  return DEVICE_TABS.find((t) => t.id === activeTab.value)?.categories || []
})

const activeItems = computed(() => {
  const base = items.value.filter((p) => activeCategories.value.includes(p.category_name))
  if (activeTab.value === 'apple' && appleSubTab.value === 'iPhone' && props.showAll && iphoneModel.value) {
    const model = IPHONE_MODELS.find((m) => m.id === iphoneModel.value)
    if (model) {
      return base.filter((item) => {
        const nameSuffix = item.name.split(' — ')[1] || ''
        return nameSuffix.includes(model.suffix)
      })
    }
  }
  return base
})

const featuredItems = computed(() => {
  if (props.showAll) return activeItems.value
  const tabId = activeTab.value
  const groups = FEATURED_GROUPS[tabId]
  const limit = FEATURED_LIMIT[tabId] || 10
  if (!groups) return activeItems.value.slice(0, limit)
  return activeItems.value
    .filter((item) => groups.some((g) => item.group?.includes(g) || item.name?.includes(g)))
    .slice(0, limit)
})

const groupedByGroup = computed(() => {
  const map = new Map<string, CatalogPrice[]>()
  for (const item of featuredItems.value) {
    const g = item.group || ''
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(item)
  }
  return map
})

watch(groupedByGroup, (groups) => {
  const names = [...groups.keys()].filter(Boolean)
  expandedGroups.value.clear()
  if (names.length) expandedGroups.value.add(names[0])
}, { immediate: true })

const duplicateNames = computed(() => {
  const counts = new Map<string, number>()
  for (const item of featuredItems.value) {
    counts.set(item.name, (counts.get(item.name) || 0) + 1)
  }
  return counts
})

const CATEGORY_LABELS: Record<string, string> = {
  iPhone: 'iPhone',
  iPad: 'iPad',
  MacBook: 'MacBook',
  iMac: 'iMac',
  'Ноутбуки': 'Ноутбук',
  'Системные блоки / ПК': 'ПК',
  'Моноблоки': 'Моноблок',
  'Смартфоны (Samsung, Xiaomi, Android)': 'Samsung/Xiaomi',
  'Планшеты Android': 'Планшет',
  'ПО / Windows / macOS': 'ПО',
  'Дополнительные услуги': 'Доп. услуги',
}



const urgent = ref(false)
const device = ref('')
const group = ref('')
const service = ref('')

const DEVICE_MAP: { crm: string; label: string }[] = [
  { crm: 'Ноутбуки', label: 'Ноутбук' },
  { crm: 'Системные блоки / ПК', label: 'Системный блок' },
  { crm: 'Моноблоки', label: 'Моноблок' },
  { crm: 'Смартфоны (Samsung, Xiaomi, Android)', label: 'Смартфон' },
  { crm: 'Планшеты Android', label: 'Планшет Android' },
  { crm: 'iPhone', label: 'iPhone' },
  { crm: 'iPad', label: 'iPad' },
  { crm: 'MacBook', label: 'MacBook' },
  { crm: 'iMac', label: 'iMac' },
  { crm: 'ПО / Windows / macOS', label: 'ПО / софт' },
  { crm: 'Дополнительные услуги', label: 'Доп. услуги' },
]

const devices = computed(() => {
  const crmNames = [...new Set(items.value.map((p) => p.category_name))]
  return DEVICE_MAP.filter((d) => crmNames.includes(d.crm))
})

const groups = computed(() =>
  [...new Set(
    items.value
      .filter((p) => p.category_name === device.value && p.group)
      .map((p) => p.group!),
  )].sort(),
)

const hasGroups = computed(() => groups.value.length > 0)

const services = computed(() => {
  if (!device.value) return []
  if (hasGroups.value) {
    return group.value
      ? items.value
          .filter((p) => p.category_name === device.value && p.group === group.value)
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      : []
  }
  return items.value
    .filter((p) => p.category_name === device.value)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
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
  selected.value ? 'Без стоимости запчастей · Финальная цена после диагностики' : 'Выберите услугу выше',
)

watch(device, () => { group.value = ''; service.value = '' })
watch(group, () => { service.value = '' })
watch(hasGroups, (v) => { if (!v) group.value = '' })
</script>

<template>
  <section class="price" id="price">
    <div class="wrap">
      <p class="ol"><span class="dot" />Прозрачные цены</p>
      <h2 class="brand-title">Прайс-лист — <span class="re">RE</span>VIVE</h2>
      <p class="lead">Ориентировочные цены на основные виды работ. Точную стоимость согласуем после диагностики и до начала ремонта.</p>

      <div v-if="items.length">
        <p class="section-label">Узнать примерную стоимость</p>
        <div class="calc-card">
          <div class="calc-stripe" aria-hidden="true" />
          <div class="calc">
            <label>
              <span class="step"><i>1</i> Устройство</span>
              <select v-model="device">
                <option value="">— выберите —</option>
                <option v-for="d in devices" :key="d.crm" :value="d.crm">{{ d.label }}</option>
              </select>
            </label>
            <label>
              <span class="step"><i>2</i> Тип проблемы</span>
              <select v-model="group" :disabled="!device || !hasGroups" :style="{ display: hasGroups ? '' : 'none' }">
                <option value="">— сначала устройство —</option>
                <option v-for="g in groups" :key="g" :value="g">{{ g }}</option>
              </select>
              <select v-if="!hasGroups" disabled>
                <option>Услуги ниже</option>
              </select>
            </label>
            <label>
              <span class="step"><i>3</i> Услуга</span>
              <select v-model="service" :disabled="!device || (hasGroups && !group)">
                <option value="">— сначала тип —</option>
                <option v-for="s in services" :key="s.key || s.name" :value="s.name">{{ s.name }}</option>
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

      <template v-if="showAll">
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
        <div v-if="activeTab === 'apple'" class="tabs sub-tabs">
          <button
            v-for="sub in APPLE_SUB_TABS"
            :key="sub.id"
            type="button"
            :class="{ active: appleSubTab === sub.id }"
            @click="appleSubTab = sub.id"
          >{{ sub.label }}</button>
        </div>

        <template v-if="activeTab === 'apple' && appleSubTab === 'iPhone'">
          <div class="model-select">
            <span class="model-label">Выберите модель:</span>
            <div class="model-grid">
              <button
                v-for="m in IPHONE_MODELS"
                :key="m.id"
                type="button"
                :class="{ active: iphoneModel === m.id }"
                @click="iphoneModel = m.id"
              >{{ m.label }}</button>
            </div>
          </div>
          <div v-if="iphoneModel" class="table">
            <h3>{{ IPHONE_MODELS.find((m) => m.id === iphoneModel)?.label }}</h3>
            <ul>
              <li v-for="item in featuredItems" :key="item.key || item.name">
                <span>{{ item.publicName || item.name.split(' — ')[0] }}</span>
                <b :class="{ free: item.price_type === 'free' }">{{ catalogPriceLabel(item) }}</b>
              </li>
            </ul>
          </div>
          <div v-else class="table-empty">
            <p>Выберите модель выше, чтобы увидеть стоимость работ</p>
          </div>
          <p class="model-hint">Не знаете точную модель? Укажите её в заявке или опишите устройство — поможем определить модель и предварительную стоимость.</p>
        </template>

        <template v-else>
          <div class="table">
            <h3>{{ activeTab === 'apple' ? appleSubTab : DEVICE_TABS.find((t) => t.id === activeTab)?.label }}</h3>
            <template v-for="[groupName, groupItems] in groupedByGroup" :key="groupName">
              <div v-if="groupName" class="group-section" :class="{ collapsed: !expandedGroups.has(groupName) }">
                <button class="group-toggle" type="button" @click="toggleGroup(groupName)">
                  <span>{{ groupName }}</span>
                  <span class="group-count">{{ groupItems.length }}</span>
                  <svg class="group-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <ul v-show="expandedGroups.has(groupName)">
                  <li v-for="item in groupItems" :key="item.key || item.name">
                    <span>
                      {{ item.name }}
                      <small v-if="duplicateNames.get(item.name) > 1" class="cat-hint">{{ CATEGORY_LABELS[item.category_name] || item.category_name }}</small>
                    </span>
                    <b :class="{ free: item.price_type === 'free' }">{{ catalogPriceLabel(item) }}</b>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </template>
      </template>
      <template v-else>
        <p class="section-label">Популярные услуги</p>
        <div class="tabs">
          <button
            v-for="tab in DEVICE_TABS"
            :key="tab.id"
            type="button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >{{ tab.label }}</button>
        </div>
        <div v-if="activeTab === 'apple'" class="tabs sub-tabs">
          <button
            v-for="sub in APPLE_SUB_TABS"
            :key="sub.id"
            type="button"
            :class="{ active: appleSubTab === sub.id }"
            @click="appleSubTab = sub.id"
          >{{ sub.label }}</button>
        </div>
        <div class="table">
          <h3>{{ activeTab === 'apple' ? appleSubTab : DEVICE_TABS.find((t) => t.id === activeTab)?.label }}</h3>
          <template v-for="[groupName, groupItems] in groupedByGroup" :key="groupName">
            <p v-if="groupName" class="group-label">{{ groupName }}</p>
            <ul>
              <li v-for="item in groupItems" :key="item.key || item.name">
                <span>
                  {{ item.name }}
                  <small v-if="duplicateNames.get(item.name) > 1" class="cat-hint">{{ CATEGORY_LABELS[item.category_name] || item.category_name }}</small>
                </span>
                <b :class="{ free: item.price_type === 'free' }">{{ catalogPriceLabel(item) }}</b>
              </li>
            </ul>
          </template>
        </div>
        <NuxtLink v-if="activeTab === 'apple' && appleSubTab === 'iPhone'" to="/prices?device=iphone" class="model-cta">
          Цены для моей модели →
        </NuxtLink>
      </template>

      <p class="note">
        Цены указаны за работу. Стоимость запчастей и комплектующих рассчитывается отдельно после диагностики и согласования.
      </p>
      <NuxtLink v-if="!showAll" to="/prices" class="all-link">
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
.sub-tabs {
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 3px solid var(--brand);
}
.sub-tabs button {
  padding: 6px 14px;
  font-size: 13px;
}
.model-select {
  margin-bottom: 16px;
}
.model-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--dim);
  margin-bottom: 10px;
}
.model-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.model-grid button {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.model-grid button.active,
.model-grid button:hover {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}
.table-empty {
  background: #fff;
  border-radius: 14px;
  padding: 40px 20px;
  border: 1px solid var(--border);
  text-align: center;
  color: var(--dim);
  font-size: 14px;
  margin-bottom: 16px;
}
.model-hint {
  font-size: 13px;
  color: var(--dim);
  line-height: 1.6;
  margin-top: 8px;
}
.model-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 700;
  color: var(--brand);
  text-decoration: none;
  transition: opacity 0.2s;
}
.model-cta:hover {
  opacity: 0.8;
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
.service-label {
  font-size: 13px;
  font-weight: 800;
  color: #111;
  margin: 20px 0 4px;
  padding: 6px 0;
  border-bottom: 2px solid var(--brand);
}
.group-label:first-child {
  margin-top: 0;
}
.group-section {
  margin-bottom: 2px;
}
.group-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
  background: none;
  border: none;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}
.group-toggle:hover {
  color: #e04410;
}
.group-count {
  font-size: 10px;
  font-weight: 600;
  background: var(--soft);
  color: var(--dim);
  padding: 1px 6px;
  border-radius: 10px;
}
.group-chevron {
  width: 14px;
  height: 14px;
  margin-left: auto;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.group-section:not(.collapsed) .group-chevron {
  transform: rotate(180deg);
}
.group-section.collapsed .group-toggle {
  border-bottom-color: transparent;
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
.cat-hint {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: var(--dim);
  background: rgba(255,133,98,0.08);
  border-radius: 4px;
  padding: 1px 6px;
  margin-left: 6px;
  vertical-align: middle;
  line-height: 1.4;
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
  .tabs {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 6px;
    padding-bottom: 4px;
    margin-bottom: 16px;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tabs button {
    white-space: nowrap;
    flex-shrink: 0;
    padding: 8px 14px;
    font-size: 12px;
  }
  .table li { font-size: 13px; flex-direction: column; gap: 4px; }
  .table b { font-size: 14px; }
  .calc { padding: 16px; gap: 12px; }
  .model-grid button { padding: 6px 10px; font-size: 12px; }
}
</style>
