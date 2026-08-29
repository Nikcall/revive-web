<script setup lang="ts">
type Step = { title: string; text: string; icon?: string }

const props = defineProps<{
  eyebrow?: string
  title?: string
  steps?: Step[]
  coverImage?: string
  coverTitle?: string
  quote?: string
}>()

const list = computed(() => props.steps || [])
</script>

<template>
  <section class="steps-wrap">
    <div
      v-if="coverTitle"
      class="cover"
      :style="{ backgroundImage: `url(${coverImage || '/images/covers/steps.jpg'})` }"
    >
      <div class="veil" />
      <p>{{ coverTitle }}</p>
    </div>
    <div class="steps">
      <div class="wrap">
        <p v-if="eyebrow" class="ol">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <ol>
          <li v-for="step in list" :key="step.title">
            <img v-if="step.icon" :src="step.icon" alt="" width="72" height="72" />
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
        <a class="btn-fill" href="#order">ОСТАВИТЬ ЗАЯВКУ</a>
      </div>
    </div>
    <div v-if="quote" class="quote">
      <div class="wrap">
        <p>{{ quote }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cover {
  position: relative;
  min-height: 48vh;
  display: grid;
  place-items: center;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  text-align: center;
  color: #fff;
}
.veil {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}
.cover p {
  position: relative;
  z-index: 1;
  font-size: clamp(26px, 4vw, 42px);
  font-weight: 700;
  max-width: 820px;
  padding: 48px 24px;
  line-height: 1.25;
}
.steps {
  padding: 100px 0 80px;
  background: #fff;
  text-align: center;
}
.ol {
  color: var(--brand);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 16px;
  font-size: 13px;
}
h2 {
  font-size: clamp(24px, 4vw, 36px);
  max-width: 860px;
  margin: 0 auto 56px;
  text-transform: uppercase;
  line-height: 1.2;
  font-weight: 700;
}
ol {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  list-style: none;
  text-align: center;
  margin-bottom: 48px;
}
li img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  margin: 0 auto 16px;
}
h3 {
  margin: 0 0 12px;
  text-transform: uppercase;
  font-size: 22px;
  font-weight: 700;
}
p {
  color: #333;
  line-height: 1.6;
  font-size: 16px;
}
.quote {
  background: #f5f5f5;
  padding: 72px 0;
  text-align: center;
}
.quote p {
  max-width: 760px;
  margin: 0 auto;
  font-size: 20px;
  line-height: 1.65;
  color: #222;
}
@media (max-width: 880px) {
  ol { grid-template-columns: 1fr; }
  .cover { background-attachment: scroll; min-height: 36vh; }
  .steps { padding: 64px 0 48px; }
}
</style>
