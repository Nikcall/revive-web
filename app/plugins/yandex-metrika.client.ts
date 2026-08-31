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

let metrikaInitialized = false

function loadMetrika(counterId: number, app: any) {
  if (metrikaInitialized) return
  metrikaInitialized = true

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
    if (currentUrl === lastUrl) return
    window.ym?.(counterId, 'hit', currentUrl, {
      title: document.title,
      referer: previousUrl,
    })
    previousUrl = currentUrl
    lastUrl = currentUrl
  }

  sendHit()

  app.hook('app:mounted', () => sendHit())
  app.hook('page:finish', () => sendHit())
}

export default defineNuxtPlugin((app) => {
  const config = useRuntimeConfig()
  const counterId = Number(config.public.yandexMetrikaId)

  if (!counterId) {
    console.warn('[Metrika] Counter ID is not configured')
    return
  }

  const consent = useCookie<'accepted' | 'rejected' | null>('revive_cookie_consent')

  if (consent.value === 'accepted') {
    loadMetrika(counterId, app)
  } else {
    watch(consent, (val) => {
      if (val === 'accepted') {
        loadMetrika(counterId, app)
      }
    })
  }
})
