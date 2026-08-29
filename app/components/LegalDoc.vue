<script setup lang="ts">
import type { CmsLegalBlock, CmsPage } from '~/types/cms'

const props = defineProps<{ page: CmsPage }>()

const legal = computed(() => {
  const block = (props.page.blocks || []).find((b) => b.type === 'legal' && b.visible !== false)
  return (block || { type: 'legal', sections: [] }) as CmsLegalBlock
})

function localHref(raw: string) {
  try {
    const url = new URL(raw)
    if (url.hostname === 'revive.su' || url.hostname === 'www.revive.su') {
      return `${url.pathname}${url.search}${url.hash}` || '/'
    }
  } catch { /* mailto / relative */ }
  if (raw.startsWith('mailto:') || raw.startsWith('tel:')) return raw
  return raw
}

function isInternal(href: string) {
  return href.startsWith('/')
}

const tokenRe = /(https?:\/\/[^\s<]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\+7 \(995\) 243-19-95)/g

function parts(text: string) {
  const out: { t: string; href?: string }[] = []
  let last = 0
  for (const match of text.matchAll(tokenRe)) {
    const offset = match.index || 0
    if (offset > last) out.push({ t: text.slice(last, offset) })
    const [full, url, email, phone] = match
    if (url) {
      const clean = url.replace(/[),.;]+$/, '')
      const trail = url.slice(clean.length)
      out.push({ t: clean, href: localHref(clean) })
      if (trail) out.push({ t: trail })
    } else if (email) {
      out.push({ t: email, href: `mailto:${email}` })
    } else if (phone) {
      out.push({ t: phone, href: 'tel:+79952431995' })
    } else {
      out.push({ t: full })
    }
    last = offset + full.length
  }
  if (last < text.length) out.push({ t: text.slice(last) })
  if (!out.length) out.push({ t: text })
  return out
}
</script>

<template>
  <main class="legal">
    <article class="wrap">
      <h1>{{ page.h1 }}</h1>
      <p v-if="legal.intro" class="intro">
        <template v-for="(bit, i) in parts(legal.intro)" :key="'i' + i">
          <NuxtLink v-if="bit.href && isInternal(bit.href)" :to="bit.href">{{ bit.t }}</NuxtLink>
          <a v-else-if="bit.href" :href="bit.href">{{ bit.t }}</a>
          <template v-else>{{ bit.t }}</template>
        </template>
      </p>
      <section v-for="(section, si) in legal.sections || []" :key="si">
        <h2>{{ section.title }}</h2>
        <template v-for="(block, bi) in section.blocks || []" :key="bi">
          <p v-if="block.type === 'p' && block.text">
            <template v-for="(bit, i) in parts(block.text)" :key="i">
              <NuxtLink v-if="bit.href && isInternal(bit.href)" :to="bit.href">{{ bit.t }}</NuxtLink>
              <a v-else-if="bit.href" :href="bit.href">{{ bit.t }}</a>
              <template v-else>{{ bit.t }}</template>
            </template>
          </p>
          <ul v-else-if="block.type === 'ul'">
            <li v-for="(item, li) in block.items || []" :key="li">{{ item }}</li>
          </ul>
          <table v-else-if="block.type === 'table'">
            <tbody>
              <tr v-for="(row, ri) in block.rows || []" :key="ri">
                <th>{{ row.label }}</th>
                <td>{{ row.value }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </section>
    </article>
  </main>
</template>

<style scoped>
.legal {
  padding: calc(var(--header-h) + 48px) 0 64px;
}
h1 {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 28px;
}
.intro,
p,
li,
td {
  font-size: 17px;
  line-height: 1.75;
  color: #222;
}
.intro {
  margin-bottom: 28px;
}
section {
  margin-bottom: 28px;
}
h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 8px 0 12px;
}
p + p {
  margin-top: 10px;
}
ul {
  margin: 8px 0 12px 1.2em;
}
li {
  margin-bottom: 8px;
}
a {
  color: var(--brand);
  text-decoration: underline;
  text-underline-offset: 3px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 8px;
  font-size: 16px;
}
th,
td {
  border: 1px solid var(--border);
  padding: 12px 14px;
  vertical-align: top;
  text-align: left;
}
th {
  width: 34%;
  background: #f7f7f7;
  font-weight: 600;
}
@media (max-width: 700px) {
  table, tbody, tr, th, td { display: block; width: 100%; }
  th { border-bottom: 0; }
}
</style>
