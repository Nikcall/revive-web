<script setup lang="ts">
const files: Record<string, Record<string, string>> = {
  glyph: {
    telegram: '/icons/soc-telegram.svg',
    whatsapp: '/icons/soc-whatsapp.svg',
    vk: '/icons/soc-vk.svg',
    phone: '/icons/soc-phone.svg',
    email: '/icons/soc-email.svg',
    max: '/icons/soc-max.svg',
    maxmessenger: '/icons/soc-max.svg',
    write: '/icons/fab-write.svg',
    close: '/icons/fab-close.svg',
  },
  circle: {
    telegram: '/icons/circ-telegram.svg',
    whatsapp: '/icons/circ-whatsapp.svg',
    vk: '/icons/circ-vk.svg',
    phone: '/icons/circ-phone.svg',
    email: '/icons/circ-email.svg',
    max: '/icons/circ-max.svg',
    maxmessenger: '/icons/soc-maxmessenger.svg',
  },
  radio: {
    phone: '/icons/radio-phone.svg',
    telegram: '/icons/radio-telegram.svg',
    whatsapp: '/icons/radio-whatsapp.svg',
    vk: '/icons/radio-vk.svg',
    max: '/icons/radio-max.svg',
    maxmessenger: '/icons/radio-max.svg',
  },
}

const props = withDefaults(defineProps<{
  name: string
  variant?: 'glyph' | 'circle' | 'radio'
}>(), { variant: 'glyph' })

const src = computed(() => {
  const set = files[props.variant] || files.glyph
  return set[props.name] || files.glyph[props.name] || ''
})
const painted = computed(() => props.variant !== 'radio')
</script>

<template>
  <img
    v-if="!painted"
    class="si-img"
    :src="src"
    alt=""
    width="18"
    height="18"
  />
  <span
    v-else
    class="si"
    :style="{ '--si': `url('${src}')` }"
    aria-hidden="true"
  />
</template>

<style scoped>
.si {
  display: block;
  width: 24px;
  height: 24px;
  background-color: #fff;
  -webkit-mask: var(--si) center / contain no-repeat;
  mask: var(--si) center / contain no-repeat;
}
.si-img {
  display: block;
  width: 18px;
  height: 18px;
  object-fit: contain;
}
</style>
