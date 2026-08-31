type YmFunction = (
  counterId: number,
  method: string,
  ...args: any[]
) => void

declare global {
  interface Window {
    ym?: YmFunction & {
      a?: any[]
      l?: number
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const counterId = Number(config.public.yandexMetrikaId)

  if (!counterId) {
    console.warn('[Metrika] Counter ID is not configured')
    return
  }

  if (!window.ym) {
    const ym = function (...args: any[]) {
      ;(ym.a ||= []).push(args)
    } as YmFunction & {
      a?: any[]
      l?: number
    }

    ym.l = Date.now()
    window.ym = ym
  }

  const metrikaSrc = 'https://mc.yandex.ru/metrika/tag.js'

  if (!document.querySelector(`script[src="${metrikaSrc}"]`)) {
    const script = document.createElement('script')

    script.async = true
    script.src = metrikaSrc

    document.head.appendChild(script)
  }

  window.ym(counterId, 'init', {
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  })

  let lastUrl = ''
  let previousUrl = document.referrer

  const sendHit = () => {
    const currentUrl = window.location.href

    if (currentUrl === lastUrl) {
      return
    }

    window.ym?.(counterId, 'hit', currentUrl, {
      title: document.title,
      referer: previousUrl,
    })

    previousUrl = currentUrl
    lastUrl = currentUrl
  }

  nuxtApp.hook('app:mounted', () => {
    sendHit()
  })

  nuxtApp.hook('page:finish', () => {
    sendHit()
  })
})
