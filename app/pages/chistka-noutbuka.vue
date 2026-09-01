<script setup lang="ts">
usePageSeo({
  title: 'Чистка ноутбука от пыли в Сургуте — REVIVE',
  description: 'Чистка системы охлаждения ноутбука, замена термопасты. Устранение перегрева и шума. Бесплатная диагностика, гарантия.',
  canonical: '/chistka-noutbuka',
  ogTitle: 'Чистка ноутбука от пыли — REVIVE Сургут',
  ogDescription: 'Чистка ноутбука от пыли, замена термопасты. Устраняем перегрев за 1–2 часа. Бесплатная диагностика, гарантия.',
})

useBreadcrumb([
  { name: 'Главная', href: '/' },
  { name: 'Ремонт ноутбуков', href: '/remont-noutbukov' },
  { name: 'Чистка ноутбука', href: '/chistka-noutbuka' },
])

const { public: { siteUrl } } = useRuntimeConfig()
const reqUrl = useRequestURL()
const baseUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Чистка ноутбука от пыли',
  description: 'Чистка системы охлаждения, замена термопасты, устранение перегрева и шума.',
  url: `${baseUrl}/chistka-noutbuka`,
  provider: { '@type': 'RepairService', name: 'REVIVE', url: baseUrl },
  areaServed: { '@type': 'City', name: 'Сургут' },
  offers: { '@type': 'Offer', price: 900, priceCurrency: 'RUB', availability: 'https://schema.org/InStock' },
})

const steps = [
  { num: '01', title: 'Приёмка', desc: 'Вы приносите ноутбук или мы забираем его по городу. Фиксируем состояние.' },
  { num: '02', title: 'Разборка', desc: 'Аккуратно снимаем крышку, отсоединяем кулер и радиатор.' },
  { num: '03', title: 'Чистка', desc: 'Убираем пыль из вентиляторов, радиатора и корпуса сжатым воздухом и кистями.' },
  { num: '04', title: 'Термопаста', desc: 'Наносим новую термопасту на процессор и видеочип.' },
  { num: '05', title: 'Сборка', desc: 'Собираем обратно, проверяем температуры под нагрузкой.' },
  { num: '06', title: 'Готово', desc: 'Вы получаете тихий, холодный ноутбук с гарантией.' },
]

const signs = [
  { icon: '🌡️', text: 'Ноутбук горячий на ощупь' },
  { icon: '💨', text: 'Кулер сильно шумит' },
  { icon: '🐌', text: 'Тормозит в простых задачах' },
  { icon: '⚡', text: 'Сам выключается под нагрузкой' },
  { icon: '🔥', text: 'Температуры CPU выше 85°C' },
  { icon: '🎮', text: 'Фризы в играх' },
]
</script>

<template>
  <main class="page">
    <section class="hero">
      <div class="wrap hero-inner">
        <div class="hero-text">
          <p class="ol">Услуга</p>
          <h1>Чистка ноутбука от пыли в&nbsp;Сургуте</h1>
          <p class="hero-desc">
            Перегрев, шум, тормоза — всё это решается чисткой за 1–2 часа.
            Убираем пыль из кулера и радиатора, наносим новую термопасту.
            Ноутбук снова холодный и тихий.
          </p>
          <div class="hero-meta">
            <span class="meta-chip">от 900 ₽</span>
            <span class="meta-chip">диагностика бесплатно</span>
            <span class="meta-chip">1–2 часа</span>
            <span class="meta-chip">гарантия 3 мес.</span>
          </div>
          <a class="hero-cta" href="#order">Оставить заявку</a>
        </div>
        <div class="hero-visual">
          <div class="badge-card">
            <div class="badge-temp">95°C → 52°C</div>
            <p class="badge-label">Средний результат чистки</p>
          </div>
        </div>
      </div>
    </section>

    <section class="signs">
      <div class="wrap">
        <h2>Признаки, что пора чистить</h2>
        <div class="signs-grid">
          <div v-for="sign in signs" :key="sign.text" class="sign">
            <span class="sign-icon">{{ sign.icon }}</span>
            <span class="sign-text">{{ sign.text }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="steps">
      <div class="wrap">
        <p class="section-label">Как мы работаем</p>
        <h2>6 простых шагов</h2>
        <div class="steps-grid">
          <div v-for="step in steps" :key="step.num" class="step">
            <span class="step-num">{{ step.num }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="includes">
      <div class="wrap">
        <h2>Что входит в услугу</h2>
        <div class="inc-grid">
          <div class="inc">Полная разборка корпуса</div>
          <div class="inc">Чистка вентилятора и радиатора</div>
          <div class="inc">Удаление пыли сжатым воздухом</div>
          <div class="inc">Нанесение новой термопасты</div>
          <div class="inc">Проверка температур под нагрузкой</div>
          <div class="inc">Рекомендации по эксплуатации</div>
        </div>
        <div class="price-box">
          <div class="price-val">от 900 ₽</div>
          <div class="price-note">Термопаста включена в стоимость</div>
          <a class="hero-cta" href="#order">Записаться</a>
        </div>
      </div>
    </section>

    <section class="brands-section">
      <div class="wrap">
        <p class="section-label">Ремонтируем</p>
        <h2>Все бренды ноутбуков</h2>
        <p class="brands-text">ASUS, Lenovo, HP, Dell, Acer, MSI, Apple MacBook, Huawei, Samsung, Xiaomi и другие.</p>
      </div>
    </section>

    <TrackCta />
  </main>
</template>

<style scoped>
.page { padding-top: var(--header-h); }
.hero {
  background: linear-gradient(135deg, #171717 0%, #2a2a2a 100%);
  color: #fff;
  padding: 56px 0 64px;
}
.hero-inner { display: flex; align-items: center; gap: 48px; }
.hero-text { flex: 1; min-width: 0; }
.ol { color: var(--brand); font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; font-size: 13px; }
h1 { font-size: clamp(28px, 4vw, 44px); margin-bottom: 16px; line-height: 1.15; }
.hero-desc { font-size: 17px; line-height: 1.65; opacity: 0.85; max-width: 540px; margin-bottom: 20px; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.meta-chip { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap; }
.hero-cta { display: inline-block; background: var(--brand); color: #fff; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: background 0.2s; }
.hero-cta:hover { background: #e04410; }
.hero-visual { flex-shrink: 0; }
.badge-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; text-align: center; }
.badge-temp { font-size: 36px; font-weight: 900; color: #4ade80; margin-bottom: 8px; }
.badge-label { font-size: 14px; color: rgba(255,255,255,0.6); }

.signs { padding: 72px 0; background: #fff; }
.signs h2, .steps h2, .includes h2, .brands-section h2 { font-size: clamp(22px, 3.5vw, 30px); font-weight: 800; margin-bottom: 32px; text-align: center; }
.section-label { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--brand); margin-bottom: 8px; }
.signs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.sign { display: flex; align-items: center; gap: 12px; background: var(--soft); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; }
.sign-icon { font-size: 24px; }
.sign-text { font-size: 14px; font-weight: 600; }

.steps { padding: 72px 0; background: var(--soft); }
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.step { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 24px; }
.step-num { font-size: 32px; font-weight: 900; color: var(--brand); opacity: 0.3; }
.step h3 { font-size: 16px; font-weight: 700; margin: 8px 0; }
.step p { font-size: 14px; color: var(--dim); line-height: 1.5; }

.includes { padding: 72px 0; background: #fff; }
.inc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 40px; }
.inc { background: var(--soft); border: 1px solid var(--border); border-radius: 10px; padding: 14px 18px; font-size: 14px; font-weight: 600; text-align: center; }
.price-box { text-align: center; background: linear-gradient(135deg, #171717, #2a2a2a); border-radius: 16px; padding: 40px; color: #fff; }
.price-val { font-size: 36px; font-weight: 900; margin-bottom: 8px; }
.price-note { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 20px; }

.brands-section { padding: 72px 0; background: var(--soft); text-align: center; }
.brands-text { font-size: 16px; color: var(--dim); }

@media (max-width: 768px) {
  .hero { padding: 40px 0 48px; }
  .hero-inner { flex-direction: column; gap: 28px; text-align: center; }
  .hero-desc { max-width: none; }
  .hero-meta { justify-content: center; }
  .hero-cta { display: block; text-align: center; }
  .signs-grid, .steps-grid, .inc-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .hero { padding: 32px 0 40px; }
  .signs, .steps, .includes, .brands-section { padding: 48px 0; }
  .badge-temp { font-size: 28px; }
  .price-val { font-size: 28px; }
}
</style>
