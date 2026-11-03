import { useId } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Retícula de puntos del sistema de marca (sustituye al mapamundi):
 * trama al ~14 % con desvanecido radial. Decorativa.
 */
export function DotGrid({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const dot = tone === "dark" ? "rgba(195,210,226,0.16)" : "rgba(27,43,68,0.12)"
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(${dot} 1.2px, transparent 1.2px)`,
        backgroundSize: "22px 22px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)",
      }}
    />
  )
}

/** Avión de Lucide como path SVG (24×24), para animarlo sobre la ruta. */
const PLANE_PATH =
  "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"

/**
 * Ruta punteada origen → destino con un avión en tránsito (lenguaje "del viaje"
 * del manual). Pin navy/blanco en origen, naranja en destino. Decorativa.
 */
export function FlightRoute({
  className,
  tone = "dark",
  duration = 9,
}: {
  className?: string
  tone?: "dark" | "light"
  duration?: number
}) {
  const id = useId().replace(/:/g, "")
  const reduce = useReducedMotion()
  const routeColor = tone === "dark" ? "#8AA4C1" : "#5C7EA6"
  const originColor = tone === "dark" ? "#FFFFFF" : "#1B2B44"
  const d = "M 20 70 C 220 -10, 420 120, 620 40 S 900 20, 980 60"

  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 110"
      className={cn("pointer-events-none h-auto w-full", className)}
    >
      <path
        id={`route-${id}`}
        d={d}
        fill="none"
        stroke={routeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 10"
      />
      <circle cx="20" cy="70" r="6" fill={originColor} />
      <circle cx="980" cy="60" r="7" fill="#F37021" />
      <circle cx="980" cy="60" r="13" fill="none" stroke="#F37021" strokeOpacity="0.45" strokeWidth="1.5" />
      {!reduce && (
        <g>
          <path d={PLANE_PATH} fill="#F37021" transform="translate(-12 -12)" />
          <animateMotion dur={`${duration}s`} repeatCount="indefinite" rotate="auto">
            <mpath href={`#route-${id}`} />
          </animateMotion>
        </g>
      )}
    </svg>
  )
}
