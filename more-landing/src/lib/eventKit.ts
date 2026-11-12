import type { SiteSettingsMap } from "@/lib/supabase"

/**
 * Kit interno del evento activo (Admin → Kit del evento y la sala de espera).
 *
 * Acá solo vive la ESTRUCTURA del evento: qué páginas tiene y qué claves de
 * `site_settings` guardan sus precios y links. Los valores salen de la base, así
 * que cambiar un precio o un link desde Configuración se refleja solo.
 *
 * Para un webinar nuevo: agregar su entrada en `EVENTS` y apuntar `ACTIVE_EVENT_ID`.
 */

export type KitPage = { label: string; path: string; note: string }

export type KitTicket = {
  label: string
  audience: "Público" | "Comunidad"
  priceKey: keyof SiteSettingsMap
  linkKey: keyof SiteSettingsMap
  /** Ruta de la página de gracias a la que redirige el pago (con su query). */
  thanksPath?: string
}

export type KitEvent = {
  id: string
  name: string
  dateLabel: string
  /** Texto de bienvenida al terminar la cuenta regresiva. */
  welcome: string
  pages: KitPage[]
  tickets: KitTicket[]
  /** Pantalla del admin para ver inscritos (si existe). */
  adminPath?: string
  /** Ruta base para el generador de UTMs. */
  utmBasePath: string
  /** Valor sugerido para utm_campaign. */
  utmCampaign: string
}

export const EVENTS: KitEvent[] = [
  {
    id: "taller-23nov",
    name: "Taller MORE · Diseña tu ruta y destraba tu proceso",
    dateLabel: "Lunes 23 y martes 24 de noviembre · 7:00 PM (Colombia)",
    welcome: "Bienvenido al Taller MORE. Hoy diseñas tu ruta a EE.UU.",
    pages: [
      { label: "Landing pública", path: "/taller-23nov", note: "Para anuncios, correos y redes. Precio público." },
      { label: "Landing Comunidad More", path: "/taller-23nov/comunidad", note: "Solo para la comunidad: precio especial. No se indexa." },
      { label: "Registro para Meta Lead Ads", path: "/taller-23nov/registro", note: "Destino de los formularios nativos de Meta: elegir entrada y pagar." },
      { label: "Registro Comunidad (Lead Ads)", path: "/taller-23nov/comunidad/registro", note: "Igual que el anterior, con precio de comunidad." },
      { label: "Página de gracias", path: "/taller-23nov/gracias", note: "Después del pago. Dispara Purchase en Meta." },
    ],
    tickets: [
      { label: "General", audience: "Público", priceKey: "tc_general_price", linkKey: "tc_general_payment_link", thanksPath: "/taller-23nov/gracias?entrada=general&version=publico" },
      { label: "VIP", audience: "Público", priceKey: "tc_vip_price", linkKey: "tc_vip_payment_link", thanksPath: "/taller-23nov/gracias?entrada=vip&version=publico" },
      { label: "General", audience: "Comunidad", priceKey: "tc_comunidad_general_price", linkKey: "tc_comunidad_general_payment_link", thanksPath: "/taller-23nov/gracias?entrada=general&version=comunidad" },
      { label: "VIP", audience: "Comunidad", priceKey: "tc_comunidad_vip_price", linkKey: "tc_comunidad_vip_payment_link", thanksPath: "/taller-23nov/gracias?entrada=vip&version=comunidad" },
    ],
    adminPath: "/admin/taller",
    utmBasePath: "/taller-23nov",
    utmCampaign: "taller-23nov",
  },
]

export const ACTIVE_EVENT_ID = "taller-23nov"

export const getActiveEvent = (): KitEvent => EVENTS.find((e) => e.id === ACTIVE_EVENT_ID) ?? EVENTS[0]

/** Dominio público: en local también se copian los links de producción. */
export const PUBLIC_ORIGIN = "https://moremigracion.com"
