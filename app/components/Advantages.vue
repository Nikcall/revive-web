<script setup lang="ts">
type CareItem = { title: string; text: string; html?: string; icon?: string }

defineProps<{ items: CareItem[]; compact?: boolean }>()
</script>

<template>
  <section class="adv" :class="{ compact }">
    <div class="wrap">
      <h2>{{ compact ? 'Мы заботимся о вашем удобстве и качестве нашего сервиса' : 'МЫ ЗАБОТИМСЯ О ВАШЕМ УДОБСТВЕ' }}<template v-if="!compact"><br />И КАЧЕСТВЕ НАШЕГО СЕРВИСА</template></h2>
      <ul>
        <li v-for="item in items" :key="item.title">
          <img v-if="item.icon?.includes('/')" :src="item.icon" alt="" width="80" height="80" />
          <div>
            <h3 v-html="item.title.replace(/\n/g, '<br />')" />
            <p v-html="(item.html || item.text).replace(/\n/g, '<br />')" />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.adv {
  padding: 100px 0;
  background: #fff;
}
h2 {
  font-size: clamp(26px, 4vw, 42px);
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 64px;
  font-weight: 700;
  line-height: 1.15;
}
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 56px;
  max-width: 920px;
  margin: 0 auto;
}
li {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 28px;
  align-items: start;
}
img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
h3 {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
  line-height: 1.2;
}
p {
  font-size: 20px;
  line-height: 1.55;
  color: #222;
}
@media (max-width: 700px) {
  li { grid-template-columns: 56px 1fr; gap: 16px; }
  img { width: 56px; height: 56px; }
  .adv { padding: 64px 0; }
  h2 { margin-bottom: 36px; }
}
.compact {
  background: #111;
  color: #fff;
  padding: 72px 0;
}
.compact h2 {
  font-size: clamp(24px, 4vw, 36px);
  text-align: left;
  margin-bottom: 32px;
  text-transform: uppercase;
}
.compact ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: none;
}
.compact li {
  display: block;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 22px;
}
.compact h3 {
  font-size: 16px;
  text-transform: none;
}
.compact p { color: #aaa; font-size: 14px; }
@media (max-width: 880px) {
  .compact ul { grid-template-columns: 1fr 1fr; }
}
</style>
