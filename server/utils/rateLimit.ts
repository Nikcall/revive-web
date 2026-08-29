type Bucket = { count: number; resetAt: number }

const hits = new Map<string, Bucket>()

export function rateLimitHit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = hits.get(key)
  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }
  if (current.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }
  current.count += 1
  return { ok: true, remaining: limit - current.count }
}
