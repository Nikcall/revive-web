<script setup lang="ts">
import type { CmsSettings } from '~/types/cms'

defineProps<{ settings: CmsSettings }>()
const show = ref(false)

onMounted(() => {
  show.value = localStorage.getItem('revive-cookie') !== '1'
})

function accept() {
  localStorage.setItem('revive-cookie', '1')
  show.value = false
}
</script>

<template>
  <div v-if="show" class="cookie" role="alertdialog" aria-label="Уведомление о cookie">
    <p>
      {{ settings.cookie_text }}
      <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
    </p>
    <button type="button" @click="accept">Ок, больше не показывать</button>
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
button {
  background: #000;
  color: #fff;
  border: 0;
  border-radius: 30px;
  padding: 10px 16px;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}
@media (max-width: 700px) {
  .cookie {
    left: 12px;
    right: 12px;
    bottom: 88px;
    max-width: none;
  }
}
</style>
