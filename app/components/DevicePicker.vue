<script setup lang="ts">
const devices = [
  { name: 'Ноутбук', icon: 'laptop', href: '/remont-noutbukov' },
  { name: 'Смартфон', icon: 'phone', href: '/remont-smartfonov' },
  { name: 'iPhone', icon: 'iphone', href: '/prices' },
  { name: 'MacBook', icon: 'laptop', href: '/prices' },
  { name: 'Компьютер', icon: 'pc', href: '/remont-kompyuterov' },
  { name: 'Планшет', icon: 'tablet', href: '/remont-planshetov' },
]

const strokeMarkup: Record<string, string> = {
  laptop: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M0 20h24"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  iphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="17" r="1"/><line x1="6" y1="5" x2="18" y2="5"/>',
  pc: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
}

function iconSvg(name: string) {
  const inner = strokeMarkup[name] || strokeMarkup.laptop
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
}
</script>

<template>
  <section class="picker">
    <div class="wrap">
      <h2 class="title">Что нужно отремонтировать?</h2>
      <p class="subtitle">Выберите устройство — покажем цены и условия</p>
      <div class="grid">
        <NuxtLink
          v-for="device in devices"
          :key="device.name"
          :to="device.href"
          class="device"
        >
          <div class="device-icon" v-html="iconSvg(device.icon)" />
          <span class="device-name">{{ device.name }}</span>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" /></svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.picker {
  padding: 80px 0;
  background: linear-gradient(180deg, #f8f8f8 0%, #fff 100%);
}
.title {
  text-align: center;
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--dim);
  margin-bottom: 44px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.device {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.25s, transform 0.2s;
}
.device:hover {
  border-color: rgba(253, 81, 25, 0.35);
  box-shadow: 0 8px 32px rgba(253, 81, 25, 0.08);
  transform: translateY(-2px);
}
.device-icon {
  width: 48px;
  height: 48px;
  background: var(--soft);
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}
.device:hover .device-icon {
  background: var(--brand);
  color: #fff;
}
.device-icon :deep(svg) {
  width: 24px;
  height: 24px;
}
.device-name {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
}
.chevron {
  width: 18px;
  height: 18px;
  color: var(--dim);
  transition: transform 0.2s, color 0.2s;
  flex-shrink: 0;
}
.device:hover .chevron {
  color: var(--brand);
  transform: translateX(3px);
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 580px) {
  .grid { grid-template-columns: 1fr; gap: 12px; }
  .picker { padding: 56px 0 48px; }
  .subtitle { margin-bottom: 32px; }
  .device { padding: 18px 16px; }
  .device-icon { width: 42px; height: 42px; }
  .device-name { font-size: 15px; }
}
</style>
