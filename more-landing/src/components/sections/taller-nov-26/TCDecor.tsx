import { useEffect, useRef } from "react"
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion"
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

/** Pausa en destino antes de repetir el vuelo (segundos). */
const LANDING_PAUSE = 1.6

/**
 * Ruta origen → destino con un avión en tránsito (lenguaje "del viaje" del manual).
 * El avión acelera y frena con suavidad, se ladea en las curvas y deja una estela
 * naranja que dibuja la ruta; al llegar, el destino "aterriza" con ondas.
 * La posición se escribe directo en el SVG (sin re-render). Decorativa.
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
  const reduce = useReducedMotion()
  const pathRef = useRef<SVGPathElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const progress = useMotionValue(reduce ? 0.55 : 0)

  const routeColor = tone === "dark" ? "#8AA4C1" : "#5C7EA6"
  const originColor = tone === "dark" ? "#FFFFFF" : "#1B2B44"
  const labelColor = tone === "dark" ? "#C3D2E2" : "#5B6B7C"
  const d = "M 30 78 C 230 -6, 420 128, 620 46 S 890 18, 968 62"

  const place = (t: number) => {
    const path = pathRef.current
    if (!path) return
    const length = path.getTotalLength()
    const at = Math.max(0.001, Math.min(t, 0.999)) * length
    const heading = (from: number) => {
      const a = path.getPointAtLength(from)
      const b = path.getPointAtLength(Math.min(from + 4, length))
      return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
    }
    const p = path.getPointAtLength(at)
    const angle = heading(at)
    // Ladeo: según cuánto gira la ruta un poco más adelante, el avión se "aplana"
    // (efecto de alabeo). Se calcula sobre la geometría, no por cuadro: no tiembla.
    const turn = Math.abs(heading(Math.min(at + 60, length - 5)) - angle)
    const bank = 1 - Math.min(turn / 90, 0.35)
    // Aparece al despegar y se desvanece al aterrizar (sin saltos al reiniciar).
    const fade = Math.min(1, t / 0.04, (1 - t) / 0.04)
    const plane = planeRef.current
    if (plane) {
      // El ícono de Lucide apunta a 45° (arriba-derecha): se compensa.
      plane.setAttribute(
        "transform",
        `translate(${p.x} ${p.y}) rotate(${angle + 45}) scale(1.35 ${1.35 * bank}) translate(-12 -12)`,
      )
      plane.style.opacity = String(reduce ? 1 : Math.max(0, fade))
    }
    if (trailRef.current) {
      trailRef.current.style.strokeDasharray = `${length}`
      trailRef.current.style.strokeDashoffset = `${length * (1 - t)}`
    }
  }

  useMotionValueEvent(progress, "change", place)

  useEffect(() => {
    place(progress.get())
    if (reduce) return
    const controls = animate(progress, [0, 1], {
      duration,
      ease: [0.45, 0, 0.25, 1],
      repeat: Infinity,
      repeatDelay: LANDING_PAUSE,
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- place lee refs; solo reinicia con duración/motion
  }, [duration, reduce])

  return (
    <svg aria-hidden viewBox="0 0 1000 120" className={cn("pointer-events-none h-auto w-full overflow-visible", className)}>
      {/* Ruta completa, punteada y tenue */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={routeColor}
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 10"
      />
      {/* Estela: tramo recorrido, sólido en naranja */}
      <path
        ref={trailRef}
        d={d}
        fill="none"
        stroke="#F37021"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      {/* Origen */}
      <circle cx="30" cy="78" r="6" fill={originColor} />
      <text x="30" y="106" textAnchor="middle" fill={labelColor} className="hidden sm:block" style={{ font: "700 13px Inter, sans-serif", letterSpacing: "0.18em" }}>
        HOY
      </text>

      {/* Destino con ondas de aterrizaje sincronizadas con el vuelo */}
      {!reduce &&
        [0, 0.35].map((delay) => (
          <motion.circle
            key={delay}
            cx="968"
            cy="62"
            fill="none"
            stroke="#F37021"
            strokeWidth="1.5"
            initial={{ r: 7, opacity: 0 }}
            animate={{ r: [7, 30], opacity: [0.7, 0] }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              delay: duration + delay,
              repeat: Infinity,
              repeatDelay: duration + LANDING_PAUSE - 1.2,
            }}
          />
        ))}
      <circle cx="968" cy="62" r="13" fill="none" stroke="#F37021" strokeOpacity="0.45" strokeWidth="1.5" />
      <circle cx="968" cy="62" r="7" fill="#F37021" />
      <text x="968" y="98" textAnchor="middle" fill="#F37021" className="hidden sm:block" style={{ font: "700 13px Inter, sans-serif", letterSpacing: "0.18em" }}>
        EE.UU.
      </text>

      {/* Avión */}
      <g ref={planeRef}>
        <path d={PLANE_PATH} fill="#F37021" stroke={tone === "dark" ? "#16243D" : "#FFFFFF"} strokeWidth="1.2" strokeLinejoin="round" />
      </g>
    </svg>
  )
}
