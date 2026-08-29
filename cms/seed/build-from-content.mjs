import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
const content = JSON.parse(readFileSync(join(dir, 'content.json'), 'utf8'))

const TR = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .split('')
    .map((ch) => (Object.prototype.hasOwnProperty.call(TR, ch) ? TR[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70)
}

function priceType(row) {
  if (row.price_from == null) return 'on_request'
  if (row.price_from === 0) return 'free'
  if (row.price_to == null) return 'from'
  if (row.price_to === row.price_from) return 'fixed'
  return 'range'
}

const MAP = {
  'Установка / настройка ПО': {
    category_slug: 'programmnoe-obespechenie',
    service_slug: 'programmnoe-obespechenie',
    service_name: 'Установка / настройка ПО',
    landing_path: '/remont-kompyuterov',
    sort: 10,
  },
  'Ноутбуки': {
    category_slug: 'noutbuki',
    service_slug: 'remont-noutbukov',
    service_name: 'Ремонт ноутбуков',
    landing_path: '/remont-noutbukov',
    sort: 20,
  },
  'Системные блоки': {
    category_slug: 'sistemnye-bloki',
    service_slug: 'remont-kompyuterov',
    service_name: 'Системные блоки',
    landing_path: '/remont-kompyuterov',
    sort: 30,
  },
  'Моноблоки': {
    category_slug: 'monobloki',
    service_slug: 'remont-monoblokov',
    service_name: 'Моноблоки',
    landing_path: '/remont-kompyuterov',
    sort: 40,
  },
  'Смартфоны': {
    category_slug: 'smartfony',
    service_slug: 'remont-smartfonov',
    service_name: 'Смартфоны',
    landing_path: '/remont-smartfonov',
    sort: 50,
  },
  'Планшеты': {
    category_slug: 'planshety',
    service_slug: 'remont-planshetov',
    service_name: 'Планшеты',
    landing_path: '/remont-planshetov',
    sort: 60,
  },
  'Apple устройства': {
    category_slug: 'apple-ustroystva',
    service_slug: 'remont-apple',
    service_name: 'Apple устройства',
    landing_path: '/remont-smartfonov',
    sort: 70,
  },
}

const categories = Object.entries(MAP).map(([name, meta]) => ({
  name,
  slug: meta.category_slug,
  description: '',
  sort: meta.sort,
  is_active: true,
}))

const services = Object.entries(MAP).map(([name, meta]) => ({
  category_slug: meta.category_slug,
  name: meta.service_name,
  slug: meta.service_slug,
  landing_path: meta.landing_path,
  short_description: '',
  description: '',
  icon: '',
  image: '',
  is_featured: meta.service_slug === 'remont-noutbukov',
  is_active: true,
  sort: meta.sort,
}))

const used = {}
const sortByService = {}
const price_items = content.prices.map((row) => {
  const meta = MAP[row.category]
  if (!meta) throw new Error(`Unknown category: ${row.category}`)
  const type = priceType(row)
  let key = slugify(row.name)
  const uniq = `${meta.service_slug}:${key}`
  used[uniq] = (used[uniq] || 0) + 1
  if (used[uniq] > 1) key = `${key}-${used[uniq]}`
  sortByService[meta.service_slug] = (sortByService[meta.service_slug] || 0) + 10
  return {
    service_slug: meta.service_slug,
    key,
    name: row.name,
    group: row.group,
    description: '',
    price_type: type,
    price_fixed: type === 'fixed' ? row.price_from : null,
    price_from: type === 'from' || type === 'range' ? row.price_from : null,
    price_to: type === 'range' ? row.price_to : null,
    unit: '',
    note: '',
    is_active: row.active !== false,
    sort: sortByService[meta.service_slug],
  }
})

if (price_items.length !== 118) throw new Error(`Expected 118 prices, got ${price_items.length}`)

writeFileSync(
  join(dir, 'services-prices.json'),
  `${JSON.stringify({ categories, services, price_items }, null, 2)}\n`,
)
console.log('categories', categories.length, 'services', services.length, 'price_items', price_items.length)
