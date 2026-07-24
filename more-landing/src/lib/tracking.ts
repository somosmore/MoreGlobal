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
 *   `/masterclass` (vista de la landing de masterclass). Si existe
 *   `VITE_META_CAPI_MASTERCLASS_VIEW_URL`, también se envía ViewContent por
 *   Conversions API (Edge) con el mismo `event_id` que el píxel (deduplicación).
 * - Lead / lead_submitted → al enviar el quiz de diagnóstico con éxito.
 * - CompleteRegistration / masterclass_registration → registro masterclass OK
 *   (píxel directo: `fbq` con parámetros neutros; GTM: `dataLayer`; CAPI en
 *   `masterclass-register` cuando el cliente envía `capi_event_id`). GA4: `sign_up`.
 * - Schedule / schedule_cta_click → al hacer clic en el CTA VIP que abre el
 *   calendario o el link de pago.
 * - Schedule / appointment_booked → al cargar `/gracias` tras agendar (conversión
 *   real de cita confirmada; una vez por sesión de navegador).
 *
 * Meta Business Tool Terms: no enviar Información de contacto en claro ni
 * datos de categorías prohibidas; no usar fbq("init", id, user_data) desde aquí.
 */
import type { SiteSettingsMap } from "@/lib/supabase"

const MASTERCLASS_LANDING_PATHS = new Set([
  "/masterclass",
  "/taller-niw",
  "/taller-niw/registro",
])

const isMasterclassLandingPath = (pathname: string): boolean =>
  MASTERCLASS_LANDING_PATHS.has(pathname)

/** Parámetros opacos hacia Meta (evitar nombres que describan categorías sensibles en eventos). */
const META_EVENT_PARAMS = {
  masterclassView: {
    content_name: "svc_page_a",
    content_category: "content_view",
  },
  quizLead: {
    content_name: "form_flow_b",
    content_category: "interactive_flow",
  },
  masterclassFormOk: {
    content_name: "form_flow_c",
    content_category: "content_view",
  },
  appointmentBooked: {
    content_name: "appt_confirmed_a",
    content_category: "content_view",
  },
} as const

/** Lee cookies _fbp / _fbc para emparejar con Conversions API. */
export const getFbpFbcFromDocument = (): { fbp?: string; fbc?: string } => {
  if (typeof document === "undefined") return {}
  const out: { fbp?: string; fbc?: string } = {}
  for (const part of document.cookie.split(";")) {
    const s = part.trim()
    if (s.startsWith("_fbp=")) out.fbp = decodeURIComponent(s.slice(5))
    if (s.startsWith("_fbc=")) out.fbc = decodeURIComponent(s.slice(5))
  }
  return out
}

const fireMasterclassViewContentCapi = (params: {
  eventId: string
  eventSourceUrl: string
  clientUserAgent: string
  fbp?: string
  fbc?: string
}) => {
  const url = (import.meta.env.VITE_META_CAPI_MASTERCLASS_VIEW_URL as string | undefined)?.trim()
  if (!url) return
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()
  if (!anonKey) return
  const body: Record<string, string> = {
    event_id: params.eventId,
    event_source_url: params.eventSourceUrl,
    client_user_agent: params.clientUserAgent,
  }
  if (params.fbp) body.fbp = params.fbp
  if (params.fbc) body.fbc = params.fbc
  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify(body),
  }).catch(() => {})
}

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
// No pasar user_data / Información de contacto aquí (Cond. herramientas Meta).
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

  let masterclassViewEventId: string | undefined
  if (isMasterclassLandingPath(pathname)) {
    const capiUrl = (import.meta.env.VITE_META_CAPI_MASTERCLASS_VIEW_URL as string | undefined)?.trim()
    if (capiUrl) {
      masterclassViewEventId = crypto.randomUUID()
      const { fbp, fbc } = getFbpFbcFromDocument()
      fireMasterclassViewContentCapi({
        eventId: masterclassViewEventId,
        eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
        clientUserAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        fbp,
        fbc,
      })
    }
  }

  const gtm = settings.google_tag_manager_id.trim()
  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "virtual_page_view",
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : "",
    })
    if (isMasterclassLandingPath(pathname)) {
      window.dataLayer.push({
        event: "masterclass_landing_view",
        ...META_EVENT_PARAMS.masterclassView,
        page_path: pathname,
        ...(masterclassViewEventId ? { capi_event_id: masterclassViewEventId } : {}),
      })
    }
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "PageView")
    if (isMasterclassLandingPath(pathname)) {
      const viewOpts = masterclassViewEventId
        ? { eventID: masterclassViewEventId }
        : undefined
      if (viewOpts) {
        window.fbq?.(
          "track",
          "ViewContent",
          { ...META_EVENT_PARAMS.masterclassView },
          viewOpts
        )
      } else {
        window.fbq?.("track", "ViewContent", {
          ...META_EVENT_PARAMS.masterclassView,
        })
      }
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
    ...META_EVENT_PARAMS.quizLead,
  }

  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "Lead", {
      ...META_EVENT_PARAMS.quizLead,
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
 * - Píxel Meta directo: `CompleteRegistration` con parámetros neutros (sin datos
 *   de contacto ni categorías sensibles). GA4: `sign_up` con method neutro.
 * - Si `capi.eventId` está definido, se pasa a `fbq` / `dataLayer` para deduplicar
 *   con el evento enviado por Conversions API desde el servidor.
 */
export type MasterclassTrackingCapiContext = {
  eventId?: string
}

export const trackMasterclassRegistration = async (
  settings: SiteSettingsMap,
  capi?: MasterclassTrackingCapiContext
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
    ...META_EVENT_PARAMS.masterclassFormOk,
    page_path: window.location.pathname,
    ...(capi?.eventId ? { capi_event_id: capi.eventId } : {}),
  }

  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
    return
  }

  if (settings.meta_pixel_id.trim()) {
    const fbOpts = capi?.eventId ? { eventID: capi.eventId } : undefined
    if (fbOpts) {
      window.fbq?.(
        "track",
        "CompleteRegistration",
        { ...META_EVENT_PARAMS.masterclassFormOk },
        fbOpts
      )
    } else {
      window.fbq?.("track", "CompleteRegistration", {
        ...META_EVENT_PARAMS.masterclassFormOk,
      })
    }
  }

  if (settings.ga4_measurement_id.trim()) {
    window.gtag?.("event", "sign_up", { method: "mc_web" })
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
    content_name: "cta_calendar",
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

const APPOINTMENT_BOOKED_STORAGE_KEY = "more_appointment_booked"

/**
 * Conversión real de cita agendada (página `/gracias` post-redirect del calendario).
 *
 * - GTM: empuja `appointment_booked` al `dataLayer`.
 * - Sin GTM: `fbq("track", "Schedule")` con parámetros opacos y GA4
 *   `schedule_appointment`.
 * - Se dispara como máximo una vez por sesión de navegador (sessionStorage)
 *   para evitar doble fire en Strict Mode o refrescos.
 */
export const trackAppointmentBooked = async (settings: SiteSettingsMap) => {
  if (typeof window === "undefined") return
  if (isAdminRoute(window.location.pathname)) return
  if (!trackingActive(settings)) return

  try {
    if (sessionStorage.getItem(APPOINTMENT_BOOKED_STORAGE_KEY) === "1") return
    sessionStorage.setItem(APPOINTMENT_BOOKED_STORAGE_KEY, "1")
  } catch {
    // sessionStorage puede fallar en modo privado; seguimos y disparamos igual
  }

  const gtm = settings.google_tag_manager_id.trim()
  const meta = settings.meta_pixel_id.trim()
  const ga4 = settings.ga4_measurement_id.trim()
  if (!gtm && !meta && !ga4) return

  await ensureTrackingScripts(settings)

  const payload = {
    event: "appointment_booked",
    ...META_EVENT_PARAMS.appointmentBooked,
    page_path: window.location.pathname,
  }

  if (gtm) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
    return
  }

  if (settings.meta_pixel_id.trim()) {
    window.fbq?.("track", "Schedule", {
      ...META_EVENT_PARAMS.appointmentBooked,
    })
  }

  if (settings.ga4_measurement_id.trim()) {
    window.gtag?.("event", "schedule_appointment")
  }
}
