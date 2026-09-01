<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { caseItem } = useCase(slug)

if (!caseItem.value) {
  throw createError({ statusCode: 404, statusMessage: 'Кейс не найден' })
}

const c = caseItem.value

useHead({
  title: `${c.title} — REVIVE Service`,
  meta: [
    { name: 'description', content: `${c.device} — ${c.problem}. Диагностика и ремонт в REVIVE Service, Сургут.` },
  ],
})
</script>

<template>
  <article v-if="c" class="case-detail">
    <div class="wrap">
      <NuxtLink to="/cases" class="back">&larr; Все кейсы</NuxtLink>

      <header class="case-head">
        <span class="eyebrow">{{ c.device }}</span>
        <h1>{{ c.title }}</h1>
        <time v-if="c.published_at" :datetime="c.published_at">
          {{ new Date(c.published_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </time>
      </header>

      <div v-if="c.cover_image" class="case-cover">
        <img :src="c.cover_image" :alt="c.title" width="900" height="500" />
      </div>

      <div v-if="c.before_image || c.after_image" class="before-after">
        <div v-if="c.before_image" class="ba-img">
          <span class="ba-label">До</span>
          <img :src="c.before_image" :alt="`${c.title} — до`" width="440" height="300" />
        </div>
        <div v-if="c.after_image" class="ba-img">
          <span class="ba-label">После</span>
          <img :src="c.after_image" :alt="`${c.title} — после`" width="440" height="300" />
        </div>
      </div>

      <div class="case-body">
        <section v-if="c.problem" class="section">
          <h2>Проблема</h2>
          <p>{{ c.problem }}</p>
        </section>
        <section v-if="c.diagnostics" class="section">
          <h2>Диагностика</h2>
          <p>{{ c.diagnostics }}</p>
        </section>
        <section v-if="c.repair" class="section">
          <h2>Что сделали</h2>
          <p>{{ c.repair }}</p>
        </section>
        <section v-if="c.result" class="section">
          <h2>Результат</h2>
          <p>{{ c.result }}</p>
        </section>
      </div>

      <div v-if="c.gallery?.length" class="gallery">
        <h2>Фотографии</h2>
        <div class="gallery-grid">
          <img
            v-for="(img, i) in c.gallery"
            :key="i"
            :src="img"
            :alt="`${c.title} — фото ${i + 1}`"
            loading="lazy"
            width="400"
            height="300"
          />
        </div>
      </div>

      <div v-if="c.tags?.length" class="tags">
        <span v-for="tag in c.tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.case-detail {
  padding: 100px 0 72px;
  min-height: 60vh;
}
.wrap {
  max-width: 860px;
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
.case-head {
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
  margin-bottom: 8px;
}
time {
  font-size: 13px;
  color: var(--dim);
}
.case-cover {
  margin-bottom: 32px;
  border-radius: 12px;
  overflow: hidden;
}
.case-cover img {
  width: 100%;
  height: auto;
  display: block;
}
.before-after {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}
.ba-img {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: var(--soft);
}
.ba-img img {
  width: 100%;
  height: auto;
  display: block;
}
.ba-label {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
}
.case-body {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 32px;
}
.section h2 {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--brand);
  margin-bottom: 8px;
}
.section p {
  font-size: 15px;
  color: #444;
  line-height: 1.65;
}
.gallery {
  margin-bottom: 32px;
}
.gallery h2 {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.gallery-grid img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tags span {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  background: var(--soft);
  color: var(--brand);
}
@media (max-width: 580px) {
  .wrap { padding: 0 16px; }
  .case-detail { padding: 80px 0 48px; }
  .before-after { grid-template-columns: 1fr; }
}
</style>
