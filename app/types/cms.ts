export type CmsNavItem = { label: string; href: string; children?: CmsNavItem[] }
export type CmsAdvantage = { title: string; text: string; icon: string }
export type CmsPromo = {
  title: string
  subtitle: string
  cta_text: string
  cta_href: string
  badge: string
  image?: string
  active: boolean
}
export type CmsCase = {
  id?: number
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
  /** Legacy fields for backwards compat */
  text?: string
  price_label?: string
  before_url?: string
  after_url?: string
}
export type CmsReview = { author: string; service: string; text: string; rating: number }

export type CmsHomepage = {
  hero_chip_label: string
  hero_chip_city: string
  hero_line1_prefix: string
  hero_line1_accent: string
  hero_line2_prefix: string
  hero_line2_typed: string
  hero_line2_suffix: string
  tagline: string
  cta_primary_text: string
  cta_primary_href: string
  cta_secondary_text: string
  cta_secondary_href: string
  core_title: string
  core_subtitle: string
  stats: { value: number | null; suffix: string; label: string; static?: string }[]
  floating_cards: { name: string; price: string; icon: string; accent?: boolean; href?: string }[]
  marquee: string[]
  advantages: { title: string; text: string; icon: string }[]
  steps_eyebrow?: string
  steps_title?: string
  steps?: { title: string; text: string }[]
  about_eyebrow?: string
  about_title?: string
  about_html?: string
}

export type CmsSettings = {
  site_name: string
  logo_url: string
  header_cta_text: string
  phone: string
  phone_href: string
  email: string
  legal_name: string
  inn: string
  ogrnip: string
  address: string
  city: string
  hours: string
  telegram: string
  whatsapp: string
  vk: string
  max?: string
  cookie_text: string
  nav: CmsNavItem[]
  hero_title?: string
  hero_subtitle?: string
  hero_button_text?: string
  hero_button_url?: string
}

export type SiteHeroSettings = {
  hero_title: string
  hero_subtitle: string
  hero_button_text: string
  hero_button_url: string
}

export type CmsContacts = CmsSettings

export type CmsQrLink = {
  id: string
  label: string
  href: string
  external?: boolean
  utm_source?: string
  utm_campaign?: string
  utm_content?: string
}

export type CmsLegalInline =
  | { type: 'p'; text: string; items?: string[]; rows?: { label: string; value: string }[] }
  | { type: 'ul'; items: string[]; text?: string; rows?: { label: string; value: string }[] }
  | { type: 'table'; rows: { label: string; value: string }[]; text?: string; items?: string[] }

export type CmsLegalSection = {
  title: string
  blocks: CmsLegalInline[]
}

export type CmsLegalBlock = {
  type: 'legal'
  visible?: boolean
  intro?: string
  sections: CmsLegalSection[]
}

export type CmsBlock = {
  type: 'hero' | 'service_advantages' | 'price_table' | 'text_image' | 'repair_cases' | 'faq' | 'reviews' | 'cta' | 'legal' | 'qr_hub' | 'device_picker' | 'track_cta' | 'popular_services'
  visible?: boolean
  [key: string]: unknown
}

export type CmsPage = {
  slug: string
  title: string
  h1: string
  seo_title: string
  seo_description: string
  canonical: string
  og_image: string
  blocks: CmsBlock[]
}

export type CmsService = {
  id?: number
  slug: string
  name: string
  h1: string
  short_description: string
  hero_description?: string
  icon?: string
  price_from: number
  diagnostic_price: number
  warranty: string
  hero_image: string
  seo_title: string
  seo_description: string
  blocks: CmsBlock[]
  sort: number
}

export type CmsPrice = {
  name: string
  group: string
  category?: string
  price_from: number
  price_to: number | null
  diagnostic_price: number
  urgent_multiplier: number
  active: boolean
  sort: number
  service_slug?: string
  service?: number | { id?: number; slug?: string; name?: string }
}

export type CmsFaq = {
  question: string
  answer: string
  sort: number
}

export type CmsPost = {
  id?: number
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

export type CmsContent = {
  settings: CmsSettings
  pages: CmsPage[]
  services: CmsService[]
  prices: CmsPrice[]
  faq: CmsFaq[]
  qr_links: CmsQrLink[]
}
