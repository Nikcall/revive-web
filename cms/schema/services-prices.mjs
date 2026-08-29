/**
 * Directus content model for Services + Prices.
 *
 *   service_categories 1 ── N services 1 ── N price_items
 *
 * slug идентифицирует Service. landing_path — публичная страница, где он сейчас
 * показывается (несколько услуг могут делить /remont-kompyuterov).
 * price_items.group — тип проблемы калькулятора, буквально из seed.
 *
 * Fixture — стартовое наполнение, не хозяин контента.
 *
 *   BOOTSTRAP  схема, relations, public READ, отсутствующие записи
 *   SEED       insert only if missing (slug / price_items.key)
 *   FORCE      --force | CMS_FORCE_SEED=1  намеренно fixture → CMS
 *
 * Identity never overwritten: category.slug, service.slug, price_items.key
 * Editorial (name, descriptions, prices) lives in Directus after first insert.
 *
 *   node cms/schema/services-prices.mjs
 *   node cms/schema/services-prices.mjs --force
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIRECTUS = process.env.DIRECTUS_URL || 'http://localhost:8055'
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@revive.su'
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'ReviveCmsLocal1!'
const seed = JSON.parse(await readFile(join(__dirname, '../seed/services-prices.json'), 'utf8'))

const PRICE_TYPE_CHOICES = [
  { text: 'Фиксированная', value: 'fixed' },
  { text: 'От', value: 'from' },
  { text: 'Диапазон', value: 'range' },
  { text: 'Бесплатно', value: 'free' },
  { text: 'По запросу', value: 'on_request' },
]

function field(collection, name, type, meta = {}, schema = {}) {
  const isBool = type === 'boolean'
  const isText = type === 'text'
  const isSelect = meta.interface === 'select-dropdown'
  return {
    collection,
    field: name,
    type,
    meta: {
      interface: isBool ? 'boolean' : isText ? 'input-multiline' : isSelect ? 'select-dropdown' : 'input',
      width: 'full',
      ...meta,
    },
    schema,
  }
}

const createdAt = (collection) => ({
  collection,
  field: 'created_at',
  type: 'timestamp',
  meta: { special: ['date-created'], interface: 'datetime', readonly: true, hidden: true, width: 'half' },
  schema: {},
})

const updatedAt = (collection) => ({
  collection,
  field: 'updated_at',
  type: 'timestamp',
  meta: { special: ['date-updated'], interface: 'datetime', readonly: true, hidden: true, width: 'half' },
  schema: {},
})

const COLLECTIONS = [
  {
    collection: 'service_categories',
    meta: {
      icon: 'category',
      note: 'Тип техники / крупное направление. Не мелкая операция.',
      display_template: '{{name}}',
      sort_field: 'sort',
    },
    fields: [
      field('service_categories', 'name', 'string', { required: true }),
      field('service_categories', 'slug', 'string', { required: true }, { is_unique: true }),
      field('service_categories', 'description', 'text'),
      field('service_categories', 'sort', 'integer', { width: 'half', interface: 'input' }, { default_value: 0 }),
      field('service_categories', 'is_active', 'boolean', { width: 'half' }, { default_value: true }),
      createdAt('service_categories'),
      updatedAt('service_categories'),
    ],
  },
  {
    collection: 'services',
    meta: {
      icon: 'build',
      note: 'Направление со своей страницей. Цена здесь не хранится — только в price_items.',
      display_template: '{{name}}',
      sort_field: 'sort',
    },
    fields: [
      field('services', 'name', 'string', { required: true, note: 'Рабочее имя, не H1. Позже отдельно seo_h1.' }),
      field('services', 'slug', 'string', { required: true, note: 'Внутренний идентификатор. Не обязан совпадать с URL.' }, { is_unique: true }),
      field('services', 'landing_path', 'string', {
        width: 'half',
        note: 'Публичный путь страницы, например /remont-kompyuterov. Не уникален.',
      }),
      field('services', 'short_description', 'text'),
      field('services', 'description', 'text'),
      field('services', 'icon', 'string'),
      field('services', 'image', 'string', { note: 'URL файла Directus, не путь из git' }),
      field('services', 'is_featured', 'boolean', { width: 'half' }, { default_value: false }),
      field('services', 'is_active', 'boolean', { width: 'half' }, { default_value: true }),
      field('services', 'sort', 'integer', { width: 'half', interface: 'input' }, { default_value: 0 }),
      createdAt('services'),
      updatedAt('services'),
    ],
  },
  {
    collection: 'price_items',
    meta: {
      icon: 'payments',
      note: 'Единственный источник цены для главной, /prices и страницы услуги.',
      display_template: '{{name}}',
      sort_field: 'sort',
    },
    fields: [
      field('price_items', 'key', 'string', {
        required: true,
        width: 'half',
        note: 'Стабильный ключ: diagnostics, cooling-cleaning. Уникален в паре service_id + key. Не название.',
      }),
      field('price_items', 'name', 'string', { required: true, note: 'Редактируемое название. Идентификатор — key.' }),
      field('price_items', 'group', 'string', {
        width: 'half',
        note: 'Тип проблемы калькулятора. Значение как на сайте, без нормализации.',
      }),
      field('price_items', 'description', 'text'),
      field('price_items', 'price_type', 'string', {
        required: true,
        interface: 'select-dropdown',
        options: { choices: PRICE_TYPE_CHOICES },
        note: 'fixed | from | range | free | on_request. Не хранить «от 2500 ₽» строкой.',
      }, { default_value: 'from' }),
      field('price_items', 'price_from', 'integer', { width: 'half', interface: 'input' }),
      field('price_items', 'price_to', 'integer', { width: 'half', interface: 'input' }),
      field('price_items', 'price_fixed', 'integer', { width: 'half', interface: 'input' }),
      field('price_items', 'unit', 'string', { width: 'half' }),
      field('price_items', 'note', 'text'),
      field('price_items', 'is_active', 'boolean', { width: 'half' }, { default_value: true }),
      field('price_items', 'sort', 'integer', { width: 'half', interface: 'input' }, { default_value: 0 }),
      createdAt('price_items'),
      updatedAt('price_items'),
    ],
  },
]

const RELATIONS = [
  {
    collection: 'services',
    field: 'category_id',
    related_collection: 'service_categories',
    one_field: 'services',
    fieldMeta: {
      interface: 'select-dropdown-m2o',
      special: ['m2o'],
      required: true,
      display: 'related-values',
      display_options: { template: '{{name}}' },
      options: { template: '{{name}}' },
      width: 'half',
    },
    alias: {
      collection: 'service_categories',
      field: 'services',
      meta: {
        interface: 'list-o2m',
        special: ['o2m'],
        options: { template: '{{name}}', enableCreate: true },
      },
    },
  },
  {
    collection: 'price_items',
    field: 'service_id',
    related_collection: 'services',
    one_field: 'price_items',
    fieldMeta: {
      interface: 'select-dropdown-m2o',
      special: ['m2o'],
      required: true,
      display: 'related-values',
      display_options: { template: '{{name}}' },
      options: { template: '{{name}}' },
      width: 'half',
    },
    alias: {
      collection: 'services',
      field: 'price_items',
      meta: {
        interface: 'list-o2m',
        special: ['o2m'],
        options: { template: '{{name}}', enableCreate: true },
      },
    },
  },
]

export async function applyServicesPricesSchema(api, token) {
  for (const col of COLLECTIONS) {
    try {
      await api(`/collections/${col.collection}`, {}, token)
      console.log(`= ${col.collection}`)
    } catch {
      await api('/collections', {
        method: 'POST',
        body: JSON.stringify({ collection: col.collection, meta: col.meta, schema: { name: col.collection } }),
      }, token)
      console.log(`+ ${col.collection}`)
    }

    const existing = await api(`/fields/${col.collection}`, {}, token)
    const names = new Set((existing.data || []).map((x) => x.field))
    for (const item of col.fields) {
      if (names.has(item.field)) continue
      await api(`/fields/${col.collection}`, { method: 'POST', body: JSON.stringify(item) }, token)
      console.log(`  + ${col.collection}.${item.field}`)
    }
  }

  const relations = await api('/relations?limit=-1', {}, token)
  const haveRel = new Set((relations.data || []).map((r) => `${r.collection}.${r.field}`))

  for (const rel of RELATIONS) {
    const fields = await api(`/fields/${rel.collection}`, {}, token)
    const names = new Set((fields.data || []).map((x) => x.field))
    if (!names.has(rel.field)) {
      await api(`/fields/${rel.collection}`, {
        method: 'POST',
        body: JSON.stringify({
          collection: rel.collection,
          field: rel.field,
          type: 'integer',
          meta: rel.fieldMeta,
          schema: {},
        }),
      }, token)
      console.log(`  + ${rel.collection}.${rel.field}`)
    }

    const oneFields = await api(`/fields/${rel.related_collection}`, {}, token)
    const oneNames = new Set((oneFields.data || []).map((x) => x.field))
    if (!oneNames.has(rel.alias.field)) {
      await api(`/fields/${rel.related_collection}`, {
        method: 'POST',
        body: JSON.stringify({
          collection: rel.alias.collection,
          field: rel.alias.field,
          type: 'alias',
          meta: rel.alias.meta,
          schema: null,
        }),
      }, token)
      console.log(`  + ${rel.related_collection}.${rel.alias.field} (o2m)`)
    }

    if (!haveRel.has(`${rel.collection}.${rel.field}`)) {
      await api('/relations', {
        method: 'POST',
        body: JSON.stringify({
          collection: rel.collection,
          field: rel.field,
          related_collection: rel.related_collection,
          meta: {
            one_field: rel.one_field,
            one_deselect_action: 'nullify',
            sort_field: 'sort',
          },
          schema: { on_delete: 'RESTRICT' },
        }),
      }, token)
      console.log(`+ ${rel.collection}.${rel.field} → ${rel.related_collection}`)
    }
  }

  const publicPolicyId = await resolvePublicPolicyId(api, token)
  if (publicPolicyId) {
    const allPerms = await api(`/permissions?filter[policy][_eq]=${publicPolicyId}&limit=-1`, {}, token)
    const byCollection = new Map()
    for (const perm of allPerms.data || []) {
      const list = byCollection.get(perm.collection) || []
      list.push(perm)
      byCollection.set(perm.collection, list)
    }
    for (const name of COLLECTIONS.map((c) => c.collection)) {
      const list = byCollection.get(name) || []
      if (!list.some((p) => p.action === 'read')) {
        await api('/permissions', {
          method: 'POST',
          body: JSON.stringify({
            policy: publicPolicyId,
            collection: name,
            action: 'read',
            fields: ['*'],
            permissions: {},
            validation: {},
          }),
        }, token)
        console.log(`+ public read ${name}`)
      }
      for (const perm of list) {
        if (perm.action === 'read') continue
        await api(`/permissions/${perm.id}`, { method: 'DELETE' }, token)
        console.log(`- public ${perm.action} ${name}`)
      }
    }
  } else {
    console.log('! public policy not found — catalog will be 403 until Public read is granted')
  }

  await leaveLegacyPrices(api, token)
  await seedFixture(api, token, isForceSeed())
}

function isForceSeed() {
  return process.argv.includes('--force') || process.env.CMS_FORCE_SEED === '1'
}

async function resolvePublicPolicyId(api, token) {
  const policies = await api('/policies?limit=-1', {}, token)
  const rows = policies.data || []
  const pub = rows.find((p) => p.name === '$t:public_label' || /^public$/i.test(String(p.name || '')))
    || rows.find((p) => p.admin_access === false && p.app_access === false)
  return pub?.id || ''
}

async function leaveLegacyPrices(api, token) {
  try {
    await api('/collections/prices', {}, token)
    console.log('= prices (legacy: not created, not seeded, not read, not deleted)')
  } catch {
    /* absent — do not create */
  }
}

async function bySlug(api, token, collection, slug) {
  const body = await api(`/items/${collection}?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`, {}, token)
  return body.data?.[0] || null
}

async function byPriceKey(api, token, serviceId, key) {
  const body = await api(
    `/items/price_items?filter[service_id][_eq]=${serviceId}&filter[key][_eq]=${encodeURIComponent(key)}&limit=1`,
    {},
    token,
  )
  return body.data?.[0] || null
}

async function byPriceName(api, token, serviceId, name) {
  const body = await api(
    `/items/price_items?filter[service_id][_eq]=${serviceId}&filter[name][_eq]=${encodeURIComponent(name)}&limit=1`,
    {},
    token,
  )
  return body.data?.[0] || null
}

function withoutKeys(row, keys) {
  const out = { ...row }
  for (const key of keys) delete out[key]
  return out
}

async function ensureBySlug(api, token, collection, row, extra = {}, force = false) {
  const existing = await bySlug(api, token, collection, row.slug)
  const payload = { ...withoutKeys(row, ['slug']), ...extra }
  if (existing) {
    if (force) {
      await api(`/items/${collection}/${existing.id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token)
      console.log(`~ ${collection} ${row.slug} (force)`)
    } else if (collection === 'services' && row.landing_path && !existing.landing_path) {
      await api(`/items/${collection}/${existing.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ landing_path: row.landing_path, sort: row.sort }),
      }, token)
      console.log(`~ ${collection} ${row.slug} (landing_path)`)
    } else {
      console.log(`= ${collection} ${row.slug}`)
    }
    return existing.id
  }
  const created = await api(`/items/${collection}`, {
    method: 'POST',
    body: JSON.stringify({ ...payload, slug: row.slug }),
  }, token)
  console.log(`+ ${collection} ${row.slug}`)
  return created.data.id
}

const ROUNDTRIP_FIXTURE = [
  { key: 'diagnostics', name: 'Диагностика' },
  { key: 'cooling-cleaning', name: 'Чистка системы охлаждения' },
  { key: 'keyboard-replacement', name: 'Замена клавиатуры' },
  { key: 'motherboard-repair', name: 'Ремонт материнской платы' },
]

async function retireRoundtripFixture(api, token) {
  for (const item of ROUNDTRIP_FIXTURE) {
    const found = await api(
      `/items/price_items?filter[key][_eq]=${encodeURIComponent(item.key)}&fields=id,key,name&limit=5`,
      {},
      token,
    )
    for (const row of found.data || []) {
      if (row.name !== item.name) continue
      await api(`/items/price_items/${row.id}`, { method: 'DELETE' }, token)
      console.log(`- price_items ${item.key} (roundtrip fixture)`)
    }
  }
}

async function seedFixture(api, token, force = false) {
  const categoryIds = {}
  for (const row of seed.categories) {
    categoryIds[row.slug] = await ensureBySlug(api, token, 'service_categories', row, {}, force)
  }

  const serviceIds = {}
  for (const row of seed.services) {
    const { category_slug, ...item } = row
    serviceIds[row.slug] = await ensureBySlug(api, token, 'services', item, {
      category_id: categoryIds[category_slug],
    }, force)
  }

  for (const row of seed.price_items) {
    const { service_slug, ...item } = row
    if (!item.key) throw new Error(`price_item «${item.name}» без key`)
    const serviceId = serviceIds[service_slug]
    let existing = await byPriceKey(api, token, serviceId, item.key)
    if (!existing) {
      const byName = await byPriceName(api, token, serviceId, item.name)
      if (byName && !byName.key) existing = byName
    }
    const payload = { ...item, service_id: serviceId }
    if (existing) {
      if (!existing.key && item.key) {
        await api(`/items/price_items/${existing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ key: item.key }),
        }, token)
        console.log(`~ price_items ${item.key} (set key)`)
      } else if (!existing.group && item.group) {
        await api(`/items/price_items/${existing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ group: item.group }),
        }, token)
        console.log(`~ price_items ${item.key} (group)`)
      } else if (force) {
        await api(`/items/price_items/${existing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(withoutKeys(payload, ['key'])),
        }, token)
        console.log(`~ price_items ${item.key} (force)`)
      } else {
        console.log(`= price_items ${item.key}`)
      }
      continue
    }
    await api('/items/price_items', { method: 'POST', body: JSON.stringify(payload) }, token)
    console.log(`+ price_items ${item.key}`)
  }

  await retireRoundtripFixture(api, token)
}

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

const isMain = import.meta.url === pathToFileURL(process.argv[1] || '').href
if (isMain) {
  console.log(`Waiting for ${DIRECTUS}…`)
  await wait()
  const login = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: EMAIL, password: PASSWORD }) })
  await applyServicesPricesSchema(api, login.data.access_token)
  console.log(`Готово. Админка: ${DIRECTUS}`)
}
