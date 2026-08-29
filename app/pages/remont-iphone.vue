<script setup lang="ts">
usePageSeo({
  title: 'Ремонт iPhone в Сургуте — замена экрана, аккумулятора — REVIVE',
  description: 'Ремонт iPhone всех моделей в Сургуте: замена дисплея, аккумулятора, камеры, разъёма зарядки. Бесплатная диагностика, гарантия до 6 мес.',
  canonical: '/remont-iphone',
  ogTitle: 'Ремонт iPhone в Сургуте — REVIVE',
  ogDescription: 'Замена экрана, аккумулятора, камеры iPhone в Сургуте. Бесплатная диагностика, честные цены, гарантия.',
})

useBreadcrumb([
  { name: 'Главная', href: '/' },
  { name: 'Ремонт iPhone', href: '/remont-iphone' },
])

const { public: { siteUrl } } = useRuntimeConfig()
const reqUrl = useRequestURL()
const baseUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ремонт iPhone в Сургуте',
  description: 'Ремонт iPhone всех моделей: замена дисплея, аккумулятора, камеры, разъёма зарядки, Face ID. Бесплатная диагностика.',
  url: `${baseUrl}/remont-iphone`,
  provider: { '@type': 'RepairService', name: 'REVIVE', url: baseUrl },
  areaServed: { '@type': 'City', name: 'Сургут' },
  offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', availability: 'https://schema.org/InStock' },
})

const models = [
  { label: 'iPhone 17 Pro / Pro Max', desc: 'Последняя модель, USB-C' },
  { label: 'iPhone 16 / 16 Plus / 16 Pro', desc: 'Актуальное поколение' },
  { label: 'iPhone 15 / 15 Pro', desc: 'USB-C, Dynamic Island' },
  { label: 'iPhone 14 / 14 Pro', desc: 'Face ID, Night Shift' },
  { label: 'iPhone 13 / 13 Pro', desc: 'A15 Bionic' },
  { label: 'iPhone SE 3 / SE 2', desc: 'Компактный, доступный' },
  { label: 'iPhone 8 и старше', desc: 'Классический дизайн' },
]

const services = [
  { icon: '📱', name: 'Замена дисплея', desc: 'Оригинальные и качественные LCD/OLED модули. Сохраняем True Tone.', from: true },
  { icon: '🔋', name: 'Замена аккумулятора', desc: 'Новый АКБ — снова целый день без зарядки. Калибровка после замены.', from: true },
  { icon: '📸', name: 'Замена камеры', desc: 'Задняя, фронтовая, модуль LiDAR. Восстанавливаем качество фото.', from: true },
  { icon: '🔌', name: 'Разъём зарядки', desc: 'Lightning и USB-C. Чистка, пайка или замена гнезда.', from: true },
  { icon: '🔊', name: 'Динамик / микрофон', desc: 'Тихий звонок? Не работает микрофон? Замена за 1–2 часа.', from: false },
  { icon: '⚡', name: 'Face ID / Touch ID', desc: 'Диагностика и восстановление биометрии. Не отключаем без согласия.', from: false },
]

const steps = [
  { num: '01', title: 'Диагностика', desc: 'Определяем проблему бесплатно. Назначаем точную цену до начала работ.' },
  { num: '02', title: 'Согласование', desc: 'Вы утверждаете стоимость и сроки. Никаких скрытых платежей.' },
  { num: '03', title: 'Ремонт', desc: 'Работаем от 30 минут до 2 часов в зависимости от сложности.' },
  { num: '04', title: 'Проверка', desc: 'Тестируем все функции: экран, камеру, датчики, зарядку.' },
]

const advantages = [
  { val: '0 ₽', label: 'Диагностика' },
  { val: 'до 6 мес.', label: 'Гарантия' },
  { val: '1–2 ч.', label: 'Средний ремонт' },
  { val: '100%', label: 'Честная цена' },
]
</script>

<template>
  <main class="page">
    <section class="hero">
      <div class="wrap hero-inner">
        <div class="hero-text">
          <p class="ol">Сервисный центр</p>
          <h1>Ремонт <span class="accent">iPhone</span> в&nbsp;Сургуте</h1>
          <p class="hero-desc">
            Замена экрана, аккумулятора, камеры, разъёма зарядки.
            Бесплатная диагностика, честная цена до начала работ,
            гарантия до 6 месяцев.
          </p>
          <div class="hero-meta">
            <span class="meta-chip">от 900 ₽</span>
            <span class="meta-chip">диагностика бесплатно</span>
            <span class="meta-chip">1–2 часа</span>
            <span class="meta-chip">гарантия до 6 мес.</span>
          </div>
          <a class="hero-cta" href="#order">Оставить заявку</a>
        </div>
        <div class="hero-visual">
          <div class="model-list">
            <div v-for="m in models" :key="m.label" class="model">
              <span class="model-label">{{ m.label }}</span>
              <span class="model-desc">{{ m.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="adv-bar">
      <div class="wrap">
        <div class="adv-grid">
          <div v-for="a in advantages" :key="a.label" class="adv">
            <span class="adv-val">{{ a.val }}</span>
            <span class="adv-label">{{ a.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="services">
      <div class="wrap">
        <p class="section-label">Услуги</p>
        <h2>Что мы ремонтируем</h2>
        <div class="svc-grid">
          <div v-for="s in services" :key="s.name" class="svc">
            <span class="svc-icon">{{ s.icon }}</span>
            <div class="svc-body">
              <h3>{{ s.name }}</h3>
              <p>{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="steps">
      <div class="wrap">
        <p class="section-label">Процесс</p>
        <h2>Как проходит ремонт</h2>
        <div class="steps-grid">
          <div v-for="step in steps" :key="step.num" class="step">
            <span class="step-num">{{ step.num }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="models-section">
      <div class="wrap">
        <p class="section-label">Модели</p>
        <h2>Ремонтируем все поколения iPhone</h2>
        <p class="models-text">
          iPhone 17 Pro / Pro Max, iPhone 16, 15, 14, 13, 12, 11,
          iPhone SE 3 / SE 2, iPhone X, 8, 7 и старше.
          Запчасти в наличии или под заказ за 1–3 дня.
        </p>
        <NuxtLink to="/prices" class="all-link">
          Смотреть все цены
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </NuxtLink>
      </div>
    </section>

    <section class="brands-section">
      <div class="wrap">
        <p class="section-label">Также ремонтируем</p>
        <h2>Другие бренды</h2>
        <p class="brands-text">Samsung, Xiaomi, Honor, Huawei, Realme, ASUS, Lenovo, MacBook и другие.</p>
        <div class="brand-links">
          <NuxtLink to="/remont-smartfonov" class="brand-link">Ремонт смартфонов</NuxtLink>
          <NuxtLink to="/remont-noutbukov" class="brand-link">Ремонт ноутбуков</NuxtLink>
          <NuxtLink to="/remont-planshetov" class="brand-link">Ремонт планшетов</NuxtLink>
        </div>
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
.accent { color: var(--brand); }
.hero-desc { font-size: 17px; line-height: 1.65; opacity: 0.85; max-width: 540px; margin-bottom: 20px; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.meta-chip { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap; }
.hero-cta { display: inline-block; background: var(--brand); color: #fff; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: background 0.2s; }
.hero-cta:hover { background: #e04410; }
.hero-visual { flex-shrink: 0; }
.model-list { display: flex; flex-direction: column; gap: 6px; }
.model { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 16px; }
.model-label { font-size: 14px; font-weight: 700; display: block; }
.model-desc { font-size: 12px; opacity: 0.5; }

.adv-bar { padding: 32px 0; background: #fff; border-bottom: 1px solid var(--border); }
.adv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
.adv-val { display: block; font-size: clamp(18px, 3vw, 26px); font-weight: 900; color: var(--brand); }
.adv-label { font-size: 13px; color: var(--dim); }

.services { padding: 72px 0; background: var(--soft); }
h2 { text-align: center; font-size: clamp(22px, 3.5vw, 30px); font-weight: 800; margin-bottom: 32px; }
.section-label { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--brand); margin-bottom: 8px; }
.svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.svc { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 20px; display: flex; gap: 14px; align-items: flex-start; }
.svc-icon { font-size: 28px; flex-shrink: 0; }
.svc-body h3 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.svc-body p { font-size: 13px; color: var(--dim); line-height: 1.5; }

.steps { padding: 72px 0; background: #fff; }
.steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.step { background: var(--soft); border: 1px solid var(--border); border-radius: 14px; padding: 24px; }
.step-num { font-size: 32px; font-weight: 900; color: var(--brand); opacity: 0.3; }
.step h3 { font-size: 16px; font-weight: 700; margin: 8px 0; }
.step p { font-size: 14px; color: var(--dim); line-height: 1.5; }

.models-section { padding: 72px 0; background: var(--soft); text-align: center; }
.models-text { font-size: 16px; color: var(--dim); max-width: 600px; margin: 0 auto 28px; line-height: 1.7; }
.all-link { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--brand); text-decoration: none; transition: opacity 0.2s; }
.all-link:hover { opacity: 0.8; }
.all-link svg { width: 16px; height: 16px; }

.brands-section { padding: 72px 0; background: #fff; text-align: center; }
.brands-text { font-size: 16px; color: var(--dim); margin-bottom: 20px; }
.brand-links { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
.brand-link { background: var(--soft); border: 1px solid var(--border); border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; color: inherit; transition: border-color 0.2s; }
.brand-link:hover { border-color: var(--brand); color: var(--brand); }

@media (max-width: 768px) {
  .hero { padding: 40px 0 48px; }
  .hero-inner { flex-direction: column; gap: 28px; text-align: center; }
  .hero-desc { max-width: none; }
  .hero-meta { justify-content: center; }
  .hero-cta { display: block; text-align: center; }
  .adv-grid { grid-template-columns: repeat(2, 1fr); }
  .svc-grid { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: 1fr 1fr; }
  .model-list { flex-direction: row; flex-wrap: wrap; justify-content: center; }
}
@media (max-width: 480px) {
  .hero { padding: 32px 0 40px; }
  .hero-meta { gap: 8px; }
  .meta-chip { font-size: 12px; padding: 5px 12px; }
  .steps-grid { grid-template-columns: 1fr; }
}
</style>
