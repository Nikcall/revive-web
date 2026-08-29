/**
 * Server proxy: /api/track?number=R0001&phone=9001234567
 * Hides CRM URL from browser, avoids CORS issues.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const number = String(query.number || '').trim()
  const phone = String(query.phone || '').trim()

  if (!number) {
    throw createError({ statusCode: 400, statusMessage: 'Укажите номер заявки' })
  }
  if (!phone) {
    throw createError({ statusCode: 400, statusMessage: 'Укажите телефон' })
  }

  const config = useRuntimeConfig()
  const crmUrl = String(config.crmTrackUrl || '').replace(/\/$/, '')

  if (!crmUrl) {
    throw createError({ statusCode: 500, statusMessage: 'CRM tracking URL not configured' })
  }

  try {
    const result = await $fetch(`${crmUrl}/api/public/order/status`, {
      method: 'GET',
      params: { number, phone },
      timeout: 10000,
    })
    return result
  } catch (err: any) {
    const status = err?.response?.status || err?.statusCode || 502
    const body = err?.response?._data || err?.data
    throw createError({
      statusCode: status === 404 ? 404 : 502,
      statusMessage: body?.error || 'Заявка не найдена',
    })
  }
})
