<script setup lang="ts">
import type { CmsSettings } from '~/types/cms'

defineProps<{ settings: CmsSettings }>()

const consent = useCookie<'accepted' | 'rejected' | null>(
  'revive_cookie_consent',
  {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  }
)

const visible = computed(() => consent.value === null)

function accept() {
  consent.value = 'accepted'
}

function reject() {
  consent.value = 'rejected'
}
</script>

<template>
  <div v-if="visible" class="cookie" role="alertdialog" aria-label="Уведомление о cookie">
    <p>
      {{ settings.cookie_text }}
      <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
    </p>
    <div class="cookie-btns">
      <button type="button" class="cookie-reject" @click="reject">Отклонить</button>
      <button type="button" class="cookie-accept" @click="accept">Принять</button>
    </div>
  </div>
</template>

<style scoped>
.cookie {
  position: fixed;
  left: 16px;
  right: auto;
  bottom: 16px;
  z-index: 45;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
  padding: 16px 18px;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 480px;
  margin: 0;
}
p {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}
p a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
}
.cookie-btns {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.cookie-accept {
  background: #000;
  color: #fff;
  border: 0;
  border-radius: 30px;
  padding: 12px 18px;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}
.cookie-reject {
  background: transparent;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 30px;
  padding: 12px 18px;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}
.cookie-reject:hover {
  border-color: #999;
  color: #333;
}
@media (max-width: 700px) {
  .cookie {
    left: 12px;
    right: 12px;
    bottom: 88px;
    max-width: none;
    flex-direction: column;
    align-items: stretch;
  }
  .cookie-btns {
    justify-content: stretch;
  }
  .cookie-btns button {
    flex: 1;
  }
}
@media (max-width: 480px) {
  .cookie { padding: 12px 14px; gap: 10px; bottom: 80px; }
  p { font-size: 13px; }
  .cookie-accept, .cookie-reject { padding: 10px 14px; font-size: 11px; }
}
</style>
