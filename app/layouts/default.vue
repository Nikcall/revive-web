<script setup lang="ts">
const { content } = await useCms()
const settings = computed(() => content.value.settings)
const route = useRoute()
const showOrderForm = computed(() => route.path !== '/track')
</script>

<template>
  <Header
    :settings="settings"
    :contacts="settings"
    :nav="settings.nav"
    :cta-text="settings.header_cta_text"
  />
  <slot />
  <OrderForm v-if="showOrderForm" :contacts="settings" />
  <Footer :settings="settings" :contacts="settings" />
  <SocialLinks :contacts="settings" />
  <CookieBanner :settings="settings" />
</template>
