import { useCallback } from "react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { buildWhatsappUrl } from "@/lib/whatsapp"

/**
 * Devuelve una función que arma el enlace de WhatsApp de la empresa con el
 * número configurado en Admin → Settings → Contacto.
 *
 *   const whatsappUrl = useWhatsappUrl()
 *   <a href={whatsappUrl(t("footer.ctaWhatsappMsg"))}>…</a>
 */
export function useWhatsappUrl() {
  const { settings } = useSiteSettings()
  const number = settings.whatsapp_number

  return useCallback((message?: string) => buildWhatsappUrl(number, message), [number])
}
