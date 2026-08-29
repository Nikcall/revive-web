<script setup lang="ts">
import '~/assets/css/main.css'

const props = defineProps<{
  error: { statusCode: number; statusMessage?: string; message?: string }
}>()

const isNotFound = computed(() => props.error?.statusCode === 404)
const title = computed(() => (isNotFound.value ? 'Страница не найдена — REVIVE' : 'Ошибка — REVIVE'))

useHead({
  title: title.value,
  meta: [
    { name: 'description', content: 'Запрошенная страница не найдена на сайте сервисного центра REVIVE.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-inner">
      <p class="code">{{ error?.statusCode || 404 }}</p>
      <h1 v-if="isNotFound">Страница не найдена</h1>
      <h1 v-else>Что-то пошло не так</h1>
      <p class="desc" v-if="isNotFound">
        Возможно, страница была перемещена или адрес введён с ошибкой.
        Посмотрите актуальные цены на ремонт или вернитесь на главную.
      </p>
      <p class="desc" v-else>
        Попробуйте обновить страницу или вернуться на главную.
      </p>
      <div class="actions">
        <a href="/" class="btn-fill" @click.prevent="handleClear">На главную</a>
        <NuxtLink to="/prices" class="btn-outline">Смотреть цены</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
}
.error-inner {
  max-width: 480px;
}
.code {
  font-size: 72px;
  font-weight: 900;
  color: var(--brand);
  line-height: 1;
  margin-bottom: 8px;
}
h1 {
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 800;
  margin-bottom: 12px;
}
.desc {
  font-size: 16px;
  color: var(--dim);
  line-height: 1.6;
  margin-bottom: 28px;
}
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-fill,
.btn-outline {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s;
}
.btn-fill {
  background: var(--brand);
  color: #fff;
}
.btn-fill:hover {
  background: #e04410;
}
.btn-outline {
  background: var(--soft);
  color: var(--text);
  border: 1px solid var(--border);
}
.btn-outline:hover {
  border-color: var(--brand);
  color: var(--brand);
}
</style>
