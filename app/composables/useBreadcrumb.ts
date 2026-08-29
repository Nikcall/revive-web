interface BreadcrumbItem {
  name: string
  href: string
}

export function useBreadcrumb(items: BreadcrumbItem[]) {
  const { public: { siteUrl } } = useRuntimeConfig()
  const reqUrl = useRequestURL()
  const fallbackUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : `${reqUrl.protocol}//${reqUrl.host}`

  const listItems = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${fallbackUrl}${item.href}`,
  }))

  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  })
}
