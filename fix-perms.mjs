const DIRECTUS = "http://localhost:8055"
const EMAIL = "admin@revive.su"
const PASSWORD = "p3oZoEQVXUEDgl8UUCZ3"

async function api(path, opts = {}, token) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${DIRECTUS}${path}`, { ...opts, headers })
  const text = await res.text()
  let body = null
  try { body = text ? JSON.parse(text) : null } catch { body = { raw: text } }
  return body
}

const { data: loginData } = await api("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
const token = loginData.access_token
console.log("Logged in.")

// Seed posts
const postsSeed = [
  {
    slug: "how-to-choose-ssd",
    title: "Как выбрать SSD для ноутбука или ПК",
    excerpt: "NVMe vs SATA, M.2 vs 2.5 дюйма — разбираемся, какой диск подойдёт именно вам.",
    content: "<h2>Какой SSD выбрать</h2>\n<p>SSD — самое простое и доступное ускорение компьютера. Замена HDD на SSD ускоряет загрузку системы в 5–10 раз, но важно выбрать правильный интерфейс и форм-фактор.</p>\n\n<h3>NVMe vs SATA</h3>\n<p><strong>SATA III</strong> — максимальная скорость ~550 МБ/с. Подходит для офисных задач и повседневной работы.</p>\n<p><strong>NVMe (PCIe)</strong> — скорость от 1500 до 7000 МБ/с в зависимости от поколения. Нужен для видеообработки, игр, работы с большими файлами.</p>\n\n<h3>M.2 vs 2.5\"</h3>\n<p><strong>M.2</strong> — компактный форм-фактор для ноутбуков и современных ПК. Проверьте, поддерживает ли ваша плата NVMe или только SATA.</p>\n<p><strong>2.5\"</strong> — корпусной форм-фактор. Подходит для старых ноутбуков и десктопов.</p>\n\n<h3>На что обратить внимание</h3>\n<ul>\n<li><strong>Терабайты записи (TBW)</strong> — ресурс диска. Бюджетные модели — 100–300 TBW, хорошие — от 600 TBW.</li>\n<li><strong>DRAM-кэш</strong> — ускоряет случайные операции.</li>\n<li><strong>Размер</strong> — 256 ГБ достаточно для системы, 512 ГБ для системы + программ, 1 ТБ для рабочих задач.</li>\n</ul>\n\n<blockquote>В REVIVE Service подбираем SSD под конкретную задачу и бюджет. Привезите ноутбук — определим, какой слот и интерфейс доступны.</blockquote>",
    cover_image: "",
    category: "general",
    author: "REVIVE Service",
    seo_title: "Как выбрать SSD для ноутбука или ПК — REVIVE Service",
    seo_description: "NVMe vs SATA, M.2 vs 2.5 дюйма — разбираемся, какой SSD подойдёт для вашего компьютера.",
    featured: true,
    sort: 1,
    status: "published",
    published_at: new Date().toISOString(),
  },
  {
    slug: "laptop-does-not-turn-on",
    title: "Ноутбук не включается: что проверить самостоятельно",
    excerpt: "Прежде чем нести в ремонт — 5 простых проверок, которые помогут понять причину.",
    content: "<h2>Ноутбук не включается</h2>\n<p>Не паникуйте. Прежде чем планировать дорогой ремонт, проверьте 5 простых вещей.</p>\n\n<h3>1. Проверьте заряд</h3>\n<p>Подключите зарядное устройство и подождите 15–30 минут. Индикатор заряда горит? Если нет — попробуйте другую розетку и другое зарядное.</p>\n\n<h3>2. Сброс питания</h3>\n<p>Отключите зарядку, удерживайте кнопку включения 15–20 секунд, затем подключите зарядку и включите.</p>\n\n<h3>3. Внешний экран</h3>\n<p>Подключите внешний монитор через HDMI. Если изображение есть — проблема в шлейфе или матрице.</p>\n\n<h3>4. Память</h3>\n<p>Если есть доступ к слотам RAM — извлеките планки и вставьте заново.</p>\n\n<h3>5. Накопитель</h3>\n<p>Извлеките SSD/HDD. Если ноутбук включается без диска — проблема в накопителе.</p>\n\n<blockquote>Если ничего не помогает — приезжайте. Диагностика бесплатная, скажем точную стоимость до начала ремонта.</blockquote>",
    cover_image: "",
    category: "notebooks",
    author: "REVIVE Service",
    seo_title: "Ноутбук не включается — что проверить до ремонта",
    seo_description: "5 простых проверок, если ноутбук не включается. Бесплатная диагностика в REVIVE Service, Сургут.",
    featured: false,
    sort: 2,
    status: "published",
    published_at: new Date().toISOString(),
  },
]

const existingPosts = await api("/items/posts?limit=-1", {}, token)
const existingSlugs = new Set((existingPosts.data || []).map((p) => p.slug))
const postsToAdd = postsSeed.filter((p) => !existingSlugs.has(p.slug))

if (postsToAdd.length) {
  await api("/items/posts", { method: "POST", body: JSON.stringify(postsToAdd) }, token)
  console.log(`+ posts (${postsToAdd.length})`)
} else {
  console.log("= posts (already seeded)")
}

// Verify
const check = await api("/items/posts?limit=-1", {}, token)
console.log("Total posts:", check.data?.length || 0)
console.log("Done.")
