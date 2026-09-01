type DirectusResponse<T> = { data?: T }

type CaseItem = {
  id: number
  slug: string
  title: string
  device: string
  problem: string
  diagnostics: string
  repair: string
  result: string
  cover_image: string
  gallery: string[] | null
  before_image: string
  after_image: string
  tags: string[] | null
  published_at: string
  featured: boolean
  sort: number
  status: string
}

function resolveUrl(base: string, val: string | null | undefined): string {
  if (!val) return ''
  if (val.startsWith('http') || val.startsWith('/')) return val
  // Directus file UUID → /assets/{uuid}
  return `${base}/assets/${val}?key=cover-large`
}

function mapCase(item: CaseItem, base: string) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    device: item.device,
    problem: item.problem,
    diagnostics: item.diagnostics,
    repair: item.repair,
    result: item.result,
    cover_image: resolveUrl(base, item.cover_image),
    gallery: (item.gallery || []).map((f) => resolveUrl(base, f)),
    before_image: resolveUrl(base, item.before_image),
    after_image: resolveUrl(base, item.after_image),
    tags: item.tags || [],
    published_at: item.published_at,
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
  const limit = Math.min(Number(query.limit) || 20, 50)

  if (!base) {
    return { data: [] }
  }

  try {
    if (slug) {
      const body = await $fetch<DirectusResponse<CaseItem>>(`${base}/items/cases`, {
        params: {
          filter: { slug, status: 'published' },
          limit: 1,
        },
        timeout: 5000,
      })
      const item = body.data?.[0]
      return { data: item ? mapCase(item, base) : null }
    }

    const filter: Record<string, unknown> = { status: 'published' }
    if (featured) filter.featured = true

    const body = await $fetch<DirectusResponse<CaseItem[]>>(`${base}/items/cases`, {
      params: {
        filter,
        sort: 'sort',
        limit,
        fields: ['*'],
      },
      timeout: 5000,
    })

    return { data: (body.data || []).map((item) => mapCase(item, base)) }
  } catch {
    return { data: [] }
  }
})
