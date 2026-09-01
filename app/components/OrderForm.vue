<script setup lang="ts">
import type { CmsContacts } from '~/types/cms'

const props = defineProps<{ contacts: CmsContacts }>()
const name = ref('')
const phone = ref('')
const channel = ref('phone')
const problem = ref('')
const consent = ref(false)
const company = ref('')
const status = ref<'idle' | 'loading' | 'ok' | 'error'>('idle')
const message = ref('')

const route = useRoute()
const { serviceBySlug } = await useCms()
const { capture } = useAttribution()

const channels = [
  { value: 'phone', label: 'Телефон' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'vk', label: 'VK' },
  { value: 'max', label: 'MAX' },
]

function maskPhone(raw: string) {
  let digits = raw.replace(/\D/g, '')
  if (!digits.length) return ''
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
  if (!digits.startsWith('7')) digits = `7${digits}`
  digits = digits.slice(0, 11)
  const rest = digits.slice(1)
  let out = '+7'
  if (rest.length) out += ` (${rest.slice(0, 3)}`
  if (rest.length >= 3) out += ')'
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`
  return out
}

function onPhoneInput(event: Event) {
  const el = event.target as HTMLInputElement
  phone.value = maskPhone(el.value)
}

const phoneValid = computed(() => phone.value.replace(/\D/g, '').length === 11)

function slugFromPath(path: string) {
  const raw = String(path || '').split('?')[0].split('#')[0]
  return raw.replace(/^\/+|\/+$/g, '').split('/')[0] || ''
}

function labelForSlug(slug: string) {
  const service = slug ? serviceBySlug(slug) : null
  if (service?.h1) return service.h1.replace(/\s+в Сургуте\.?$/i, '')
  if (service?.name) return `Ремонт ${service.name.toLowerCase()}`
  return ''
}

function serviceLabel(landingPage = '') {
  const fromRoute = String(route.params.slug || '')
  if (fromRoute) return labelForSlug(fromRoute)
  return labelForSlug(slugFromPath(landingPage))
}

function leadMessage() {
  const channelLabel = channels.find((item) => item.value === channel.value)?.label || ''
  const parts = [problem.value.trim()]
  if (channel.value && channel.value !== 'phone') parts.push(`Связь: ${channelLabel}`)
  return parts.filter(Boolean).join('\n')
}

async function onSubmit() {
  if (!consent.value || !phoneValid.value) return
  status.value = 'loading'
  message.value = ''
  const attr = capture()
  try {
    await submitLead({
      name: name.value,
      phone: phone.value,
      message: leadMessage(),
      service: serviceLabel(attr.landing_page),
      page_url: route.path,
      landing_page: attr.landing_page || route.path,
      referrer: attr.referrer,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      utm_term: attr.utm_term,
      yclid: attr.yclid,
      company: company.value,
    })
    status.value = 'ok'
    name.value = ''
    phone.value = ''
    problem.value = ''
    consent.value = false
  } catch {
    status.value = 'error'
    message.value = 'Не отправилось. Позвоните или напишите в мессенджер — мы на связи.'
  }
}
</script>

<template>
  <section class="order" id="order">
    <div class="wrap grid">
      <div class="copy">
        <h2>Онлайн-форма<br />для записи на ремонт</h2>
        <p class="lead">Позвоните нам прямо сейчас<br />или напишите в мессенджеры —<br />мы всегда на связи!</p>
        <div class="soc">
          <a :href="props.contacts.telegram" target="_blank" rel="nofollow" aria-label="Telegram">
            <SocialIcon name="telegram" variant="glyph" />
          </a>
          <a :href="props.contacts.whatsapp" target="_blank" rel="nofollow" aria-label="WhatsApp">
            <SocialIcon name="whatsapp" variant="glyph" />
          </a>
          <a :href="props.contacts.vk" target="_blank" rel="nofollow" aria-label="VK">
            <SocialIcon name="vk" variant="glyph" />
          </a>
          <a
            v-if="props.contacts.max"
            :href="props.contacts.max"
            target="_blank"
            rel="nofollow"
            aria-label="MAX"
          >
            <SocialIcon name="max" variant="glyph" />
          </a>
          <a :href="props.contacts.phone_href" aria-label="Телефон">
            <SocialIcon name="phone" variant="glyph" />
          </a>
          <a :href="`mailto:${props.contacts.email}`" aria-label="Почта">
            <SocialIcon name="email" variant="glyph" />
          </a>
        </div>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="hp" aria-hidden="true">
          <label>
            <span>Company</span>
            <input v-model="company" type="text" tabindex="-1" autocomplete="off" />
          </label>
        </div>
        <label class="field">
          <span>Имя</span>
          <input v-model="name" type="text" required autocomplete="name" placeholder="Как к вам обращаться" />
        </label>
        <fieldset class="channels-wrap">
          <legend>Как удобнее связаться</legend>
          <div class="channels">
            <label v-for="item in channels" :key="item.value">
              <input v-model="channel" type="radio" :value="item.value" />
              <SocialIcon :name="item.value" variant="glyph" />
              {{ item.label }}
            </label>
          </div>
        </fieldset>
        <label class="field">
          <span>Телефон</span>
          <input
            :value="phone"
            type="tel"
            required
            autocomplete="tel"
            inputmode="tel"
            placeholder="+7 (995) 000-00-00"
            @input="onPhoneInput"
          />
        </label>
        <label class="field">
          <span>Что случилось</span>
          <textarea v-model="problem" rows="3" placeholder="Кратко опишите проблему" />
        </label>
        <button class="btn-fill submit" type="submit" :disabled="status === 'loading' || !consent || !phoneValid">
          {{ status === 'loading' ? 'Отправка…' : 'Связаться с мастером REVIVE' }}
        </button>
        <label class="consent">
          <input v-model="consent" type="checkbox" required />
          <span>
            Я согласен на обработку персональных данных согласно
            <NuxtLink to="/privacy">политике конфиденциальности</NuxtLink>
            и
            <NuxtLink to="/oferta">оферте</NuxtLink>.
            Или сразу:
            <a :href="contacts.phone_href">{{ contacts.phone }}</a>
          </span>
        </label>
        <p v-if="status === 'ok'" class="ok">Заявка принята! Спасибо, что обратились в REVIVE. В ближайшее время мы свяжемся с вами, уточним детали и расскажем, что делать дальше.</p>
        <p v-if="status === 'error'" class="err">{{ message }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.order {
  padding: 100px 0;
  background: #fff;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
h2 {
  font-size: clamp(26px, 4vw, 32px);
  margin-bottom: 16px;
  text-transform: uppercase;
  font-weight: 600;
  line-height: 1.2;
}
.lead {
  color: #070707;
  margin-bottom: 24px;
  line-height: 1.6;
}
.soc {
  display: flex;
  gap: 10px;
  align-items: center;
}
.soc a {
  display: grid;
  place-items: center;
  color: #555;
  transition: color 0.2s;
  padding: 7px;
}
.soc a:hover {
  color: var(--brand);
}
.soc :deep(.si-img) {
  width: 22px;
  height: 22px;
}
.soc :deep(.si) {
  width: 22px;
  height: 22px;
}
form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field > span,
.channels-wrap legend {
  font-size: 14px;
  font-weight: 600;
}
.channels-wrap {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}
input,
textarea {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #c7c7c7;
  font-size: 16px;
  resize: vertical;
}
.channels {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  font-weight: 600;
  font-size: 13px;
  margin-top: 8px;
}
.channels label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.channels :deep(.si-img) {
  width: 18px;
  height: 18px;
}
.channels :deep(.si) {
  width: 18px;
  height: 18px;
}
.submit {
  border-radius: 10px;
  align-self: flex-start;
}
.submit:hover:not(:disabled) {
  background: #000;
  box-shadow: none;
  transform: none;
}
.submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  pointer-events: none;
}
.consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #555;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 400;
  cursor: pointer;
}
.consent input {
  margin-top: 3px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 1px solid #888;
  border-radius: 3px;
  flex-shrink: 0;
  accent-color: var(--brand);
  cursor: pointer;
}
.consent a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.ok { color: #0a7; }
.err { color: #c33; }
.hp {
  position: absolute;
  left: -9999px;
  height: 0;
  overflow: hidden;
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr; gap: 28px; }
  .submit { width: 100%; }
}
@media (max-width: 480px) {
  .order { padding: 48px 0; }
  .soc { gap: 6px; }
  h2 { font-size: 22px; }
  .channels { gap: 8px 12px; font-size: 12px; }
  input, textarea { padding: 14px; font-size: 15px; }
}
</style>
