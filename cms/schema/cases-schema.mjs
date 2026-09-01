/**
 * Directus schema for `cases` collection.
 * Extracted so it can be called from bootstrap.mjs or standalone.
 */
function f(collection, name, type, meta = {}, schema = {}) {
  return {
    collection,
    field: name,
    type,
    meta: {
      interface: type === 'json' ? 'input-code' : type === 'text' ? 'input-multiline' : type === 'boolean' ? 'boolean' : type === 'integer' ? 'input' : 'input',
      width: 'full',
      options: type === 'json' ? { language: 'json' } : undefined,
      ...meta,
    },
    schema,
  }
}

const CASES_FIELDS = [
  f('cases', 'title', 'string', { required: true, note: 'Название кейса, напр. "Gigabyte B450M — нет старта"' }),
  f('cases', 'slug', 'string', { required: true }, { is_unique: true }),
  f('cases', 'device', 'string', { required: true, note: 'Устройство: iPhone 12 mini, Системный блок и т.д.' }),
  f('cases', 'problem', 'text', { required: true, note: 'Симптом / жалоба клиента' }),
  f('cases', 'diagnostics', 'text', { note: 'Что выявила диагностика' }),
  f('cases', 'repair', 'text', { note: 'Что было сделано' }),
  f('cases', 'result', 'text', { note: 'Итог ремонта' }),
  f('cases', 'cover_image', 'string', { interface: 'input', note: 'URL или UUID файла Directus' }),
  f('cases', 'gallery', 'json', { note: 'Массив URL/UUID доп. фото' }),
  f('cases', 'before_image', 'string', { note: 'Фото «до» ремонта' }),
  f('cases', 'after_image', 'string', { note: 'Фото «после» ремонта' }),
  f('cases', 'tags', 'json', { note: 'Теги: ["Материнская плата","Микропайка"]' }),
  f('cases', 'published_at', 'dateTime', { interface: 'datetime', note: 'Дата публикации' }),
  f('cases', 'featured', 'boolean', { default_value: false, note: 'Показывать на главной' }),
  f('cases', 'sort', 'integer', { default_value: 0, note: 'Порядок (меньше = выше)' }),
  f('cases', 'status', 'string', { interface: 'select-dropdown', options: { choices: [{ text: 'Опубликован', value: 'published' }, { text: 'Черновик', value: 'draft' }] }, default_value: 'draft' }),
]

export async function applyCasesSchema(api, token) {
  // Create collection
  try {
    await api('/collections/cases', {}, token)
    console.log('= cases')
  } catch {
    await api('/collections', {
      method: 'POST',
      body: JSON.stringify({
        collection: 'cases',
        meta: { icon: 'build', note: 'Реальные ремонты — кейсы из практики', display_template: '{{title}}' },
        schema: { name: 'cases' },
      }),
    }, token)
    console.log('+ cases')
  }

  // Create fields
  const existing = await api('/fields/cases', {}, token)
  const names = new Set((existing.data || []).map((x) => x.field))
  for (const field of CASES_FIELDS) {
    if (names.has(field.field)) continue
    await api('/fields/cases', { method: 'POST', body: JSON.stringify(field) }, token)
    console.log(`  + cases.${field.field}`)
  }

  // Add sort field to collection meta for default sort
  try {
    await api('/collections/cases', {
      method: 'PATCH',
      body: JSON.stringify({
        meta: {
          sort_field: 'sort',
          sort_direction: 'asc',
        },
      }),
    }, token)
  } catch { /* optional */ }
}
