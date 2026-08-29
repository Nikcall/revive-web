<script setup lang="ts">
import type { CmsFaq } from '~/types/cms'

defineProps<{ items: CmsFaq[] }>()
const open = ref<number | null>(0)
</script>

<template>
  <section class="faq" id="faq">
    <div class="wrap">
      <h2>Часто задаваемые вопросы</h2>
      <p class="lead">Мы собрали самые популярные вопросы наших клиентов, чтобы Вам было проще</p>
      <div class="list">
        <article v-for="(item, i) in items" :key="item.question">
          <button type="button" @click="open = open === i ? null : i">
            <span class="q">
              <em>Вы:</em>
              {{ item.question }}
            </span>
            <span class="plus">{{ open === i ? '−' : '+' }}</span>
          </button>
          <p v-show="open === i">
            <em>Поддержка:</em>
            {{ item.answer }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding: 100px 0;
  background: #f5f5f5;
}
h2 {
  font-size: clamp(28px, 4vw, 42px);
  margin-bottom: 8px;
}
.lead {
  color: var(--dim);
  margin-bottom: 28px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
article {
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}
button {
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  padding: 18px 20px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
}
.q {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
em {
  font-style: normal;
  color: var(--brand);
  font-weight: 700;
}
.plus {
  color: var(--brand);
  font-size: 22px;
  line-height: 1;
}
p {
  padding: 0 20px 18px;
  color: #444;
  line-height: 1.6;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
