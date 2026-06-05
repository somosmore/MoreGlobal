import { useRef, useState } from "react"
import { Download, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

type UppPdfExportProps = {
  price?: string | null
  loading?: boolean
}

// html2canvas does not reliably support CSS Grid — use only flex + explicit widths
const FF = "Inter, system-ui, -apple-system, sans-serif"

const BENEFITS = [
  "9 módulos de formación estratégica (video + material PDF)",
  "4 talleres prácticos en vivo con retroalimentación en tiempo real",
  "4 sesiones de coaching 1:1 con un especialista",
  "Guías, plantillas y checklists de implementación",
  "Acceso a comunidad privada de profesionales",
  "Ruta clara de 90–120 días hasta la petición",
]

const MODULES = [
  "01 · Evaluación de perfil y elegibilidad",
  "02 · Fundamentos de la EB-2 NIW",
  "03 · Diseño del proyecto de interés nacional",
  "04 · Construcción de evidencia",
  "05 · Narrativa profesional",
  "06 · Cartas de recomendación",
  "07 · Plan de negocio / Plan profesional",
  "08 · Preparación del expediente",
  "09 · Estrategia post-envío",
]

const BONUSES = [
  "Revisión Estratégica de Expediente",
  "Mentoría: IA aplicada al caso",
  "Sesión VIP 1:1 con Ivon More",
  "Coaching grupal de acompañamiento",
]

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    role: "Médico especialista · Venezuela",
    quote:
      "Pensé que sin un PhD no tenía oportunidad. El programa me ayudó a construir un caso tan sólido que fue aprobado en 4 meses.",
  },
  {
    name: "Ana P.",
    role: "Empresaria · Colombia",
    quote:
      "Lo mejor del UPP es que te da la estructura para avanzar. Las sesiones de coaching 1:1 fueron clave para mi aprobación.",
  },
  {
    name: "María V.",
    role: "Investigadora PhD · Colombia",
    quote:
      "El UPP me dio la estructura exacta para presentar mi impacto de forma que USCIS pudiera valorarlo correctamente.",
  },
]

const STATS = [
  { value: "9", label: "Módulos completos" },
  { value: "4", label: "Talleres en vivo" },
  { value: "4", label: "Sesiones 1:1" },
  { value: "90-120", label: "Días hasta la petición" },
]

export function UppPdfExport({ price, loading }: UppPdfExportProps) {
  const templateRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)
  const effectivePrice = price || "$2,500"

  const handleExport = async () => {
    if (!templateRef.current || generating) return
    setGenerating(true)
    try {
      // Wait for all images inside the template to fully load
      const imgs = Array.from(templateRef.current.querySelectorAll("img"))
      await Promise.all(
        imgs.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((res) => {
                  img.onload = () => res()
                  img.onerror = () => res()
                })
        )
      )

      const canvas = await html2canvas(templateRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 8000,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

      const PAGE_W = 210
      const PAGE_H = 297
      const imgH = PAGE_W * (canvas.height / canvas.width)

      let remaining = imgH
      let pos = 0

      pdf.addImage(imgData, "PNG", 0, pos, PAGE_W, imgH)
      remaining -= PAGE_H

      while (remaining > 0) {
        pos -= PAGE_H
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, pos, PAGE_W, imgH)
        remaining -= PAGE_H
      }

      pdf.save("UPP-Unsung-Professional-MORE.pdf")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      {/* ── Visible download button ── */}
      <button
        onClick={handleExport}
        disabled={generating || !!loading}
        className="inline-flex items-center gap-2 rounded-xl border border-[#0A3161]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0A3161] shadow-sm transition-all hover:border-orange/40 hover:bg-orange/5 hover:text-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {generating ? "Generando PDF…" : "Descargar brochure PDF"}
      </button>

      {/* ══════════════════════════════════════════════════════════════════
          Off-screen brochure template — 794 px wide (A4 @ 96 dpi)
          IMPORTANT: use only display:flex + explicit widths. NO CSS Grid —
          html2canvas does not reliably render grid-template-columns.
         ══════════════════════════════════════════════════════════════════ */}
      <div
        ref={templateRef}
        aria-hidden
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "794px",
          backgroundColor: "#ffffff",
          fontFamily: FF,
          lineHeight: "normal",
        }}
      >
        {/* ── HEADER ────────────────────────────────────────────── */}
        <div
          style={{
            background: "#0A3161",
            padding: "18px 36px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/logo_more_light.png"
            alt="MORE"
            style={{ height: "32px", width: "auto", display: "block" }}
            crossOrigin="anonymous"
          />
          <div style={{ marginLeft: "auto", flexShrink: 0 }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(243,112,33,0.15)",
                border: "1px solid rgba(243,112,33,0.45)",
                borderRadius: "100px",
                padding: "4px 13px",
                fontSize: "9.5px",
                fontWeight: 700,
                color: "#F37021",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontFamily: FF,
              }}
            >
              Programa guiado
            </span>
          </div>
        </div>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div style={{ background: "#0A3161", padding: "24px 36px 32px" }}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "white",
              lineHeight: "1.15",
              margin: "0 0 10px 0",
              padding: 0,
              fontFamily: FF,
              maxWidth: "580px",
            }}
          >
            Convierte tu trayectoria en una{" "}
            <span style={{ color: "#F37021" }}>Green Card EB-2 NIW aprobada</span>
          </h1>
          <p
            style={{
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.72)",
              lineHeight: "1.6",
              margin: 0,
              padding: 0,
              fontFamily: FF,
              maxWidth: "500px",
            }}
          >
            El programa paso a paso para profesionales que quieren preparar su caso EB-2 NIW con
            estrategia, evidencia real y acompañamiento experto.
          </p>
        </div>

        {/* ── STATS BAR — flex, NOT grid ────────────────────────── */}
        <div style={{ display: "flex", background: "#F37021" }}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: "1 1 0",
                padding: "14px 8px",
                textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.22)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "white",
                  margin: 0,
                  padding: 0,
                  fontFamily: FF,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.88)",
                  margin: "3px 0 0 0",
                  padding: 0,
                  fontFamily: FF,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN CONTENT — two columns via flex ──────────────── */}
        <div style={{ padding: "26px 36px", display: "flex", gap: "22px", alignItems: "flex-start" }}>
          {/* LEFT: benefits + modules */}
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <h2
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0A3161",
                margin: "0 0 10px 0",
                padding: 0,
                fontFamily: FF,
              }}
            >
              Lo que incluye el programa
            </h2>

            {BENEFITS.map((b) => (
              <div
                key={b}
                style={{ display: "flex", alignItems: "flex-start", gap: "7px", margin: "0 0 6px 0" }}
              >
                <span
                  style={{
                    color: "#F37021",
                    fontWeight: 700,
                    fontSize: "12px",
                    lineHeight: "1.5",
                    flexShrink: 0,
                    fontFamily: FF,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: "11.5px",
                    color: "#374151",
                    lineHeight: "1.5",
                    margin: 0,
                    padding: 0,
                    fontFamily: FF,
                  }}
                >
                  {b}
                </span>
              </div>
            ))}

            <h2
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0A3161",
                margin: "18px 0 7px 0",
                padding: 0,
                fontFamily: FF,
              }}
            >
              Los 9 módulos
            </h2>

            {MODULES.map((m) => (
              <div
                key={m}
                style={{
                  fontSize: "10.5px",
                  color: "#6B7280",
                  padding: "3px 8px",
                  background: "#F9FAFB",
                  borderRadius: "4px",
                  borderLeft: "3px solid #F37021",
                  margin: "0 0 3px 0",
                  textAlign: "left",
                  fontFamily: FF,
                  lineHeight: "1.5",
                }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* RIGHT: pricing + bonuses */}
          <div style={{ width: "240px", flexShrink: 0 }}>
            {/* Pricing card */}
            <div
              style={{
                background: "#0A3161",
                borderRadius: "12px",
                padding: "18px",
                margin: "0 0 10px 0",
              }}
            >
              <div
                style={{
                  fontSize: "8.5px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.5)",
                  margin: "0 0 4px 0",
                  padding: 0,
                  fontFamily: FF,
                }}
              >
                Inversión única
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "white",
                  lineHeight: "1",
                  margin: 0,
                  padding: 0,
                  fontFamily: FF,
                }}
              >
                {effectivePrice}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.4)",
                  margin: "2px 0 12px 0",
                  padding: 0,
                  fontFamily: FF,
                }}
              >
                USD · Pago único
              </div>
              <div
                style={{
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: "7px",
                  padding: "7px 9px",
                  margin: "0 0 10px 0",
                }}
              >
                <div
                  style={{
                    fontSize: "9.5px",
                    color: "#86EFAC",
                    lineHeight: "1.5",
                    margin: 0,
                    padding: 0,
                    fontFamily: FF,
                  }}
                >
                  Garantia de 7 dias — 100% de devolucion si no estas satisfecho.
                </div>
              </div>
              <div
                style={{
                  fontSize: "9.5px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: "1.5",
                  margin: 0,
                  padding: 0,
                  fontFamily: FF,
                }}
              >
                Plazas limitadas para garantizar la calidad del acompañamiento.
              </div>
            </div>

            {/* Bonuses card */}
            <div
              style={{
                background: "rgba(243,112,33,0.07)",
                border: "1px solid rgba(243,112,33,0.2)",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "8.5px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#F37021",
                  margin: "0 0 7px 0",
                  padding: 0,
                  fontFamily: FF,
                }}
              >
                Bonos incluidos
              </div>
              {BONUSES.map((bonus) => (
                <div
                  key={bonus}
                  style={{
                    fontSize: "9.5px",
                    color: "#92400E",
                    paddingLeft: "7px",
                    borderLeft: "2px solid #F37021",
                    margin: "0 0 4px 0",
                    lineHeight: "1.4",
                    fontFamily: FF,
                  }}
                >
                  {bonus}
                </div>
              ))}
              <div
                style={{
                  margin: "8px 0 0 0",
                  paddingTop: "7px",
                  borderTop: "1px solid rgba(243,112,33,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "9.5px",
                    color: "#9CA3AF",
                    textDecoration: "line-through",
                    margin: 0,
                    padding: 0,
                    fontFamily: FF,
                  }}
                >
                  Valor: $1,500 USD
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#F37021",
                    margin: "2px 0 0 0",
                    padding: 0,
                    fontFamily: FF,
                  }}
                >
                  GRATIS con pago unico
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── IVON SECTION ─────────────────────────────────────── */}
        <div
          style={{
            background: "#F0F4FA",
            padding: "20px 36px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <img
            src="/ivon.png"
            alt="Ivon More"
            crossOrigin="anonymous"
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              display: "block",
              border: "3px solid #F37021",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0A3161",
                margin: 0,
                padding: 0,
                fontFamily: FF,
              }}
            >
              Ivon More
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#F37021",
                fontWeight: 600,
                margin: "2px 0 5px 0",
                padding: 0,
                fontFamily: FF,
              }}
            >
              Fundadora de MORE · Experta EB-2 NIW
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#4B5563",
                lineHeight: "1.55",
                margin: 0,
                padding: 0,
                fontFamily: FF,
              }}
            >
              +200 profesionales acompañados hacia la Green Card. Estratega certificada en
              inmigración para talentos extraordinarios con impacto nacional en EE.UU.
            </div>
          </div>
        </div>

        {/* ── TESTIMONIALS — flex, NOT grid ────────────────────── */}
        <div
          style={{
            background: "#F9FAFB",
            padding: "20px 36px",
            borderTop: "1px solid #F3F4F6",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0A3161",
              textAlign: "center",
              margin: "0 0 14px 0",
              padding: 0,
              fontFamily: FF,
            }}
          >
            Profesionales que ya lo lograron
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  flex: "1 1 0",
                  background: "white",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#F59E0B",
                    margin: "0 0 5px 0",
                    padding: 0,
                    fontFamily: FF,
                  }}
                >
                  ★★★★★
                </div>
                <p
                  style={{
                    fontSize: "10px",
                    color: "#4B5563",
                    fontStyle: "italic",
                    margin: "0 0 7px 0",
                    padding: 0,
                    lineHeight: "1.5",
                    fontFamily: FF,
                  }}
                >
                  "{t.quote}"
                </p>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#0A3161",
                    margin: 0,
                    padding: 0,
                    fontFamily: FF,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: "9.5px",
                    color: "#9CA3AF",
                    margin: "2px 0 0 0",
                    padding: 0,
                    fontFamily: FF,
                  }}
                >
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER CTA ───────────────────────────────────────── */}
        <div
          style={{
            background: "#0A3161",
            padding: "22px 36px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "white",
              margin: "0 0 5px 0",
              padding: 0,
              fontFamily: FF,
            }}
          >
            ¿Listo para empezar tu ruta a la Green Card?
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              margin: "0 0 14px 0",
              padding: 0,
              fontFamily: FF,
            }}
          >
            Escribenos hoy y da el primer paso con un asesor especializado
          </p>
          <div
            style={{
              display: "inline-block",
              background: "#25D366",
              borderRadius: "10px",
              padding: "10px 22px",
              color: "white",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: FF,
            }}
          >
            WhatsApp: +57 313 221 9798
          </div>
          <p
            style={{
              fontSize: "9.5px",
              color: "rgba(255,255,255,0.35)",
              margin: "12px 0 0 0",
              padding: 0,
              fontFamily: FF,
            }}
          >
            more.com.co · Consultoria de Inmigracion · EB-2 NIW
          </p>
        </div>
      </div>
    </>
  )
}
