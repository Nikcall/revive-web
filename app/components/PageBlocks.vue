<script setup lang="ts">
import type { CmsBlock, CmsFaq, CmsHomepage, CmsPrice, CmsService } from '~/types/cms'
import type { CatalogPrice } from '#shared/catalog'
import { catalogPriceLabel, matchesLanding } from '#shared/catalog'

const props = defineProps<{
  blocks: CmsBlock[]
  h1?: string
  services: CmsService[]
  prices: CmsPrice[]
  faq: CmsFaq[]
  serviceSlug?: string
  catalogPrices?: CatalogPrice[]
  showAllPrices?: boolean
}>()

const DEFAULT_ADVANTAGES = [
  { title: 'Бесплатная диагностика', text: 'При согласии на ремонт', icon: 'check' },
  { title: 'Гарантия до 6 месяцев', text: 'На работы и комплектующие', icon: 'lock' },
  { title: 'Выезд по всему Сургуту', text: 'В любой район города', icon: 'pin' },
  { title: 'Без скрытых платежей', text: 'Цена фиксируется до начала', icon: 'shield' },
]

const CARE_ITEMS = [
  {
    title: 'Бесплатная диагностика\nвашего устройства\n(при условии дальнейшего ремонта)',
    text: 'Проводим бесплатную диагностику, чтобы точно выявить причину неисправности перед ремонтом. Диагностика бесплатна при Вашем согласии на ремонт. В случае отказа Вы оплачиваете только диагностику и получаете подробный акт с результатами проверки.',
    icon: '/images/icons/adv-1.svg',
  },
  {
    title: 'Быстрая и качественная диагностика',
    text: 'Мы гарантируем оперативный подход к выявлению неисправностей. В нашем сервисном центре диагностика занимает всего 15 мин! Вы экономите своё время — не нужно долго ждать результатов. Мастер сразу предложит оптимальное решение и согласует дальнейшие действия.',
    icon: '/images/icons/adv-2.svg',
  },
  {
    title: 'Забота о каждом клиенте',
    text: 'Мы ценим каждого клиента. Наши мастера учитывают Ваши пожелания и предлагают решения, которые идеально подходят именно Вам: консультируют по всем вопросам, учитывают потребности и бюджет, работают с максимальной заботой о Вашей технике.',
    icon: '/images/icons/adv-3.svg',
  },
  {
    title: 'Честные цены —\nникаких скрытых платежей',
    text: 'Вы заранее знаете стоимость ремонта — никаких скрытых и дополнительных платежей. Мы ценим Ваше доверие и гарантируем честные условия и прозрачный расчёт.',
    icon: '/images/icons/adv-4.svg',
  },
  {
    title: 'Ясные этапы ремонта',
    text: 'Мы объясняем каждый этап ремонта простым языком. Вы всегда знаете, что происходит с Вашей техникой.',
    icon: '/images/icons/adv-5.svg',
  },
]

const visible = computed(() => (props.blocks || []).filter((b) => b.visible !== false))

function heroFrom(block: CmsBlock): CmsHomepage {
  const bySlug = Object.fromEntries(props.services.map((s) => [s.slug, s]))
  const cards = [
    { name: 'Ноутбуки', price: formatPrice(bySlug['remont-noutbukov']?.price_from ?? 600), icon: 'laptop', href: '/remont-noutbukov' },
    { name: 'Смартфоны', price: formatPrice(bySlug['remont-smartfonov']?.price_from ?? 600), icon: 'phone', href: '/remont-smartfonov' },
    { name: 'Диагностика', price: 'Бесплатно', icon: 'check', accent: true, href: '/prices' },
    { name: 'Компьютеры', price: formatPrice(bySlug['remont-kompyuterov']?.price_from ?? 300), icon: 'pc', href: '/remont-kompyuterov' },
    { name: 'Планшеты', price: formatPrice(bySlug['remont-planshetov']?.price_from ?? 800), icon: 'tablet', href: '/remont-planshetov' },
    { name: 'Гарантия', price: 'до 6 месяцев', icon: 'shield', href: '/#faq' },
  ]
  return {
    hero_chip_label: String(block.chip_label || 'Сервисный центр'),
    hero_chip_city: String(block.chip_city || 'Сургут'),
    hero_line1_prefix: String(block.line1_prefix || 'Ремонт'),
    hero_line1_accent: String(block.line1_accent || 'компьютерной'),
    hero_line2_prefix: String(block.line2_prefix || 'и'),
    hero_line2_typed: String(block.line2_typed || 'мобильной'),
    hero_line2_suffix: String(block.line2_suffix || 'техники'),
    tagline: String(block.tagline || 'Быстро, честно — гарантия до 6 месяцев и выезд по Сургуту.'),
    cta_primary_text: String(block.cta_primary_text || 'Записаться на ремонт'),
    cta_primary_href: String(block.cta_primary_href || '#order'),
    cta_secondary_text: String(block.cta_secondary_text || 'Смотреть прайс'),
    cta_secondary_href: String(block.cta_secondary_href || '/prices'),
    core_title: String(block.core_title || 'REVIVE'),
    core_subtitle: String(block.core_subtitle || 'SERVICE CENTER'),
    stats: (block.stats as CmsHomepage['stats']) || [],
    floating_cards: cards,
    marquee: (block.marquee as string[]) || [],
    advantages: DEFAULT_ADVANTAGES,
  }
}

function tablePrices(_block: CmsBlock) {
  const catalog = (props.catalogPrices || []).filter((item) => matchesLanding(item, props.serviceSlug))
  const catalogLandings = new Set(catalog.map((item) => item.landing_path || `/${item.service_slug}`))
  const catalogSlugs = new Set(catalog.map((item) => item.service_slug))
  const fromCatalog = catalog.map((item) => ({
    category: item.category_name || item.service_name,
    device_type: item.service_slug,
    group: item.group || item.service_name,
    name: item.name,
    price_label: catalogPriceLabel(item),
    price_min: item.price_type === 'free' ? 0 : item.price_fixed ?? item.price_from ?? null,
    sort: item.sort,
    urgent_multiplier: 1.3,
  }))
  const fromSeed = pricesForService(props.prices, props.serviceSlug)
    .filter((p) => {
      const seedLanding = `/${p.service_slug || ''}`
      return !catalogSlugs.has(p.service_slug || '') && !catalogLandings.has(seedLanding)
    })
    .map((p) => {
      const serviceName = props.services.find((s) => s.slug === p.service_slug)?.name || p.group
      return {
        category: p.category || serviceName,
        device_type: p.service_slug || '',
        group: p.group,
        name: p.name,
        price_label: formatPrice(p.price_from, p.price_to),
        price_min: p.price_from,
        sort: p.sort,
        urgent_multiplier: p.urgent_multiplier || 1.3,
      }
    })
  return [...fromCatalog, ...fromSeed]
}

function stepsOf(block: CmsBlock) {
  const defaults = [
    { title: 'ЗАЯВКА', text: 'Позвоните нам или оставьте заявку на сайте — опишите проблему. И мы договоримся о передаче техники.', icon: '/images/icons/step-1.svg' },
    { title: 'Бесплатная диагностика (при условии дальнейшего ремонта)', text: 'Мастер проведет бесплатную диагностику и озвучит решение.', icon: '/images/icons/step-2.svg' },
    { title: 'РЕМОНТ', text: 'Мастер устранит проблему — вы получите рабочее устройство с гарантией.', icon: '/images/icons/step-3.svg' },
  ]
  const raw = (block.steps as { title: string; text: string; icon?: string }[]) || defaults
  return raw.map((step, i) => ({ ...defaults[i], ...step }))
}
</script>

<template>
  <template v-for="(block, i) in visible" :key="i">
    <Hero v-if="block.type === 'hero'" :home="heroFrom(block)" :h1="h1 || 'Ремонт компьютерной и мобильной техники'" />
    <DevicePicker v-else-if="block.type === 'device_picker'" />
    <TrackCta v-else-if="block.type === 'track_cta'" />
    <ClientOnly v-else-if="block.type === 'popular_services'">
      <PopularServices :slug="serviceSlug" />
    </ClientOnly>
    <template v-else-if="block.type === 'service_advantages'">
      <Services v-if="block.show_catalog" :services="services" />
      <Advantages
        v-else
        :compact="block.variant !== 'care'"
        :items="block.variant === 'care' ? CARE_ITEMS : DEFAULT_ADVANTAGES"
      />
    </template>
    <BeforeAfter v-else-if="block.type === 'repair_cases'" :cases="(block.items as any) || []" />
    <Reviews v-else-if="block.type === 'reviews'" :reviews="(block.items as any) || []" />
    <Promo
      v-else-if="block.type === 'cta'"
      :promos="[{
        title: String(block.title || ''),
        subtitle: String(block.subtitle || ''),
        cta_text: String(block.cta_text || 'Оставить заявку'),
        cta_href: String(block.cta_href || '#order'),
        badge: String(block.badge || ''),
        image: String(block.image || ''),
        active: true,
      }]"
    />
    <PriceTable v-else-if="block.type === 'price_table'" :catalog-prices="catalogPrices" :service-slug="serviceSlug" :show-all="showAllPrices" />
    <RepairSteps
      v-else-if="block.type === 'text_image' && block.variant === 'steps'"
      :eyebrow="String(block.eyebrow || 'Профессионально и с прозрачными ценами')"
      :title="String(block.title || 'Просто оставьте заявку, а мы восстановим вашу технику всего в три этапа!')"
      :steps="stepsOf(block)"
      :cover-title="String(block.cover_title || 'Решим любые проблемы — от настройки до сложного ремонта')"
      :cover-image="String(block.cover_image || '/images/covers/steps.jpg')"
      :quote="String(block.quote || 'Мы дорожим доверием каждого клиента. Если Вы уже пользовались нашими услугами, будем очень признательны за пару слов о Вашем опыте. Отправьте Ваш отзыв на service@revive.su или напишите в удобный для Вас мессенджер. Спасибо, что помогаете нам совершенствоваться!')"
    />
    <About
      v-else-if="block.type === 'text_image'"
      :eyebrow="String(block.eyebrow || 'О НАС')"
      :title="String(block.title || 'REVIVE — это не просто сервисный центр')"
      :html="String(block.html || '')"
      :cover-title="String(block.cover_title || 'Ваши устройства в надежных руках')"
      :cover-image="String(block.cover_image || '/images/covers/hands.jpg')"
      :images="(block.images as string[]) || ['/images/covers/about-1.webp', '/images/covers/about-2.png', '/images/covers/about-3.jpg']"
    />
    <FAQ v-else-if="block.type === 'faq'" :items="faq" />
  </template>
</template>
