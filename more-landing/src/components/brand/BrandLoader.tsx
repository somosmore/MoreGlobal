import { Plane } from "lucide-react"
import { cn } from "@/lib/utils"

type BrandLoaderProps = {
  /** `dark` para landings en navy (taller), `light` para el resto del sitio. */
  tone?: "dark" | "light"
  label?: string
}

/**
 * Pantalla de carga de marca: logo + mini ruta punteada que el avión recorre
 * dejando estela (lenguaje "del viaje" del manual). Solo CSS (`.brand-loader-*`
 * en index.css) para no sumar peso a la carga inicial.
 */
export default function BrandLoader({ tone = "light", label = "Cargando…" }: BrandLoaderProps) {
  const dark = tone === "dark"

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-4",
        dark ? "bg-navy-ink" : "bg-paper",
      )}
    >
      <img
        src={dark ? "/logo_more_dark.png" : "/logo_more_light.png"}
        alt="MORE"
        className="-my-10 h-36 w-auto"
      />

      <div className="brand-loader-route" aria-hidden>
        <span className={cn("brand-loader-track", dark ? "border-navy-line" : "border-navy-pale")} />
        <span className="brand-loader-trail" />
        <span className={cn("brand-loader-dot left-0", dark ? "bg-white" : "bg-navy-deep")} />
        <span className="brand-loader-dot right-0 bg-orange" />
        <span className="brand-loader-plane">
          <Plane className="h-5 w-5 rotate-45 fill-orange text-orange" />
        </span>
      </div>

      <p
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.18em]",
          dark ? "text-navy-soft" : "text-ink-muted",
        )}
      >
        {label}
      </p>
    </div>
  )
}
