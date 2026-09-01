export type CaseItem = {
  id: number
  slug: string
  title: string
  device: string
  problem: string
  diagnostics: string
  repair: string
  result: string
  cover_image: string
  gallery: string[]
  before_image: string
  after_image: string
  tags: string[]
  published_at: string
  featured: boolean
  sort: number
  status: string
}

export async function useCases(opts?: { featured?: boolean; limit?: number }) {
  const params = new URLSearchParams()
  if (opts?.featured) params.set('featured', '1')
  if (opts?.limit) params.set('limit', String(opts.limit))

  const qs = params.toString()
  const url = `/api/cases${qs ? `?${qs}` : ''}`

  const { data } = await useAsyncData(`cases-${qs || 'all'}`, () => $fetch<{ data: CaseItem[] }>(url))
  return { cases: computed(() => data.value?.data || []) }
}

export async function useCase(slug: string) {
  const { data } = await useAsyncData(`case-${slug}`, () =>
    $fetch<{ data: CaseItem | null }>(`/api/cases?slug=${slug}`)
  )
  return { caseItem: computed(() => data.value?.data || null) }
}
