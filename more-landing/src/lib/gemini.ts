import { GoogleGenerativeAI } from "@google/generative-ai"
import type {
  WizardAnswers,
  TechConfig,
  GeneratedLandingJson,
} from "@/lib/supabase"

const apiKey = (import.meta.env.VITE_GEMINI_API_KEY ?? "").trim()

export type GeminiOutput = {
  landingJson: GeneratedLandingJson
  codePrompt: string
}

const buildSystemPrompt = (
  answers: WizardAnswers,
  techConfig?: TechConfig
): string => {
  const p1 = answers.part1 ?? {}
  const p2 = answers.part2 ?? {}
  const p3 = answers.part3 ?? {}
  const p4 = answers.part4 ?? {}
  const p5 = answers.part5 ?? {}

  const techSection = techConfig
    ? `
## Configuración técnica
- Stack: ${techConfig.stack ?? "React + Next.js + Tailwind CSS"}
- Base de datos: ${techConfig.database ?? "Supabase"}
- Panel admin: ${techConfig.needs_admin ? "Sí" : "No"}
- Dominio: ${techConfig.domain ?? "Por definir"}
- Tracking: ${techConfig.tracking ?? "Google Analytics"}
- Notas técnicas: ${techConfig.notes ?? "Ninguna"}`
    : ""

  return `Eres un experto en CRO (Conversion Rate Optimization) y copywriting de alto impacto para landing pages.

Tu tarea es analizar la información del negocio y generar el contenido completo para una landing page de alta conversión.

## Información del negocio

### Parte 1 - Identidad
- Nombre de marca: ${p1.brand_name ?? "No especificado"}
- Qué hace en una frase: ${p1.one_liner ?? "No especificado"}
- Industria: ${p1.industry ?? "No especificado"}
- Colores/sensaciones de marca: ${p1.brand_colors ?? "Profesional, confiable, moderno"}

### Parte 2 - Problema y Solución
- Dolor principal del cliente: ${p2.client_pain ?? "No especificado"}
- Resultado final prometido: ${p2.happy_ending ?? "No especificado"}
- Diferenciador vs competencia: ${p2.differentiator ?? "No especificado"}

### Parte 3 - Cliente Ideal
- Perfil del cliente ideal: ${p3.ideal_client ?? "No especificado"}
- Segmentos de clientes: ${p3.client_segments ?? "No especificado"}

### Parte 4 - Oferta y Acción
- Servicios/paquetes: ${p4.services ?? "No especificado"}
- Primera acción deseada del usuario: ${p4.primary_action ?? "Contactar por WhatsApp"}
- URL de acción: ${p4.primary_action_url ?? "#"}
- Número/métrica impresionante: ${p4.impressive_number ?? "No especificado"}
${techSection}

### Parte 5 - Confianza
- Testimonios reales: ${p5.testimonials ?? "No especificados"}
- Garantía o mensaje de cierre: ${p5.guarantee ?? "No especificado"}

---

## Instrucciones de output

Responde ÚNICAMENTE con un objeto JSON válido sin markdown, sin comentarios, sin texto adicional antes o después. El JSON debe tener exactamente esta estructura:

{
  "hero": {
    "badge": "etiqueta corta de 3-5 palabras que resume la propuesta única",
    "h1": "headline principal de alto impacto, pregunta o afirmación disruptiva (máx 12 palabras)",
    "h2": "subtítulo que explica el mecanismo y el perfil (1-2 oraciones)",
    "cta_primary": "texto del botón principal en primera persona (ej: 'Sí, quiero evaluar mi perfil')",
    "cta_secondary": "texto del botón secundario de menor compromiso",
    "trust_line": "línea de trust con 2-3 métricas separadas por • (ej: '+500 clientes • 98% satisfacción • Sin contratos')",
    "urgency_line": "frase de urgencia o costo de no actuar (1 oración, en itálica)"
  },
  "pain_points": [
    { "title": "título del problema 1 (3-5 palabras)", "description": "descripción visceral del dolor (2-3 oraciones)" },
    { "title": "título del problema 2 (3-5 palabras)", "description": "descripción visceral del dolor (2-3 oraciones)" },
    { "title": "título del problema 3 (3-5 palabras)", "description": "descripción visceral del dolor (2-3 oraciones)" }
  ],
  "who_we_help": [
    { "segment": "nombre del segmento", "description": "quién es este cliente en 1 oración", "result": "resultado específico que obtiene" },
    { "segment": "nombre del segmento", "description": "quién es este cliente en 1 oración", "result": "resultado específico que obtiene" }
  ],
  "pricing": [
    { "name": "nombre del plan/servicio", "description": "descripción en 1-2 oraciones", "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"], "cta": "texto del CTA en primera persona" }
  ],
  "testimonials": [
    { "name": "Nombre del cliente", "role": "Cargo o perfil", "text": "testimonio reescrito para máximo impacto con resultado específico", "metric": "métrica clave obtenida" },
    { "name": "Nombre del cliente", "role": "Cargo o perfil", "text": "testimonio reescrito para máximo impacto con resultado específico", "metric": "métrica clave obtenida" }
  ],
  "faq": [
    { "question": "pregunta frecuente real que elimina objeción de compra", "answer": "respuesta que convierte la objeción en argumento de venta" },
    { "question": "pregunta frecuente real", "answer": "respuesta persuasiva" },
    { "question": "pregunta frecuente real", "answer": "respuesta persuasiva" }
  ],
  "trust_stats": ["stat 1 impresionante", "stat 2 impresionante", "stat 3 impresionante"],
  "risk_reversal": "garantía o frase de reversión de riesgo que elimina el miedo a contratar"
}`
}

const buildCodePrompt = (
  answers: WizardAnswers,
  landingJson: GeneratedLandingJson,
  techConfig?: TechConfig
): string => {
  const stack = techConfig?.stack ?? "React + Vite + TypeScript + Tailwind CSS"
  const brandName = answers.part1?.brand_name ?? "la marca"
  const primaryAction = answers.part4?.primary_action ?? "WhatsApp"
  const primaryActionUrl = answers.part4?.primary_action_url ?? "#"

  return `# Prompt para generar landing page completa — ${brandName}

## Stack tecnológico
${stack}, Framer Motion para animaciones, Lucide React para íconos.

## Paleta de colores
Basada en: ${answers.part1?.brand_colors ?? "Profesional, moderno y confiable"}
Define una paleta primaria con 2 colores principales + neutros.

## Estructura de la landing (en orden)
1. **Navbar** — Logo + links de navegación + CTA en esquina superior derecha
2. **Hero** — Badge animado + H1 + H2 + CTA primario y secundario + trust indicators
3. **Pain Points** — 3 cards de problemas con íconos
4. **Who We Help** — Segmentos de clientes que se identifican
5. **Pricing** — Cards de planes con features, precio y CTA
6. **Testimonials** — Cards con nombre, rol, testimonio y métrica
7. **FAQ** — Acordeón con preguntas y respuestas
8. **Footer** — Links + redes sociales + copyright

## Contenido generado para cada sección

### Hero
- Badge: "${landingJson.hero?.badge ?? ""}"
- H1: "${landingJson.hero?.h1 ?? ""}"
- H2: "${landingJson.hero?.h2 ?? ""}"
- CTA primario: "${landingJson.hero?.cta_primary ?? ""}" → enlaza a ${primaryActionUrl}
- CTA secundario: "${landingJson.hero?.cta_secondary ?? ""}"
- Trust line: "${landingJson.hero?.trust_line ?? ""}"
- Urgency line: "${landingJson.hero?.urgency_line ?? ""}"

### Pain Points
${(landingJson.pain_points ?? []).map((p, i) => `${i + 1}. **${p.title}**: ${p.description}`).join("\n")}

### Who We Help
${(landingJson.who_we_help ?? []).map((w) => `- **${w.segment}**: ${w.description} → Resultado: ${w.result}`).join("\n")}

### Pricing
${(landingJson.pricing ?? []).map((p) => `- **${p.name}**: ${p.description}\n  Features: ${p.features.join(", ")}\n  CTA: "${p.cta}"`).join("\n")}

### Testimonials
${(landingJson.testimonials ?? []).map((t) => `- **${t.name}** (${t.role}): "${t.text}" — Métrica: ${t.metric ?? "N/A"}`).join("\n")}

### FAQ
${(landingJson.faq ?? []).map((f) => `- **${f.question}**: ${f.answer}`).join("\n")}

### Trust Stats
${(landingJson.trust_stats ?? []).join(" • ")}

### Risk Reversal
"${landingJson.risk_reversal ?? ""}"

## Reglas de implementación
- CTAs siempre en primera persona: "Sí, quiero...", "Quiero conocer...", "Mostrarme..."
- NUNCA usar: "Submit", "Enviar", "Learn More", "Contáctanos"
- Mobile-first, responsive con breakpoints sm/md/lg
- Animaciones con Framer Motion: fade-in + slide-up al hacer scroll (whileInView)
- Cada sección tiene un id para anclar la navegación
- CTA principal de toda la landing apunta a: ${primaryActionUrl} (${primaryAction})
- Incluir un formulario o quiz de captura de leads antes del pricing
- Colores: definir variables CSS o constantes Tailwind, NO hardcodear valores hex en cada componente

## Output esperado
Genera cada sección como un componente React independiente en TypeScript.
Empieza por el componente Hero, luego continúa en orden.
Cada componente debe ser autocontenido e importar solo lo necesario.`
}

export const generateLandingContent = async (
  answers: WizardAnswers,
  techConfig?: TechConfig
): Promise<GeminiOutput> => {
  if (!apiKey) {
    throw new Error(
      "Gemini API key no configurada. Agrega VITE_GEMINI_API_KEY en tu archivo .env"
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const systemPrompt = buildSystemPrompt(answers, techConfig)

  const result = await model.generateContent(systemPrompt)
  const text = result.response.text().trim()

  let landingJson: GeneratedLandingJson
  try {
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim()
    landingJson = JSON.parse(cleaned)
  } catch {
    throw new Error(
      "Gemini devolvió una respuesta que no es JSON válido. Intentá regenerar."
    )
  }

  const codePrompt = buildCodePrompt(answers, landingJson, techConfig)

  return { landingJson, codePrompt }
}
