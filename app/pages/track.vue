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
const token = ref('')

const messages = ref<any[]>([])
const chatOpen = ref(false)
const chatInput = ref('')
const chatSending = ref(false)
const chatError = ref('')

let chatTimer: ReturnType<typeof setInterval> | null = null

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

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

async function lookup() {
  error.value = ''
  order.value = null
  token.value = ''
  loading.value = true
  messages.value = []
  chatOpen.value = false

  try {
    const data = await $fetch('/api/track', {
      params: { number: orderNumber.value.trim(), phone: phone.value.trim() },
    })
    if (!(data as any)?.success) {
      error.value = (data as any)?.error || 'Заявка не найдена'
      return
    }
    order.value = (data as any).order
    token.value = (data as any).order?.token || ''

    if (token.value) {
      await fetchMessages()
      startChatPolling()
    }
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'Не удалось найти заявку'
  } finally {
    loading.value = false
  }
}

async function fetchMessages() {
  if (!token.value) return
  try {
    const data = await $fetch('/api/track/messages', {
      params: { token: token.value },
    })
    if ((data as any)?.success) {
      messages.value = (data as any).messages || []
    }
  } catch {
    // silent
  }
}

function startChatPolling() {
  stopChatPolling()
  chatTimer = setInterval(fetchMessages, 15000)
}

function stopChatPolling() {
  if (chatTimer) {
    clearInterval(chatTimer)
    chatTimer = null
  }
}

async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text || chatSending.value || !token.value) return

  chatSending.value = true
  chatError.value = ''

  try {
    await $fetch('/api/track/messages', {
      method: 'POST',
      params: { token: token.value },
      body: { text },
    })
    chatInput.value = ''
    await fetchMessages()
  } catch (e: any) {
    chatError.value = e?.data?.statusMessage || 'Не удалось отправить'
  } finally {
    chatSending.value = false
  }
}

function toggleChat() {
  chatOpen.value = !chatOpen.value
  if (chatOpen.value) fetchMessages()
}

onUnmounted(() => stopChatPolling())
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

        <div v-if="token" class="track-chat-toggle">
          <button class="track-btn" type="button" @click="toggleChat">
            {{ chatOpen ? 'Закрыть чат' : 'Написать мастеру' }}
          </button>
          <span v-if="messages.length" class="track-chat-count">{{ messages.length }}</span>
        </div>
      </div>

      <div v-if="chatOpen && token" class="track-chat">
        <div class="track-chat-header">
          <h3>Чат по заявке</h3>
          <small>Мастер ответит в ближайшее время</small>
        </div>

        <div class="track-chat-messages" ref="chatScroll">
          <p v-if="!messages.length" class="track-chat-empty">Пока нет сообщений. Напишите первым!</p>
          <div
            v-for="m in messages"
            :key="m.id"
            class="track-chat-msg"
            :class="m.sender === 'staff' ? 'staff' : 'client'"
          >
            <span class="track-chat-sender">{{ m.sender === 'staff' ? 'Мастер' : 'Вы' }}</span>
            <p>{{ m.text }}</p>
            <time>{{ formatTime(m.createdAt || m.createdat) }}</time>
          </div>
        </div>

        <form class="track-chat-form" @submit.prevent="sendMessage">
          <input
            v-model="chatInput"
            type="text"
            placeholder="Сообщение…"
            maxlength="1000"
            :disabled="chatSending"
          />
          <button type="submit" :disabled="chatSending || !chatInput.trim()">
            {{ chatSending ? '…' : '→' }}
          </button>
        </form>
        <p v-if="chatError" class="track-chat-error">{{ chatError }}</p>
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
.track-chat-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.track-chat-count {
  background: var(--brand);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  min-width: 22px;
  height: 22px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  padding: 0 6px;
}
.track-chat {
  margin-top: 24px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}
.track-chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}
.track-chat-header h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 2px;
}
.track-chat-header small {
  color: #999;
  font-size: 12px;
}
.track-chat-messages {
  max-height: 360px;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.track-chat-empty {
  color: #999;
  text-align: center;
  padding: 24px 0;
  font-size: 14px;
}
.track-chat-msg {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
}
.track-chat-msg.client {
  align-self: flex-end;
  background: var(--brand);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.track-chat-msg.staff {
  align-self: flex-start;
  background: #f0f0f0;
  color: #222;
  border-bottom-left-radius: 4px;
}
.track-chat-sender {
  display: block;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
  opacity: 0.7;
}
.track-chat-msg p {
  margin: 0;
}
.track-chat-msg time {
  display: block;
  font-size: 10px;
  opacity: 0.6;
  margin-top: 4px;
  text-align: right;
}
.track-chat-form {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
}
.track-chat-form input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}
.track-chat-form input:focus {
  outline: none;
  border-color: var(--brand);
}
.track-chat-form button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: var(--brand);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.track-chat-form button:hover:not(:disabled) {
  background: #000;
}
.track-chat-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.track-chat-error {
  padding: 0 16px 12px;
  color: #d32f2f;
  font-size: 13px;
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
  .track-chat-msg {
    max-width: 90%;
  }
}
@media (max-width: 480px) {
  .track-page {
    padding: calc(var(--header-h) + 24px) 16px 56px;
  }
  h1 { font-size: 26px; }
}
</style>
