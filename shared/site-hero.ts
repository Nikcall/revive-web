export type SiteHeroSettings = {
  hero_title: string
  hero_subtitle: string
  hero_button_text: string
  hero_button_url: string
}

export const SITE_HERO_FALLBACK: SiteHeroSettings = {
  hero_title: 'Ремонт компьютерной и мобильной техники',
  hero_subtitle: 'Диагностика и ремонт техники в Сургуте',
  hero_button_text: 'Оставить заявку',
  hero_button_url: '#order',
}

export function normalizeSiteHero(row?: Partial<SiteHeroSettings> | null): SiteHeroSettings {
  return {
    hero_title: row?.hero_title || SITE_HERO_FALLBACK.hero_title,
    hero_subtitle: row?.hero_subtitle || SITE_HERO_FALLBACK.hero_subtitle,
    hero_button_text: row?.hero_button_text || SITE_HERO_FALLBACK.hero_button_text,
    hero_button_url: row?.hero_button_url || SITE_HERO_FALLBACK.hero_button_url,
  }
}
