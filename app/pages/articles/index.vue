<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const activeCategory = (route.query.category as string) || ''

const { posts } = await usePosts({ limit: 20, category: activeCategory || undefined })

const categories = [
  { label: 'Все', value: '' },
  { label: 'Ноутбуки', value: 'notebooks' },
  { label: 'Смартфоны', value: 'smartphones' },
  { label: 'ПК', value: 'pc' },
  { label: 'Данные', value: 'data' },
  { label: 'Общее', value: 'general' },
]

const categoryLabels: Record<string, string> = {
  notebooks: 'Ноутбуки',
  smartphones: 'Смартфоны',
  pc: 'ПК',
  data: 'Данные',
  general: 'Общее',
}

useHead({
  title: 'База знаний — REVIVE Service',
  meta: [
    { name: 'description', content: 'Полезные статьи о ремонте техники, диагностике и обслуживании. База знаний REVIVE Service, Сургут.' },
  ],
})
</script>

<template>
  <section class="articles-page">
    <div class="wrap">
      <div class="head">
        <span class="eyebrow">База знаний</span>
        <h1>Полезные <span>статьи</span></h1>
        <p class="subtitle">Советы по эксплуатации, диагностика, выбор комплектующих. Пишем о том, что встречаем в мастерской.</p>
      </div>

      <nav class="cats">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.value"
          :to="cat.value ? `/articles?category=${cat.value}` : '/articles'"
          :class="['cat-btn', { active: activeCategory === cat.value }]"
        >
          {{ cat.label }}
        </NuxtLink>
      </nav>

      <div v-if="posts.length" class="grid">
        <NuxtLink
          v-for="item in posts"
          :key="item.id"
          :to="`/articles/${item.slug}`"
          class="card"
        >
          <div v-if="item.cover_image" class="card-img">
            <img :src="item.cover_image" :alt="item.title" loading="lazy" width="400" height="240" />
          </div>
          <div class="card-body">
            <span v-if="item.category" class="card-cat">{{ categoryLabels[item.category] || item.category }}</span>
            <h2 class="card-title">{{ item.title }}</h2>
            <p class="card-excerpt">{{ item.excerpt }}</p>
            <time v-if="item.published_at" :datetime="item.published_at">
              {{ new Date(item.published_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </time>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="empty">
        <p>Статьи пока не добавлены. Зайдите позже — мы пишем о частых проблемах и ремонтах.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.articles-page {
  padding: 100px 0 72px;
  min-height: 60vh;
}
.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.head {
  margin-bottom: 32px;
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
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 36px;
}
.cat-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: #fff;
  color: #555;
  text-decoration: none;
  transition: all 0.15s;
}
.cat-btn:hover {
  border-color: var(--brand);
  color: var(--brand);
}
.cat-btn.active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
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
.card-cat {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}
.card-excerpt {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
time {
  font-size: 12px;
  color: var(--dim);
  margin-top: auto;
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
  .articles-page { padding: 80px 0 48px; }
}
</style>
