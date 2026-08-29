import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle2, type LucideIcon } from "lucide-react"
import {
  getWebinarSep26FormCopy,
  type WebinarSep26FormVariant,
} from "@/components/sections/webinar-sep-26/webinarSep26Copy"
import { CtaButton } from "@/components/brand/CtaButton"

export const WEBINAR_SEP26_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/BxyDE4gWioL3kcecf1zexi"

type WSWhatsappJoinCardProps = {
  variant?: WebinarSep26FormVariant
  className?: string
  showLogo?: boolean
}

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "h-5 w-5 shrink-0"} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function WSWhatsappJoinCard({
  variant = "ads",
  className = "",
  showLogo = false,
}: WSWhatsappJoinCardProps) {
  const copy = getWebinarSep26FormCopy(variant)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`mx-auto w-full max-w-md px-4 sm:px-6 ${className}`}
    >
      {showLogo ? (
        <div className="mb-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            aria-label="MORE — Ir al inicio"
          >
            <img
              src="/logo_more_dark.png"
              alt="MORE — Migración con Propósito"
              className="h-48 w-auto sm:h-60"
            />
          </Link>
        </div>
      ) : null}

      <div className="rounded-3xl border border-navy/15 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-orange-wash">
          <CheckCircle2 className="h-9 w-9 text-orange-dark" aria-hidden />
        </div>

        <h1 className="mb-5 font-display text-[1.625rem] font-bold leading-snug text-navy-deep sm:text-2xl">
          {copy.successTitle}
        </h1>

        <div className="mb-8 space-y-3 font-sans text-[0.9375rem] leading-relaxed text-ink-muted sm:text-base">
          <p className="text-lg font-semibold text-navy-deep">{copy.successLine1}</p>
          <p>{copy.successLine2}</p>
          <p>{copy.successLine3}</p>
        </div>

        <CtaButton
          label={copy.successCta}
          href={WEBINAR_SEP26_WHATSAPP_GROUP_URL}
          variant="whatsapp"
          size="lg"
          icon={WhatsappIcon as LucideIcon}
          ariaLabel={copy.successCta}
        />
      </div>
    </motion.div>
  )
}
