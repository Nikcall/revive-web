import {
  ATTR_COOKIE,
  emptyToNull,
  type AttributionSnapshot,
  type WebsiteLeadPayload,
} from '#shared/lead-contract'
import { clip, isRuMobile, normalizeRuPhone, parseAttributionCookie } from '../utils/phone'
import { rateLimitHit } from '../utils/rateLimit'

function fromCookie(event: Parameters<typeof getCookie>[0]): AttributionSnapshot {
  return parseAttributionCookie(getCookie(event, ATTR_COOKIE) || '')
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const limited = rateLimitHit(`leads:${ip}`, 8, 10 * 60 * 1000)
  if (!limited.ok) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Слишком много заявок. Позвоните или напишите в мессенджер.',
    })
  }

  const body = (await readBody<Partial<WebsiteLeadPayload>>(event)) || {}
  if (clip(body.company, 80)) {
    return { success: true, lead_id: null, forwarded: false }
  }

  const attr = fromCookie(event)
  const phone = normalizeRuPhone(String(body.phone || ''))
  if (!isRuMobile(phone)) {
    throw createError({ statusCode: 422, statusMessage: 'Укажите телефон' })
  }

  const payload: WebsiteLeadPayload = {
    name: clip(body.name, 120),
    phone,
    message: clip(body.message, 2000),
    service: clip(body.service, 160),
    page_url: clip(body.page_url, 300) || '/',
    landing_page: clip(body.landing_page, 300) || attr.landing_page || clip(body.page_url, 300) || '/',
    referrer: clip(body.referrer, 500) || attr.referrer,
    source: 'website',
    utm_source: emptyToNull(body.utm_source || attr.utm_source),
    utm_medium: emptyToNull(body.utm_medium || attr.utm_medium),
    utm_campaign: emptyToNull(body.utm_campaign || attr.utm_campaign),
    utm_content: emptyToNull(body.utm_content || attr.utm_content),
    utm_term: emptyToNull(body.utm_term || attr.utm_term),
    yclid: emptyToNull(body.yclid || attr.yclid),
  }

  const config = useRuntimeConfig()
  const crmUrl = String(config.crmLeadsUrl || '').trim()
  const crmKey = String(config.crmLeadsKey || '').trim()

  if (!crmUrl) {
    console.info('[leads] stub (NUXT_CRM_LEADS_URL empty)', payload)
    return { success: true, lead_id: null, forwarded: false }
  }

  try {
    const crm = await $fetch<{ success?: boolean; lead_id?: number }>(crmUrl, {
      method: 'POST',
      body: payload,
      timeout: 8000,
      headers: {
        ...(crmKey ? { 'x-revive-website-key': crmKey } : {}),
        'x-revive-client-ip': ip,
      },
    })
    return {
      success: true,
      lead_id: crm?.lead_id ?? null,
      forwarded: true,
    }
  } catch (error: unknown) {
    const status = Number((error as { statusCode?: number; status?: number })?.statusCode
      || (error as { status?: number })?.status
      || 0)
    if (status === 400 || status === 422) {
      throw createError({ statusCode: 422, statusMessage: 'Проверьте телефон и поля формы' })
    }
    console.error('[leads] CRM error', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Не отправилось. Позвоните или напишите в мессенджер — мы на связи.',
    })
  }
})
