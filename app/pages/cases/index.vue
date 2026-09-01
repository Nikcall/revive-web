<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { cases } = await useCases({ limit: 20 })

useHead({
  title: 'Реальные ремонты — REVIVE Service',
  meta: [
    { name: 'description', content: 'Примеры реальных ремонтов из практики REVIVE Service в Сургуте — от диагностики до результата.' },
  ],
})
</script>

<template>
  <section class="cases-page">
    <div class="wrap">
      <div class="head">
        <span class="eyebrow">Из практики</span>
        <h1>Реальные <span>ремонты</span></h1>
        <p class="subtitle">Каждый кейс — реальный случай из нашей мастерской. От диагностики до результата.</p>
      </div>

      <div v-if="cases.length" class="grid">
        <NuxtLink
          v-for="item in cases"
          :key="item.id"
          :to="`/cases/${item.slug}`"
          class="card"
        >
          <div v-if="item.cover_image" class="card-img">
            <img :src="item.cover_image" :alt="item.title" loading="lazy" width="400" height="240" />
          </div>
          <div class="card-body">
            <h2 class="card-title">{{ item.title }}</h2>
            <p class="card-device">{{ item.device }}</p>
            <p class="card-problem">{{ item.problem }}</p>
            <div v-if="item.tags?.length" class="card-tags">
              <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="empty">
        <p>Кейсы пока не добавлены. Зайдите позже — мы регулярно публикуем примеры ремонтов.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cases-page {
  padding: 100px 0 72px;
  min-height: 60vh;
}
.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.head {
  margin-bottom: 48px;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 12px;
}
.eyebrow::before {
  content: '';
  width: 24px;
  height: 2px;
  background: var(--brand);
}
h1 {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
h1 span {
  color: var(--brand);
}
.subtitle {
  font-size: 17px;
  color: var(--dim);
  max-width: 560px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.card {
  background: #fafafa;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: rgba(253, 81, 25, 0.3);
  box-shadow: 0 8px 28px rgba(253, 81, 25, 0.06);
}
.card-img {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--soft);
}
.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}
.card-device {
  font-size: 13px;
  font-weight: 600;
  color: var(--brand);
}
.card-problem {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.card-tags span {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 100px;
  background: var(--soft);
  color: var(--brand);
}
.empty {
  text-align: center;
  padding: 80px 0;
  color: var(--dim);
  font-size: 16px;
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .wrap { padding: 0 24px; }
}
@media (max-width: 580px) {
  .grid { grid-template-columns: 1fr; }
  .wrap { padding: 0 16px; }
  .cases-page { padding: 80px 0 48px; }
}
</style>
