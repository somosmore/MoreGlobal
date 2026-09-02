import { useEffect } from "react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { formatWhatsappDisplay } from "@/lib/whatsapp"

const includes = [
  "Estrategia del caso personalizada",
  "Declaración profesional revisada",
  "Sesión de Interés Nacional",
  "Plan Profesional elaborado por MORE",
  "Presentación ejecutiva profesional",
  "Formularios USCIS completados",
  "4 cartas redactadas por MORE",
  "Cover Letter + lista de Exhibits",
  "Consolidación y envío a USCIS",
  "Estrategia de relacionamiento",
  "Guía práctica 90 días en EE.UU.",
  "Acceso a MORE Academy",
]

const phases = [
  { num: "01", label: "Inducción y\nDiagnóstico", weeks: "Sem 1-2" },
  { num: "02", label: "Declaración\nProfesional", weeks: "Sem 3-4" },
  { num: "03", label: "Propuesta de\nEsfuerzo", weeks: "Sem 5-6" },
  { num: "04", label: "Evidencias y\nPresentación", weeks: "Sem 7-8" },
  { num: "05", label: "Plan de\nImplementación", weeks: "Sem 9-11" },
  { num: "06", label: "Cover Letter\ny Exhibits", weeks: "Sem 12-15" },
  { num: "07", label: "Envío Final\na USCIS", weeks: "Sem 16" },
]

const PageHeader = ({ logo, label }: { logo: string; label: string }) => (
  <div style={{
    background: "white",
    padding: "18px 40px",
    borderBottom: "2px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}>
    <img src={logo} alt="MORE" style={{ height: 80, objectFit: "contain" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F37021" }} />
      <span style={{ color: "#2A3A4A", fontSize: 15, fontWeight: 600 }}>{label}</span>
    </div>
  </div>
)

const PageFooter = ({ left, right }: { left: string; right: string }) => (
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
      <span style={{ color: "#6b7280", fontSize: 13 }}>{left}</span>
    </div>
    <span style={{ color: "#9ca3af", fontSize: 13 }}>{right}</span>
  </div>
)

export default function TurboPdfPage() {
  const { settings } = useSiteSettings()
  const whatsappDisplay = formatWhatsappDisplay(settings.whatsapp_number)

  useEffect(() => {
    document.title = "Plan Turbo EB-2 NIW — MORE"
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

          {/* Badge */}
          <div style={{ margin: "20px 40px 0" }}>
            <span style={{
              background: "rgba(243,112,33,0.25)",
              border: "1px solid rgba(243,112,33,0.5)",
              color: "#fca76a",
              padding: "6px 18px",
              borderRadius: 20,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              ◆ Servicio completo · Done-with-you
            </span>
          </div>

          {/* Main: wordmark + photo */}
          <div style={{ display: "flex", alignItems: "flex-start", padding: "18px 40px 0", gap: 32 }}>

            <div style={{ flex: 1 }}>
              {/* Category badge */}
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.7)",
                  padding: "4px 12px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  ⚡ Programa Premium · EB-2 NIW
                </span>
              </div>

              {/* Wordmark */}
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.3em", color: "rgba(255,255,255,0.5)", lineHeight: 1, marginBottom: 2 }}>
                PLAN
              </div>
              <div style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: "0.06em",
                lineHeight: 1,
                background: "linear-gradient(90deg, #F37021 0%, #FFD166 60%, #F37021 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px rgba(243,112,33,0.55))",
                display: "inline-block",
              }}>
                TURBO
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, marginBottom: 14 }}>
                <div style={{ width: 52, height: 3, background: "linear-gradient(90deg, #F37021, #FFD166)", borderRadius: 2 }} />
                <div style={{ width: 10, height: 3, background: "rgba(243,112,33,0.4)", borderRadius: 2 }} />
                <div style={{ width: 5, height: 3, background: "rgba(243,112,33,0.2)", borderRadius: 2 }} />
              </div>

              <h1 style={{ color: "white", fontSize: 34, fontWeight: 900, lineHeight: 1.15, marginBottom: 14 }}>
                Tu Green Card<br />
                <span style={{ color: "#fca76a" }}>EB-2 NIW</span> con<br />
                acompañamiento<br />
                experto
              </h1>

              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, lineHeight: 1.6, maxWidth: 340 }}>
                Un equipo elabora contigo la gran mayoría de tus documentos. Tú aportas la información, nosotros construimos el expediente.
              </p>

              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.08)", borderRadius: 8, borderLeft: "3px solid rgba(243,112,33,0.6)" }}>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.5 }}>
                  <strong style={{ color: "rgba(255,255,255,0.9)" }}>No incluye:</strong>{" "}
                  Equivalencia de títulos · Traducciones · Fees USCIS
                </p>
              </div>
            </div>

            {/* Photo */}
            <div style={{ flexShrink: 0, position: "relative" }}>
              <div style={{
                width: 210,
                height: 300,
                borderRadius: 16,
                overflow: "hidden",
                border: "3px solid rgba(243,112,33,0.5)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}>
                <img src="/ivon.png" alt="Ivon More" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div style={{
                position: "absolute",
                bottom: -14, left: "50%",
                transform: "translateX(-50%)",
                background: "#F37021",
                color: "white",
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(243,112,33,0.5)",
              }}>
                Ivon More · Fundadora
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12, padding: "32px 40px 0" }}>
            {[
              { value: "$10,000", label: "USD · Inversión única" },
              { value: "16", label: "Semanas de proceso" },
              { value: "120-160", label: "Días hasta USCIS" },
              { value: "5+", label: "Años exp. requerida" },
            ].map(({ value, label }) => (
              <div key={label} style={{
                flex: 1,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "14px 10px",
                textAlign: "center",
              }}>
                <div style={{ color: "white", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{value}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginTop: 5, lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
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
              Cupos limitados · Atención personalizada garantizada
            </span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
              {whatsappDisplay}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            PÁGINA 2 — QUÉ INCLUYE + PROCESO
        ══════════════════════════════════════════ */}
        <div className="pdf-page" style={{ background: "#fafafa" }}>
          <PageHeader logo="/logo_more_dark.png" label="Plan Turbo EB-2 NIW" />

          <div style={{ padding: "28px 40px 0" }}>

            {/* Includes */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 5, height: 24, background: "#F37021", borderRadius: 2 }} />
                <h2 style={{ color: "#2A3A4A", fontSize: 24, fontWeight: 800 }}>¿Qué incluye el Plan Turbo?</h2>
                <span style={{ marginLeft: "auto", background: "#2A3A4A", color: "white", fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                  12 entregables
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 28px" }}>
                {includes.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "white", borderRadius: 8, border: "1px solid #ebebeb" }}>
                    <span style={{ color: "#F37021", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#374151", fontSize: 18, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process timeline */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 5, height: 24, background: "#F37021", borderRadius: 2 }} />
                <h2 style={{ color: "#2A3A4A", fontSize: 24, fontWeight: 800 }}>Tu ruta de 16 semanas al envío</h2>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                {phases.map((phase, i) => (
                  <div key={phase.num} style={{ flex: 1, position: "relative" }}>
                    <div style={{
                      background: i === phases.length - 1 ? "#F37021" : "white",
                      border: `1px solid ${i === phases.length - 1 ? "#F37021" : "#e5e7eb"}`,
                      borderRadius: 10,
                      padding: "12px 8px",
                      textAlign: "center",
                      height: "100%",
                    }}>
                      <div style={{ color: i === phases.length - 1 ? "rgba(255,255,255,0.8)" : "#F37021", fontSize: 13, fontWeight: 800 }}>
                        {phase.num}
                      </div>
                      <div style={{ color: i === phases.length - 1 ? "white" : "#1f2937", fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginTop: 5, whiteSpace: "pre-line" }}>
                        {phase.label}
                      </div>
                      <div style={{ color: i === phases.length - 1 ? "rgba(255,255,255,0.75)" : "#9ca3af", fontSize: 13, marginTop: 5 }}>
                        {phase.weeks}
                      </div>
                    </div>
                    {i < phases.length - 1 && (
                      <div style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", color: "#d1d5db", fontSize: 14, zIndex: 1, fontWeight: 700 }}>›</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <PageFooter left="Por Ivon More · Fundadora & Estratega EB-2 NIW" right="Página 2 de 3" />
        </div>

        {/* ══════════════════════════════════════════
            PÁGINA 3 — PRECIO Y CTA
        ══════════════════════════════════════════ */}
        <div className="pdf-page" style={{ background: "#fafafa" }}>
          <PageHeader logo="/logo_more_dark.png" label="Plan Turbo EB-2 NIW" />

          <div style={{ padding: "40px 40px 0" }}>

            {/* Section title */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={{ width: 5, height: 24, background: "#F37021", borderRadius: 2 }} />
              <h2 style={{ color: "#2A3A4A", fontSize: 24, fontWeight: 800 }}>Tu inversión</h2>
            </div>

            {/* Big pricing card */}
            <div style={{
              background: "linear-gradient(135deg, #2A3A4A 0%, #1e2d3d 100%)",
              borderRadius: 20,
              padding: "40px 44px",
              marginBottom: 28,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 40 }}>

                {/* Price block */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                    Inversión total
                  </div>
                  <div style={{ color: "white", fontSize: 64, fontWeight: 900, lineHeight: 1 }}>$10,000</div>
                  <div style={{ color: "#fca76a", fontSize: 22, fontWeight: 600, marginTop: 6 }}>USD · Pago único</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, marginTop: 6 }}>
                    Más gastos de transferencia bancaria
                  </div>
                  <div style={{ marginTop: 20, color: "rgba(255,255,255,0.65)", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#F37021" }}>◆</span>
                    120-160 días de diagnóstico al envío
                  </div>
                  <div style={{ marginTop: 10, color: "rgba(255,255,255,0.65)", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#F37021" }}>◆</span>
                    Cupos limitados · Atención personalizada
                  </div>
                </div>

                <div style={{ width: 1, height: 160, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

                {/* Contact block */}
                <div style={{ flex: 1 }}>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                    Contacto directo
                  </p>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 18, marginBottom: 6 }}>WhatsApp:</div>
                    <div style={{ color: "white", fontSize: 26, fontWeight: 800 }}>+57 313 221 9798</div>
                  </div>
                  <div style={{ padding: "16px 20px", background: "#F37021", borderRadius: 12, textAlign: "center" }}>
                    <p style={{ color: "white", fontSize: 20, fontWeight: 800 }}>Reservar mi lugar →</p>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginTop: 4 }}>{whatsappDisplay}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* No incluye reminder */}
            <div style={{ padding: "20px 24px", background: "white", borderRadius: 12, border: "1px solid #e5e7eb", borderLeft: "4px solid #F37021" }}>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "#6b7280" }}>
                <strong style={{ color: "#374151" }}>No incluye:</strong>{" "}
                Equivalencia de títulos · Traducciones oficiales · Fees migratorios USCIS
              </p>
            </div>

            {/* Testimonial quote */}
            <div style={{ marginTop: 28, padding: "24px 28px", background: "linear-gradient(135deg, #f8f9fa, #fff)", borderRadius: 12, border: "1px solid #e5e7eb" }}>
              <p style={{ color: "#374151", fontSize: 18, lineHeight: 1.7, fontStyle: "italic" }}>
                "Tener un equipo que redactara el Cover Letter y armara los Exhibits fue un diferencial enorme. Sé que mi expediente estaba al nivel que USCIS espera ver."
              </p>
              <p style={{ color: "#F37021", fontSize: 16, fontWeight: 700, marginTop: 12 }}>— Luis F., Arquitecto · México</p>
            </div>
          </div>

          <PageFooter left="Por Ivon More · Fundadora & Estratega EB-2 NIW" right="Página 3 de 3" />
        </div>

      </div>
    </>
  )
}
