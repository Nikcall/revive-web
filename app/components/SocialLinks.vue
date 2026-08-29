<script setup lang="ts">
import type { CmsContacts } from '~/types/cms'

defineProps<{ contacts: CmsContacts }>()
const open = ref(false)
const showTop = ref(false)

function onScroll() {
  showTop.value = (window.scrollY || document.documentElement.scrollTop) > 400
}

function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="fab">
    <button
      v-show="showTop"
      class="top-btn"
      type="button"
      aria-label="Наверх"
      @click="toTop"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 14l6-6 6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="open" class="fab-list">
      <a
        class="fab-item telegram"
        :href="contacts.telegram"
        target="_blank"
        rel="nofollow"
        aria-label="Telegram"
      >
        <SocialIcon name="telegram" variant="circle" />
      </a>
      <a
        class="fab-item whatsapp"
        :href="contacts.whatsapp"
        target="_blank"
        rel="nofollow"
        aria-label="WhatsApp"
      >
        <SocialIcon name="whatsapp" variant="circle" />
      </a>
      <a
        class="fab-item vk"
        :href="contacts.vk"
        target="_blank"
        rel="nofollow"
        aria-label="VK"
      >
        <SocialIcon name="vk" variant="circle" />
      </a>
      <a
        v-if="contacts.max"
        class="fab-item max"
        :href="contacts.max"
        target="_blank"
        rel="nofollow"
        aria-label="MAX"
      >
        <SocialIcon name="max" variant="circle" />
      </a>
    </div>
    <button class="fab-btn" type="button" :aria-label="open ? 'Закрыть' : 'Написать'" @click="open = !open">
      <SocialIcon :name="open ? 'close' : 'write'" />
    </button>
  </div>
</template>

<style scoped>
.fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.fab-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 0;
  background: #fff;
  color: #000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  padding: 12px;
  display: grid;
  place-items: center;
}
.fab-btn :deep(.si) {
  width: 28px;
  height: 26px;
}
.fab-list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.fab-item {
  width: 50px;
  height: 50px;
  color: #111;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.16));
  transition: transform 0.15s;
}
.fab-item:hover {
  transform: scale(1.06);
}
.fab-item.telegram { color: #1d98dc; }
.fab-item.whatsapp { color: #27d061; }
.fab-item.vk { color: #0077ff; }
.fab-item.max { color: #000; }
.top-btn {
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: var(--brand);
  color: #fff;
  box-shadow: 0 8px 24px var(--glow);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.top-btn svg {
  width: 22px;
  height: 22px;
}
.top-btn:hover {
  transform: translateY(-2px);
}
</style>
