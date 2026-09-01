import { applyCasesSchema } from './cases-schema.mjs'

const DIRECTUS = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055'
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD

async function api(path, options = {}, token) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${DIRECTUS}${path}`, { ...options, headers })
  const text = await res.text()
  let body = null
  try { body = text ? JSON.parse(text) : null } catch { body = { raw: text } }
  if (!res.ok) throw new Error(`${options.method || 'GET'} ${path} → ${res.status}`)
  return body
}

console.log(`Connecting to ${DIRECTUS}…`)
const login = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: EMAIL, password: PASSWORD }) })
const token = login.data.access_token

await applyCasesSchema(api, token)

// Grant public read
const roles = await api('/roles?filter[name][_eq]=Public', {}, token)
const publicId = roles.data?.[0]?.id
if (publicId) {
  const perms = await api(`/permissions?filter[role][_eq]=${publicId}&filter[action][_eq]=read&filter[collection][_eq]=cases&limit=-1`, {}, token)
  if (!perms.data?.length) {
    await api('/permissions', {
      method: 'POST',
      body: JSON.stringify({ role: publicId, collection: 'cases', action: 'read', fields: ['*'], permissions: {}, validation: {} }),
    }, token)
    console.log('+ public read cases')
  }
}

// Seed 3 example cases if empty
const total = await api('/items/cases?limit=0&meta=total_count', {}, token)
if ((total.meta?.total_count || 0) === 0) {
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
      featured: true, sort: 1, status: 'published',
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
      featured: true, sort: 2, status: 'published',
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
      featured: true, sort: 3, status: 'published',
      published_at: new Date().toISOString(),
    },
  ]
  await api('/items/cases', { method: 'POST', body: JSON.stringify(casesSeed) }, token)
  console.log(`+ cases seed (${casesSeed.length})`)
}

console.log('Done.')
