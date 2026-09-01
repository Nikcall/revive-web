<script setup lang="ts">
import type { CmsContacts } from '~/types/cms'

const props = defineProps<{ contacts: CmsContacts }>()
const open = ref(false)
const showTop = ref(false)
const { contacts } = props

const socialItems = computed(() => {
  const items = [
    { name: 'telegram', href: contacts.telegram, label: 'Telegram' },
    { name: 'whatsapp', href: contacts.whatsapp, label: 'WhatsApp' },
    { name: 'vk', href: contacts.vk, label: 'VK' },
  ]
  if (contacts.max) {
    items.push({ name: 'max', href: contacts.max, label: 'MAX' })
  }
  return items
})

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
    <Transition name="fab-list">
      <div v-if="open" class="fab-list">
        <a
          v-for="(item, i) in socialItems"
          :key="item.name"
          class="fab-item"
          :class="item.name"
          :href="item.href"
          target="_blank"
          rel="nofollow"
          :aria-label="item.label"
          :style="{ transitionDelay: `${i * 50}ms` }"
        >
          <SocialIcon :name="item.name" variant="glyph" />
        </a>
      </div>
    </Transition>
    <button class="fab-btn" :class="{ open }" type="button" :aria-label="open ? 'Закрыть' : 'Написать'" @click="open = !open">
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
  color: #111;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  padding: 14px;
  display: grid;
  place-items: center;
}
.fab-btn :deep(.si) {
  width: 28px;
  height: 28px;
  transition: transform 0.3s;
}
.fab-btn.open :deep(.si) {
  transform: rotate(135deg);
}
.fab-list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.fab-item {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
  transition: transform 0.15s;
  display: grid;
  place-items: center;
}
.fab-item:hover {
  transform: scale(1.1);
}
.fab-item :deep(.si) {
  width: 28px;
  height: 28px;
}
.fab-item.telegram { color: #1d98dc; }
.fab-item.whatsapp { color: #25d366; }
.fab-item.vk { color: #0077ff; }
.fab-item.max { color: #000; }

/* Stagger animation */
.fab-list-enter-active .fab-item {
  animation: fab-pop 0.25s ease-out both;
}
.fab-list-leave-active .fab-item {
  animation: fab-pop 0.15s ease-in both reverse;
}
@keyframes fab-pop {
  from { opacity: 0; transform: scale(0.6) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Transition wrapper */
.fab-list-enter-active,
.fab-list-leave-active {
  transition: opacity 0.2s;
}
.fab-list-enter-from,
.fab-list-leave-to {
  opacity: 0;
}

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
