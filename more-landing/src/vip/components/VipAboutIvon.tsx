import { motion } from "framer-motion"
import { Check, MessageCircle, Scale, Target } from "lucide-react"

const credibilityPoints = [
  "Experiencia migratoria personal, familiar y empresarial.",
  "Equipo de estrategas: no solo “papelería” ni abogado genérico.",
  "Casos aprobados en varias categorías y contextos.",
  "Enfoque de negocio aplicado a tu proyecto migratorio.",
] as const

const sessionFocus = [
  {
    icon: MessageCircle,
    title: "Tu historia real",
    text: "Proyecto y evidencias, no teoría genérica de visas.",
  },
  {
    icon: Scale,
    title: "Riesgos y tiempos",
    text: "Escenarios claros y qué esperar del proceso.",
  },
  {
    icon: Target,
    title: "La decisión de hoy",
    text: "Qué conviene hacer primero según tu perfil.",
  },
] as const

export const VipAboutIvon = () => {
  return (
    <motion.section
      className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-[0_20px_50px_-20px_rgba(42,58,74,0.15)] ring-1 ring-black/4"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      aria-labelledby="vip-about-ivon-heading"
    >
      <div className="h-1 w-full bg-linear-to-r from-orange via-orange-dark to-navy/40" aria-hidden />

      <div className="grid lg:grid-cols-12 lg:items-stretch">
        {/* Columna imagen — protagonista, sin cajas anidadas */}
        <div className="relative aspect-4/5 min-h-[300px] w-full lg:col-span-5 lg:aspect-auto lg:min-h-[min(100%,620px)]">
          <img
            src="/ivon.png"
            alt="Ivon More, fundadora y estratega migratoria en MORE"
            className="absolute inset-0 h-full w-full object-cover object-[center_top]"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/25 to-transparent lg:via-navy/15"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
            <p
              className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-orange-200/95"
              data-vip-eyebrow="true"
            >
              Fundadora & estratega · MORE
            </p>
            <p className="mt-2 font-sans text-2xl font-bold tracking-tight sm:text-3xl">Ivon More</p>
            <figure className="mt-5 hidden border-l-[3px] border-orange pl-4 sm:block">
              <blockquote className="text-sm font-normal leading-relaxed text-white/95">
                “No todos los perfiles encajan en una Green Card: mi trabajo es decirte con claridad qué
                sí podés construir y en qué plazo.”
              </blockquote>
            </figure>
          </div>
        </div>

        {/* Columna contenido */}
        <div className="flex flex-col justify-center gap-8 p-6 sm:p-9 lg:col-span-7 lg:gap-10 lg:p-12 lg:pl-10 xl:pl-14">
          <header className="space-y-4">
            <p
              className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-orange"
              data-vip-eyebrow="true"
            >
              Quién te acompaña en la llamada
            </p>
            <h2
              id="vip-about-ivon-heading"
              className="text-balance text-2xl font-semibold leading-snug text-navy sm:text-3xl lg:text-[1.75rem] lg:leading-tight xl:text-4xl"
            >
              Migración vivida en primera persona; hoy la encara con vos con método y sin venderte humo.
            </h2>
            <p className="max-w-xl font-sans text-[15px] leading-relaxed text-gray-600 sm:text-base">
              Soy mamá, esposa, profesional y empresaria. Cruzé migración familiar y de negocio sin un
              mapa claro y pagando errores caros. Eso es lo que alimenta cada diagnóstico: criterio
              real, no discurso comercial.
            </p>
          </header>

          <div>
            <p
              className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-navy/55"
              data-vip-eyebrow="true"
            >
              En la sesión VIP hablamos como pares sobre
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {sessionFocus.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-navy/8 bg-linear-to-b from-navy/4 to-white px-4 py-4 ring-1 ring-black/3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/12 text-orange">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="mt-3 font-sans text-sm font-semibold text-navy">{title}</p>
                  <p className="mt-1.5 font-sans text-xs leading-relaxed text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <ul className="grid gap-3 font-sans text-sm text-gray-800 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3 sm:text-[15px]">
            {credibilityPoints.map((line) => (
              <li key={line} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-white"
                  aria-hidden
                >
                  <Check className="h-4 w-4 stroke-3" />
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <aside className="rounded-2xl border border-navy/10 bg-navy/3 p-5 sm:p-6">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-navy/60">
              Cómo trabajamos en MORE
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-gray-700 sm:text-[15px]">
              Trabajamos con profesionales y empresarios de distintas industrias con una misma lógica:
              proyecto, evidencia y estrategia. Multidisciplina, diagnóstico honesto al inicio y cero
              guion de venta — si no hay encaje, te lo decimos.
            </p>
          </aside>

          <figure className="rounded-2xl border border-orange/20 bg-orange/6 p-5 sm:hidden">
            <blockquote className="text-center font-sans text-sm italic leading-relaxed text-navy">
              “No todos los perfiles encajan en una Green Card: mi trabajo es decirte con claridad qué
              sí podés construir y en qué plazo.”
            </blockquote>
            <figcaption className="mt-3 text-center font-sans text-xs font-semibold text-orange-dark">
              — Ivon More
            </figcaption>
          </figure>
        </div>
      </div>
    </motion.section>
  )
}
