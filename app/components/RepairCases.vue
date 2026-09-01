<script setup lang="ts">
const { cases } = await useCases({ featured: true, limit: 3 })

const iconSvg: Record<string, string> = {
  motherboard: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M0 20h24"/>',
  pc: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  default: '<rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/>',
}

function iconFor(device: string): string {
  const d = device.toLowerCase()
  if (d.includes('материн') || d.includes('gigabyte') || d.includes('asus')) return iconSvg.motherboard
  if (d.includes('системн') || d.includes('пк') || d.includes('pc')) return iconSvg.pc
  if (d.includes('iphone') || d.includes('смартфон') || d.includes('samsung') || d.includes('xiaomi') || d.includes('android')) return iconSvg.phone
  if (d.includes('ноутбук') || d.includes('macbook')) return iconSvg.motherboard
  if (d.includes('моноблок') || d.includes('imac')) return iconSvg.pc
  return iconSvg.default
}
</script>

<template>
  <section v-if="cases.length" class="cases">
    <div class="wrap">
      <div class="head">
        <span class="eyebrow">Реальные ремонты</span>
        <h2 class="title">Что мы <span>ремонтируем</span></h2>
        <p class="subtitle">Примеры из практики — от компонентного ремонта плат до микропайки смартфонов</p>
      </div>
      <div class="grid">
        <NuxtLink
          v-for="item in cases"
          :key="item.id"
          :to="`/cases/${item.slug}`"
          class="card"
        >
          <div class="card-head">
            <div class="device-icon" v-html="iconFor(item.device)" />
            <div>
              <h3 class="device">{{ item.device }}</h3>
              <span class="symptom">{{ item.problem }}</span>
            </div>
          </div>
          <div class="steps">
            <div v-if="item.diagnostics" class="step">
              <span class="step-label">Диагностика</span>
              <p>{{ item.diagnostics }}</p>
            </div>
            <div v-if="item.repair" class="step">
              <span class="step-label">Что сделали</span>
              <p>{{ item.repair }}</p>
            </div>
            <div v-if="item.result" class="step">
              <span class="step-label">Результат</span>
              <p>{{ item.result }}</p>
            </div>
          </div>
          <div v-if="item.tags?.length" class="tags">
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cases {
  padding: 72px 0;
  background: #fff;
}
.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.head {
  margin-bottom: 40px;
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
.title {
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.title span {
  color: var(--brand);
}
.subtitle {
  font-size: 16px;
  color: var(--dim);
  max-width: 520px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.card {
  background: #fafafa;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: rgba(253, 81, 25, 0.3);
  box-shadow: 0 8px 28px rgba(253, 81, 25, 0.06);
}
.card-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.device-icon {
  width: 40px;
  height: 40px;
  background: var(--soft);
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--brand);
}
.device-icon :deep(svg) {
  width: 20px;
  height: 20px;
}
.device {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 2px;
}
.symptom {
  font-size: 13px;
  color: var(--brand);
  font-weight: 600;
}
.steps {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}
.step {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.step-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--dim);
}
.step p {
  font-size: 13px;
  color: #555;
  line-height: 1.55;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}
.tags span {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  background: var(--soft);
  color: var(--brand);
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .wrap { padding: 0 24px; }
}
@media (max-width: 580px) {
  .grid { grid-template-columns: 1fr; }
  .wrap { padding: 0 16px; }
  .cases { padding: 48px 0; }
}
</style>
