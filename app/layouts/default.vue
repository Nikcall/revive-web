<script setup lang="ts">
const { content } = await useCms()
const settings = computed(() => content.value.settings)
</script>

<template>
  <Header
    :settings="settings"
    :contacts="settings"
    :nav="settings.nav"
    :cta-text="settings.header_cta_text"
  />
  <slot />
  <OrderForm :contacts="settings" />
  <Footer :settings="settings" :contacts="settings" />
  <SocialLinks :contacts="settings" />
  <CookieBanner :settings="settings" />
</template>
