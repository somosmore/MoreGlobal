import { useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import {
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Link2,
  MessageCircle,
  Presentation,
  Timer,
  Users,
  Briefcase,
} from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { buildWhatsappUrl } from "@/lib/whatsapp"
import { COMUNIDAD_FACEBOOK_GROUP_URL } from "@/components/sections/comunidad/CMFacebookJoinCard"
import { getActiveEvent, PUBLIC_ORIGIN } from "@/lib/eventKit"
import { cn } from "@/lib/utils"

/**
 * Kit del evento (`/admin/evento`): todos los links que hacen falta para operar
 * el webinar activo, con Copiar y Abrir. Los precios y links de pago salen de
 * `site_settings`; la estructura del evento, de `lib/eventKit.ts`.
 */

const UTM_SOURCES = [
  { label: "Meta Ads", source: "facebook", medium: "paid" },
  { label: "Grupo de Facebook", source: "facebook", medium: "community" },
  { label: "WhatsApp", source: "whatsapp", medium: "message" },
  { label: "Correo", source: "email", medium: "email" },
  { label: "Instagram (orgánico)", source: "instagram", medium: "social" },
] as const

function CopyButton({ value, disabled }: { value: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border bg-admin-subtle px-2.5 py-1.5 text-xs font-semibold text-admin-text hover:border-orange disabled:cursor-not-allowed disabled:opacity-40"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  )
}

function Resource({
  title,
  note,
  value,
  href,
  pending,
  badge,
}: {
  title: string
  note?: string
  value: string
  href?: string
  pending?: string
  badge?: ReactNode
}) {
  return (
    <li className={cn("rounded-admin border border-admin-border bg-admin-elevated p-4", pending && "opacity-70")}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-semibold text-admin-text">
            {title} {badge}
          </p>
          {note && <p className="mt-0.5 text-sm text-admin-faint">{note}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <CopyButton value={value} disabled={!!pending} />
          {href && !pending && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border bg-admin-subtle px-2.5 py-1.5 text-xs font-semibold text-admin-text hover:border-orange"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Abrir
            </a>
          )}
        </div>
      </div>
      <p className={cn("mt-2 truncate font-mono text-xs", pending ? "text-amber-600" : "text-orange-dark")}>
        {pending ?? value}
      </p>
    </li>
  )
}

function Block({ icon: Icon, title, children }: { icon: typeof Users; title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-admin-faint">
        <Icon className="h-4 w-4 text-orange" /> {title}
      </h2>
      <ul className="grid gap-3 lg:grid-cols-2">{children}</ul>
    </section>
  )
}

export default function AdminEventoKit() {
  const event = getActiveEvent()
  const { settings } = useSiteSettings()
  const [utmIndex, setUtmIndex] = useState(0)
  const [utmContent, setUtmContent] = useState("")

  const utmUrl = useMemo(() => {
    const s = UTM_SOURCES[utmIndex]
    const url = new URL(event.utmBasePath, PUBLIC_ORIGIN)
    url.searchParams.set("utm_source", s.source)
    url.searchParams.set("utm_medium", s.medium)
    url.searchParams.set("utm_campaign", event.utmCampaign)
    const content = utmContent.trim().toLowerCase().replace(/\s+/g, "-")
    if (content) url.searchParams.set("utm_content", content)
    return url.toString()
  }, [event, utmIndex, utmContent])

  const whatsappUrl = buildWhatsappUrl(settings.whatsapp_number)
  const salaUrl = `${window.location.origin}/admin/sala`

  return (
    <div className="min-h-full bg-admin-app">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-admin border border-admin-border bg-admin-subtle">
              <Briefcase className="h-5 w-5 text-orange" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-admin-text">Kit del evento</h1>
              <p className="text-sm text-admin-faint">
                {event.name} · {event.dateLabel}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/sala"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-orange px-4 py-2 text-sm font-bold text-white hover:bg-orange-dark"
            >
              <Timer className="h-4 w-4" /> Abrir sala de espera
            </Link>
            {event.adminPath && (
              <Link
                to={event.adminPath}
                className="inline-flex items-center gap-2 rounded-xl border border-admin-border bg-admin-elevated px-4 py-2 text-sm font-semibold text-admin-text hover:border-orange"
              >
                <Users className="h-4 w-4" /> Ver inscritos
              </Link>
            )}
          </div>
        </div>

        <Block icon={Presentation} title="Páginas del evento">
          {event.pages.map((p) => (
            <Resource key={p.path} title={p.label} note={p.note} value={`${PUBLIC_ORIGIN}${p.path}`} href={`${PUBLIC_ORIGIN}${p.path}`} />
          ))}
        </Block>

        <Block icon={CreditCard} title="Links de pago">
          {event.tickets.map((t) => {
            const link = settings[t.linkKey].trim()
            const price = settings[t.priceKey].trim()
            return (
              <Resource
                key={t.linkKey}
                title={`${t.label} · ${t.audience}`}
                badge={
                  <span className="rounded-full bg-orange/10 px-2 py-0.5 text-xs font-bold text-orange-dark">
                    {price || "Sin precio"}
                  </span>
                }
                value={link}
                href={link}
                pending={link ? undefined : "Falta cargar el link en Configuración → Taller Comunidad"}
              />
            )
          })}
        </Block>

        {event.tickets.some((t) => t.thanksPath) && (
          <Block icon={Link2} title="Redirección después del pago (para GHL)">
            {event.tickets
              .filter((t) => t.thanksPath)
              .map((t) => (
                <Resource
                  key={`${t.linkKey}-thanks`}
                  title={`${t.label} · ${t.audience}`}
                  note="Pegar en la redirección del payment link."
                  value={`${PUBLIC_ORIGIN}${t.thanksPath}`}
                />
              ))}
          </Block>
        )}

        <Block icon={Timer} title="Transmisión">
          <Resource
            title="Sala de espera (cuenta regresiva)"
            note="Para compartir en Zoom antes de empezar. Eliges los minutos y arranca con Espacio. Requiere sesión del admin."
            value={salaUrl}
            href="/admin/sala"
          />
          <Resource
            title="Link de Zoom"
            value=""
            pending="Todavía no se guarda en el sistema: pégalo en el correo y WhatsApp de acceso."
          />
        </Block>

        <Block icon={MessageCircle} title="Contacto y comunidad">
          <Resource
            title="WhatsApp de MORE"
            note={`Número cargado en Configuración → Contacto: ${settings.whatsapp_number || "sin número"}`}
            value={whatsappUrl}
            href={whatsappUrl}
          />
          <Resource title="Grupo de Facebook · Comunidad More" value={COMUNIDAD_FACEBOOK_GROUP_URL} href={COMUNIDAD_FACEBOOK_GROUP_URL} />
        </Block>

        <section className="mt-8 rounded-admin border border-admin-border bg-admin-elevated p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-admin-faint">
            <Link2 className="h-4 w-4 text-orange" /> Generador de UTMs
          </h2>
          <p className="mt-1 text-sm text-admin-faint">
            Usa un link distinto por canal para saber de dónde llegan los inscritos.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {UTM_SOURCES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setUtmIndex(i)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  i === utmIndex ? "border-orange bg-orange text-white" : "border-admin-border text-admin-text hover:border-orange",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="mt-4 block text-sm">
            <span className="text-admin-faint">Detalle opcional (utm_content), por ejemplo: anuncio-video-1</span>
            <input
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-admin-border bg-admin-subtle px-3 py-2 text-sm text-admin-text outline-none focus:border-orange"
            />
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 truncate rounded-lg bg-admin-subtle px-3 py-2 text-xs text-orange-dark">{utmUrl}</code>
            <CopyButton value={utmUrl} />
          </div>
        </section>
      </div>
    </div>
  )
}
