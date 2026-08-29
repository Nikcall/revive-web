<script setup lang="ts">
</script>

<template>
  <section class="track-cta">
    <div class="wrap">
      <div class="card">
        <div class="content">
          <span class="eyebrow">Техника уже в REVIVE?</span>
          <h2 class="title">Проверяйте статус ремонта онлайн</h2>
          <p class="text">Отслеживайте tiến độ ремонта и общайтесь с мастером через личный кабинет — круглосуточно, из любого мессенджера.</p>
          <NuxtLink to="/track" class="btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            Проверить статус ремонта
          </NuxtLink>
        </div>
        <div class="visual">
          <div class="mock-phone">
            <div class="mock-header">
              <span class="mock-dot" />
              <span class="mock-title">REVIVE</span>
            </div>
            <div class="mock-body">
              <div class="mock-order">
                <span class="mock-label">Заказ №2847</span>
                <span class="mock-status">В работе</span>
              </div>
              <div class="mock-progress">
                <div class="mock-step done">
                  <div class="step-dot" />
                  <span>Приём</span>
                </div>
                <div class="mock-step done">
                  <div class="step-dot" />
                  <span>Диагностика</span>
                </div>
                <div class="mock-step active">
                  <div class="step-dot" />
                  <span>Ремонт</span>
                </div>
                <div class="mock-step">
                  <div class="step-dot" />
                  <span>Готово</span>
                </div>
              </div>
              <div class="mock-msg">
                <div class="msg-in">Мастер: Замена матрицы выполняется, осталось ~2 часа</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.track-cta {
  padding: 0;
}
.card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
  border-radius: 24px;
  padding: 64px 56px;
  color: #fff;
}
.eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 12px;
}
.title {
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 16px;
}
.text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 440px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--brand);
  color: #fff;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}
.btn:hover {
  background: #e04518;
  transform: translateY(-1px);
}
.btn svg {
  width: 18px;
  height: 18px;
}
.visual {
  display: flex;
  justify-content: center;
}
.mock-phone {
  width: 260px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}
.mock-header {
  background: var(--brand);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.mock-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}
.mock-title {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.04em;
}
.mock-body {
  padding: 20px;
}
.mock-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.mock-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.mock-status {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand);
  background: rgba(253, 81, 25, 0.1);
  padding: 4px 12px;
  border-radius: 100px;
}
.mock-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
}
.mock-progress::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #e0e0e0;
}
.mock-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
}
.step-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 2px solid #fff;
}
.mock-step.done .step-dot {
  background: var(--brand);
}
.mock-step.active .step-dot {
  background: var(--brand);
  box-shadow: 0 0 0 4px rgba(253, 81, 25, 0.2);
}
.mock-step span {
  font-size: 10px;
  font-weight: 600;
  color: #999;
}
.mock-step.done span,
.mock-step.active span {
  color: #333;
}
.mock-msg {
  background: var(--soft);
  border-radius: 12px;
  padding: 12px 14px;
}
.msg-in {
  font-size: 12px;
  color: #555;
  line-height: 1.5;
}
@media (max-width: 880px) {
  .card { grid-template-columns: 1fr; padding: 40px 28px; gap: 32px; }
  .visual { order: -1; }
  .mock-phone { width: 220px; }
}
@media (max-width: 480px) {
  .card { padding: 32px 20px; border-radius: 16px; }
}
</style>
