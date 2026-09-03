<script setup lang="ts">
</script>

<template>
  <NuxtLink to="/track" class="track-tab" aria-label="Статус ремонта">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
    <span class="label">Статус ремонта</span>
  </NuxtLink>
</template>

<style scoped>
.track-tab {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 45;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: var(--brand);
  color: #fff;
  padding: 16px 10px;
  border-radius: 12px 0 0 12px;
  box-shadow: -6px 4px 20px rgba(0, 0, 0, 0.18);
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}
.track-tab:hover {
  background: #000;
  transform: translateY(-50%) translateX(-3px);
}
.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
@media (max-width: 640px) {
  .track-tab {
    top: 30%;
    right: 0;
    transform: translateY(-50%);
    padding: 12px 6px;
    gap: 8px;
    border-radius: 10px 0 0 10px;
  }
  .track-tab:hover {
    transform: translateY(-50%) translateX(-2px);
  }
  .icon {
    width: 16px;
    height: 16px;
  }
  .label {
    font-size: 10px;
    letter-spacing: 0.02em;
  }
}
</style>
