export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { capture } = useAttribution()
  capture()
  router.afterEach(() => capture())
})
