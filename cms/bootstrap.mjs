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

const roles = await api('/roles?filter[name][_eq]=Public', {}, token)
const publicId = roles.data?.[0]?.id
if (publicId) {
  const perms = await api(`/permissions?filter[role][_eq]=${publicId}&filter[action][_eq]=read&limit=-1`, {}, token)
  const have = new Set((perms.data || []).map((p) => p.collection))
  for (const name of COLLECTIONS.map((c) => c.collection)) {
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

console.log(`Готово. Админка: ${DIRECTUS}  (${EMAIL})`)
