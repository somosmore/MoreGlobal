import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle2, type LucideIcon } from "lucide-react"
import {
  getComunidadFormCopy,
  type ComunidadFormVariant,
} from "@/components/sections/comunidad/comunidadCopy"
import { CtaButton } from "@/components/brand/CtaButton"

export const COMUNIDAD_FACEBOOK_GROUP_URL =
  "https://www.facebook.com/groups/1466363148722242"

type CMFacebookJoinCardProps = {
  variant?: ComunidadFormVariant
  className?: string
  showLogo?: boolean
}

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "h-5 w-5 shrink-0"} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
)

export default function CMFacebookJoinCard({
  variant = "ads",
  className = "",
  showLogo = false,
}: CMFacebookJoinCardProps) {
  const copy = getComunidadFormCopy(variant)
  const groupUrl = COMUNIDAD_FACEBOOK_GROUP_URL.startsWith("http")
    ? COMUNIDAD_FACEBOOK_GROUP_URL
    : null

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
          href={groupUrl}
          variant="facebook"
          size="lg"
          icon={FacebookIcon as LucideIcon}
          disabledLabel="Enlace del grupo disponible pronto"
          ariaLabel={copy.successCta}
        />
      </div>
    </motion.div>
  )
}
