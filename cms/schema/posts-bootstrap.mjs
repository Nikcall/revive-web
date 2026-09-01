/**
 * Standalone posts bootstrap — run on VPS to create the posts collection.
 * Usage: node cms/schema/posts-bootstrap.mjs
 */
import { applyPostsSchema } from './posts-schema.mjs'

const DIRECTUS = process.env.DIRECTUS_URL || 'http://localhost:8055'
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@revive.su'
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'ReviveCmsLocal1!'

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

console.log(`Directus: ${DIRECTUS}`)
await wait()

const { data: loginData } = await api('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
const token = loginData.access_token

await applyPostsSchema(api, token)

const roles = await api('/roles?filter[name][_eq]=Public', {}, token)
const publicId = roles.data?.[0]?.id
if (publicId) {
  const perms = await api(`/permissions?filter[role][_eq]=${publicId}&filter[action][_eq]=read&limit=-1`, {}, token)
  const have = new Set((perms.data || []).map((p) => p.collection))
  if (!have.has('posts')) {
    await api('/permissions', {
      method: 'POST',
      body: JSON.stringify({ role: publicId, collection: 'posts', action: 'read', fields: ['*'], permissions: {}, validation: {} }),
    }, token)
    console.log('+ public read posts')
  }
}

console.log(`Готово. Админка: ${DIRECTUS}`)
