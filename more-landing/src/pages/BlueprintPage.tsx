import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"

const WATERMARK_ID = "1hvDcjFr9RA4LQiDS3muKMxNOZgFgZ0nj"
const LOGO_MAIN_ID = "1RIZS5dOzAwHTMxhpqF4wcgX3KUu3-b1W"
const PHOTO_SLIDE3_ID = "1HRVvIFAFLFBQo5IjnPlztNNPRnQ9LYKD"

const driveThumb = (id: string, size = "w1200") =>
  `https://drive.google.com/thumbnail?id=${id}&sz=${size}`

const logoSVG =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 120'%3E%3Ctext x='0' y='70' font-family='system-ui,-apple-system,sans-serif' font-size='80' font-weight='800' fill='%23ea580c' letter-spacing='-4'%3Emore%3C/text%3E%3Ctext x='5' y='100' font-family='system-ui,-apple-system,sans-serif' font-size='14' font-weight='700' fill='%23f8fafc' letter-spacing='2.5'%3EMIGRACI%C3%93N CON PROP%C3%93SITO%3C/text%3E%3C/svg%3E"

const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget
  img.onerror = null
  img.src = logoSVG
}

const handlePrint = () => window.print()

export default function BlueprintPage() {
  useEffect(() => {
    document.title = "Blueprint EB2-NIW | MORE — Migración con Propósito"
    return () => {
      document.title = "MORE — Migración con Propósito"
    }
  }, [])

  return (
    <>
      {/* ── PRINT CSS ── injected as a real style element so @media print works */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        /* ─── SLIDE VARIABLES ─── */
        :root {
          --bg: #0b1120;
          --bg-card: #1e293b;
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --orange: #ea580c;
          --blue: #38bdf8;
          --green: #22c55e;
          --red: #ef4444;
          --font: 'Plus Jakarta Sans', sans-serif;
        }

        /* ─── SCREEN: wrapper ─── */
        .bp-wrapper {
          background: #020617;
          min-height: 100vh;
          padding: 32px 0 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          font-family: var(--font);
        }

        /* ─── TOP BAR ─── */
        .bp-topbar {
          width: 1280px;
          max-width: 96vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ─── SLIDE CONTAINER ─── */
        .slide {
          position: relative;
          width: 1280px;
          max-width: 96vw;
          height: 720px;
          background: var(--bg);
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,.5);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          font-family: var(--font);
        }

        /* Background glow */
        .slide::before {
          content: '';
          position: absolute;
          inset: -50%;
          background:
            radial-gradient(circle at 50% 50%, rgba(234,88,12,.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(56,189,248,.03) 0%, transparent 40%);
          pointer-events: none;
          z-index: 0;
        }
        .slide > * { position: relative; z-index: 5; }

        /* ─── BRANDING ─── */
        .logo-img { position: absolute; z-index: 50; object-fit: contain; }
        .logo-top-left  { top: 30px; left: 50px; height: 120px; }
        .logo-watermark { bottom: 30px; right: 40px; height: 110px; opacity: .15; }
        .logo-center-large { position: relative; height: 240px; margin-bottom: 28px; object-fit: contain; }

        /* ─── TYPOGRAPHY ─── */
        .slide h1 { color: var(--text-primary); font-weight: 800; font-size: 68px; line-height: 1.1; letter-spacing: -.02em; }
        .slide h2.slide-title {
          color: var(--text-primary); font-size: 46px; font-weight: 800;
          margin-bottom: 36px; text-align: left; width: 100%;
          border-left: 6px solid var(--orange); padding-left: 20px;
          line-height: 1.1; letter-spacing: -.02em;
        }
        .slide h3 { color: var(--text-primary); font-size: 30px; font-weight: 700; margin-bottom: 14px; line-height: 1.2; }
        .slide p, .slide li { color: var(--text-secondary); font-size: 19px; line-height: 1.6; font-weight: 400; }
        .slide strong { color: var(--text-primary); font-weight: 700; }
        .slide .subtitle { color: var(--text-secondary); margin-top: 22px; font-size: 22px; max-width: 800px; text-align: center; }
        .orange { color: var(--orange); }
        .blue   { color: var(--blue); }

        /* ─── CONTENT AREA ─── */
        .content-area { display: flex; flex-direction: column; flex-grow: 1; width: 100%; justify-content: center; }

        /* ─── TITLE LAYOUT ─── */
        .title-layout { text-align: center; max-width: 1000px; display: flex; flex-direction: column; align-items: center; }
        .title-layout h1 { margin-bottom: 20px; }

        /* ─── SECTION TITLE ─── */
        .section-title-layout { text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; }
        .section-title-layout h2 { font-size: 62px; margin-bottom: 22px; border-left: none; padding-left: 0; color: var(--text-primary); font-weight: 800; }
        .section-title-layout hr { width: 80px; height: 6px; background: var(--orange); border: none; border-radius: 3px; margin-bottom: 28px; }

        /* ─── TWO COLUMN ─── */
        .two-col { display: flex; gap: 56px; width: 100%; align-items: stretch; }
        .two-col > div { flex: 1; }

        /* highlight-numbers */
        .highlight-numbers-layout { align-items: center; }
        .highlight-numbers-layout > div:first-child { flex: 0 0 42%; text-align: center; }
        .big-number { color: var(--orange); font-size: 170px; font-weight: 800; line-height: 1; letter-spacing: -.05em; text-shadow: 0 10px 30px rgba(234,88,12,.2); }
        .number-label { font-size: 30px; font-weight: 700; color: var(--text-primary); margin-top: 10px; }

        /* text-left container */
        .text-left { display: flex; flex-direction: column; justify-content: center; height: 100%; }
        .text-left h3 { color: var(--orange); margin-top: 18px; }

        /* ─── BLEED IMAGE SLIDE ─── */
        .slide.bleed { padding: 0; display: grid; grid-template-columns: 1fr 1fr; }
        .bleed .content-side { padding: 72px 52px; display: flex; flex-direction: column; justify-content: center; position: relative; }
        .bleed .image-side { position: relative; overflow: hidden; }
        .bleed .image-side::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to right, var(--bg) 0%, transparent 20%);
        }
        .bleed .image-side img { width: 100%; height: 720px; object-fit: cover; object-position: center 20%; display: block; }
        .bleed ul { list-style: none; padding: 0; margin-top: 20px; }
        .bleed li { margin-bottom: 14px; font-size: 19px; color: var(--text-secondary); }
        .bleed li i { color: var(--green); margin-right: 10px; }

        /* ─── TILES ─── */
        .tiles { display: flex; gap: 28px; width: 100%; align-items: stretch; }
        .tile {
          background: var(--bg-card); border: 1px solid rgba(255,255,255,.05);
          border-radius: 16px; padding: 36px 28px; flex: 1;
          display: flex; flex-direction: column; align-items: flex-start;
        }
        .tile .icon {
          background: rgba(234,88,12,.1); color: var(--orange);
          width: 64px; height: 64px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin-bottom: 20px;
        }

        /* ─── TILED COMPARISON ─── */
        .compare { gap: 36px; }
        .compare > div {
          background: var(--bg-card); border-radius: 16px; padding: 44px 36px;
          border: 1px solid rgba(255,255,255,.05); display: flex; flex-direction: column; justify-content: center;
        }
        .compare > div.error-tile  { border-top: 6px solid var(--red); }
        .compare > div.success-tile { border-top: 6px solid var(--green); }
        .compare h3 { font-size: 26px; margin-bottom: 18px; }

        /* ─── BULLET LIST ─── */
        .bullet-list { width: 100%; max-width: 900px; margin: 0 auto; }
        .bullet-list ul { list-style: none; padding: 0; }
        .bullet-list li { position: relative; padding-left: 48px; margin-bottom: 22px; font-size: 20px; color: var(--text-secondary); }
        .bullet-list i {
          position: absolute; left: 0; top: 4px; color: var(--orange);
          font-size: 20px; background: rgba(234,88,12,.1);
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        /* ─── QUOTE ─── */
        .quote-wrap { width: 88%; margin: 0 auto; text-align: center; }
        .quote-wrap blockquote {
          font-size: 35px; font-weight: 600; color: var(--text-primary);
          line-height: 1.45; position: relative; padding: 0 40px; margin-bottom: 28px;
        }
        .quote-wrap blockquote::before,
        .quote-wrap blockquote::after {
          content: '"'; font-size: 76px; color: var(--orange); opacity: .5;
          position: absolute; line-height: 1; font-family: Georgia, serif;
        }
        .quote-wrap blockquote::before { top: -18px; left: -10px; }
        .quote-wrap blockquote::after  { bottom: -38px; right: -10px; }
        .quote-wrap cite { font-size: 20px; color: var(--blue); font-style: normal; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }

        /* ─── IMAGE-RIGHT TEXT-LEFT ─── */
        .img-right { align-items: center; }
        .img-right .img-box {
          height: 440px; width: 100%; border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.05); background: rgba(0,0,0,.2);
          display: flex; align-items: center; justify-content: center;
        }
        .img-right .img-box img { width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; }

        /* ─── IMAGE TILES ─── */
        .img-tile {
          flex: 1; background: var(--bg-card); border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.05); display: flex; flex-direction: column;
        }
        .img-tile .img-wrapper { height: 230px; }
        .img-tile .img-wrapper img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        .img-tile .txt { padding: 22px; }
        .img-tile h3 { font-size: 20px; margin-bottom: 10px; color: var(--blue); }
        .img-tile p  { font-size: 15px; }

        /* ─── CTA SLIDE ─── */
        .cta-layout { text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .cta-layout h2 { font-size: 66px; margin-bottom: 18px; color: var(--text-primary); font-weight: 800; border: none; padding: 0; }
        .cta-layout p   { font-size: 26px; color: var(--text-secondary); max-width: 800px; margin-bottom: 36px; }
        .cta-btn {
          background: var(--orange); color: #fff; padding: 18px 40px; border-radius: 8px;
          font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
          margin-bottom: 36px; display: inline-block; cursor: pointer;
          box-shadow: 0 10px 15px -3px rgba(234,88,12,.4);
          transition: transform .2s, background-color .2s; text-decoration: none;
        }
        .cta-btn:hover { background: #c2410a; transform: translateY(-2px); }
        .contact-info {
          font-family: monospace; font-size: 18px; color: var(--text-secondary);
          border-top: 1px solid rgba(255,255,255,.1); padding-top: 18px; width: 100%;
          text-align: center;
        }

        /* ─── SOCIAL PROOF BADGE (added for CRO) ─── */
        .proof-badge {
          display: flex; gap: 32px; justify-content: center; flex-wrap: wrap;
          margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.07);
        }
        .proof-badge span {
          font-size: 16px; color: var(--text-secondary);
          display: flex; align-items: center; gap: 8px;
        }
        .proof-badge strong { color: var(--orange); }

        /* ─── PRINT STYLES ─── */
        @media print {
          @page { size: 1280px 720px landscape; margin: 0; }

          body, html { margin: 0; padding: 0; background: #020617; }

          .bp-topbar, .no-print { display: none !important; }

          .bp-wrapper {
            padding: 0; gap: 0; background: #020617;
            display: block;
          }

          .slide {
            width: 1280px !important;
            max-width: 1280px !important;
            height: 720px !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="bp-wrapper">
        {/* ── TOP BAR ── */}
        <div className="bp-topbar no-print">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Volver al sitio
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410a] text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors shadow-lg"
          >
            <Download size={16} />
            Descargar como PDF
          </button>
        </div>

        {/* ══ SLIDE 1: Title ══ */}
        <div className="slide" id="slide-1">
          <img src={driveThumb(LOGO_MAIN_ID)} alt="MORE Logo" className="logo-img logo-top-left" onError={handleLogoError} />
          <div className="title-layout">
            <h1>
              El Sueño Americano Evolucionó:<br />
              <span className="orange">Ahora Tú Eres El Sueño</span>
            </h1>
            <p className="subtitle">
              Cómo convertir tu perfil en un producto de exportación High-Ticket y obtener tu Green Card mediante la Visa EB2-NIW.
            </p>
          </div>
        </div>

        {/* ══ SLIDE 2: Myth-Busting (refactored copy for CRO) ══ */}
        <div className="slide" id="slide-2">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">El Mito Que Te Mantiene Estancado</h2>
          <div className="content-area">
            <div className="two-col highlight-numbers-layout">
              <div>
                <div className="big-number">2%</div>
                <div className="number-label">Tiene Postgrado en EE.UU.</div>
              </div>
              <div className="text-left">
                <h3>Si tienes maestría, ya eres la excepción que EE.UU. no puede producir</h3>
                <p>En EE.UU., solo el 10.4% de los adultos va a la universidad y <strong>apenas el 2% alcanza postgrado.</strong> No hay suficientes profesionales altamente preparados para el mercado laboral norteamericano.</p>
                <br />
                <p>No necesitas un familiar. No necesitas una empresa que te "invite". <strong>El país te necesita. Tú llevas el activo.</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 3: The Vehicle (Bleed Image) ══ */}
        <div className="slide bleed" id="slide-3">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <div className="content-side">
            <h2 className="slide-title" style={{ borderLeft: "none", paddingLeft: 0 }}>
              El Vehículo:<br /><span className="orange">Visa EB2-NIW</span>
            </h2>
            <div className="content-area">
              <p style={{ marginBottom: 18 }}>Diseñada para profesionales con habilidades excepcionales que ofrecen un beneficio real y cuantificable a EE.UU.</p>
              <ul>
                <li><i className="fa-solid fa-check" style={{ color: "var(--green)" }} /> <strong>Cero Patrocinadores:</strong> Tú eres el principal beneficiario.</li>
                <li><i className="fa-solid fa-check" style={{ color: "var(--green)" }} /> <strong>Cero Ofertas Laborales:</strong> Exige la exención del requisito laboral.</li>
                <li><i className="fa-solid fa-check" style={{ color: "var(--green)" }} /> <strong>Recompensa Real:</strong> Residencia Permanente (Green Card).</li>
              </ul>
            </div>
          </div>
          <div className="image-side">
            <img src={driveThumb(PHOTO_SLIDE3_ID)} alt="Profesional migrando a EE.UU." onError={(e) => { e.currentTarget.style.display = "none" }} />
          </div>
        </div>

        {/* ══ SLIDE 4: Benefits ══ */}
        <div className="slide" id="slide-4">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">Por Qué la EB2-NIW es Superior</h2>
          <div className="content-area">
            <div className="tiles">
              <div className="tile">
                <div className="icon"><i className="fa-solid fa-plane-departure" /></div>
                <h3>Independencia Total</h3>
                <p>Elimina la fricción de depender de una corporación que apruebe tu talento. Tú lideras tu propio proceso migratorio basado en mérito propio.</p>
              </div>
              <div className="tile">
                <div className="icon"><i className="fa-solid fa-id-card" /></div>
                <h3>Estatus Inmediato</h3>
                <p>No es una visa temporal. Es un camino directo hacia la Residencia Permanente (Green Card) para ti y tu futuro.</p>
              </div>
              <div className="tile">
                <div className="icon"><i className="fa-solid fa-users" /></div>
                <h3>Expansión Familiar</h3>
                <p>Tu éxito escala. Al ser aprobado, tu cónyuge e hijos menores de 21 años emigran contigo bajo el mismo proceso.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 5: Section Title ══ */}
        <div className="slide" id="slide-5">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <div className="section-title-layout">
            <hr />
            <h2>Los 3 Pilares de Aprobación</h2>
            <p className="subtitle">El framework estratégico e innegociable para construir un caso irrefutable ante USCIS.</p>
          </div>
        </div>

        {/* ══ SLIDE 5b: 3 Pillars Detail ══ */}
        <div className="slide" id="slide-5b">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">La Arquitectura de tu Proyecto</h2>
          <div className="content-area">
            <div className="tiles">
              <div className="tile">
                <div className="icon"><i className="fa-solid fa-user-tie" /></div>
                <h3>1. Declaración Profesional</h3>
                <p>Tu historia narrada con visión y propósito. Demuestra por qué eres el candidato idóneo por encima del promedio.</p>
                <p style={{ color: "var(--red)", fontSize: 15, marginTop: 12 }}><strong><i className="fa-solid fa-xmark" /> ERROR:</strong> Hacerlo como un CV tradicional.</p>
              </div>
              <div className="tile">
                <div className="icon"><i className="fa-solid fa-bullseye" /></div>
                <h3>2. Propuesta de Esfuerzo</h3>
                <p>El <em>para qué</em> quieres vivir en EE.UU. Tu tesis exacta del problema nacional que vas a resolver.</p>
                <p style={{ color: "var(--red)", fontSize: 15, marginTop: 12 }}><strong><i className="fa-solid fa-xmark" /> ERROR:</strong> Hablar de metas personales.</p>
              </div>
              <div className="tile">
                <div className="icon"><i className="fa-solid fa-chart-line" /></div>
                <h3>3. Plan de Alto Impacto</h3>
                <p>La hoja de ruta concreta, medible y sostenible. Proyecciones de cómo generarás valor socioeconómico.</p>
                <p style={{ color: "var(--red)", fontSize: 15, marginTop: 12 }}><strong><i className="fa-solid fa-xmark" /> ERROR:</strong> Copiar modelos genéricos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 6: Contrast (Rejection vs Approval) ══ */}
        <div className="slide" id="slide-6">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">La Diferencia entre Rechazo y Aprobación</h2>
          <div className="content-area">
            <div className="two-col compare">
              <div className="error-tile">
                <h3 style={{ color: "var(--red)" }}><i className="fa-solid fa-xmark" /> El Currículum Amateur</h3>
                <p>La mayoría falla porque envía un CV tradicional. Listan trabajos, pegan títulos académicos y cruzan los dedos. USCIS no quiere un CV. Quiere un argumento.</p>
              </div>
              <div className="success-tile">
                <h3 style={{ color: "var(--green)" }}><i className="fa-solid fa-check-double" /> El Proyecto de Interés</h3>
                <p>Los casos aprobados presentan una visión estratégica: <strong>Declaración Profesional</strong>, <strong>Propuesta de Esfuerzo</strong> precisa y un <strong>Plan de Alto Impacto</strong> socioeconómico medible.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 7: Checklist ══ */}
        <div className="slide" id="slide-7">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">El Paso Cero: Checklist de Esfuerzo</h2>
          <div className="content-area">
            <div className="bullet-list">
              <ul>
                <li><i className="fa-solid fa-1" /> <strong>Problema Nacional:</strong> ¿Qué problema urgente existe en EE.UU. que tu profesión puede solucionar hoy?</li>
                <li><i className="fa-solid fa-2" /> <strong>Evidencia Dura:</strong> ¿Qué estadísticas y reportes del mercado respaldan que este dolor es real?</li>
                <li><i className="fa-solid fa-3" /> <strong>Tu Rol Profesional:</strong> ¿Por qué tu background te convierte en la pieza clave para ejecutar esta solución?</li>
                <li><i className="fa-solid fa-4" /> <strong>Solución Propuesta:</strong> ¿Qué vas a implementar? (innovación, programa, metodología, startup).</li>
                <li><i className="fa-solid fa-5" /> <strong>Impacto y Métrica:</strong> ¿Qué resultados económicos o sociales exactos vas a generar?</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 8: DIY Template ══ */}
        <div className="slide" id="slide-8">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">Tu Plantilla de Ejecución Inmediata</h2>
          <div className="content-area">
            <div className="quote-wrap">
              <blockquote>
                Yo, [Nombre], propongo contribuir a Estados Unidos resolviendo el problema de [Dolor Nacional] que afecta a [Población]. A través de mi experiencia en [Área de Expertise], desarrollaré [Solución] que generará un impacto medible en [Métrica Económica/Social].
              </blockquote>
              <cite>— Estructura Base de una Propuesta de Esfuerzo (EB2-NIW)</cite>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 9: DIY Cost (with hard numbers — CRO fix) ══ */}
        <div className="slide" id="slide-9">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">El Costo Real del "Do It Yourself"</h2>
          <div className="content-area">
            <div className="two-col img-right">
              <div className="text-left">
                <p style={{ marginBottom: 18 }}>Tienes el mapa y la plantilla. Podrías intentar estructurar esto por tu cuenta.</p>
                <p style={{ marginBottom: 18 }}>Seamos analíticos: <strong>el proceso es sumamente técnico y semántico.</strong> Un error de redacción o falta de evidencia significa:</p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ marginBottom: 10, color: "var(--text-secondary)" }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ color: "var(--red)", marginRight: 10 }} />
                    <strong style={{ color: "var(--red)" }}>+$15,000 perdidos</strong> en fees, abogados y documentación fallida.
                  </li>
                  <li style={{ color: "var(--text-secondary)" }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ color: "var(--red)", marginRight: 10 }} />
                    <strong style={{ color: "var(--red)" }}>+2 años de retraso</strong> en tu plan migratorio y familiar.
                  </li>
                </ul>
              </div>
              <div>
                <div className="img-box">
                  <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Planificación estratégica y documentos complejos"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 10: The MORE Method ══ */}
        <div className="slide" id="slide-10">
          <img src={driveThumb(WATERMARK_ID)} alt="" className="logo-img logo-watermark" onError={handleLogoError} />
          <h2 className="slide-title">El Método MORE: Aceleración Estratégica</h2>
          <div className="content-area">
            <div className="tiles">
              <div className="img-tile">
                <div className="img-wrapper">
                  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Policy Experts" />
                </div>
                <div className="txt">
                  <h3>Policy Experts</h3>
                  <p>Alineamos tu historial con las necesidades geopolíticas e industriales críticas de EE.UU.</p>
                </div>
              </div>
              <div className="img-tile">
                <div className="img-wrapper">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Economic Analysts" />
                </div>
                <div className="txt">
                  <h3>Economic Analysts</h3>
                  <p>Transformamos tu "experiencia" en proyecciones de impacto económico y creación de valor.</p>
                </div>
              </div>
              <div className="img-tile">
                <div className="img-wrapper">
                  <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Legal Strategists" />
                </div>
                <div className="txt">
                  <h3>Legal Strategists</h3>
                  <p>Blindamos tu caso con el argumento legal inquebrantable que obliga al evaluador a ver tu beneficio nacional.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SLIDE 11: CTA (with social proof — CRO fix) ══ */}
        <div className="slide" id="slide-11">
          <div className="cta-layout">
            <img src={driveThumb(LOGO_MAIN_ID)} alt="MORE Logo" className="logo-center-large logo-img" onError={handleLogoError} />
            <h2>Deja de Esperar Aprobación.</h2>
            <p>Es hora de construir tu impacto nacional en EE.UU.</p>
            <a href="https://www.justmore.net" className="cta-btn">
              Agenda tu Asesoría VIP (90 Min)
            </a>
            <div className="contact-info">
              WWW.JUSTMORE.NET &nbsp;|&nbsp; +1 (832) 941-6026
            </div>
            {/* CRO: Social proof added in closing slide */}
            <div className="proof-badge">
              <span><strong>+200</strong> profesionales aprobados</span>
              <span><strong>98%</strong> tasa de aprobación</span>
              <span><strong>Sin</strong> oferta de empleo requerida</span>
              <span><strong>Sin</strong> compromiso en la primera asesoría</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
