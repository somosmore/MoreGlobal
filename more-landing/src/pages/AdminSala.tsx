import { useCallback, useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Minus, Play, Plus, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { getActiveEvent } from "@/lib/eventKit"
import { ClockRing } from "@/components/admin/sala/ClockRing"
import { ChatBubbles } from "@/components/admin/sala/ChatBubbles"
import { SALA_MESSAGES } from "@/components/admin/sala/salaMessages"
import { MAX_MINUTES, MIN_MINUTES, useLaunchTimer } from "@/components/admin/sala/useLaunchTimer"

/**
 * Sala de espera (`/admin/sala`): cuenta regresiva para proyectar en Zoom antes
 * de empezar. Sin el menú del admin para que la pantalla compartida se vea limpia.
 * Atajos: Espacio/Enter inicia, R o Esc reinicia.
 */

const PRESETS = [1, 5, 10, 15, 30]
const PANEL_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const

function requestFullscreen() {
  const el = document.documentElement
  if (document.fullscreenElement || !el.requestFullscreen) return
  void el.requestFullscreen().catch(() => {})
}

function Panel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <motion.section
      key={id}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.98 }}
      transition={PANEL_TRANSITION}
      className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-6 text-center"
    >
      {children}
    </motion.section>
  )
}

function StepButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

export default function AdminSala() {
  const event = getActiveEvent()
  const timer = useLaunchTimer(10)
  const { phase, minutes, setMinutes, start, reset, restart } = timer

  const launch = useCallback(() => {
    start()
    requestFullscreen()
  }, [start])

  useEffect(() => {
    const previous = document.title
    document.title = `Sala de espera · ${event.name}`
    return () => {
      document.title = previous
    }
  }, [event.name])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return
      if (e.code === "Space" || e.key === "Enter") {
        if (phase === "idle") {
          e.preventDefault()
          launch()
        } else if (phase === "done") {
          e.preventDefault()
          restart()
        }
        return
      }
      if (e.key === "r" || e.key === "R" || (e.key === "Escape" && phase === "running")) reset()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [launch, phase, reset, restart])

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(243,112,33,0.10) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(243,112,33,0.08) 0%, transparent 60%)",
        }}
      />

      <Link
        to="/admin/evento"
        className="fixed left-6 top-5 z-30 text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors hover:text-white"
      >
        MORE
      </Link>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <Panel id="idle">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-xs uppercase tracking-widest text-white/65">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange" aria-hidden />
              En vivo · Estamos por comenzar
            </span>
            <h1 className="text-balance text-[clamp(2rem,5.5vw,3.75rem)] font-extrabold leading-tight tracking-tight">
              {event.name.split(" · ")[0]} <span className="text-orange">está por empezar</span>
            </h1>
            <p className="max-w-xl text-pretty text-base text-white/65">
              {event.dateLabel}. Acomódate, silencia las notificaciones y prepárate.
            </p>

            <div className="mt-2 flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-widest text-white/60">Duración del conteo</span>
                <div className="flex items-center justify-center gap-3">
                  <StepButton label="Restar un minuto" onClick={() => setMinutes(minutes - 1)} disabled={minutes <= MIN_MINUTES}>
                    <Minus className="h-5 w-5" />
                  </StepButton>
                  <label className="flex items-baseline gap-1.5">
                    <span className="sr-only">Minutos</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={MIN_MINUTES}
                      max={MAX_MINUTES}
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur()
                          launch()
                        }
                      }}
                      className="w-24 border-b border-white/20 bg-transparent pb-1 text-center text-4xl font-extrabold tabular-nums outline-none focus:border-orange"
                    />
                    <span className="text-sm text-white/60">min</span>
                  </label>
                  <StepButton label="Sumar un minuto" onClick={() => setMinutes(minutes + 1)} disabled={minutes >= MAX_MINUTES}>
                    <Plus className="h-5 w-5" />
                  </StepButton>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMinutes(preset)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        preset === minutes
                          ? "border-orange bg-orange text-white"
                          : "border-white/15 text-white/60 hover:border-orange hover:text-white",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={launch}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-orange text-base font-bold text-white hover:bg-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden /> Iniciar
              </button>
              <p className="text-xs text-white/50">o presiona Espacio · R para reiniciar</p>
            </div>
          </Panel>
        )}

        {phase === "running" && (
          <Panel id="running">
            <span className="text-sm uppercase tracking-[0.3em] text-white/60">Comenzamos en</span>
            <ClockRing remaining={timer.remaining} total={timer.total} />
            <p className="max-w-md text-pretty text-sm text-white/60">
              Guarda este momento. La sesión arranca cuando el reloj llegue a cero.
            </p>
          </Panel>
        )}

        {phase === "done" && (
          <Panel id="done">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-orange">Es hora</span>
            <h2 className="text-[clamp(2.5rem,9vw,6rem)] font-extrabold leading-none tracking-tight">¡Comenzamos!</h2>
            <p className="max-w-xl text-pretty text-lg text-white/65">{event.welcome}</p>
            <button
              type="button"
              onClick={restart}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/60 transition-colors hover:border-orange hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Contar de nuevo
            </button>
          </Panel>
        )}
      </AnimatePresence>

      {phase === "running" && <ChatBubbles messages={SALA_MESSAGES} />}
    </main>
  )
}
