export type PostItem = {
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

export async function usePosts(opts?: { featured?: boolean; category?: string; limit?: number }) {
  const params = new URLSearchParams()
  if (opts?.featured) params.set('featured', '1')
  if (opts?.category) params.set('category', opts.category)
  if (opts?.limit) params.set('limit', String(opts.limit))

  const qs = params.toString()
  const url = `/api/posts${qs ? `?${qs}` : ''}`

  const { data } = await useAsyncData(`posts-${qs || 'all'}`, () => $fetch<{ data: PostItem[] }>(url))
  return { posts: computed(() => data.value?.data || []) }
}

export async function usePost(slug: string) {
  const { data } = await useAsyncData(`post-${slug}`, () =>
    $fetch<{ data: PostItem | null }>(`/api/posts?slug=${slug}`)
  )
  return { post: computed(() => data.value?.data || null) }
}
