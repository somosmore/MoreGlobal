import { useRef, useState } from "react"
import { Download, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

type UppPdfExportProps = {
  price?: string | null
  loading?: boolean
}

const BENEFITS = [
  "9 módulos de formación estratégica (video + material PDF)",
  "4 talleres prácticos en vivo con retroalimentación en tiempo real",
  "4 sesiones de coaching 1:1 con un especialista",
  "Guías, plantillas y checklists de implementación",
  "Acceso a comunidad privada de profesionales",
  "Ruta clara de 90–120 días hasta la petición",
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
      "Lo mejor del UPP es que te da la estructura para avanzar sin depender de nadie. Las sesiones de coaching fueron clave para mi aprobación.",
  },
  {
    name: "María V.",
    role: "Investigadora PhD · Colombia",
    quote:
      "Tenía publicaciones y citas pero no sabía cómo articularlas en un caso EB-2 NIW. El UPP me dio la estructura exacta para presentar mi impacto.",
  },
]

const MODULES_SHORT = [
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

function s(styles: React.CSSProperties): React.CSSProperties {
  return styles
}

export function UppPdfExport({ price, loading }: UppPdfExportProps) {
  const templateRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)

  const effectivePrice = price || "$2,500"

  const handleExport = async () => {
    if (!templateRef.current || generating) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(templateRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

      const pdfWidth = 210
      const pdfHeight = 297
      const imgRatio = canvas.width / canvas.height
      const pdfImgWidth = pdfWidth
      const pdfImgHeight = pdfWidth / imgRatio

      let heightLeft = pdfImgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, pdfImgWidth, pdfImgHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position -= pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, pdfImgWidth, pdfImgHeight)
        heightLeft -= pdfHeight
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

      {/* ── Off-screen brochure template (794px = A4 @ 96 dpi) ── */}
      <div
        ref={templateRef}
        aria-hidden
        style={s({
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "794px",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          color: "#111827",
        })}
      >
        {/* ── HEADER ── */}
        <div
          style={s({
            background: "#0A3161",
            padding: "26px 40px 22px",
            display: "flex",
            alignItems: "center",
          })}
        >
          <div>
            <div
              style={s({
                fontSize: "22px",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
              })}
            >
              MORE
            </div>
            <div
              style={s({
                fontSize: "10px",
                color: "rgba(255,255,255,0.45)",
                marginTop: "2px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              })}
            >
              Consultoría de Inmigración
            </div>
          </div>
          <div style={s({ marginLeft: "auto" })}>
            <span
              style={s({
                display: "inline-block",
                background: "rgba(243,112,33,0.15)",
                border: "1px solid rgba(243,112,33,0.4)",
                borderRadius: "100px",
                padding: "5px 14px",
                fontSize: "10px",
                fontWeight: 700,
                color: "#F37021",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              })}
            >
              Programa guiado
            </span>
          </div>
        </div>

        {/* ── HERO ── */}
        <div style={s({ background: "#0A3161", padding: "30px 40px 44px" })}>
          <h1
            style={s({
              fontSize: "34px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              margin: "0 0 14px",
              maxWidth: "600px",
            })}
          >
            Convierte tu trayectoria en una{" "}
            <span style={s({ color: "#F37021" })}>Green Card EB-2 NIW aprobada</span>
          </h1>
          <p
            style={s({
              fontSize: "14px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: "530px",
            })}
          >
            El programa paso a paso para profesionales que quieren preparar su caso EB-2 NIW con
            estrategia, evidencia real y acompañamiento experto.
          </p>
        </div>

        {/* ── STATS BAR ── */}
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            background: "#F37021",
          })}
        >
          {[
            { value: "9", label: "Módulos completos" },
            { value: "4", label: "Talleres en vivo" },
            { value: "4", label: "Sesiones 1:1" },
            { value: "90–120", label: "Días hasta la petición" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={s({
                padding: "16px 10px",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.22)" : "none",
              })}
            >
              <div style={s({ fontSize: "24px", fontWeight: 800, color: "white" })}>
                {stat.value}
              </div>
              <div
                style={s({
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.85)",
                  marginTop: "3px",
                })}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── CONTENT GRID ── */}
        <div
          style={s({
            padding: "34px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 256px",
            gap: "30px",
            alignItems: "start",
          })}
        >
          {/* Left: benefits */}
          <div>
            <h2
              style={s({
                fontSize: "16px",
                fontWeight: 700,
                color: "#0A3161",
                margin: "0 0 14px",
              })}
            >
              Lo que incluye el programa
            </h2>
            <div style={s({ display: "flex", flexDirection: "column", gap: "9px" })}>
              {BENEFITS.map((b) => (
                <div
                  key={b}
                  style={s({ display: "flex", alignItems: "flex-start", gap: "9px" })}
                >
                  <span
                    style={s({
                      color: "#F37021",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0,
                      marginTop: "0px",
                    })}
                  >
                    ✓
                  </span>
                  <span style={s({ fontSize: "12.5px", color: "#374151", lineHeight: 1.55 })}>
                    {b}
                  </span>
                </div>
              ))}
            </div>

            {/* Modules compact list */}
            <h2
              style={s({
                fontSize: "15px",
                fontWeight: 700,
                color: "#0A3161",
                margin: "22px 0 10px",
              })}
            >
              Los 9 módulos
            </h2>
            <div style={s({ display: "flex", flexDirection: "column", gap: "5px" })}>
              {MODULES_SHORT.map((m) => (
                <div
                  key={m}
                  style={s({
                    fontSize: "11.5px",
                    color: "#6B7280",
                    padding: "5px 10px",
                    background: "#F9FAFB",
                    borderRadius: "6px",
                    borderLeft: "3px solid #F37021",
                  })}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Right: pricing card */}
          <div>
            <div
              style={s({
                background: "#0A3161",
                borderRadius: "16px",
                padding: "22px",
                color: "white",
              })}
            >
              <div
                style={s({
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "5px",
                })}
              >
                Inversión única
              </div>
              <div
                style={s({
                  fontSize: "40px",
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1,
                })}
              >
                {effectivePrice}
              </div>
              <div
                style={s({
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "16px",
                })}
              >
                USD · Pago único
              </div>

              <div
                style={s({
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: "8px",
                  padding: "9px 11px",
                  marginBottom: "14px",
                })}
              >
                <div
                  style={s({ fontSize: "11px", color: "rgba(134,239,172,1)", lineHeight: 1.55 })}
                >
                  🛡️ Garantía de 7 días · 100% de devolución si no estás satisfecho.
                </div>
              </div>

              <div
                style={s({ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 })}
              >
                Plazas limitadas para garantizar la calidad del acompañamiento.
              </div>
            </div>

            {/* Bonus tag */}
            <div
              style={s({
                marginTop: "12px",
                background: "rgba(243,112,33,0.07)",
                border: "1px solid rgba(243,112,33,0.2)",
                borderRadius: "12px",
                padding: "14px",
              })}
            >
              <div
                style={s({
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#F37021",
                  marginBottom: "8px",
                })}
              >
                🎁 Bonos incluidos
              </div>
              {[
                "Revisión Estratégica de Expediente",
                "Mentoría IA aplicada al caso",
                "Sesión VIP 1:1 con Ivon More",
                "Coaching grupal de acompañamiento",
              ].map((bonus) => (
                <div
                  key={bonus}
                  style={s({
                    fontSize: "11px",
                    color: "#92400E",
                    marginBottom: "4px",
                    paddingLeft: "10px",
                    borderLeft: "2px solid #F37021",
                  })}
                >
                  {bonus}
                </div>
              ))}
              <div
                style={s({
                  marginTop: "10px",
                  fontSize: "11px",
                  color: "#9CA3AF",
                  textDecoration: "line-through",
                })}
              >
                Valor: $1,500 USD
              </div>
              <div
                style={s({ fontSize: "13px", fontWeight: 700, color: "#F37021" })}
              >
                GRATIS con pago único
              </div>
            </div>
          </div>
        </div>

        {/* ── TESTIMONIALS ── */}
        <div
          style={s({
            background: "#F9FAFB",
            padding: "26px 40px",
            borderTop: "1px solid #F3F4F6",
          })}
        >
          <h2
            style={s({
              fontSize: "15px",
              fontWeight: 700,
              color: "#0A3161",
              textAlign: "center",
              margin: "0 0 16px",
            })}
          >
            Profesionales que ya lo lograron
          </h2>
          <div style={s({ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" })}>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={s({
                  background: "white",
                  borderRadius: "10px",
                  padding: "14px",
                  border: "1px solid #E5E7EB",
                })}
              >
                <div style={s({ fontSize: "12px", color: "#F59E0B", marginBottom: "7px" })}>
                  ★★★★★
                </div>
                <p
                  style={s({
                    fontSize: "11px",
                    color: "#4B5563",
                    fontStyle: "italic",
                    margin: "0 0 9px",
                    lineHeight: 1.55,
                  })}
                >
                  "{t.quote}"
                </p>
                <div style={s({ fontSize: "11px", fontWeight: 600, color: "#0A3161" })}>
                  {t.name}
                </div>
                <div style={s({ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" })}>
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER CTA ── */}
        <div
          style={s({
            background: "#0A3161",
            padding: "28px 40px",
            textAlign: "center",
          })}
        >
          <p
            style={s({
              fontSize: "18px",
              fontWeight: 700,
              color: "white",
              margin: "0 0 6px",
            })}
          >
            ¿Listo para empezar tu ruta a la Green Card?
          </p>
          <p
            style={s({
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              margin: "0 0 18px",
            })}
          >
            Escríbenos hoy y da el primer paso con un asesor especializado
          </p>
          <div
            style={s({
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#25D366",
              borderRadius: "12px",
              padding: "11px 24px",
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
            })}
          >
            📱 WhatsApp: +57 313 221 9798
          </div>
          <p
            style={s({
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              margin: "14px 0 0",
            })}
          >
            more.com.co · Consultoría de Inmigración · EB-2 NIW
          </p>
        </div>
      </div>
    </>
  )
}
