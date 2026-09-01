/**
 * Directus bootstrap.
 * Hero layer: site_settings (+ pages, faq).
 * Services + Prices: схема + insert missing (cms/schema/services-prices.mjs).
 * Fixture не перезаписывает редакторский контент. Force: CMS_FORCE_SEED=1.
 * npm run cms:bootstrap
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyServicesPricesSchema } from './schema/services-prices.mjs'
import { applyCasesSchema } from './schema/cases-schema.mjs'
import { applyPostsSchema } from './schema/posts-schema.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIRECTUS = process.env.DIRECTUS_URL || 'http://localhost:8055'
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@revive.su'
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'ReviveCmsLocal1!'
const seed = JSON.parse(await readFile(join(__dirname, 'seed/content.json'), 'utf8'))
const extra = JSON.parse(await readFile(join(__dirname, 'seed/extra.json'), 'utf8'))
const seedPages = [...seed.pages, ...(extra.pages || [])]

async function api(path, options = {}, token) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${DIRECTUS}${path}`, { ...options, headers })
  const text = await res.text()
  let body = null
  try { body = text ? JSON.parse(text) : null } catch { body = { raw: text } }
  if (!res.ok) {
    const err = new Error(`${options.method || 'GET'} ${path} → ${res.status}`)
    err.body = body
    throw err
  }
  return body
}

async function wait() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${DIRECTUS}/server/health`)
      if (res.ok) return
    } catch { /* booting */ }
    await new Promise((r) => setTimeout(r, 2000))
  }
  throw new Error(`Directus не ответил: ${DIRECTUS}`)
}

function f(collection, name, type, meta = {}, schema = {}) {
  return {
    collection,
    field: name,
    type,
    meta: { interface: type === 'json' ? 'input-code' : type === 'text' ? 'input-multiline' : 'input', width: 'full', options: type === 'json' ? { language: 'json' } : undefined, ...meta },
    schema,
  }
}

const COLLECTIONS = [
  {
    collection: 'site_settings',
    meta: { singleton: true, icon: 'settings', note: 'Телефон, логотип, навигация' },
    fields: [
      f('site_settings', 'site_name', 'string'),
      f('site_settings', 'logo_url', 'string', { note: 'URL файла Directus или внешний. Картинки не в git.' }),
      f('site_settings', 'header_cta_text', 'string'),
      f('site_settings', 'phone', 'string'),
      f('site_settings', 'phone_href', 'string'),
      f('site_settings', 'email', 'string'),
      f('site_settings', 'legal_name', 'string'),
      f('site_settings', 'inn', 'string'),
      f('site_settings', 'ogrnip', 'string'),
      f('site_settings', 'address', 'text'),
      f('site_settings', 'city', 'string'),
      f('site_settings', 'hours', 'string'),
      f('site_settings', 'telegram', 'string'),
      f('site_settings', 'whatsapp', 'string'),
      f('site_settings', 'vk', 'string'),
      f('site_settings', 'cookie_text', 'text'),
      f('site_settings', 'nav', 'json'),
      f('site_settings', 'hero_title', 'string', { note: 'H1 главной. Singleton — править здесь, не в коде.' }),
      f('site_settings', 'hero_subtitle', 'text'),
      f('site_settings', 'hero_button_text', 'string'),
      f('site_settings', 'hero_button_url', 'string'),
    ],
  },
  {
    collection: 'pages',
    meta: { icon: 'article', note: 'home | prices | contacts + блоки' },
    fields: [
      f('pages', 'slug', 'string', { required: true }, { is_unique: true }),
      f('pages', 'title', 'string', { required: true }),
      f('pages', 'h1', 'string', { note: 'Главный заголовок страницы' }),
      f('pages', 'seo_title', 'string'),
      f('pages', 'seo_description', 'text'),
      f('pages', 'canonical', 'string'),
      f('pages', 'og_image', 'string'),
      f('pages', 'blocks', 'json', { note: 'hero | service_advantages | price_table | text_image | repair_cases | faq | reviews | cta' }),
    ],
  },
  {
    collection: 'faq',
    meta: { icon: 'help' },
    fields: [
      f('faq', 'question', 'string', { required: true }),
      f('faq', 'answer', 'text', { required: true }),
      f('faq', 'sort', 'integer'),
    ],
  },
]

console.log(`Waiting for ${DIRECTUS}…`)
await wait()
const login = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: EMAIL, password: PASSWORD }) })
const token = login.data.access_token

for (const col of COLLECTIONS) {
  try {
    await api(`/collections/${col.collection}`, {}, token)
    console.log(`= ${col.collection}`)
  } catch {
    await api('/collections', { method: 'POST', body: JSON.stringify({ collection: col.collection, meta: col.meta, schema: { name: col.collection } }) }, token)
    console.log(`+ ${col.collection}`)
  }
  const existing = await api(`/fields/${col.collection}`, {}, token)
  const names = new Set((existing.data || []).map((x) => x.field))
  for (const field of col.fields) {
    if (names.has(field.field)) continue
    await api(`/fields/${col.collection}`, { method: 'POST', body: JSON.stringify(field) }, token)
    console.log(`  + ${col.collection}.${field.field}`)
  }
}

await applyServicesPricesSchema(api, token)
await applyCasesSchema(api, token)
await applyPostsSchema(api, token)

const roles = await api('/roles?filter[name][_eq]=Public', {}, token)
const publicId = roles.data?.[0]?.id
if (publicId) {
  const perms = await api(`/permissions?filter[role][_eq]=${publicId}&filter[action][_eq]=read&limit=-1`, {}, token)
  const have = new Set((perms.data || []).map((p) => p.collection))
  for (const name of [...COLLECTIONS.map((c) => c.collection), 'cases', 'posts']) {
    if (have.has(name)) continue
    await api('/permissions', {
      method: 'POST',
      body: JSON.stringify({ role: publicId, collection: name, action: 'read', fields: ['*'], permissions: {}, validation: {} }),
    }, token)
    console.log(`+ public read ${name}`)
  }
}

async function empty(collection) {
  const body = await api(`/items/${collection}?limit=0&meta=total_count`, {}, token)
  return (body.meta?.total_count || 0) === 0
}

const settingsNow = await api('/items/site_settings', {}, token)
const heroSeed = {
  hero_title: seed.settings.hero_title,
  hero_subtitle: seed.settings.hero_subtitle,
  hero_button_text: seed.settings.hero_button_text,
  hero_button_url: seed.settings.hero_button_url,
}
if (!settingsNow.data?.site_name) {
  await api('/items/site_settings', { method: 'POST', body: JSON.stringify(seed.settings) }, token)
  console.log('+ site_settings')
} else if (!settingsNow.data?.hero_title || !settingsNow.data?.hero_button_text) {
  await api('/items/site_settings', { method: 'PATCH', body: JSON.stringify(heroSeed) }, token)
  console.log('~ site_settings hero')
}

if (await empty('pages')) {
  await api('/items/pages', { method: 'POST', body: JSON.stringify(seedPages) }, token)
  console.log(`+ pages (${seedPages.length})`)
} else {
  const have = new Set(((await api('/items/pages?limit=-1&fields=slug', {}, token)).data || []).map((p) => p.slug))
  const missing = seedPages.filter((p) => !have.has(p.slug))
  if (missing.length) {
    await api('/items/pages', { method: 'POST', body: JSON.stringify(missing) }, token)
    console.log(`+ pages missing (${missing.map((p) => p.slug).join(', ')})`)
  }
}

if (await empty('faq')) {
  await api('/items/faq', { method: 'POST', body: JSON.stringify(seed.faq) }, token)
  console.log(`+ faq (${seed.faq.length})`)
}

// Seed cases (3 examples from practice)
if (await empty('cases')) {
  const casesSeed = [
    {
      title: 'Gigabyte B450M DS3H — нет старта',
      slug: 'gigabyte-b450m-post-00',
      device: 'Gigabyte B450M DS3H',
      problem: 'Нет запуска, POST 00. Материнская плата не подаёт признаков жизни.',
      diagnostics: 'Повреждён дроссель в цепи питания чипсета. Диагностика показала неисправный контроллер преобразователя питания.',
      repair: 'Замена контроллера и повреждённого дросселя. Проверка напряжений и температурного режима.',
      result: 'Плата снова прошла POST и запустилась.',
      tags: ['Материнская плата', 'Компонентный ремонт', 'Цепи питания'],
      featured: true,
      sort: 1,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      title: 'Системный блок — синий экран',
      slug: 'system-block-bsod-unexpected-kernel',
      device: 'Системный блок',
      problem: 'Синий экран UNEXPECTED_KERNEL_MODE_TRAP. Периодические зависания.',
      diagnostics: 'Последовательная аппаратная диагностика выявила неисправный модуль оперативной памяти.',
      repair: 'Замена модуля оперативной памяти.',
      result: 'Система прошла повторное тестирование без повторных сбоев.',
      tags: ['ПК', 'Диагностика', 'ОЗУ'],
      featured: true,
      sort: 2,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      title: 'iPhone 12 mini — Face ID не работает',
      slug: 'iphone-12-mini-face-id',
      device: 'iPhone 12 mini',
      problem: 'Face ID перестал работать после падения.',
      diagnostics: 'Требуется работа с компонентами шлейфа Face ID и датчиков под микроскопом.',
      repair: 'Перенос необходимых элементов с контролем контактных площадок и качества пайки.',
      result: 'Face ID восстановлен. Сложные работы выполняются с увеличением и контролем температуры.',
      tags: ['Смартфон', 'Микропайка', 'Face ID'],
      featured: true,
      sort: 3,
      status: 'published',
      published_at: new Date().toISOString(),
    },
  ]
  await api('/items/cases', { method: 'POST', body: JSON.stringify(casesSeed) }, token)
  console.log(`+ cases (${casesSeed.length})`)
}

if (process.env.CMS_FORCE_SEED || process.env.CMS_SEED_POSTS) {
  const existingPosts = await api('/items/posts?limit=-1', {}, token)
  const existingSlugs = new Set((existingPosts.data || []).map((p) => p.slug))

  const postsSeed = [
    {
      slug: 'how-to-choose-ssd',
      title: 'Как выбрать SSD для ноутбука или ПК',
      excerpt: 'NVMe vs SATA, M.2 vs 2.5 дюйма — разбираемся, какой диск подойдёт именно вам.',
      content: `<h2>Какой SSD выбрать</h2>
<p>SSD — самое простое и доступное ускорение компьютера. Замена HDD на SSD ускоряет загрузку системы в 5–10 раз, но важно выбрать правильный интерфейс и форм-фактор.</p>

<h3>NVMe vs SATA</h3>
<p><strong>SATA III</strong> — максимальная скорость ~550 МБ/с. Подходит для офисных задач и повседневной работы.</p>
<p><strong>NVMe (PCIe)</strong> — скорость от 1500 до 7000 МБ/с в зависимости от поколения. Нужен для видеообработки, игр, работы с большими файлами.</p>

<h3>M.2 vs 2.5"</h3>
<p><strong>M.2</strong> — компактный форм-фактор для ноутбуков и современных ПК. Проверьте, поддерживает ли ваша плата NVMe или только SATA.</p>
<p><strong>2.5"</strong> — корпусной форм-фактор. Подходит для старых ноутбуков и десктопов. Заменяется без вскрытия корпуса.</p>

<h3>На что обратить внимание</h3>
<ul>
<li><strong>Терабайты записи (TBW)</strong> — ресурс диска. Бюджетные модели — 100–300 TBW, хорошие — от 600 TBW.</li>
<li><strong>DRAM-кэш</strong> — ускоряет случайные операции. Диски без DRAM дешевле, но медленнее при большом объёме файлов.</li>
<li><strong>Размер</strong> — 256 ГБ достаточно для системы, 512 ГБ для системы + программ, 1 ТБ для рабочих задач.</li>
</ul>

<blockquote>В REVIVE Service подбираем SSD под конкретную задачу и бюджет. Привезите ноутбук — определим, какой слот и интерфейс доступны.</blockquote>`,
      cover_image: '',
      category: 'general',
      author: 'REVIVE Service',
      seo_title: 'Как выбрать SSD для ноутбука или ПК — REVIVE Service',
      seo_description: 'NVMe vs SATA, M.2 vs 2.5" — разбираемся, какой SSD подойдёт для вашего компьютера.',
      featured: true,
      sort: 1,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'laptop-does-not-turn-on',
      title: 'Ноутбук не включается: что проверить самостоятельно',
      excerpt: 'Прежде чем нести в ремонт — 5 простых проверок, которые помогут понять причину.',
      content: `<h2>Ноутбук не включается</h2>
<p>Не паникуйте. Прежде чем планировать дорогой ремонт, проверьте 5 простых вещей — иногда проблема решается за минуту.</p>

<h3>1. Проверьте заряд</h3>
<p>Подключите зарядное устройство и подождите 15–30 минут. Индикатор заряда горит? Если нет — попробуйте другую розетку и другое зарядное.</p>

<h3>2. Сброс питания</h3>
<p>Отключите зарядку, удерживайте кнопку включения 15–20 секунд, затем подключите зарядку и включите. Это сбрасывает ошибки контроллера питания.</p>

<h3>3. Внешний экран</h3>
<p>Подключите внешний монитор через HDMI. Если изображение есть — проблема в шлейфе или матрице, а не в системной плате.</p>

<h3>4. Память</h3>
<p>Если есть доступ к слотам RAM — извлеките планки и вставьте заново. Окисление контактов — частая причина отказа.</p>

<h3>5. Накопитель</h3>
<p>Извлеките SSD/HDD. Если ноутбук включается без диска — проблема в накопителе или коротком по питанию.</p>

<blockquote>Если ничего не помогает — приезжайте. Диагностика бесплатная, скажем точную стоимость до начала ремонта.</blockquote>`,
      cover_image: '',
      category: 'notebooks',
      author: 'REVIVE Service',
      seo_title: 'Ноутбук не включается — что проверить до ремонта',
      seo_description: '5 простых проверок, если ноутбук не включается. Бесплатная диагностика в REVIVE Service, Сургут.',
      featured: false,
      sort: 2,
      status: 'published',
      published_at: new Date().toISOString(),
    },
  ]

  const postsToAdd = postsSeed.filter((p) => !existingSlugs.has(p.slug))
  if (postsToAdd.length) {
    await api('/items/posts', { method: 'POST', body: JSON.stringify(postsToAdd) }, token)
    console.log(`+ posts (${postsToAdd.length})`)
  }
}

console.log(`Готово. Админка: ${DIRECTUS}  (${EMAIL})`)
