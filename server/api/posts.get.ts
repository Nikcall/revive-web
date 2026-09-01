type DirectusResponse<T> = { data?: T }

type PostItem = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  published_at: string
  author: string
  seo_title: string
  seo_description: string
  featured: boolean
  sort: number
  status: string
}

function resolveUrl(base: string, val: string | null | undefined): string {
  if (!val) return ''
  if (val.startsWith('http') || val.startsWith('/')) return val
  return `${base}/assets/${val}?key=cover-large`
}

function mapPost(item: PostItem, base: string) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    cover_image: resolveUrl(base, item.cover_image),
    category: item.category,
    published_at: item.published_at,
    author: item.author,
    seo_title: item.seo_title,
    seo_description: item.seo_description,
    featured: item.featured,
    sort: item.sort,
    status: item.status,
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = String(config.directusUrl || '').replace(/\/$/, '')
  const query = getQuery(event)
  const slug = query.slug as string | undefined
  const featured = query.featured === '1'
  const category = query.category as string | undefined
  const limit = Math.min(Number(query.limit) || 20, 50)

  if (!base) {
    return { data: [] }
  }

  try {
    if (slug) {
      const body = await $fetch<DirectusResponse<PostItem>>(`${base}/items/posts`, {
        params: {
          filter: { slug, status: 'published' },
          limit: 1,
        },
        timeout: 5000,
      })
      const item = body.data?.[0]
      return { data: item ? mapPost(item, base) : null }
    }

    const filter: Record<string, unknown> = { status: 'published' }
    if (featured) filter.featured = true
    if (category) filter.category = category

    const body = await $fetch<DirectusResponse<PostItem[]>>(`${base}/items/posts`, {
      params: {
        filter,
        sort: 'sort',
        limit,
        fields: ['*'],
      },
      timeout: 5000,
    })

    return { data: (body.data || []).map((item) => mapPost(item, base)) }
  } catch {
    return { data: [] }
  }
})
