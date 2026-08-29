<script setup lang="ts">
import type { CmsHomepage } from '~/types/cms'

const props = defineProps<{
  home: CmsHomepage
  h1: string
}>()

const { settings: heroCms } = await useSiteSettings()

const counters = ref<Record<number, string>>({})

const cmsTitle = computed(() => heroCms.value.hero_title || props.h1)
const splitTitle = computed(() => {
  const t = cmsTitle.value
  return t.includes('компьютерной') && t.includes('мобильной')
})
const taglineLines = computed(() =>
  (heroCms.value.hero_subtitle || props.home.tagline || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean),
)

onMounted(() => {
  props.home.stats.forEach((stat, idx) => {
    if (stat.static) {
      counters.value[idx] = stat.static
      return
    }
    const target = Number(stat.value || 0)
    const duration = 1400
    const started = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - started) / duration)
      counters.value[idx] = Math.floor(target * p) + (stat.suffix || '')
      if (p < 1) requestAnimationFrame(step)
      else counters.value[idx] = target + (stat.suffix || '')
    }
    requestAnimationFrame(step)
  })
})

const strokeMarkup: Record<string, string> = {
  laptop: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M0 20h24"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  check: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
  pc: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  pin: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>',
}

function iconSvg(name: string) {
  const inner = strokeMarkup[name] || strokeMarkup.check
  return `<svg viewBox="0 0 24 24" fill="none">${inner}</svg>`
}
</script>

<template>
  <section class="hero-wrap">
    <div class="hero">
      <div class="bg-dots" />
      <div class="bg-glow-r" />
      <div class="bg-glow-l" />
      <div class="particles" aria-hidden="true">
        <span class="particle p1" /><span class="particle p2" /><span class="particle p3" />
        <span class="particle p4" /><span class="particle p5" /><span class="particle p6" />
      </div>
      <div class="hero-left">
        <div class="chip">
          <div class="chip-icon">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" /></svg>
          </div>
          <span class="chip-label">{{ home.hero_chip_label }}</span>
          <span class="chip-sep">·</span>
          <span class="chip-city">{{ home.hero_chip_city }}</span>
        </div>
        <h1 class="headline">
          <span class="sr">{{ cmsTitle }}</span>
          <span class="hl-visual" aria-hidden="true">
            <template v-if="splitTitle">
              <span class="hl-line">
                {{ home.hero_line1_prefix }}
                <span class="accent">{{ home.hero_line1_accent }}</span>
              </span>
              <span class="hl-line">
                {{ home.hero_line2_prefix }}
                <span class="typed">{{ home.hero_line2_typed }}</span>
                {{ home.hero_line2_suffix }}
              </span>
            </template>
            <span v-else class="hl-line">{{ cmsTitle }}</span>
          </span>
        </h1>
        <p class="tagline">
          <template v-for="(line, i) in taglineLines" :key="line">
            <strong v-if="i === 1">{{ line }}</strong>
            <span v-else>{{ line }}</span>
            <br v-if="i < taglineLines.length - 1" />
          </template>
        </p>
        <div class="actions">
          <a class="btn-fill" :href="heroCms.hero_button_url">
            <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.81 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.72 6.72l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
            {{ heroCms.hero_button_text }}
          </a>
          <a class="btn-outline" :href="home.cta_secondary_href">
            {{ home.cta_secondary_text }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
        <div class="stats">
          <template v-for="(stat, i) in home.stats" :key="stat.label">
            <div class="stat">
              <div class="stat-num">{{ counters[i] ?? stat.static ?? (stat.value + stat.suffix) }}</div>
              <div class="stat-lbl">{{ stat.label }}</div>
            </div>
            <div v-if="i < home.stats.length - 1" class="stat-sep" />
          </template>
        </div>
      </div>
      <div class="hero-right">
        <div class="orbit orbit-1" />
        <div class="orbit orbit-2" />
        <div class="core">
          <div class="core-card">
            <div class="core-re">
              <span>RE</span><span class="vive">VIVE</span>
            </div>
            <div class="core-vive">{{ home.core_subtitle }}</div>
          </div>
        </div>
        <NuxtLink
          v-for="(card, i) in home.floating_cards"
          :key="card.name"
          class="svc"
          :class="`svc-${i + 1}`"
          :to="card.href || '/'"
          :aria-label="`${card.name}, ${card.price}`"
        >
          <div class="svc-ic" v-html="iconSvg(card.icon)" />
          <div>
            <div class="svc-name">{{ card.name }}</div>
            <div class="svc-price" :class="{ accent: card.accent }">{{ card.price }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="marquee-bar">
      <div class="marquee-inner">
        <span v-for="(item, i) in [...home.marquee, ...home.marquee]" :key="i" class="mq-item">
          <span class="mq-dot" />{{ item }}
        </span>
      </div>
    </div>
    <div class="adv-bar">
      <div v-for="adv in home.advantages" :key="adv.title" class="adv">
        <div class="adv-ic" v-html="iconSvg(adv.icon)" />
        <div>
          <div class="adv-t">{{ adv.title }}</div>
          <div class="adv-s">{{ adv.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-wrap {
  padding-top: var(--header-h);
  background: linear-gradient(160deg, #fff 0%, #f0f0f0 100%);
}
.hero {
  position: relative;
  min-height: calc(100vh - var(--header-h));
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 56px 80px;
  gap: 48px;
  overflow: hidden;
}
.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  opacity: 0.45;
  z-index: 0;
}
.bg-glow-r,
.bg-glow-l {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.bg-glow-r {
  width: 700px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(253, 81, 25, 0.08) 0%, transparent 65%);
  top: -200px;
  right: -200px;
  animation: glowDrift 14s ease-in-out infinite;
}
.bg-glow-l {
  width: 400px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(253, 81, 25, 0.05) 0%, transparent 65%);
  bottom: -80px;
  left: -80px;
  animation: glowDrift 18s ease-in-out infinite reverse;
}
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(253, 81, 25, 0.2);
  animation: partFloat ease-in-out infinite alternate;
}
.p1 { width: 4px; height: 4px; top: 15%; left: 8%; animation-duration: 6s; }
.p2 { width: 3px; height: 3px; top: 70%; left: 15%; animation-duration: 8s; animation-delay: 1s; }
.p3 { width: 5px; height: 5px; top: 30%; left: 80%; animation-duration: 7s; animation-delay: 2s; }
.p4 { width: 3px; height: 3px; top: 80%; left: 75%; animation-duration: 9s; animation-delay: 0.5s; }
.p5 { width: 4px; height: 4px; top: 50%; left: 45%; animation-duration: 5s; animation-delay: 3s; }
.p6 { width: 2px; height: 2px; top: 10%; left: 55%; animation-duration: 10s; animation-delay: 1.5s; }
.hero-left,
.hero-right {
  position: relative;
  z-index: 1;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 8px 18px 8px 10px;
  margin-bottom: 40px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  animation: chipIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.chip-icon {
  width: 30px;
  height: 30px;
  background: var(--brand);
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
}
.chip-icon::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1.5px solid rgba(253, 81, 25, 0.3);
  animation: chipPing 2.8s ease-out infinite;
}
.chip-icon svg {
  width: 14px;
  height: 14px;
  fill: #fff;
  color: #fff;
}
.chip-label {
  font-size: 12px;
  font-weight: 700;
}
.chip-sep,
.chip-city {
  font-size: 12px;
  color: var(--dim);
}
.headline {
  position: relative;
  margin-bottom: 22px;
  animation: slideIn 0.7s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.hl-visual {
  display: flex;
  flex-direction: column;
  gap: 0.08em;
}
.hl-line {
  color: var(--text);
  font-size: clamp(34px, 5.4vw, 68px);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.04em;
}
.accent,
.typed {
  color: var(--brand);
}
.typed {
  display: inline-block;
  white-space: nowrap;
  vertical-align: bottom;
  border-right: 3px solid var(--brand);
  animation: blink-caret 0.9s step-end 4, hide-caret 0s 3.6s forwards;
}
.tagline {
  font-size: 16px;
  color: var(--dim);
  line-height: 1.55;
  max-width: 440px;
  margin-bottom: 36px;
}
.tagline strong {
  color: var(--text);
  font-weight: 600;
}
.actions {
  display: flex;
  gap: 16px;
  margin-bottom: 56px;
  flex-wrap: wrap;
  align-items: center;
}
.actions .btn-fill svg {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.actions .btn-outline svg {
  width: 16px;
  height: 16px;
}
.stats {
  display: flex;
  gap: 32px;
}
.stat-num {
  font-size: 28px;
  font-weight: 900;
  color: var(--brand);
  letter-spacing: -0.04em;
  line-height: 1;
}
.stat-lbl {
  font-size: 10px;
  font-weight: 600;
  color: var(--dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 3px;
}
.stat-sep {
  width: 1px;
  background: var(--border);
  align-self: stretch;
}
.hero-right {
  height: 540px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.core {
  width: 200px;
  height: 200px;
  z-index: 5;
}
.core-card {
  width: 100%;
  height: 100%;
  background: var(--brand);
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 30px 70px rgba(253, 81, 25, 0.4), 0 10px 30px rgba(253, 81, 25, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  animation: coreFloat 7s ease-in-out infinite;
}
.core-re {
  font-size: 38px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1;
  white-space: nowrap;
}
.vive {
  color: rgba(255, 255, 255, 0.85);
}
.core-vive {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.2em;
  margin-top: 4px;
  white-space: nowrap;
}
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(253, 81, 25, 0.1);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.orbit-1 {
  width: 320px;
  height: 320px;
  border-style: dashed;
  border-color: rgba(253, 81, 25, 0.15);
  animation: spin 35s linear infinite;
}
.orbit-2 {
  width: 480px;
  height: 480px;
  animation: spin 55s linear infinite reverse;
}
.svc {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
  z-index: 4;
  white-space: nowrap;
  color: inherit;
  cursor: pointer;
  animation: svcFloat ease-in-out infinite;
}
.svc:hover {
  box-shadow: 0 14px 40px rgba(253, 81, 25, 0.15);
}
.svc-ic {
  width: 38px;
  height: 38px;
  background: var(--soft);
  border-radius: 10px;
  display: grid;
  place-items: center;
}
.svc-ic :deep(svg) {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--brand);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.svc-name {
  font-size: 13px;
  font-weight: 700;
}
.svc-price {
  font-size: 11px;
  color: var(--dim);
  margin-top: 1px;
}
.svc-price.accent {
  color: var(--brand);
  font-weight: 700;
}
.svc-1 { top: 3%; left: 50%; animation-duration: 5.5s; animation-name: svcFloatCentered; }
.svc-2 { top: 20%; right: -2%; animation-duration: 7s; animation-delay: 0.7s; }
.svc-3 { bottom: 22%; right: -4%; animation-duration: 6s; animation-delay: 1.4s; }
.svc-4 { bottom: 5%; left: 50%; animation-duration: 6.5s; animation-delay: 2s; animation-name: svcFloatCentered; }
.svc-5 { bottom: 22%; left: -4%; animation-duration: 5s; animation-delay: 2.8s; }
.svc-6 { top: 20%; left: -2%; animation-duration: 7.5s; animation-delay: 1s; }
.marquee-bar {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.02);
  overflow: hidden;
  padding: 13px 0;
}
.marquee-inner {
  display: flex;
  width: max-content;
  animation: mq 24s linear infinite;
}
.mq-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 30px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dim);
  white-space: nowrap;
}
.mq-dot {
  width: 5px;
  height: 5px;
  background: var(--brand);
  border-radius: 50%;
}
.adv-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border);
}
.adv {
  padding: 22px 26px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-right: 1px solid var(--border);
  transition: background 0.2s;
}
.adv:last-child { border-right: none; }
.adv:hover { background: var(--soft); }
.adv:hover .adv-ic { background: var(--brand); }
.adv:hover .adv-ic :deep(svg) { stroke: #fff; }
.adv-ic {
  width: 40px;
  height: 40px;
  background: var(--soft);
  border-radius: 12px;
  display: grid;
  place-items: center;
  transition: background 0.2s;
}
.adv-ic :deep(svg) {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--brand);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.2s;
}
.adv-t { font-size: 13px; font-weight: 700; }
.adv-s { font-size: 11px; color: var(--dim); margin-top: 2px; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes blink-caret {
  0%, 100% { border-color: var(--brand); }
  50% { border-color: transparent; }
}
@keyframes hide-caret {
  to { border-color: transparent; }
}
@keyframes coreFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes glowDrift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 30px); }
}
@keyframes partFloat {
  from { transform: translateY(0); opacity: 0.15; }
  to { transform: translateY(-18px); opacity: 0.5; }
}
@keyframes chipIn {
  from { opacity: 0; transform: translateY(12px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes chipPing {
  0% { transform: scale(1); opacity: 0.8; }
  80%, 100% { transform: scale(1.8); opacity: 0; }
}
@keyframes svcFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes svcFloatCentered {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}
@media (max-width: 880px) {
  .hero { grid-template-columns: 1fr; padding: 40px 24px 40px; min-height: auto; }
  .hero-right {
    height: auto;
    flex-wrap: wrap;
    gap: 16px;
    padding-top: 8px;
  }
  .orbit { display: none; }
  .core { width: 120px; height: 120px; }
  .core-re { font-size: 24px; }
  .svc {
    position: static;
    animation: none;
    transform: none !important;
    width: calc(50% - 8px);
  }
  .adv-bar { grid-template-columns: 1fr 1fr; }
  .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .stat-sep { display: none; }
  .tagline { max-width: 100%; }
  .hl-line { font-size: clamp(32px, 9vw, 44px); }
}
@media (max-width: 480px) {
  .hero { padding: 24px 16px 32px; }
  .chip { margin-bottom: 24px; }
  .hl-line { font-size: clamp(28px, 8vw, 38px); }
  .tagline { font-size: 14px; margin-bottom: 24px; }
  .actions { margin-bottom: 32px; }
  .stats { grid-template-columns: 1fr; gap: 12px; }
  .stat-num { font-size: 22px; }
  .svc { width: 100%; }
  .adv-bar { grid-template-columns: 1fr; }
  .adv { padding: 16px 20px; }
}
@media (max-width: 430px) {
  .actions { flex-direction: column; align-items: stretch; }
  .actions .btn-fill { width: 100%; justify-content: center; }
  .actions .btn-outline { width: 100%; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-inner,
  .core-card,
  .orbit-1,
  .orbit-2,
  .svc,
  .bg-glow-r,
  .bg-glow-l,
  .particle,
  .chip-icon::after,
  .headline {
    animation: none !important;
  }
  .typed {
    animation: none !important;
    border-right: none;
  }
}
</style>
