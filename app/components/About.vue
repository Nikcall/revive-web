<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  html?: string
  coverTitle?: string
  coverImage?: string
  images?: string[]
}>()
</script>

<template>
  <section class="about" id="about">
    <div
      v-if="coverTitle"
      class="cover"
      :style="{ backgroundImage: `url(${coverImage || '/images/covers/hands.jpg'})` }"
    >
      <div class="veil" />
      <p>{{ coverTitle }}</p>
    </div>
    <div class="wrap body-wrap">
      <p class="ol">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <div class="body" v-html="html" />
      <div v-if="images?.length" class="gallery">
        <img v-for="src in images" :key="src" :src="src" alt="REVIVE — сервисный центр в Сургуте" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.cover {
  position: relative;
  min-height: 42vh;
  display: grid;
  place-items: center;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;
  text-align: center;
}
.veil {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.cover p {
  position: relative;
  z-index: 1;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  text-transform: uppercase;
  padding: 40px 24px;
  letter-spacing: 0.04em;
}
.body-wrap {
  padding: 80px 48px 100px;
}
.ol {
  color: var(--brand);
  font-weight: 700;
  letter-spacing: 0.16em;
  margin-bottom: 12px;
}
h2 {
  font-size: clamp(28px, 4vw, 42px);
  margin-bottom: 24px;
  max-width: 820px;
}
.body {
  max-width: 860px;
  color: #333;
  line-height: 1.75;
  font-size: 17px;
}
.body :deep(p) {
  margin-bottom: 14px;
}
.body :deep(h3) {
  margin: 28px 0 10px;
  font-size: 22px;
}
.body :deep(ul) {
  margin: 0 0 16px 18px;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}
.gallery img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
}
@media (max-width: 880px) {
  .cover { background-attachment: scroll; }
  .body-wrap { padding: 48px 24px 64px; }
  .gallery { grid-template-columns: 1fr; }
}
</style>
