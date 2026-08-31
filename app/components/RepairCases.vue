<script setup lang="ts">
const cases = [
  {
    device: 'Gigabyte B450M DS3H',
    icon: 'motherboard',
    symptom: 'Нет запуска, POST 00',
    diagnosis: 'Повреждён дроссель в цепи питания чипсета. Диагностика показала неисправный контроллер преобразователя питания.',
    fix: 'Замена контроллера и повреждённого дросселя. Проверка напряжений и температурного режима.',
    result: 'Плата снова прошла POST и запустилась.',
    tags: ['Материнская плата', 'Компонентный ремонт', 'Цепи питания'],
  },
  {
    device: 'Системный блок',
    icon: 'pc',
    symptom: 'Синий экран UNEXPECTED_KERNEL_MODE_TRAP',
    diagnosis: 'Последовательная аппаратная диагностика выявила неисправный модуль оперативной памяти.',
    fix: 'Замена модуля оперативной памяти.',
    result: 'Система прошла повторное тестирование без повторных сбоев.',
    tags: ['ПК', 'Диагностика', 'ОЗУ'],
  },
  {
    device: 'iPhone 12 mini',
    icon: 'phone',
    symptom: 'Face ID не работает',
    diagnosis: 'Требуется работа с компонентами шлейфа Face ID и датчиков под микроскопом.',
    fix: 'Перенос необходимых элементов с контролем контактных площадок и качества пайки.',
    result: 'Face ID восстановлен. Сложные работы выполняются с увеличением и контролем температуры.',
    tags: ['Смартфон', 'Микропайка', 'Face ID'],
  },
]

const iconSvg: Record<string, string> = {
  motherboard: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M0 20h24"/>',
  pc: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>',
}
</script>

<template>
  <section class="cases">
    <div class="wrap">
      <div class="head">
        <span class="eyebrow">Реальные ремонты</span>
        <h2 class="title">Что мы <span>ремонтируем</span></h2>
        <p class="subtitle">Три примера из практики — от компонентного ремонта плат до микропайки смартфонов</p>
      </div>
      <div class="grid">
        <article v-for="item in cases" :key="item.device" class="card">
          <div class="card-head">
            <div class="device-icon" v-html="iconSvg[item.icon]" />
            <div>
              <h3 class="device">{{ item.device }}</h3>
              <span class="symptom">{{ item.symptom }}</span>
            </div>
          </div>
          <div class="steps">
            <div class="step">
              <span class="step-label">Диагностика</span>
              <p>{{ item.diagnosis }}</p>
            </div>
            <div class="step">
              <span class="step-label">Что сделали</span>
              <p>{{ item.fix }}</p>
            </div>
            <div class="step">
              <span class="step-label">Результат</span>
              <p>{{ item.result }}</p>
            </div>
          </div>
          <div class="tags">
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </div>
        </article>
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
