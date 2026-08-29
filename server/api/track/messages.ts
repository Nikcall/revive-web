/**
 * Server proxy: /api/track/messages
 * GET — fetch messages by token, POST — send message by token.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = String(query.token || '').trim()

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Укажите токен' })
  }

  const config = useRuntimeConfig()
  const crmUrl = String(config.crmTrackUrl || '').replace(/\/$/, '')

  if (!crmUrl) {
    throw createError({ statusCode: 500, statusMessage: 'CRM tracking URL not configured' })
  }

  const method = getMethod(event)

  try {
    if (method === 'GET') {
      return await $fetch(`${crmUrl}/api/public/order/messages`, {
        method: 'GET',
        params: { token },
        timeout: 10000,
      })
    }

    const body = await readBody(event)
    const text = String(body?.text || '').trim()

    if (!text) {
      throw createError({ statusCode: 400, statusMessage: 'Введите текст сообщения' })
    }
    if (text.length > 1000) {
      throw createError({ statusCode: 400, statusMessage: 'Слишком длинное сообщение' })
    }

    return await $fetch(`${crmUrl}/api/public/order/messages`, {
      method: 'POST',
      params: { token },
      body: { text },
      timeout: 10000,
    })
  } catch (err: any) {
    if (err.statusCode) throw err
    const status = err?.response?.status || err?.statusCode || 502
    const errBody = err?.response?._data || err?.data
    throw createError({
      statusCode: status === 404 ? 404 : 502,
      statusMessage: errBody?.error || 'Ошибка сервера',
    })
  }
})
