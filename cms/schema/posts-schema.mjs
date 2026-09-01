/**
 * Directus schema for `posts` collection (база знаний / полезные статьи).
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

const POSTS_FIELDS = [
  f('posts', 'title', 'string', { required: true, note: 'Заголовок статьи' }),
  f('posts', 'slug', 'string', { required: true }, { is_unique: true }),
  f('posts', 'excerpt', 'text', { required: true, note: 'Краткое описание для превью (1-2 предложения)' }),
  f('posts', 'content', 'text', { required: true, note: 'Полный текст статьи (Markdown или HTML)' }),
  f('posts', 'cover_image', 'string', { note: 'URL или UUID файла Directus' }),
  f('posts', 'category', 'string', { interface: 'select-dropdown', options: { choices: [{ text: 'Ноутбуки', value: 'notebooks' }, { text: 'Смартфоны', value: 'smartphones' }, { text: 'ПК', value: 'pc' }, { text: 'Данные', value: 'data' }, { text: 'Общее', value: 'general' }] }, note: 'Категория статьи' }),
  f('posts', 'published_at', 'dateTime', { interface: 'datetime', note: 'Дата публикации' }),
  f('posts', 'author', 'string', { default_value: 'REVIVE Service', note: 'Автор' }),
  f('posts', 'seo_title', 'string', { note: 'SEO заголовок (если отличается от title)' }),
  f('posts', 'seo_description', 'text', { note: 'SEO описание для мета-тегов' }),
  f('posts', 'featured', 'boolean', { default_value: false, note: 'Показывать на главной' }),
  f('posts', 'sort', 'integer', { default_value: 0, note: 'Порядок (меньше = выше)' }),
  f('posts', 'status', 'string', { interface: 'select-dropdown', options: { choices: [{ text: 'Опубликован', value: 'published' }, { text: 'Черновик', value: 'draft' }] }, default_value: 'draft' }),
]

export async function applyPostsSchema(api, token) {
  try {
    await api('/collections/posts', {}, token)
    console.log('= posts')
  } catch {
    await api('/collections', {
      method: 'POST',
      body: JSON.stringify({
        collection: 'posts',
        meta: { icon: 'article', note: 'База знаний — полезные статьи', display_template: '{{title}}' },
        schema: { name: 'posts' },
      }),
    }, token)
    console.log('+ posts')
  }

  const existing = await api('/fields/posts', {}, token)
  const names = new Set((existing.data || []).map((x) => x.field))
  for (const field of POSTS_FIELDS) {
    if (names.has(field.field)) continue
    await api('/fields/posts', { method: 'POST', body: JSON.stringify(field) }, token)
    console.log(`  + posts.${field.field}`)
  }

  try {
    await api('/collections/posts', {
      method: 'PATCH',
      body: JSON.stringify({ meta: { sort_field: 'sort', sort_direction: 'asc' } }),
    }, token)
  } catch { /* optional */ }
}
