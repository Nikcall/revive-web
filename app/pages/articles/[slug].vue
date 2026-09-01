<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { post } = usePost(slug)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
}

const p = post.value

const categoryLabels: Record<string, string> = {
  notebooks: 'Ноутбуки',
  smartphones: 'Смартфоны',
  pc: 'ПК',
  data: 'Данные',
  general: 'Общее',
}

useHead({
  title: p.seo_title || `${p.title} — REVIVE Service`,
  meta: [
    { name: 'description', content: p.seo_description || p.excerpt },
  ],
})
</script>

<template>
  <article v-if="p" class="post-detail">
    <div class="wrap">
      <NuxtLink to="/articles" class="back">&larr; Все статьи</NuxtLink>

      <header class="post-head">
        <span v-if="p.category" class="eyebrow">{{ categoryLabels[p.category] || p.category }}</span>
        <h1>{{ p.title }}</h1>
        <div class="meta">
          <span v-if="p.author">{{ p.author }}</span>
          <time v-if="p.published_at" :datetime="p.published_at">
            {{ new Date(p.published_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </time>
        </div>
      </header>

      <div v-if="p.cover_image" class="post-cover">
        <img :src="p.cover_image" :alt="p.title" width="900" height="500" />
      </div>

      <div class="post-body" v-html="p.content" />
    </div>
  </article>
</template>

<style scoped>
.post-detail {
  padding: 100px 0 72px;
  min-height: 60vh;
}
.wrap {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 48px;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dim);
  text-decoration: none;
  margin-bottom: 32px;
  transition: color 0.15s;
}
.back:hover {
  color: var(--brand);
}
.post-head {
  margin-bottom: 32px;
}
.eyebrow {
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 8px;
}
h1 {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 12px;
}
.meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--dim);
}
.post-cover {
  margin-bottom: 32px;
  border-radius: 12px;
  overflow: hidden;
}
.post-cover img {
  width: 100%;
  height: auto;
  display: block;
}
.post-body {
  font-size: 16px;
  color: #333;
  line-height: 1.75;
}
.post-body :deep(h2) {
  font-size: 22px;
  font-weight: 700;
  margin: 36px 0 16px;
}
.post-body :deep(h3) {
  font-size: 18px;
  font-weight: 700;
  margin: 28px 0 12px;
}
.post-body :deep(p) {
  margin-bottom: 16px;
}
.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 12px 0 16px 24px;
}
.post-body :deep(li) {
  margin-bottom: 6px;
}
.post-body :deep(strong) {
  font-weight: 700;
}
.post-body :deep(blockquote) {
  border-left: 3px solid var(--brand);
  padding: 12px 16px;
  margin: 16px 0;
  background: #fafafa;
  border-radius: 0 8px 8px 0;
  color: #555;
}
.post-body :deep(code) {
  background: var(--soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}
.post-body :deep(pre) {
  background: #1a1a1a;
  color: #f0f0f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}
.post-body :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}
@media (max-width: 580px) {
  .wrap { padding: 0 16px; }
  .post-detail { padding: 80px 0 48px; }
}
</style>
