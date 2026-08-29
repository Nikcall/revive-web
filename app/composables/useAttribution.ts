import {
  ATTR_COOKIE,
  ATTR_STORAGE,
  ATTRIBUTION_KEYS,
  EMPTY_ATTRIBUTION,
  type AttributionSnapshot,
} from '#shared/lead-contract'

const MAX_AGE = 60 * 60 * 24 * 90

function queryVal(query: Record<string, unknown>, key: string) {
  const raw = query[key]
  if (Array.isArray(raw)) return String(raw[0] || '').trim()
  return raw ? String(raw).trim() : ''
}

function readStored(): AttributionSnapshot {
  if (!import.meta.client) return { ...EMPTY_ATTRIBUTION }
  try {
    const fromStorage = sessionStorage.getItem(ATTR_STORAGE)
    if (fromStorage) return { ...EMPTY_ATTRIBUTION, ...JSON.parse(fromStorage) }
  } catch {
    /* ignore */
  }
  try {
    const match = document.cookie.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${ATTR_COOKIE}=`))
    if (match) {
      return { ...EMPTY_ATTRIBUTION, ...JSON.parse(decodeURIComponent(match.slice(ATTR_COOKIE.length + 1))) }
    }
  } catch {
    /* ignore */
  }
  return { ...EMPTY_ATTRIBUTION }
}

function persist(next: AttributionSnapshot) {
  if (!import.meta.client) return
  const json = JSON.stringify(next)
  try {
    sessionStorage.setItem(ATTR_STORAGE, json)
  } catch {
    /* ignore */
  }
  document.cookie = `${ATTR_COOKIE}=${encodeURIComponent(json)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`
}

function firstExternalReferrer() {
  if (!import.meta.client) return ''
  const ref = String(document.referrer || '')
  if (!ref) return ''
  try {
    const host = new URL(ref).hostname
    if (host === location.hostname) return ''
  } catch {
    return ''
  }
  return ref.slice(0, 500)
}

export function captureAttribution(query: Record<string, unknown>, path: string) {
  const current = readStored()
  const next = { ...current }
  let changed = false

  for (const key of ATTRIBUTION_KEYS) {
    const incoming = queryVal(query, key)
    if (incoming && !next[key]) {
      next[key] = incoming.slice(0, 200)
      changed = true
    }
  }

  if (!next.landing_page && path) {
    next.landing_page = path.slice(0, 300)
    changed = true
  }

  if (!next.referrer) {
    const ref = firstExternalReferrer()
    if (ref) {
      next.referrer = ref
      changed = true
    }
  }

  if (changed || !current.landing_page) persist(next)
  return next
}

export function useAttribution() {
  const route = useRoute()
  const snapshot = useState<AttributionSnapshot>('rv-attr', () => ({ ...EMPTY_ATTRIBUTION }))

  const capture = () => {
    snapshot.value = captureAttribution(route.query as Record<string, unknown>, route.path)
    return snapshot.value
  }

  if (import.meta.client) capture()

  return { snapshot, capture }
}
