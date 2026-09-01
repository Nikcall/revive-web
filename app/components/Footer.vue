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
        © {{ year }} <span>RE</span>VIVE — ремонт компьютерной и мобильной техники в Сургуте.
        <br />Бесплатная диагностика · Гарантия · Выезд мастера
        <br />{{ contacts.legal_name }}
        <br />ИНН {{ contacts.inn }} · ОГРНИП {{ contacts.ogrnip }}
        <br />Адрес: {{ contacts.address }}
        <br />Режим работы: {{ contacts.hours }}
        <br />Тел.: <a :href="contacts.phone_href">{{ contacts.phone }}</a> · E-mail:
        <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
      </p>
      <p class="disclaimer">
        REVIVE — независимый сервис. Упомянутые товарные знаки (Apple, Samsung, MSI, ASUS и др.) принадлежат их правообладателям. Упоминание брендов не означает авторизацию или партнёрство с производителями.
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
  display: grid;
  place-items: center;
  padding: 10px;
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
.disclaimer {
  margin-top: 20px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.6;
}
a:hover {
  color: var(--brand);
}
@media (max-width: 700px) {
  .ft { padding: 36px 0 48px; }
  .links { font-size: 14px; gap: 10px 16px; }
  .soc { gap: 10px; }
}
@media (max-width: 480px) {
  .ft { padding: 28px 0 36px; }
  .copy { font-size: 13px; }
  .links { font-size: 13px; gap: 8px 14px; }
}
</style>
