/**
 * Вертикальный срез Services + Prices.
 * 1. CMS: price_items.key=cooling-cleaning  3500 → 4000
 * 2. GET /api/catalog?slug=remont-noutbukov
 * 3. HTML /prices и /remont-noutbukov содержат «4 000 ₽»
 *
 * Нужны Directus (docker compose up -d && npm run cms:services) и Nuxt (npm run dev).
 */
const DIRECTUS = process.env.DIRECTUS_URL || 'http://localhost:8055'
const SITE = process.env.NUXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000'
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@revive.su'
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'ReviveCmsLocal1!'
const ITEM_KEY = 'cooling-cleaning'

async function json(url, options = {}) {
  const res = await fetch(url, options)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${url} → ${res.status} ${JSON.stringify(body)}`)
  return body
}

function has4000(html) {
  return html.includes('4 000 ₽') || html.includes('4\u00a0000 ₽') || html.includes('4\u202f000 ₽')
}

const login = await json(`${DIRECTUS}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
const auth = { Authorization: `Bearer ${login.data.access_token}`, 'Content-Type': 'application/json' }

const found = await json(
  `${DIRECTUS}/items/price_items?filter[key][_eq]=${encodeURIComponent(ITEM_KEY)}&fields=id,key,name,price_type,price_fixed,service_id.slug&limit=1`,
  { headers: auth },
)
const row = found.data?.[0]
if (!row?.id) throw new Error(`Нет price_item key=${ITEM_KEY}. Сначала npm run cms:services`)

console.log('CMS сейчас:', row.key, row.name, row.price_type, row.price_fixed)

await json(`${DIRECTUS}/items/price_items/${row.id}`, {
  method: 'PATCH',
  headers: auth,
  body: JSON.stringify({ price_fixed: 4000 }),
})
console.log('CMS записали: cooling-cleaning → 4000')

const catalog = await json(`${SITE}/api/catalog?slug=remont-noutbukov`)
const items = catalog.services?.[0]?.price_items || []
console.log('API /api/catalog:')
for (const item of items) {
  const id = String(item.key || item.name)
  console.log(`  ${id.padEnd(24)} ${String(item.name).padEnd(32)} ${String(item.price_type).padEnd(12)} ${item.price_fixed ?? item.price_from ?? ''}`)
}

const pricesHtml = await fetch(`${SITE}/prices`).then((r) => r.text())
const serviceHtml = await fetch(`${SITE}/remont-noutbukov`).then((r) => r.text())
const pricesOk = has4000(pricesHtml)
const serviceOk = has4000(serviceHtml)
console.log(pricesOk ? '/prices → 4 000 ₽' : '/prices НЕ показывает 4 000 ₽')
console.log(serviceOk ? '/remont-noutbukov → 4 000 ₽' : '/remont-noutbukov НЕ показывает 4 000 ₽')
if (!pricesOk || !serviceOk) process.exit(1)
console.log('Services + Prices — источник правды.')
