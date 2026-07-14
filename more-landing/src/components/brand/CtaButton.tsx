import type { MouseEventHandler } from "react"
import { Link } from "react-router-dom"
import { CalendarDays, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { trackScheduleCta } from "@/lib/tracking"

export type CtaVariant = "primary" | "secondary" | "whatsapp"
export type CtaSize = "md" | "lg"

type CtaButtonProps = {
  label: string
  /** Enlace externo (pago, WhatsApp). Excluyente con `to` y `onClick`. */
  href?: string | null
  /** Ruta interna de React Router. */
  to?: string
  /** Handler adicional; también puede usarse solo, sin `href` ni `to` (renderiza un <button>). */
  onClick?: MouseEventHandler<HTMLElement>
  variant?: CtaVariant
  size?: CtaSize
  /** Muestra un skeleton mientras se resuelven los settings. */
  loading?: boolean
  /** Texto del estado deshabilitado (cuando no hay destino configurado). */
  disabledLabel?: string
  /** Deshabilita el CTA (atributo HTML real; no solo CSS). */
  disabled?: boolean
  /** Tipo del botón nativo. Usar `submit` dentro de formularios. */
  type?: "button" | "submit"
  icon?: LucideIcon | null
  /** Dispara el evento de agendamiento (Meta/GTM/GA4) al hacer clic. */
  trackSchedule?: boolean
  ariaLabel?: string
  className?: string
}

const VARIANTS: Record<CtaVariant, string> = {
  primary:
    "bg-orange text-white shadow-md shadow-orange/25 hover:bg-orange-dark hover:shadow-lg hover:shadow-orange/35 focus-visible:ring-orange",
  secondary:
    "border border-navy/20 bg-white text-navy shadow-sm hover:border-orange/50 hover:text-orange-dark focus-visible:ring-orange",
  whatsapp:
    "bg-[#25D366] text-white shadow-md shadow-[#25D366]/25 hover:bg-[#20BD5A] hover:shadow-lg focus-visible:ring-[#25D366]",
}

const SIZES: Record<CtaSize, string> = {
  md: "min-h-[44px] px-6 py-3 text-sm",
  lg: "min-h-[52px] px-8 py-3.5 text-base",
}

const BASE =
  "cta-shine inline-flex w-full items-center justify-center gap-2 rounded-full font-sans font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

const DISABLED =
  "cursor-not-allowed opacity-50 shadow-none hover:shadow-none hover:bg-inherit"

/**
 * CTA único del sitio: pastilla naranja con barrido de luz y elevación
 * (ver `.cta-shine` en index.css). Sirve como <a>, <Link> o <button>.
 */
export const CtaButton = ({
  label,
  href,
  to,
  onClick,
  variant = "primary",
  size = "md",
  loading,
  disabledLabel,
  disabled = false,
  type = "button",
  icon = CalendarDays,
  trackSchedule = false,
  ariaLabel,
  className,
}: CtaButtonProps) => {
  const { settings } = useSiteSettings()

  const classes = cn(
    BASE,
    VARIANTS[variant],
    SIZES[size],
    disabled && DISABLED,
    className,
  )
  const Icon = icon

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    if (trackSchedule) void trackScheduleCta(settings)
    onClick?.(event)
  }

  const content = (
    <>
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
      <span>{label}</span>
    </>
  )

  if (loading) {
    return (
      <div
        className={cn(
          "h-11 w-full animate-pulse rounded-full bg-gray-200",
          size === "lg" && "h-13",
          className,
        )}
      />
    )
  }

  if (to && !disabled) {
    return (
      <Link to={to} onClick={handleClick} aria-label={ariaLabel ?? label} className={classes}>
        {content}
      </Link>
    )
  }

  if (href && !disabled) {
    const isAnchor = href.startsWith("#")

    return (
      <a
        href={href}
        target={isAnchor ? undefined : "_blank"}
        rel={isAnchor ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        aria-label={ariaLabel ?? label}
        className={classes}
      >
        {content}
      </a>
    )
  }

  if (onClick || type === "submit" || disabled) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick || trackSchedule ? handleClick : undefined}
        aria-label={ariaLabel ?? label}
        className={classes}
      >
        {content}
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled
      aria-label={disabledLabel ?? label}
      className={cn(
        BASE,
        SIZES[size],
        "cursor-not-allowed bg-gray-200 text-gray-400 shadow-none",
        className,
      )}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
      <span>{disabledLabel ?? label}</span>
    </button>
  )
}
