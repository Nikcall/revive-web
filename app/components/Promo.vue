<script setup lang="ts">
import type { CmsPromo } from '~/types/cms'

defineProps<{ promos: CmsPromo[] }>()
</script>

<template>
  <section
    v-for="promo in promos.filter((p) => p.active !== false)"
    :key="promo.title || promo.badge"
    class="promo"
    :class="{ photo: Boolean(promo.image) }"
    :style="promo.image ? { backgroundImage: `url(${promo.image})` } : undefined"
  >
    <div class="veil" />
    <div class="wrap inner">
      <p v-if="promo.badge" class="badge">{{ promo.badge }}</p>
      <div class="copy">
        <h2 v-if="promo.title">{{ promo.title }}</h2>
        <p v-if="promo.subtitle" class="sub">{{ promo.subtitle }}</p>
      </div>
      <a class="cta" :href="promo.cta_href">{{ promo.cta_text }}</a>
    </div>
  </section>
</template>

<style scoped>
.promo {
  position: relative;
  background: #111;
  background-size: cover;
  background-position: center;
  color: #fff;
}
.veil {
  display: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.45) 100%);
}
.photo .veil {
  display: block;
}
.inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px 28px;
  flex-wrap: wrap;
  padding: 22px 24px;
  text-align: left;
}
.badge {
  background: var(--brand);
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 6px;
  text-transform: uppercase;
  flex-shrink: 0;
}
h2 {
  font-size: 18px;
  margin-bottom: 4px;
}
.copy {
  min-width: 0;
  max-width: 560px;
}
.sub {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.45;
  font-size: 15px;
  margin: 0;
}
.cta {
  color: #fff !important;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 2px solid var(--brand);
  padding-bottom: 2px;
  transition: color 0.2s;
}
.cta:hover {
  color: var(--brand) !important;
}
@media (max-width: 700px) {
  .inner {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 20px 0;
  }
}
@media (max-width: 480px) {
  .inner { padding: 16px 0; }
  h2 { font-size: 16px; }
  .sub { font-size: 13px; }
  .badge { font-size: 11px; padding: 6px 10px; }
}
</style>
