<script setup lang="ts">
definePageMeta({ layout: 'default' })

useHead({
  title: 'Статус ремонта — REVIVE',
  meta: [
    { name: 'description', content: 'Проверьте статус ремонта вашей техники по номеру заявки и телефону.' },
  ],
})

const orderNumber = ref('')
const phone = ref('')
const loading = ref(false)
const error = ref('')
const order = ref<any>(null)

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая заявка',
  accepted: 'Принята',
  diag: 'Диагностика',
  repair: 'В ремонте',
  waiting_parts: 'Ожидание запчастей',
  ready: 'Готова к выдаче',
  issued: 'Выдана',
  closed: 'Выполнена',
  refused: 'Отказ',
}

const STATUS_ICONS: Record<string, string> = {
  new: '📋',
  accepted: '✅',
  diag: '🔍',
  repair: '🔧',
  waiting_parts: '📦',
  ready: '✨',
  issued: '🎉',
  closed: '✔️',
  refused: '❌',
}

const STATUS_STEP = ['new', 'accepted', 'diag', 'repair', 'waiting_parts', 'ready', 'issued']

function formatPrice(v: number) {
  return new Intl.NumberFormat('ru-RU').format(v) + ' ₽'
}

async function lookup() {
  error.value = ''
  order.value = null
  loading.value = true

  try {
    const data = await $fetch('/api/track', {
      params: { number: orderNumber.value.trim(), phone: phone.value.trim() },
    })
    if (!(data as any)?.success) {
      error.value = (data as any)?.error || 'Заявка не найдена'
      return
    }
    order.value = (data as any).order
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'Не удалось найти заявку'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="track-page">
    <div class="track-wrap">
      <h1>Статус ремонта</h1>
      <p class="track-sub">Введите номер заявки и телефон, указанный при оформлении.</p>

      <form class="track-form" @submit.prevent="lookup">
        <div class="track-fields">
          <div class="track-field">
            <label for="track-num">Номер заявки</label>
            <input id="track-num" v-model="orderNumber" type="text" placeholder="R0001" required />
          </div>
          <div class="track-field">
            <label for="track-phone">Телефон</label>
            <input id="track-phone" v-model="phone" type="tel" placeholder="+7 (900) 123-45-67" required />
          </div>
        </div>
        <button class="track-btn" type="submit" :disabled="loading">
          {{ loading ? 'Поиск…' : 'Проверить' }}
        </button>
      </form>

      <p v-if="error" class="track-error">{{ error }}</p>

      <div v-if="order" class="track-result">
        <div class="track-header">
          <span class="track-num">Заявка {{ order.number }}</span>
          <span class="track-status-badge">
            {{ STATUS_ICONS[order.status] || '📋' }}
            {{ STATUS_LABELS[order.status] || order.status }}
          </span>
        </div>

        <div class="track-progress">
          <div
            v-for="(step, i) in STATUS_STEP"
            :key="step"
            class="track-step"
            :class="{ done: order.statusStep >= i, active: order.statusStep === i }"
          >
            <span class="track-dot" />
            <span class="track-step-label">{{ STATUS_LABELS[step] }}</span>
          </div>
        </div>

        <div class="track-info">
          <div class="track-info-row">
            <span class="track-label">Устройство</span>
            <span>{{ order.device || '—' }}</span>
          </div>
          <div v-if="order.problem" class="track-info-row">
            <span class="track-label">Описание</span>
            <span>{{ order.problem }}</span>
          </div>
          <div v-if="order.dueDate" class="track-info-row">
            <span class="track-label">Ориентировочный срок</span>
            <span>{{ order.dueDate }}</span>
          </div>
          <div v-if="order.total > 0" class="track-info-row">
            <span class="track-label">Стоимость</span>
            <span>{{ formatPrice(order.total) }}</span>
          </div>
          <div v-if="order.note" class="track-info-row">
            <span class="track-label">Комментарий</span>
            <span>{{ order.note }}</span>
          </div>
        </div>

        <div v-if="order.works?.length" class="track-section">
          <h3>Выполненные работы</h3>
          <div v-for="w in order.works" :key="w.name" class="track-work">
            <span>{{ w.name }}</span>
            <span v-if="w.price">{{ formatPrice(w.price) }}</span>
          </div>
        </div>

        <div v-if="order.parts?.length" class="track-section">
          <h3>Запчасти</h3>
          <div v-for="p in order.parts" :key="p.name" class="track-work">
            <span>{{ p.name }}{{ p.quantity > 1 ? ` ×${p.quantity}` : '' }}</span>
            <span v-if="p.price">{{ formatPrice(p.price * (p.quantity || 1)) }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.track-page {
  padding: calc(var(--header-h) + 40px) 24px 80px;
  min-height: 80vh;
}
.track-wrap {
  max-width: 640px;
  margin: 0 auto;
}
h1 {
  font-family: Oswald, sans-serif;
  font-size: 32px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.track-sub {
  color: #666;
  margin-bottom: 32px;
}
.track-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.track-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.track-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}
.track-field input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
}
.track-field input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(253, 81, 25, 0.12);
}
.track-btn {
  align-self: flex-start;
  background: var(--brand);
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.track-btn:hover {
  background: #000;
}
.track-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.track-error {
  margin-top: 16px;
  color: #d32f2f;
  font-weight: 600;
}
.track-result {
  margin-top: 40px;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 28px;
  background: #fafafa;
}
.track-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.track-num {
  font-weight: 700;
  font-size: 18px;
}
.track-status-badge {
  background: var(--brand);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}
.track-progress {
  display: flex;
  gap: 0;
  margin-bottom: 28px;
  overflow-x: auto;
}
.track-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
  position: relative;
}
.track-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 8px;
  left: calc(50% + 8px);
  right: calc(-50% + 8px);
  height: 2px;
  background: #ddd;
}
.track-step.done:not(:last-child)::after {
  background: var(--brand);
}
.track-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ddd;
  border: 2px solid #fff;
  z-index: 1;
  margin-bottom: 6px;
}
.track-step.done .track-dot {
  background: var(--brand);
}
.track-step.active .track-dot {
  background: var(--brand);
  box-shadow: 0 0 0 4px rgba(253, 81, 25, 0.2);
}
.track-step-label {
  font-size: 10px;
  text-align: center;
  color: #999;
  line-height: 1.2;
}
.track-step.done .track-step-label,
.track-step.active .track-step-label {
  color: #333;
  font-weight: 600;
}
.track-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.track-info-row {
  display: flex;
  gap: 12px;
}
.track-label {
  min-width: 160px;
  font-weight: 600;
  color: #555;
  flex-shrink: 0;
}
.track-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-top: 8px;
}
.track-section h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.track-work {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}
@media (max-width: 600px) {
  .track-fields {
    grid-template-columns: 1fr;
  }
  .track-info-row {
    flex-direction: column;
    gap: 2px;
  }
  .track-label {
    min-width: 0;
  }
  .track-step-label {
    font-size: 9px;
  }
}
</style>
