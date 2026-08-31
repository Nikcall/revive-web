<script setup lang="ts">
import type { CmsReview } from '~/types/cms'

const props = defineProps<{ reviews?: CmsReview[] }>()

const fallbackReviews: CmsReview[] = [
  {
    author: 'Татьяна Т.',
    text: 'Хочу выразить огромную благодарность за то, что вернули мой ноутбук к жизни. Золотые руки у мастера. Ноутбук работает лучше, чем когда его купили. Очень быстро отремонтировали. Очень рекомендую!',
    service: 'Ремонт ноутбука',
  },
  {
    author: 'Владимир',
    text: 'Обращался с целью замены заднего стекла, аккумулятора и настройки беспроводной зарядки. Все сделано очень качественно и быстро. Рекомендую данный сервис!',
    service: 'Ремонт iPhone',
  },
  {
    author: 'Ярославна А.',
    text: 'Хотела бы поблагодарить сервис REVIVE за быстрый и качественный ремонт ноутбука! Специалист объяснил всё максимально понятно, простым и доступным языком. Работа была выполнена в оговорённые сроки, что для меня было очень важно, так как я работаю удаленно.',
    service: 'Ремонт ноутбука',
  },
]

const allReviews = computed(() => props.reviews?.length ? props.reviews : fallbackReviews)

const index = ref(0)
const visible = 3

const max = computed(() => Math.max(0, allReviews.value.length - visible))
function prev() {
  index.value = Math.max(0, index.value - 1)
}
function next() {
  index.value = Math.min(max.value, index.value + 1)
}

const palettes = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6']
</script>

<template>
  <section class="rv" id="reviews">
    <div class="wrap">
      <div class="ol">Отзывы клиентов</div>
      <div class="head">
        <h2>ЧТО ГОВОРЯТ<br /><span>КЛИЕНТЫ</span></h2>
        <div class="nav">
          <button type="button" :disabled="index === 0" @click="prev">←</button>
          <button type="button" :disabled="index >= max" @click="next">→</button>
        </div>
      </div>
      <p class="sb">500+ ремонтов в личной практике мастера — и каждый клиент доволен</p>
      <div class="outer">
        <div class="track" :style="{ transform: `translateX(-${index * (100 / visible)}%)` }">
          <article v-for="(item, i) in allReviews" :key="item.author + i" class="card">
            <div class="stars">★★★★★</div>
            <p>{{ item.text }}</p>
            <div class="bot">
              <div class="av" :class="palettes[i % palettes.length]">{{ item.author[0] }}</div>
              <div>
                <strong>{{ item.author }}</strong>
                <small>{{ item.service }}</small>
              </div>
              <span>✓</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rv {
  background: #000;
  color: #fff;
  padding: 0 0 80px;
  font-family: Nunito, sans-serif;
}
.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.ol {
  color: var(--brand);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}
h2 {
  font-family: Oswald, sans-serif;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1;
}
h2 span {
  color: var(--brand);
}
.nav button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  margin-left: 8px;
}
.nav button:hover:not(:disabled) {
  background: var(--brand);
  border-color: var(--brand);
}
.nav button:disabled {
  opacity: 0.25;
}
.sb {
  color: #aaa;
  margin: 12px 0 24px;
}
.outer {
  overflow: hidden;
}
.track {
  display: flex;
  gap: 16px;
  transition: transform 0.45s;
}
.card {
  flex: 0 0 calc((100% - 32px) / 3);
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  padding: 22px;
}
.stars {
  color: #f5c842;
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.card p {
  font-size: 13px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
  min-height: 110px;
}
.bot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
}
.av {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.a1 { background: linear-gradient(135deg, #fd5119, #ff8c00); }
.a2 { background: linear-gradient(135deg, #e040fb, #7c4dff); }
.a3 { background: linear-gradient(135deg, #00bcd4, #00e676); color: #000; }
.a4 { background: linear-gradient(135deg, #ff4081, #f9a825); }
.a5 { background: linear-gradient(135deg, #26c6da, #00e5ff); color: #000; }
.a6 { background: linear-gradient(135deg, #69f0ae, #b2ff59); color: #000; }
.bot strong {
  display: block;
  font-size: 13px;
}
.bot small {
  color: #555;
  font-size: 11px;
}
.bot span {
  margin-left: auto;
  color: var(--brand);
  font-weight: 700;
}
@media (max-width: 880px) {
  .wrap { padding: 0 20px; }
  .card { flex: 0 0 100%; }
  .track { transform: translateX(calc(-1 * v-bind(index) * 100%)) !important; }
}
@media (max-width: 480px) {
  .wrap { padding: 0 16px; }
  .rv { padding: 0 0 56px; }
}
</style>
