import type { CatalogService } from '#shared/catalog'

export async function useCatalog(slug?: string) {
  const key = slug ? `catalog:${slug}` : 'catalog'
  const { data } = await useFetch<{ services: CatalogService[] }>('/api/catalog', {
    key,
    query: slug ? { slug } : undefined,
  })
  const services = computed(() => data.value?.services || [])
  const priceItems = computed(() => services.value.flatMap((item) => item.price_items))
  return { services, priceItems }
}
