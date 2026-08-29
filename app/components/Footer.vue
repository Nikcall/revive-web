<script setup lang="ts">
import type { CmsContacts, CmsSettings } from '~/types/cms'

defineProps<{
  settings: CmsSettings
  contacts: CmsContacts
}>()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="ft">
    <div class="wrap">
      <div class="soc">
        <a :href="contacts.telegram" target="_blank" rel="nofollow" aria-label="Telegram">
          <SocialIcon name="telegram" />
        </a>
        <a :href="contacts.whatsapp" target="_blank" rel="nofollow" aria-label="WhatsApp">
          <SocialIcon name="whatsapp" />
        </a>
        <a :href="contacts.vk" target="_blank" rel="nofollow" aria-label="VK">
          <SocialIcon name="vk" />
        </a>
        <a :href="contacts.phone_href" aria-label="Телефон">
          <SocialIcon name="phone" />
        </a>
        <a :href="`mailto:${contacts.email}`" aria-label="Почта">
          <SocialIcon name="email" />
        </a>
        <a v-if="contacts.max" :href="contacts.max" target="_blank" rel="nofollow" aria-label="MAX">
          <SocialIcon name="max" />
        </a>
      </div>
      <hr />
      <ul class="links">
        <li><NuxtLink to="/track">Статус ремонта</NuxtLink></li>
        <li><NuxtLink to="/oferta">Оферта</NuxtLink></li>
        <li><NuxtLink to="/return">Возврат</NuxtLink></li>
        <li><NuxtLink to="/privacy">Конфиденциальность</NuxtLink></li>
      </ul>
      <p class="copy">
        © {{ year }} <span>RE</span>VIVE — ремонт смартфонов, ноутбуков и техники Apple в Сургуте.
        <br />Бесплатная диагностика · Гарантия · Выезд мастера
        <br />{{ contacts.legal_name }}
        <br />ИНН {{ contacts.inn }} · ОГРНИП {{ contacts.ogrnip }}
        <br />Адрес: {{ contacts.address }}
        <br />Режим работы: {{ contacts.hours }}
        <br />Тел.: <a :href="contacts.phone_href">{{ contacts.phone }}</a> · E-mail:
        <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.ft {
  background: #171717;
  color: #fff;
  padding: 48px 0 64px;
  font-size: 15px;
  line-height: 1.7;
}
.soc {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}
.soc a {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: #fff;
  transition: color 0.2s;
}
.soc a:hover {
  color: var(--brand);
}
hr {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0 28px;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  list-style: none;
  margin-bottom: 28px;
  font-size: 15px;
  font-weight: 600;
}
.copy span {
  color: rgb(255, 133, 98);
}
a:hover {
  color: var(--brand);
}
@media (max-width: 700px) {
  .links { font-size: 15px; gap: 12px 20px; }
}
</style>
