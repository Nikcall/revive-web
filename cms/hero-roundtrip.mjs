/**
 * Проверка вертикали Directus → Nuxt.
 * 1. PATCH hero_button_text
 * 2. GET главной
 * 3. Ищет текст кнопки в HTML
 *
 * Нужен запущенный Directus (docker compose up -d && npm run cms:bootstrap)
 * и Nuxt (npm run dev).
 */
const DIRECTUS = process.env.DIRECTUS_URL || 'http://localhost:8055'
const SITE = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@revive.su'
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'ReviveCmsLocal1!'
const NEXT = process.argv[2] || 'Заказать ремонт'

async function json(url, options = {}) {
  const res = await fetch(url, options)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${url} → ${res.status} ${JSON.stringify(body)}`)
  return body
}

const login = await json(`${DIRECTUS}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
const token = login.data.access_token
const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const before = await json(`${DIRECTUS}/items/site_settings`)
console.log('CMS сейчас:', before.data?.hero_button_text)

await json(`${DIRECTUS}/items/site_settings`, {
  method: 'PATCH',
  headers: auth,
  body: JSON.stringify({ hero_button_text: NEXT }),
})
console.log('CMS записали:', NEXT)

const html = await fetch(SITE).then((r) => r.text())
const ok = html.includes(NEXT)
console.log(ok ? `Главная показывает «${NEXT}» — фундамент работает.` : `Главная НЕ показывает «${NEXT}». Проверьте npm run dev и что / не prerender.`)
if (!ok) process.exit(1)
