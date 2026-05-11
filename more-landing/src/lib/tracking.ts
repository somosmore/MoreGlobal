/**
 * Módulo central de medición (tracking) del sitio público.
 *
 * Resumen
 * -------
 * - El sitio es una SPA (React Router): no hay recarga entre rutas, así que las
 *   "vistas de página" se simulan manualmente desde `TrackingBootstrap` →
 *   `bootstrapTracking` → `sendPageView` en cada cambio de `pathname`.
 * - Las rutas bajo `/admin` NUNCA se miden (ver `isAdminRoute`).
 * - La medición se puede pausar globalmente desde admin con `tracking_enabled`
 *   (si la setting vale "false", este módulo no carga scripts ni envía eventos).
 *
 * Prioridad de carga (importante)
 * --------------------------------
 * Si en `site_settings` hay un ID de Google Tag Manager (GTM), este módulo
 * carga SOLO GTM y publica los eventos en `window.dataLayer`. En ese modo no
 * inyecta `fbq` ni `gtag` directamente: el píxel de Meta o GA4 deben
 * configurarse dentro del propio contenedor GTM para evitar duplicar tags.
 *
 * Si NO hay GTM pero sí hay píxel de Meta y/o GA4, se cargan los snippets
 * estándar y se llama a `fbq("track", ...)` / `gtag("event", ...)` directamente.
 *
 * Eventos que envía esta web
 * --------------------------
 * - PageView / virtual_page_view → en cada cambio de ruta pública.
 * - ViewContent / masterclass_landing_view → al entrar específicamente a
 *   `/masterclass` (vista de la landing de masterclass).
 * - Lead / lead_submitted → al enviar el quiz de diagnóstico con éxito.
 * - CompleteRegistration / masterclass_registration → al registro exitoso en
 *   el formulario de masterclass.
 * - Schedule / schedule_cta_click → al hacer clic en el CTA VIP que abre el
 *   calendario o el link de pago.
 */
import type { SiteSettingsMap } from "@/lib/supabase"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

// Las rutas del panel admin nunca disparan eventos: la medición solo aplica
// al sitio público (campañas, embudos, conversiones).
export const isAdminRoute = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/")

// Interruptor general controlado desde admin. Si la setting vale "false"
// (cualquier capitalización) la medición queda completamente apagada.
const trackingActive = (settings: SiteSettingsMap) =>
  settings.tracking_enabled.trim().toLowerCase() !== "false"

// Caché a nivel de módulo para evitar inyectar dos veces los scripts cuando
// `bootstrapTracking` se llama en cada cambio de ruta. `loadKey` guarda una
// "firma" de los IDs activos y `loadPromise` la carga en curso.
let loadPromise: Promise<void> | null = null
let loadKey = ""

// Firma única por combinación de IDs configurados. Si hay GTM se prioriza GTM;
// si no, se combinan Meta + GA4. Si cambia algún ID, la firma cambia y se
// fuerza una nueva carga.
const getLoadSignature = (settings: SiteSettingsMap) => {
  const gtm = settings.google_tag_manager_id.trim()
  if (gtm) return `gtm:${gtm}`
  return [
    settings.meta_pixel_id.trim(),
    settings.ga4_measurement_id.trim(),
  ].join("|")
}

// Inyecta un <script async> en el <head> usando un `id` para que no se duplique
// si el módulo se inicializa más de una vez.
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

// Pequeño poll mientras Facebook termina de definir `window.fbq`. Resuelve en
// cuanto está disponible o a los 10 s como salvaguarda (no bloquea para siempre).
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

// Inserta el snippet inline oficial del píxel de Meta (crea la cola `fbq` y
// carga `fbevents.js`). Se ejecuta una sola vez gracias al `stubId`.
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

// Inicializa el píxel de Meta con el ID configurado en admin.
const initMetaPixel = async (pixelId: string) => {
  await ensureFbqStub()
  window.fbq?.("init", pixelId)
}

// Carga el contenedor de Google Tag Manager. A partir de aquí los eventos del
// sitio se publican en `dataLayer` y es GTM quien decide qué disparar (Meta,
// GA4, etc.). Por eso, en modo GTM no llamamos a `fbq` ni `gtag` aquí.
const initGtm = async (containerId: string) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" })
  await injectScript(
    `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`,
    "more-google-tag-manager"
  )
}

// Carga Google Analytics 4 directamente (solo cuando NO usamos GTM).
// `send_page_view: false` desactiva la vista automática para que la maneje
// `sendPageView` y se respete el flujo SPA.
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

/**
 * Asegura que los scripts de medición están cargados según la configuración
 * actual. Es idempotente: si ya se está cargando o la firma de IDs no cambió,
 * reutiliza la promesa en curso. Si la firma cambió (p. ej. el admin actualizó
 * el ID de GTM o de Meta), descarta la caché y vuelve a cargar.
 *
 * Decisión clave: si hay GTM se carga SOLO GTM. Meta y GA4 quedan para
 * configurarse dentro del contenedor.
 */
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

/**
 * Envía una vista de página (virtual) acorde al modo activo.
 *
 * - Con GTM: empuja `virtual_page_view` al `dataLayer`. Además, si la ruta es
 *   `/masterclass` empuja un evento extra `masterclass_landing_view` para que
 *   GTM pueda mapearlo al pixel de Meta (ViewContent) sin depender de la URL.
 * - Sin GTM: llama directamente a `fbq("track", "PageView")` y, en
 *   `/masterclass`, además `fbq("track", "ViewContent", { content_name, ... })`.
 *   Si hay GA4 directo, envía también `page_view`.
 */
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
    if (pathname === "/masterclass") {
      window.dataLayer.push({
        event: "masterclass_landing_view",
        content_name: "masterclass_eb2niw",
        page_path: pathname,
      })
    }
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "PageView")
    if (pathname === "/masterclass") {
      window.fbq?.("track", "ViewContent", {
        content_name: "masterclass_eb2niw",
        content_category: "masterclass",
      })
    }
  }

  if (settings.ga4_measurement_id.trim()) {
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : "",
    })
  }
}

/**
 * Punto de entrada llamado desde `TrackingBootstrap` en cada cambio de ruta.
 * Garantiza scripts cargados y dispara la vista de página correspondiente.
 */
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

/**
 * Conversión "Lead" del quiz de diagnóstico (Sección Quiz).
 *
 * Se llama tras guardar el lead correctamente en Supabase.
 * - GTM: empuja `lead_submitted` al `dataLayer`.
 * - Sin GTM: `fbq("track", "Lead", { content_name, content_category })` y, si
 *   hay GA4 directo, `generate_lead`.
 */
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

/**
 * Conversión "Registro a la masterclass" (formulario MCRegistrationForm).
 *
 * Se llama justo después de que el endpoint `masterclass-register` responde OK.
 * - GTM: empuja `masterclass_registration` al `dataLayer`.
 * - Sin GTM: `fbq("track", "CompleteRegistration", { content_name, ... })` y,
 *   si hay GA4 directo, `sign_up` con `method: "masterclass_eb2niw"`.
 */
export const trackMasterclassRegistration = async (
  settings: SiteSettingsMap
) => {
  if (isAdminRoute(window.location.pathname)) return
  if (!trackingActive(settings)) return

  const gtm = settings.google_tag_manager_id.trim()
  const meta = settings.meta_pixel_id.trim()
  const ga4 = settings.ga4_measurement_id.trim()
  if (!gtm && !meta && !ga4) return

  await ensureTrackingScripts(settings)

  const payload = {
    event: "masterclass_registration",
    content_name: "masterclass_eb2niw",
    content_category: "masterclass",
    page_path: "/masterclass",
  }

  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "CompleteRegistration", {
      content_name: "masterclass_eb2niw",
      content_category: "masterclass",
    })
  }

  if (settings.ga4_measurement_id.trim()) {
    window.gtag?.("event", "sign_up", { method: "masterclass_eb2niw" })
  }
}

/**
 * Conversión "Schedule" del CTA de Asesoría VIP (clic que abre el
 * calendario / link de pago externo).
 *
 * - GTM: empuja `schedule_cta_click` al `dataLayer`.
 * - Sin GTM: `fbq("track", "Schedule")` y, si hay GA4 directo,
 *   `schedule_appointment_click`.
 */
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
