<script setup lang="ts">
import type { CmsContacts, CmsNavItem, CmsSettings } from '~/types/cms'

defineProps<{
  settings: CmsSettings
  contacts: CmsContacts
  nav: CmsNavItem[]
  ctaText: string
}>()

const open = ref(false)
const openSub = ref('')

function onNavClick(event: MouseEvent, item: CmsNavItem) {
  if (item.children && open.value) {
    event.preventDefault()
    openSub.value = openSub.value === item.label ? '' : item.label
    return
  }
  if (!item.children) open.value = false
}
</script>

<template>
  <header class="hdr">
    <div class="hdr-bar">
      <a href="/" class="logo">
        <img :src="settings.logo_url" :alt="settings.site_name" width="168" height="40" />
      </a>
      <nav class="hdr-nav" :class="{ open }">
        <ul>
          <li
            v-for="item in nav"
            :key="item.label"
            class="nav-item"
            @mouseenter="item.children && (openSub = item.label)"
            @mouseleave="openSub = ''"
          >
            <a
              :href="item.href"
              :aria-expanded="item.children ? openSub === item.label : undefined"
              @click="onNavClick($event, item)"
            >{{ item.label }}</a>
            <ul v-if="item.children" class="sub" :class="{ show: openSub === item.label }">
              <li v-for="child in item.children" :key="child.label">
                <a :href="child.href" @click="open = false">{{ child.label }}</a>
              </li>
            </ul>
          </li>
        </ul>
        <div class="hdr-mobile-extra">
          <a :href="contacts.phone_href">{{ contacts.phone }}</a>
          <div class="hdr-mobile-social">
            <a v-if="contacts.telegram" :href="contacts.telegram" target="_blank" rel="nofollow" aria-label="Telegram">
              <SocialIcon name="telegram" variant="glyph" />
            </a>
            <a v-if="contacts.whatsapp" :href="contacts.whatsapp" target="_blank" rel="nofollow" aria-label="WhatsApp">
              <SocialIcon name="whatsapp" variant="glyph" />
            </a>
            <a v-if="contacts.vk" :href="contacts.vk" target="_blank" rel="nofollow" aria-label="VK">
              <SocialIcon name="vk" variant="glyph" />
            </a>
          </div>
          <a class="hdr-track" href="/track">Статус ремонта</a>
          <a class="hdr-cta" href="#order" @click="open = false">Запись</a>
        </div>
      </nav>
      <div class="hdr-end">
        <div class="hdr-social">
          <a v-if="contacts.telegram" :href="contacts.telegram" target="_blank" rel="nofollow" aria-label="Telegram">
            <SocialIcon name="telegram" variant="glyph" />
          </a>
          <a v-if="contacts.whatsapp" :href="contacts.whatsapp" target="_blank" rel="nofollow" aria-label="WhatsApp">
            <SocialIcon name="whatsapp" variant="glyph" />
          </a>
          <a v-if="contacts.vk" :href="contacts.vk" target="_blank" rel="nofollow" aria-label="VK">
            <SocialIcon name="vk" variant="glyph" />
          </a>
        </div>
        <a class="hdr-track" href="/track">Статус ремонта</a>
        <a class="hdr-phone" :href="contacts.phone_href">{{ contacts.phone }}</a>
        <a class="hdr-cta" href="#order">Запись</a>
      </div>
      <button class="burger" type="button" aria-label="Меню" :aria-expanded="open" @click="open = !open">
        <span /><span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.hdr-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  height: var(--header-h);
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}
.logo {
  flex-shrink: 0;
  z-index: 2;
}
.logo img {
  width: 156px;
  height: auto;
  display: block;
}
.hdr-nav {
  flex: 1;
  min-width: 0;
}
.hdr-nav > ul {
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
}
.nav-item {
  position: relative;
}
.hdr-nav a {
  display: block;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  position: relative;
  white-space: nowrap;
}
.hdr-nav > ul > li > a::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 4px;
  height: 1px;
  background: var(--brand);
  opacity: 0;
  transition: 0.3s;
}
.hdr-nav > ul > li > a:hover::after,
.hdr-nav > ul > li > a[aria-expanded='true']::after {
  opacity: 1;
}
.sub {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  min-width: 220px;
  padding: 8px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  z-index: 20;
}
.nav-item:hover .sub,
.sub.show {
  display: block;
}
.sub a {
  font-size: 14px;
  text-transform: none;
  font-weight: 500;
  padding: 8px 16px;
  white-space: normal;
}
.sub a:hover {
  color: var(--brand);
}
.hdr-end {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.hdr-social {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hdr-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #555;
  transition: color 0.2s;
}
.hdr-social a:hover {
  color: var(--brand);
}
.hdr-social :deep(.si-img) {
  width: 20px;
  height: 20px;
}
.hdr-phone {
  font-size: 15px;
  font-weight: 600;
  font-family: Rubik, sans-serif;
  white-space: nowrap;
  letter-spacing: 0.01em;
}
.hdr-phone:hover {
  color: var(--brand);
}
.hdr-cta {
  background: var(--brand);
  color: #fff !important;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
  padding: 10px 18px;
  border-radius: 8px;
  transition: background 0.2s;
  text-align: center;
  line-height: 1.2;
}
.hdr-cta:hover {
  background: #000;
}
.hdr-track {
  font-size: 13px;
  font-weight: 600;
  color: var(--brand);
  white-space: nowrap;
}
.hdr-track:hover {
  color: #000;
}
.hdr-mobile-extra {
  display: none;
}
.burger {
  display: none;
  width: 44px;
  height: 36px;
  border: 0;
  background: none;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  z-index: 3;
  margin-left: auto;
  padding: 8px 6px;
  flex-shrink: 0;
}
.burger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #000;
}
@media (max-width: 1100px) {
  .hdr-nav a {
    font-size: 13px;
    padding: 8px 9px;
  }
  .hdr-phone {
    font-size: 14px;
  }
}
@media (max-width: 980px) {
  .hdr-bar {
    padding: 0 16px;
  }
  .logo img {
    width: 140px;
  }
  .hdr-end {
    display: none;
  }
  .burger {
    display: flex;
  }
  .hdr-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    flex: none;
  }
  .hdr-nav.open {
    display: block;
  }
  .hdr-nav > ul {
    flex-direction: column;
    align-items: stretch;
    padding: 8px 0;
  }
  .sub {
    position: static;
    box-shadow: none;
    padding-left: 12px;
  }
  .hdr-mobile-extra {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 8px 16px 20px;
    font-size: 16px;
  }
  .hdr-mobile-extra .hdr-cta {
    align-self: flex-start;
  }
  .hdr-mobile-social {
    display: flex;
    gap: 12px;
  }
  .hdr-mobile-social a {
    display: flex;
    color: #555;
  }
  .hdr-mobile-social :deep(.si-img) {
    width: 20px;
    height: 20px;
  }
  .hdr-mobile-social a {
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
  }
}
</style>
