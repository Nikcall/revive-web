<script setup lang="ts">
const page = await useLegalPage('oferta')
</script>

<template>
  <LegalDoc v-if="page" :page="page" />
</template>
