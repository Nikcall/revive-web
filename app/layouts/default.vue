<script setup lang="ts">
const { content } = await useCms()
const settings = computed(() => content.value.settings)
const route = useRoute()
const showOrderForm = computed(() => route.path !== '/track')
const showTrackTab = computed(() => route.path !== '/track')

onMounted(() => {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[href="#order"]')
    if (a) {
      e.preventDefault()
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
    }
  })
})
</script>

<template>
  <Header
    :settings="settings"
    :contacts="settings"
    :nav="settings.nav"
    :cta-text="settings.header_cta_text"
  />
  <slot />
  <TrackTab v-if="showTrackTab" />
  <OrderForm v-if="showOrderForm" :contacts="settings" />
  <Footer :settings="settings" :contacts="settings" />
  <SocialLinks :contacts="settings" />
  <CookieBanner :settings="settings" />
</template>
