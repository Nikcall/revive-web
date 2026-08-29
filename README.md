# REVIVE WEB

Сайт revive.su: **Nuxt 4** + **Directus** + Postgres `revive_web`.

Это не платформа и не «свой CMS». Первый релиз — маленький фундамент.

```text
revive.su  →  Nuxt 4
               ├── Directus → PostgreSQL revive_web
               └── POST /api/leads → REVIVE CRM
```

CMS (`cms.revive.su` / локально `:8055`) не принимает заявки и не ходит в БД CRM.

## Запуск

Нужны Node 20+ и Docker.

```bash
copy .env.example .env
npm install
docker compose up -d
npm run cms:bootstrap
npm run dev
```

| | URL |
| --- | --- |
| Сайт | http://localhost:3000 |
| CMS | http://localhost:8055 |
| Postgres `revive_web` | localhost:5433 |

Вход в Directus: `admin@revive.su` / пароль из `.env`.

Сайт открывается и без Directus — тогда берётся `cms/seed/content.json`.

## Фундамент CMS: Hero из Directus

Singleton `site_settings` (чтение Public, без create/update/delete снаружи):

- `hero_title`
- `hero_subtitle`
- `hero_button_text`
- `hero_button_url`

Главная не prerender'ится: правка кнопки в Directus → сохранить → обновить http://localhost:3000 → новый текст.

Проверка:

1. http://localhost:8055 → Content → Site Settings
2. `hero_button_text`: «Оставить заявку» → «Заказать ремонт»
3. Save
4. Обновить главную — кнопка должна смениться

Следующий слой CMS — не весь сайт, а только **Services + Prices**.

```text
service_categories  1──N  services  1──N  price_items
```

Цена живёт только в `price_items` (`key` + `price_type` + числа). `name` — редактируемый текст. SEO-поля у Service пока не создаём: `name` ≠ будущий H1.

Fixture (`cms/seed/services-prices.json`) — **первичное наполнение**. После первой вставки хозяином `name`, описаний и цен становится Directus. Обычный `npm run cms:services` не откатывает CMS. Намеренная синхронизация: `npm run cms:services:force`.

Фикстура для среза: `cooling-cleaning` = 3500 → 4000. Правка одного PriceItem должна изменить `/prices` и `/remont-noutbukov`.

Пока Directus не поднят, сайт читает `cms/seed/content.json`. Схема коллекций: `cms/schema/services-prices.mjs`.

## Что есть в первом релизе

**Hero:** `site_settings`. **Услуги и цены:** `service_categories`, `services`, `price_items`. Рядом остаются `pages`, `faq`. Коллекция `prices` — не источник правды.

**4 страницы:** `/`, `/remont-noutbukov` (и другие услуги), `/prices`, `/contacts`.

**Заявка:** форма → `POST /api/leads` (Nuxt) → `POST /api/public/leads` (CRM). Контракт: name, phone, message, service, page_url, landing_page, referrer, source=website, utm_*, yclid. UTM первого захода пишется в cookie. Если `NUXT_CRM_LEADS_URL` пустой — stub, в CRM ничего не уходит.

Цена меняется в одном `price_item` — главная, `/prices` и страница услуги читают его, а не свои копии.

Блоки страницы (не холст Tilda): `hero`, `service_advantages`, `price_table`, `text_image`, `repair_cases`, `faq`, `reviews`, `cta`. Можно скрыть, переставить, поменять тексты. HTML-простыней контента нет.

H1 главной: **«Ремонт компьютерной и мобильной техники»**.

Картинки — URL из Directus Files, не из git.

## Чего здесь нет (и не будет в этом релизе)

Блог, визуальный редактор, кейсы как раздел, аналитика, Coolify, S3, preview/staging, менеджер редиректов.

Редиректы при необходимости — позже отдельной коллекцией, не сейчас.
