<script setup lang="ts">
import type { CmsCase } from '~/types/cms'

const props = defineProps<{ cases: CmsCase[] }>()
const pos = ref<Record<string, number>>({})
const dragging = ref<string | null>(null)

function setPos(slug: string, value: number) {
  pos.value[slug] = Math.min(100, Math.max(0, value))
}

function onMove(event: PointerEvent, slug: string, el: HTMLElement) {
  if (dragging.value !== slug) return
  const rect = el.getBoundingClientRect()
  setPos(slug, ((event.clientX - rect.left) / rect.width) * 100)
}
</script>

<template>
  <section class="rv" id="works">
    <div class="ph">
      <div class="ol">Наши работы</div>
      <h2 class="tt">ДО И <span>ПОСЛЕ</span><br />РЕМОНТА</h2>
      <p class="sb">Реальные устройства, реальные результаты — перетащите ползунок и убедитесь сами</p>
    </div>
    <div class="bag">
      <article v-for="item in cases" :key="item.slug" class="bac">
        <div
          class="sl"
          @pointerdown="dragging = item.slug"
          @pointerup="dragging = null"
          @pointerleave="dragging = null"
          @pointermove="onMove($event, item.slug, $event.currentTarget as HTMLElement)"
        >
          <div class="lay before" :style="{ backgroundImage: `url(${item.before_url})` }" />
          <div
            class="lay after"
            :style="{
              backgroundImage: `url(${item.after_url})`,
              clipPath: `inset(0 ${100 - (pos[item.slug] ?? 50)}% 0 0)`,
            }"
          />
          <div class="line" :style="{ left: (pos[item.slug] ?? 50) + '%' }">
            <span>⇄</span>
          </div>
          <span class="bdg after-b">ПОСЛЕ</span>
          <span class="bdg before-b">ДО</span>
        </div>
        <div class="bi">
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <div class="tgs">
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            <span class="price">{{ item.price_label }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.rv {
  background: #000;
  color: #fff;
  font-family: Nunito, sans-serif;
  padding: 72px 0 80px;
}
.ph,
.bag {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.ol {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 16px;
}
.ol::before {
  content: '';
  width: 24px;
  height: 2px;
  background: var(--brand);
}
.tt {
  font-family: Oswald, sans-serif;
  font-size: clamp(40px, 6vw, 72px);
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 14px;
}
.tt span {
  color: var(--brand);
}
.sb {
  color: #aaa;
  max-width: 480px;
  margin-bottom: 40px;
}
.bag {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
  gap: 20px;
}
.bac {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  overflow: hidden;
}
.sl {
  position: relative;
  height: 280px;
  cursor: ew-resize;
  background: #0a0a0a;
  user-select: none;
}
.lay {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: top center;
}
.lay.before {
  filter: saturate(0.45) brightness(0.72);
}
.line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--brand);
  transform: translateX(-50%);
  z-index: 3;
}
.line span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border: 2px solid var(--brand);
  border-radius: 50%;
  background: #000;
  display: grid;
  place-items: center;
  color: var(--brand);
  font-size: 13px;
}
.bdg {
  position: absolute;
  bottom: 12px;
  z-index: 4;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  padding: 3px 10px;
  border-radius: 100px;
  background: rgba(0, 0, 0, 0.65);
}
.after-b {
  left: 12px;
  color: var(--brand);
  border: 1px solid rgba(253, 81, 25, 0.55);
}
.before-b {
  right: 12px;
  color: #ff8080;
  border: 1px solid rgba(255, 100, 100, 0.45);
}
.bi {
  padding: 18px 22px 22px;
}
.bi h3 {
  font-size: 14px;
  margin-bottom: 6px;
}
.bi p {
  font-size: 12px;
  color: #888;
  line-height: 1.55;
  margin-bottom: 12px;
}
.tgs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tgs span {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #aaa;
}
.tgs .price {
  background: rgba(253, 81, 25, 0.12);
  border-color: rgba(253, 81, 25, 0.3);
  color: var(--brand);
}
@media (max-width: 880px) {
  .ph,
  .bag {
    padding: 0 20px;
  }
}
@media (max-width: 480px) {
  .ph,
  .bag {
    padding: 0 16px;
  }
  .bag {
    grid-template-columns: 1fr;
  }
  .tt {
    font-size: clamp(28px, 7vw, 40px);
  }
}
</style>
