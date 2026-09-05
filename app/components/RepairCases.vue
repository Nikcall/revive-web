<script setup lang="ts">
interface RepairCase {
  device: string
  problem: string
  summary: string
  diagnostics?: string
  repair?: string
  result?: string
  tags: string[]
}

const CASES: RepairCase[] = [
  {
    device: 'Gigabyte B450M DS3H',
    problem: 'Не проходит запуск',
    summary: 'Неисправность цепи питания чипсета. Контроллер + дроссель заменены. POST восстановлен.',
    diagnostics: 'Плата не проходила инициализацию. Диагностика выявила неисправность в цепи питания чипсета.',
    repair: 'Заменили контроллер питания и повреждённый дроссель.',
    result: 'Плата прошла POST, стабильная работа под нагрузкой.',
    tags: ['Материнская плата', 'Компонентный ремонт', 'Цепи питания'],
  },
  {
    device: 'Системный блок',
    problem: 'Синий экран и зависания',
    summary: 'Неисправный модуль ОЗУ. Модуль заменён, система стабильна.',
    diagnostics: 'Система периодически зависала и уходила в синий экран UNEXPECTED_KERNEL_MODE_TRAP. Аппаратная диагностика выявила неисправный модуль оперативной памяти.',
    repair: 'Заменили неисправный модуль оперативной памяти.',
    result: 'Система прошла повторное тестирование без сбоев.',
    tags: ['ПК', 'Диагностика', 'ОЗУ'],
  },
  {
    device: 'iPhone 12 mini',
    problem: 'Неисправность Face ID',
    summary: 'Диагностика шлейфа датчиков под микроскопом. Микропайка выполнена.',
    diagnostics: 'Проведена диагностика системы Face ID и работа с шлейфом датчиков под микроскопом с применением микропайки.',
    tags: ['Смартфон', 'Микропайка', 'Face ID'],
  },
]

const expanded = ref<number | null>(null)

function toggle(i: number) {
  expanded.value = expanded.value === i ? null : i
}
</script>

<template>
  <section class="cases">
    <div class="wrap">
      <div class="head">
        <span class="eyebrow">Из практики</span>
        <h2 class="title">Реальные <span>ремонты</span></h2>
        <p class="subtitle">Каждый кейс — реальный случай из практики REVIVE.</p>
      </div>
      <div class="grid">
        <div
          v-for="(item, i) in CASES"
          :key="i"
          class="card"
          :class="{ open: expanded === i }"
          @click="toggle(i)"
        >
          <div class="card-head">
            <h3 class="device">{{ item.device }}</h3>
            <span class="problem">{{ item.problem }}</span>
          </div>
          <p class="summary">{{ item.summary }}</p>
          <div v-if="item.tags?.length" class="tags">
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </div>
          <span class="more">{{ expanded === i ? 'Свернуть' : 'Подробнее о ремонте' }} <svg :class="{ rotated: expanded === i }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
          <div v-if="expanded === i" class="details" @click.stop>
            <div v-if="item.diagnostics" class="detail">
              <span class="detail-label">Диагностика</span>
              <p>{{ item.diagnostics }}</p>
            </div>
            <div v-if="item.repair" class="detail">
              <span class="detail-label">Что сделали</span>
              <p>{{ item.repair }}</p>
            </div>
            <div v-if="item.result" class="detail">
              <span class="detail-label">Результат</span>
              <p>{{ item.result }}</p>
            </div>
          </div>
        </div>
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
  gap: 14px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover,
.card.open {
  border-color: rgba(253, 81, 25, 0.3);
  box-shadow: 0 8px 28px rgba(253, 81, 25, 0.06);
}
.card-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.device {
  font-size: 15px;
  font-weight: 700;
}
.problem {
  font-size: 13px;
  color: var(--brand);
  font-weight: 600;
}
.summary {
  font-size: 13px;
  color: #555;
  line-height: 1.55;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tags span {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  background: var(--soft);
  color: var(--brand);
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: var(--brand);
  margin-top: auto;
}
.more svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}
.more svg.rotated {
  transform: rotate(180deg);
}
.details {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
.detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--dim);
}
.detail p {
  font-size: 13px;
  color: #444;
  line-height: 1.55;
}
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .wrap { padding: 0 24px; }
}
@media (max-width: 580px) {
  .grid { grid-template-columns: 1fr; }
  .wrap { padding: 0 16px; }
  .cases { padding: 48px 0; }
  .card { padding: 18px; gap: 12px; }
}
</style>
