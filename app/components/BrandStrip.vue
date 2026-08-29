<script setup lang="ts">
const brands = [
  'Apple', 'Samsung', 'Xiaomi', 'ASUS', 'MSI', 'Acer',
  'Lenovo', 'Huawei', 'HONOR', 'HP', 'Dell', 'Realme',
]
</script>

<template>
  <section class="brands">
    <div class="wrap">
      <p class="label">Ремонтируем технику производителей</p>
      <div class="list">
        <span v-for="brand in brands" :key="brand" class="brand">{{ brand }}</span>
      </div>
      <p class="disclaimer">REVIVE — независимый сервис. Упомянутые товарные знаки принадлежат их правообладателям. Упоминание брендов не означает авторизацию или партнёрство с производителями.</p>
    </div>
  </section>
</template>

<style scoped>
.brands {
  padding: 48px 0;
  background: #fff;
  border-top: 1px solid var(--border);
}
.label {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--dim);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 24px;
  margin-bottom: 16px;
}
.brand {
  font-size: 15px;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.02em;
}
.disclaimer {
  text-align: center;
  font-size: 11px;
  color: #999;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
}
</style>
