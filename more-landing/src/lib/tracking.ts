import type { SiteSettingsMap } from "@/lib/supabase"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

export const isAdminRoute = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/")

const trackingActive = (settings: SiteSettingsMap) =>
  settings.tracking_enabled.trim().toLowerCase() !== "false"

let loadPromise: Promise<void> | null = null
let loadKey = ""

const getLoadSignature = (settings: SiteSettingsMap) => {
  const gtm = settings.google_tag_manager_id.trim()
  if (gtm) return `gtm:${gtm}`
  return [
    settings.meta_pixel_id.trim(),
    settings.ga4_measurement_id.trim(),
  ].join("|")
}

const injectScript = (src: string, id: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
      return
    }
    const el = document.createElement("script")
    el.id = id
    el.async = true
    el.src = src
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`Failed to load script ${id}`))
    document.head.appendChild(el)
  })

const waitForFbq = () =>
  new Promise<void>((resolve) => {
    if (window.fbq) {
      resolve()
      return
    }
    const t = window.setInterval(() => {
      if (window.fbq) {
        window.clearInterval(t)
        resolve()
      }
    }, 30)
    window.setTimeout(() => {
      window.clearInterval(t)
      resolve()
    }, 10000)
  })

const ensureFbqStub = () =>
  new Promise<void>((resolve, reject) => {
    if (window.fbq) {
      resolve()
      return
    }
    const stubId = "more-fbq-stub"
    if (document.getElementById(stubId)) {
      void waitForFbq().then(() => resolve())
      return
    }
    const el = document.createElement("script")
    el.id = stubId
    el.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');`
    el.onerror = () => reject(new Error("Meta Pixel stub failed"))
    document.head.appendChild(el)
    void waitForFbq().then(() => resolve())
  })

const initMetaPixel = async (pixelId: string) => {
  await ensureFbqStub()
  window.fbq?.("init", pixelId)
}

const initGtm = async (containerId: string) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" })
  await injectScript(
    `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`,
    "more-google-tag-manager"
  )
}

const initGa4 = async (measurementId: string) => {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args as never)
    }
  }
  await injectScript(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
    `more-gtag-${measurementId.replace(/[^a-z0-9-]/gi, "")}`
  )
  window.gtag("js", new Date())
  window.gtag("config", measurementId, { send_page_view: false })
}

export const ensureTrackingScripts = async (
  settings: SiteSettingsMap
): Promise<void> => {
  if (!trackingActive(settings)) return

  const sig = getLoadSignature(settings)
  const gtm = settings.google_tag_manager_id.trim()
  const meta = settings.meta_pixel_id.trim()
  const ga4 = settings.ga4_measurement_id.trim()

  if (!gtm && !meta && !ga4) return

  if (loadPromise && loadKey === sig) {
    await loadPromise
    return
  }

  if (loadPromise && loadKey !== sig) {
    loadPromise = null
  }

  loadKey = sig
  loadPromise = (async () => {
    if (gtm) {
      await initGtm(gtm)
      return
    }
    if (meta) await initMetaPixel(meta)
    if (ga4) await initGa4(ga4)
  })()

  try {
    await loadPromise
  } catch {
    loadPromise = null
    loadKey = ""
  }
}

export const sendPageView = (
  pathname: string,
  settings: SiteSettingsMap
) => {
  if (isAdminRoute(pathname)) return
  if (!trackingActive(settings)) return

  const gtm = settings.google_tag_manager_id.trim()
  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "virtual_page_view",
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : "",
    })
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "PageView")
  }

  if (settings.ga4_measurement_id.trim()) {
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : "",
    })
  }
}

export const bootstrapTracking = async (
  pathname: string,
  settings: SiteSettingsMap
) => {
  if (isAdminRoute(pathname)) return
  if (!trackingActive(settings)) return

  const gtm = settings.google_tag_manager_id.trim()
  const meta = settings.meta_pixel_id.trim()
  const ga4 = settings.ga4_measurement_id.trim()
  if (!gtm && !meta && !ga4) return

  await ensureTrackingScripts(settings)
  sendPageView(pathname, settings)
}

export const trackLeadFromQuiz = async (settings: SiteSettingsMap) => {
  if (isAdminRoute(window.location.pathname)) return
  if (!trackingActive(settings)) return

  const gtm = settings.google_tag_manager_id.trim()
  const meta = settings.meta_pixel_id.trim()
  const ga4 = settings.ga4_measurement_id.trim()
  if (!gtm && !meta && !ga4) return

  await ensureTrackingScripts(settings)

  const payload = {
    event: "lead_submitted",
    content_name: "diagnostico_quiz",
    content_category: "migration_diagnostic",
  }

  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "Lead", {
      content_name: "diagnostico_quiz",
      content_category: "migration_diagnostic",
    })
  }

  if (settings.ga4_measurement_id.trim()) {
    window.gtag?.("event", "generate_lead", {
      currency: "USD",
      value: 0,
    })
  }
}

export const trackScheduleCta = async (settings: SiteSettingsMap) => {
  if (isAdminRoute(window.location.pathname)) return
  if (!trackingActive(settings)) return

  const gtm = settings.google_tag_manager_id.trim()
  const meta = settings.meta_pixel_id.trim()
  const ga4 = settings.ga4_measurement_id.trim()
  if (!gtm && !meta && !ga4) return

  await ensureTrackingScripts(settings)

  const payload = {
    event: "schedule_cta_click",
    content_name: "asesoria_vip_calendar",
  }

  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "Schedule")
  }

  if (settings.ga4_measurement_id.trim()) {
    window.gtag?.("event", "schedule_appointment_click")
  }
}
