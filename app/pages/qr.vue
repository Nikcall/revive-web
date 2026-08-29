<script setup lang="ts">
import type { CmsQrLink } from '~/types/cms'

definePageMeta({ layout: 'qr' })

const { content, pageBySlug } = await useCms()
const page = computed(() => pageBySlug('qr'))
const links = computed(() => content.value.qr_links || [])
const hub = computed(() => (page.value?.blocks || []).find((b) => b.type === 'qr_hub'))
const route = useRoute()

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

usePageSeo({
  title: page.value.seo_title,
  description: page.value.seo_description,
  canonical: page.value.canonical,
  robots: 'noindex, nofollow',
})

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'] as const

function queryVal(key: string) {
  const raw = route.query[key]
  if (Array.isArray(raw)) return String(raw[0] || '')
  return raw ? String(raw) : ''
}

function hrefFor(link: CmsQrLink) {
  const utm: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const fromPage = queryVal(key)
    const fromLink = String(link[key] || '')
    const val = fromPage || fromLink
    if (val) utm[key] = val
  }

  if (link.external) return link.href

  const url = new URL(link.href, 'https://revive.su')
  for (const [key, val] of Object.entries(utm)) url.searchParams.set(key, val)
  return `${url.pathname}${url.search}`
}

</script>

<template>
  <main v-if="page" class="qr">
    <img
      class="logo"
      :src="String(hub?.logo || '/images/qr-icon.png')"
      :alt="content.settings.site_name"
      width="120"
      height="120"
    />
    <h1>
      <span v-for="(line, i) in page.h1.split('\n')" :key="i">{{ line }}</span>
    </h1>
    <p class="sub"><strong>{{ String(hub?.subtitle || page.seo_description) }}</strong></p>
    <nav class="btns" aria-label="QR-ссылки">
      <a
        v-for="link in links"
        :key="link.id"
        class="btn"
        :href="hrefFor(link)"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'nofollow noopener' : undefined"
      >{{ link.label }}</a>
    </nav>
    <p class="tag">{{ String(hub?.tagline || 'REVIVE: вернём технику к жизни!') }}</p>
  </main>
</template>

<style scoped>
.qr {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px 40px;
  background: #fff;
  color: #000;
}
.logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 28px;
}
h1 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.35;
  margin: 20px 0 10px;
  max-width: 520px;
}
h1 span {
  display: block;
}
.sub {
  font-size: 16px;
  max-width: 520px;
  margin-bottom: 28px;
  line-height: 1.5;
}
.btns {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: min(420px, 100%);
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 280px;
  min-height: 48px;
  padding: 12px 28px;
  border-radius: 30px;
  background: var(--brand);
  color: #fff !important;
  font-weight: 600;
  font-size: 16px;
  transition: background-color 0.2s;
}
.btn:hover {
  background: #000;
}
.tag {
  margin-top: 28px;
  font-size: 14px;
  color: #808080;
  font-weight: 700;
}
</style>
