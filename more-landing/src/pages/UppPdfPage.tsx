import { useEffect } from "react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { formatWhatsappDisplay } from "@/lib/whatsapp"

const modules = [
  { num: "01", title: "Evaluación de perfil y elegibilidad", value: "$500" },
  { num: "02", title: "Fundamentos de la EB-2 NIW", value: "$400" },
  { num: "03", title: "Diseño del proyecto de interés nacional", value: "$600" },
  { num: "04", title: "Construcción de evidencia", value: "$500" },
  { num: "05", title: "Narrativa profesional", value: "$400" },
  { num: "06", title: "Cartas de recomendación", value: "$500" },
  { num: "07", title: "Plan de negocio / Plan profesional", value: "$600" },
  { num: "08", title: "Preparación del expediente", value: "$400" },
  { num: "09", title: "Estrategia post-envío", value: "$500" },
]

const benefits = [
  "9 módulos de contenido estratégico",
  "4 talleres prácticos en vivo",
  "4 sesiones de coaching 1:1",
  "Guías y plantillas de implementación",
  "Comunidad privada de profesionales",
  "Ruta semanal de 90–120 días",
]

const bonuses = [
  { tag: "🔍", title: "Revisión Estratégica de Expediente", text: "Segunda mirada experta antes de presentar a USCIS." },
  { tag: "🤖", title: "Mentoría IA aplicada a tu caso", text: "Cómo usar IA correctamente para potenciar tu narrativa." },
  { tag: "👑", title: "Sesión VIP 1:1 con Ivon More", text: "Validación de tu propuesta de esfuerzo e interés nacional." },
  { tag: "🚀", title: "Coaching grupal de acompañamiento", text: "Espacios en vivo con el equipo MORE durante tu proceso." },
]

const PageHeader = ({ label }: { label: string }) => (
  <div style={{
    background: "white",
    padding: "18px 40px",
    borderBottom: "2px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}>
    <img src="/logo_more_dark.png" alt="MORE" style={{ height: 80, objectFit: "contain" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F37021" }} />
      <span style={{ color: "#2A3A4A", fontSize: 15, fontWeight: 600 }}>{label}</span>
    </div>
  </div>
)

const PageFooter = ({ right }: { right: string }) => (
  <div style={{
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    padding: "12px 40px",
    borderTop: "1px solid #e5e7eb",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src="/logo_more_dark.png" alt="MORE" style={{ height: 36, objectFit: "contain" }} />
      <span style={{ color: "#9ca3af", fontSize: 13 }}>|</span>
      <span style={{ color: "#6b7280", fontSize: 13 }}>Por Ivon More · Fundadora & Estratega EB-2 NIW</span>
    </div>
    <span style={{ color: "#9ca3af", fontSize: 13 }}>{right}</span>
  </div>
)

export default function UppPdfPage() {
  const { settings } = useSiteSettings()
  const whatsappDisplay = formatWhatsappDisplay(settings.whatsapp_number)

  useEffect(() => {
    document.title = "Unsung Professional Program | MORE"
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f0f0f0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .pdf-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 32px 16px;
        }
        .pdf-page {
          width: 794px;
          height: 1123px;
          background: white;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        }
        .print-btn {
          position: fixed;
          top: 20px; right: 20px;
          z-index: 100;
          background: #F37021;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(243,112,33,0.4);
        }
        .print-btn:hover { background: #D4611A; }
        @media print {
          body { background: white; }
          .pdf-wrapper { padding: 0; gap: 0; background: white; }
          .pdf-page {
            width: 210mm; height: 297mm;
            box-shadow: none;
            page-break-after: always;
          }
          .print-btn { display: none; }
        }
      `}</style>

      <button className="print-btn" onClick={() => window.print()}>
        ↓ Descargar PDF
      </button>

      <div className="pdf-wrapper">

        {/* ══════════════════════════════════════════
            PÁGINA 1 — PORTADA
        ══════════════════════════════════════════ */}
        <div className="pdf-page" style={{ background: "linear-gradient(135deg, #2A3A4A 0%, #1e2d3d 40%, #c45a10 80%, #F37021 100%)" }}>

          {/* Header */}
          <div style={{ padding: "24px 40px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <img src="/logo_more_light.png" alt="MORE" style={{ height: 80, objectFit: "contain" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Visa EB-2 NIW
            </span>
          </div>

          <div style={{ margin: "16px 40px 0", height: 2, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />

          {/* Main */}
          <div style={{ display: "flex", alignItems: "flex-start", padding: "20px 40px 0", gap: 28 }}>

            <div style={{ flex: 1 }}>
              {/* Category badge */}
              <div style={{ marginBottom: 10 }}>
                <span style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.75)",
                  padding: "5px 14px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  ⚡ Programa de autogestión · EB-2 NIW
                </span>
              </div>

              {/* Wordmark */}
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.35em", color: "rgba(255,255,255,0.45)", lineHeight: 1, marginBottom: 2 }}>
                UPP
              </div>
              <div style={{
                fontSize: 50,
                fontWeight: 900,
                letterSpacing: "0.03em",
                lineHeight: 1.05,
                background: "linear-gradient(90deg, #F37021 0%, #FFD166 60%, #F37021 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 16px rgba(243,112,33,0.5))",
                display: "inline-block",
              }}>
                UNSUNG<br />PROFESSIONAL
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 14 }}>
                <div style={{ width: 52, height: 3, background: "linear-gradient(90deg, #F37021, #FFD166)", borderRadius: 2 }} />
                <div style={{ width: 10, height: 3, background: "rgba(243,112,33,0.4)", borderRadius: 2 }} />
                <div style={{ width: 5, height: 3, background: "rgba(243,112,33,0.2)", borderRadius: 2 }} />
              </div>

              <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, lineHeight: 1.35, marginBottom: 10 }}>
                Convierte tu trayectoria en una<br />
                <span style={{ color: "#fca76a" }}>Green Card EB-2 NIW aprobada</span>
              </h1>

              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, lineHeight: 1.6, maxWidth: 320 }}>
                El programa paso a paso para preparar tu caso EB-2 NIW con estrategia, evidencia real y acompañamiento experto.
              </p>

              {/* Value stack */}
              <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(255,255,255,0.07)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  Valor real del programa
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 20, fontWeight: 700, textDecoration: "line-through" }}>$9,100</span>
                  <span style={{ color: "white", fontSize: 36, fontWeight: 900 }}>$2,500</span>
                  <span style={{ color: "#fca76a", fontSize: 18, fontWeight: 700 }}>USD</span>
                  <span style={{ background: "#F37021", color: "white", fontSize: 13, fontWeight: 800, padding: "4px 10px", borderRadius: 20 }}>
                    AHORRÁS $6,600+
                  </span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, marginTop: 4 }}>
                  Pago único · Garantía 7 días · Sin preguntas
                </div>
              </div>
            </div>

            {/* Image */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 200,
                height: 310,
                borderRadius: 16,
                overflow: "hidden",
                border: "3px solid rgba(243,112,33,0.45)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}>
                <img
                  src="/upp/portada-upp.png"
                  alt="Unsung Professional Program"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, padding: "18px 40px 0" }}>
            {[
              { value: "9", label: "Módulos completos" },
              { value: "4", label: "Talleres en vivo" },
              { value: "4", label: "Sesiones 1:1" },
              { value: "90–120", label: "Días hasta petición" },
            ].map(({ value, label }) => (
              <div key={label} style={{
                flex: 1,
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
              }}>
                <div style={{ color: "white", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginTop: 5, lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div style={{ margin: "14px 40px 0", padding: "14px 18px", background: "rgba(255,255,255,0.06)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Por qué funciona
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["+200 estudiantes", "Método probado", "Coaching 1:1", "Plantillas listas", "Comunidad activa"].map((item) => (
                <span key={item} style={{ color: "rgba(255,255,255,0.82)", fontSize: 18, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#fca76a", fontWeight: 700 }}>✓</span> {item}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            background: "#F37021",
            padding: "13px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
              Garantía 7 días · Devolución del 100% sin preguntas
            </span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
              {whatsappDisplay}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            PÁGINA 2 — 9 MÓDULOS + QUÉ INCLUYE
        ══════════════════════════════════════════ */}
        <div className="pdf-page" style={{ background: "#fafafa" }}>
          <PageHeader label="Unsung Professional Program" />

          <div style={{ padding: "24px 40px 0", display: "flex", gap: 24 }}>

            {/* 9 Modules — left column */}
            <div style={{ flex: 1.15 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 5, height: 24, background: "#F37021", borderRadius: 2 }} />
                <h2 style={{ color: "#2A3A4A", fontSize: 22, fontWeight: 800 }}>9 Módulos del programa</h2>
                <span style={{ marginLeft: "auto", background: "#2A3A4A", color: "white", fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  Valor $4,200
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {modules.map((m) => (
                  <div key={m.num} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "white", borderRadius: 8, border: "1px solid #ebebeb" }}>
                    <span style={{ color: "#F37021", fontSize: 14, fontWeight: 800, flexShrink: 0, width: 24 }}>{m.num}</span>
                    <span style={{ color: "#374151", fontSize: 18, fontWeight: 500, flex: 1 }}>{m.title}</span>
                    <span style={{ color: "#9ca3af", fontSize: 15, flexShrink: 0 }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: includes + social proof */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 5, height: 24, background: "#F37021", borderRadius: 2 }} />
                <h2 style={{ color: "#2A3A4A", fontSize: 22, fontWeight: 800 }}>Qué incluye</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {benefits.map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "white", borderRadius: 8, border: "1px solid #ebebeb" }}>
                    <span style={{ color: "#F37021", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#374151", fontSize: 18, fontWeight: 500 }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div style={{ padding: "20px", background: "linear-gradient(135deg, #2A3A4A, #1e2d3d)", borderRadius: 12 }}>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Casos reales
                </p>
                <p style={{ color: "white", fontSize: 17, lineHeight: 1.65, fontStyle: "italic" }}>
                  "El módulo de construcción de evidencia cambió todo. Descubrí que mi trabajo tenía mucho más impacto del que creía."
                </p>
                <p style={{ color: "#fca76a", fontSize: 15, fontWeight: 700, marginTop: 10 }}>
                  — Roberto L., Ing. Software · México
                </p>
              </div>
            </div>
          </div>

          <PageFooter right="Página 2 de 3" />
        </div>

        {/* ══════════════════════════════════════════
            PÁGINA 3 — BONOS + PRECIO + CTA
        ══════════════════════════════════════════ */}
        <div className="pdf-page" style={{ background: "#fafafa" }}>
          <PageHeader label="Unsung Professional Program" />

          <div style={{ padding: "24px 40px 0" }}>

            {/* Bonuses */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 5, height: 24, background: "#F37021", borderRadius: 2 }} />
                <h2 style={{ color: "#2A3A4A", fontSize: 22, fontWeight: 800 }}>4 Bonos incluidos con pago único</h2>
                <span style={{ marginLeft: "auto", background: "#F37021", color: "white", fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>
                  $1,500 GRATIS
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {bonuses.map((b) => (
                  <div key={b.title} style={{ display: "flex", gap: 14, padding: "16px 18px", background: "white", borderRadius: 10, border: "1px solid #ebebeb", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{b.tag}</span>
                    <div>
                      <div style={{ color: "#1f2937", fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{b.title}</div>
                      <div style={{ color: "#6b7280", fontSize: 16, marginTop: 4, lineHeight: 1.5 }}>{b.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing — two plans */}
            <div style={{
              background: "linear-gradient(135deg, #2A3A4A 0%, #1e2d3d 100%)",
              borderRadius: 16,
              padding: "28px 28px",
              display: "flex",
              gap: 16,
            }}>
              {/* Plan 1 */}
              <div style={{ flex: 1, background: "rgba(243,112,33,0.15)", border: "1.5px solid rgba(243,112,33,0.5)", borderRadius: 12, padding: "20px 20px", position: "relative" }}>
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#F37021", color: "white", fontSize: 13, fontWeight: 800, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  ⭐ RECOMENDADO
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                  Pago único
                </div>
                <div style={{ color: "white", fontSize: 40, fontWeight: 900, lineHeight: 1 }}>$2,500</div>
                <div style={{ color: "#fca76a", fontSize: 18, fontWeight: 600, marginTop: 4 }}>USD · Un solo pago</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginTop: 4, textDecoration: "line-through" }}>Valor total $10,600</div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                  {["Programa completo", "Todos los bonos (×4)", "Stack $1,500 GRATIS"].map((i) => (
                    <div key={i} style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, display: "flex", gap: 8 }}>
                      <span style={{ color: "#fca76a" }}>✓</span> {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan 2 */}
              <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "20px 20px" }}>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                  Pago en 2 cuotas
                </div>
                <div style={{ color: "white", fontSize: 30, fontWeight: 900, lineHeight: 1 }}>2 × $1,250</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, fontWeight: 600, marginTop: 4 }}>USD · Total $2,500</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, marginTop: 4 }}>Sin intereses</div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                  {["Programa completo", "🔍 Bono 1 incluido"].map((i) => (
                    <div key={i} style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, display: "flex", gap: 8 }}>
                      <span style={{ color: "#fca76a" }}>✓</span> {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA + guarantee */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
                <div style={{ padding: "18px 16px", background: "#F37021", borderRadius: 12, textAlign: "center" }}>
                  <p style={{ color: "white", fontSize: 20, fontWeight: 800 }}>Inscribirme al UPP →</p>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginTop: 4 }}>{whatsappDisplay}</p>
                </div>
                <div style={{ padding: "14px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                  <div style={{ color: "#fca76a", fontSize: 18, fontWeight: 700 }}>🛡 Garantía 7 días</div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, marginTop: 4 }}>Devolución 100% sin preguntas</div>
                </div>
              </div>
            </div>

          </div>

          <PageFooter right="Página 3 de 3" />
        </div>

      </div>
    </>
  )
}
