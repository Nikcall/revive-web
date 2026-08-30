<script setup lang="ts">
const devices = [
  { name: 'Ноутбук', icon: 'laptop', href: '/remont-noutbukov', problems: ['Не включается', 'Перегревается', 'Не заряжается', 'Разбит экран'] },
  { name: 'Смартфон', icon: 'phone', href: '/remont-smartfonov', problems: ['Разбит экран', 'Не заряжается', 'Не включается', 'Треснуло стекло'] },
  { name: 'iPhone', icon: 'phone', href: '/remont-smartfonov', problems: ['Face ID', 'Замена батареи', 'Разбит экран', 'Не заряжается'] },
  { name: 'MacBook', icon: 'laptop', href: '/remont-noutbukov', problems: ['Не включается', 'Клавиатура', 'Перегрев', 'Батарея'] },
  { name: 'Компьютер', icon: 'pc', href: '/remont-kompyuterov', problems: ['Не включается', 'Шумит', 'Тормозит', 'Перегревается'] },
  { name: 'Планшет', icon: 'tablet', href: '/remont-planshetov', problems: ['Разбит экран', 'Не заряжается', 'Не включается', 'Треснуло стекло'] },
]

const strokeMarkup: Record<string, string> = {
  laptop: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M0 20h24"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  pc: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
}

function iconSvg(name: string) {
  const inner = strokeMarkup[name] || strokeMarkup.laptop
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
}

const expanded = ref<number | null>(null)
</script>

<template>
  <section class="picker">
    <div class="wrap">
      <h2 class="title">Что нужно отремонтировать?</h2>
      <p class="subtitle">Выберите устройство — покажем цены и частые неисправности</p>
      <div class="grid">
        <div
          v-for="(device, i) in devices"
          :key="device.name"
          class="device"
          :class="{ open: expanded === i }"
          @mouseenter="expanded = i"
          @mouseleave="expanded = null"
        >
          <NuxtLink :to="device.href" class="device-main">
            <div class="device-icon" v-html="iconSvg(device.icon)" />
            <span class="device-name">{{ device.name }}</span>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" /></svg>
          </NuxtLink>
          <div class="problems">
            <div class="problems-inner">
              <NuxtLink
                v-for="problem in device.problems"
                :key="problem"
                :to="device.href"
                class="problem"
              >
                {{ problem }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.picker {
  padding: 72px 0;
  background: #fff;
}
.title {
  text-align: center;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--dim);
  margin-bottom: 40px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.device {
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.device:hover,
.device.open {
  border-color: rgba(253, 81, 25, 0.4);
  box-shadow: 0 8px 28px rgba(253, 81, 25, 0.08);
}
.device-main {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
}
.device-icon {
  width: 44px;
  height: 44px;
  background: var(--soft);
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background 0.2s;
}
.device:hover .device-icon,
.device.open .device-icon {
  background: var(--brand);
  color: #fff;
}
.device-icon :deep(svg) {
  width: 22px;
  height: 22px;
}
.device-name {
  font-size: 16px;
  font-weight: 700;
  flex: 1;
}
.chevron {
  width: 18px;
  height: 18px;
  color: var(--dim);
  transition: transform 0.2s;
}
.device.open .chevron {
  transform: rotate(90deg);
}
.problems {
  display: grid;
  grid-template-rows: 0fr;
  padding: 0 20px;
  transition: grid-template-rows 0.25s ease, padding 0.25s ease;
}
.problems-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: hidden;
}
.device.open .problems {
  grid-template-rows: 1fr;
  padding: 0 20px 16px;
}
.problem {
  display: inline-block;
  padding: 6px 14px;
  background: var(--soft);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.problem:hover {
  background: var(--brand);
  color: #fff;
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 580px) {
  .grid { grid-template-columns: 1fr; }
  .picker { padding: 48px 0; }
  .problems { grid-template-rows: 1fr; padding: 0 20px 16px; }
}
</style>
