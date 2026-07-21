import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  Lock,
  Info,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type {
  Client,
  WizardAnswers,
  TechConfig,
  LandingProject,
  LandingProjectInsert,
} from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useIsRoot } from "@/hooks/useUserRole"
import { generateLandingContent } from "@/lib/gemini"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ClientSelector from "@/components/wizard/ClientSelector"
import WizardProgress, { WIZARD_PARTS } from "@/components/wizard/WizardProgress"
import { cn } from "@/lib/utils"

// ─── Industry options ──────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Salud & Medicina",
  "Software & Tecnología",
  "Educación & Formación",
  "Finanzas & Inversiones",
  "Legal & Asesoría Jurídica",
  "Inmobiliaria & Construcción",
  "Marketing & Publicidad",
  "Comercio & Retail",
  "Turismo & Hospitalidad",
  "Logística & Transporte",
  "Industria & Manufactura",
  "Consultoría & Estrategia",
  "Arte & Diseño",
  "Gastronomía & Alimentos",
  "Otra",
]

const PRIMARY_ACTIONS = [
  { id: "whatsapp", label: "Escribir por WhatsApp" },
  { id: "calendly", label: "Agendar en Calendly" },
  { id: "email", label: "Enviar un email" },
  { id: "form", label: "Llenar un formulario" },
  { id: "call", label: "Llamar por teléfono" },
  { id: "other", label: "Otra acción" },
]

const TECH_STACKS = [
  "React + Vite + TypeScript + Tailwind CSS",
  "Next.js + TypeScript + Tailwind CSS",
  "Astro + Tailwind CSS",
  "HTML + CSS + JavaScript (sin framework)",
  "Vue.js + Tailwind CSS",
  "Otro",
]

// ─── SkipButton ────────────────────────────────────────────────────────────────

const SkipButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
  >
    No tengo esta info, omitir
  </button>
)

// ─── FieldWrapper ──────────────────────────────────────────────────────────────

const FieldWrapper = ({
  label,
  hint,
  children,
  optional = false,
  onSkip,
  skipped = false,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  optional?: boolean
  onSkip?: () => void
  skipped?: boolean
}) => (
  <div className="space-y-2">
    <div className="flex items-start justify-between gap-2">
      <label className="text-sm font-semibold text-navy leading-snug">
        {label}
        {!optional && <span className="text-orange ml-0.5">*</span>}
      </label>
      {optional && onSkip && !skipped && <SkipButton onClick={onSkip} />}
    </div>
    {hint && (
      <p className="text-xs text-gray-400 flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        {hint}
      </p>
    )}
    {skipped ? (
      <div className="px-3 py-2 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 italic">
        Campo omitido — Gemini lo completará automáticamente
      </div>
    ) : (
      children
    )}
  </div>
)

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminProjectWizard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isRoot = useIsRoot()

  const [currentPart, setCurrentPart] = useState(0)
  const [completedParts, setCompletedParts] = useState<number[]>([])
  const [client, setClient] = useState<Client | null>(null)
  const [projectName, setProjectName] = useState("")
  const [projectId, setProjectId] = useState<string | null>(id ?? null)
  const [generating, setGenerating] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [answers, setAnswers] = useState<WizardAnswers>({
    part1: {},
    part2: {},
    part3: {},
    part4: {},
    part5: {},
  })

  const [techConfig, setTechConfig] = useState<TechConfig>({})
  const [skipped, setSkipped] = useState<Record<string, boolean>>({})

  // Load existing project
  useEffect(() => {
    if (!id || !supabase) return
    supabase
      .from("landing_projects")
      .select("*, clients(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (!data) return
        const project = data as LandingProject
        setProjectName(project.name)
        setAnswers((project.answers as WizardAnswers) ?? {})
        setTechConfig((project.tech_config as TechConfig) ?? {})
        if (project.clients) setClient(project.clients as Client)
      })
  }, [id])

  // Autosave with debounce
  const autoSave = useCallback(
    async (
      updatedAnswers: WizardAnswers,
      updatedTech: TechConfig,
      updatedClient: Client | null,
      name: string
    ) => {
      if (!supabase || !user || !name.trim()) return

      setSaveStatus("saving")

      const payload: LandingProjectInsert = {
        name: name.trim(),
        client_id: updatedClient?.id ?? null,
        created_by: user.id,
        status: "draft",
        answers: updatedAnswers,
        tech_config: updatedTech,
        generated_json: null,
        generated_prompt: null,
      }

      if (projectId) {
        const { error } = await supabase
          .from("landing_projects")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", projectId)
        setSaveStatus(error ? "error" : "saved")
      } else {
        const { data, error } = await supabase
          .from("landing_projects")
          .insert([payload])
          .select()
          .single()
        if (!error && data) {
          setProjectId(data.id)
          navigate(`/admin/projects/${data.id}/edit`, { replace: true })
        }
        setSaveStatus(error ? "error" : "saved")
      }

      setTimeout(() => setSaveStatus("idle"), 2500)
    },
    [projectId, user, navigate]
  )

  const triggerSave = useCallback(
    (
      updatedAnswers: WizardAnswers,
      updatedTech: TechConfig,
      updatedClient: Client | null,
      name: string
    ) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        autoSave(updatedAnswers, updatedTech, updatedClient, name)
      }, 1500)
    },
    [autoSave]
  )

  const updateAnswers = (part: keyof WizardAnswers, field: string, value: string | null) => {
    const updated = {
      ...answers,
      [part]: { ...(answers[part] ?? {}), [field]: value },
    }
    setAnswers(updated)
    triggerSave(updated, techConfig, client, projectName)
  }

  const updateTechConfig = (field: keyof TechConfig, value: string | boolean | null) => {
    const updated = { ...techConfig, [field]: value }
    setTechConfig(updated)
    triggerSave(answers, updated, client, projectName)
  }

  const handleClientChange = (c: Client | null) => {
    setClient(c)
    triggerSave(answers, techConfig, c, projectName)
  }

  const handleProjectNameChange = (name: string) => {
    setProjectName(name)
    triggerSave(answers, techConfig, client, name)
  }

  const skipField = (key: string) => {
    setSkipped((p) => ({ ...p, [key]: true }))
  }

  const goNext = () => {
    if (!completedParts.includes(currentPart)) {
      setCompletedParts((p) => [...p, currentPart])
    }
    setCurrentPart((p) => Math.min(p + 1, WIZARD_PARTS.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goPrev = () => {
    setCurrentPart((p) => Math.max(p - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNavigate = (part: number) => {
    setCurrentPart(part)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleGenerate = async () => {
    if (!supabase || !projectId) return
    setGenerating(true)
    try {
      const { landingJson, codePrompt } = await generateLandingContent(
        answers,
        isRoot ? techConfig : undefined
      )
      await supabase
        .from("landing_projects")
        .update({
          generated_json: landingJson,
          generated_prompt: codePrompt,
          status: "generated",
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
      navigate(`/admin/projects/${projectId}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al generar con Gemini")
    } finally {
      setGenerating(false)
    }
  }

  const isLastPart = currentPart === WIZARD_PARTS.length - 1
  const p1 = answers.part1 ?? {}
  const p2 = answers.part2 ?? {}
  const p3 = answers.part3 ?? {}
  const p4 = answers.part4 ?? {}
  const p5 = answers.part5 ?? {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/projects")}
            className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <input
              value={projectName}
              onChange={(e) => handleProjectNameChange(e.target.value)}
              placeholder="Nombre del proyecto (ej: Landing MORE Migraciones)"
              className="w-full text-sm font-semibold text-navy bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal truncate"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {saveStatus === "saving" && (
              <span className="text-xs text-gray-400 animate-pulse">Guardando...</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-green-500">Guardado</span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs text-red-500">Error al guardar</span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => autoSave(answers, techConfig, client, projectName)}
              disabled={saveStatus === "saving"}
              className="gap-1.5 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Progress */}
        <WizardProgress
          currentPart={currentPart}
          completedParts={completedParts}
          onNavigate={handleNavigate}
        />

        {/* Part card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Part header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-navy/[0.02] to-transparent">
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-orange">
              {WIZARD_PARTS[currentPart]?.description}
            </span>
            <h2 className="mt-1 text-xl font-bold text-navy">
              {currentPart === 0 && "¿Para quién es este proyecto?"}
              {currentPart === 1 && "Cuéntame sobre tu marca"}
              {currentPart === 2 && "El corazón emocional de tu negocio"}
              {currentPart === 3 && "¿A quién le hablás?"}
              {currentPart === 4 && "Tu oferta y llamada a la acción"}
              {currentPart === 5 && "Tu prueba social"}
              {currentPart === 6 && "Configuración técnica"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {currentPart === 0 &&
                "Vinculá este proyecto a un cliente existente o creá uno nuevo."}
              {currentPart === 1 &&
                "Estas respuestas definen el tono y la identidad visual de toda la landing."}
              {currentPart === 2 &&
                "Aquí está el gancho emocional. Respondé desde el corazón, no desde la brochure."}
              {currentPart === 3 &&
                "Entre más específico seas, más efectivo el copy que generará Gemini."}
              {currentPart === 4 &&
                "Definí qué va a ofrecer la landing y qué querés que haga el visitante."}
              {currentPart === 5 &&
                "La evidencia que elimina el miedo a contratar."}
              {currentPart === 6 &&
                "Información técnica para el desarrollador que implementará la landing."}
            </p>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* ── Part 0: Client ── */}
            {currentPart === 0 && (
              <>
                <ClientSelector value={client} onChange={handleClientChange} />
                {!client && (
                  <p className="text-xs text-gray-400 italic">
                    Podés continuar sin vincular un cliente y hacerlo más tarde.
                  </p>
                )}
              </>
            )}

            {/* ── Part 1: Identity ── */}
            {currentPart === 1 && (
              <>
                <FieldWrapper
                  label="¿Cómo se llama tu marca o empresa?"
                  hint="El nombre exacto que aparecerá en la landing."
                >
                  <Input
                    placeholder="Ej: MORE Migraciones"
                    value={p1.brand_name ?? ""}
                    onChange={(e) => updateAnswers("part1", "brand_name", e.target.value)}
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="Si tuvieras que explicarle a un amigo qué hace tu empresa en una sola frase, ¿qué le dirías?"
                  hint="Evitá palabras técnicas. Hablá como hablarías en una conversación."
                >
                  <textarea
                    rows={3}
                    placeholder="Ej: Ayudamos a profesionales latinoamericanos a obtener la Green Card sin necesitar un empleador que los patrocine."
                    value={p1.one_liner ?? ""}
                    onChange={(e) => updateAnswers("part1", "one_liner", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="¿A qué industria pertenecés?"
                  hint="Seleccioná la que mejor describe tu actividad principal."
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => updateAnswers("part1", "industry", ind)}
                        className={cn(
                          "px-3 py-2 text-xs font-medium rounded-lg border-2 text-left transition-all duration-150",
                          p1.industry === ind
                            ? "border-orange bg-orange/5 text-navy"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </FieldWrapper>

                <FieldWrapper
                  label="¿Tenés un logo y colores definidos?"
                  hint="Si no tenés colores, describí qué sensaciones querés transmitir."
                  optional
                  onSkip={() => skipField("brand_colors")}
                  skipped={skipped["brand_colors"]}
                >
                  <textarea
                    rows={2}
                    placeholder="Ej: Logo con el nombre en azul oscuro y naranja. Sensación: profesional, confiable, con energía."
                    value={p1.brand_colors ?? ""}
                    onChange={(e) => updateAnswers("part1", "brand_colors", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>
              </>
            )}

            {/* ── Part 2: Problem & Solution ── */}
            {currentPart === 2 && (
              <>
                <FieldWrapper
                  label="¿Qué problema le quitaba el sueño a tu cliente antes de conocerte?"
                  hint="¿Qué es lo que más le duele o le molesta de su situación actual? Respondé con honestidad y emoción."
                >
                  <textarea
                    rows={4}
                    placeholder="Ej: No sabían cómo demostrar que su trabajo importa a nivel nacional. Tenían años de experiencia pero nadie les había enseñado a presentar su perfil como extraordinario..."
                    value={p2.client_pain ?? ""}
                    onChange={(e) => updateAnswers("part2", "client_pain", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="¿Cuál es el 'final feliz' que prometés?"
                  hint="No me digas el servicio. Decime cómo cambia la vida o el negocio del cliente después de contratarte."
                >
                  <textarea
                    rows={4}
                    placeholder="Ej: Vivir en Estados Unidos con su familia, trabajar libremente sin depender de un empleador, construir su legado profesional en el país que eligieron..."
                    value={p2.happy_ending ?? ""}
                    onChange={(e) => updateAnswers("part2", "happy_ending", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="¿Por qué deberían elegirte a vos y no a tu competencia?"
                  hint="¿Qué hacés distinto o mejor que el resto?"
                  optional
                  onSkip={() => skipField("differentiator")}
                  skipped={skipped["differentiator"]}
                >
                  <textarea
                    rows={3}
                    placeholder="Ej: No solo tramitamos la visa. Construimos toda la narrativa del cliente, desarrollamos su proyecto de impacto nacional y los acompañamos emocionalmente durante el proceso..."
                    value={p2.differentiator ?? ""}
                    onChange={(e) => updateAnswers("part2", "differentiator", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>
              </>
            )}

            {/* ── Part 3: Ideal Client ── */}
            {currentPart === 3 && (
              <>
                <FieldWrapper
                  label="¿A qué tipo de personas o empresas ayudás principalmente?"
                  hint="Sé específico. Cuanto más preciso, mejor el copy."
                >
                  <textarea
                    rows={3}
                    placeholder="Ej: Profesionales latinoamericanos con maestría o doctorado, empresarios y emprendedores con negocios en crecimiento, estudiantes de posgrado en STEM..."
                    value={p3.ideal_client ?? ""}
                    onChange={(e) => updateAnswers("part3", "ideal_client", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="Si pudieras dividir a tus clientes en 2 o 3 grupos según sus necesidades, ¿cuáles serían?"
                  hint="Ej: El que recién empieza vs. el que ya tiene experiencia. Describí cada grupo brevemente."
                  optional
                  onSkip={() => skipField("client_segments")}
                  skipped={skipped["client_segments"]}
                >
                  <textarea
                    rows={4}
                    placeholder="Ej:&#10;1. El profesional establecido: maestría o doctorado, +5 años de experiencia, necesita organizar y presentar su perfil.&#10;2. El talento desapercibido: grandes logros pero sin idea de cómo demostrar su impacto nacional.&#10;3. El empresario/emprendedor: construyendo algo propio que beneficia a EE.UU."
                    value={p3.client_segments ?? ""}
                    onChange={(e) => updateAnswers("part3", "client_segments", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>
              </>
            )}

            {/* ── Part 4: Offer & Action ── */}
            {currentPart === 4 && (
              <>
                <FieldWrapper
                  label="¿Cuáles son tus 2 o 3 servicios o paquetes principales?"
                  hint="Solo nombre y qué incluye brevemente. No necesitás el precio aquí."
                >
                  <textarea
                    rows={5}
                    placeholder="Ej:&#10;1. Unsung Professional Program ($2,500): Programa de 9 módulos + 4 sesiones coaching + comunidad privada.&#10;2. Plan Plus ($8,000): Acompañamiento premium completo, redactamos y diligenciamos todo tu expediente."
                    value={p4.services ?? ""}
                    onChange={(e) => updateAnswers("part4", "services", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="¿Qué es lo primero que querés que haga alguien cuando entre a tu web?"
                  hint="Elegí la acción principal. El resto serán CTAs secundarios."
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {PRIMARY_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() =>
                          updateAnswers("part4", "primary_action", action.label)
                        }
                        className={cn(
                          "px-3 py-2.5 text-xs font-medium rounded-lg border-2 text-left transition-all duration-150",
                          p4.primary_action === action.label
                            ? "border-orange bg-orange/5 text-navy"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="URL o número (Ej: https://wa.me/573245327948 o https://calendly.com/...)"
                    value={p4.primary_action_url ?? ""}
                    onChange={(e) =>
                      updateAnswers("part4", "primary_action_url", e.target.value)
                    }
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="¿Tenés algún número que impresione?"
                  hint="Clientes atendidos, años de experiencia, tasa de aprobación, tiempo promedio de resultado..."
                  optional
                  onSkip={() => skipField("impressive_number")}
                  skipped={skipped["impressive_number"]}
                >
                  <textarea
                    rows={2}
                    placeholder="Ej: +200 profesionales aprobados • 98% tasa de aprobación • 10 años de experiencia"
                    value={p4.impressive_number ?? ""}
                    onChange={(e) =>
                      updateAnswers("part4", "impressive_number", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>
              </>
            )}

            {/* ── Part 5: Trust ── */}
            {currentPart === 5 && (
              <>
                <FieldWrapper
                  label="¿Qué dicen tus clientes actuales de vos?"
                  hint="Bastan 2 o 3 frases cortas de clientes reales. Si podés agregar nombre y resultado, mejor."
                  optional
                  onSkip={() => skipField("testimonials")}
                  skipped={skipped["testimonials"]}
                >
                  <textarea
                    rows={5}
                    placeholder="Ej:&#10;'MORE me ayudó a obtener mi Green Card en 8 meses. Su acompañamiento fue increíble.' — María González, Médica&#10;&#10;'Tenía miedo de que mi perfil no calificara, pero ellos construyeron una narrativa que nunca hubiera imaginado.' — Carlos Ruiz, Ingeniero"
                    value={p5.testimonials ?? ""}
                    onChange={(e) => updateAnswers("part5", "testimonials", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>

                <FieldWrapper
                  label="¿Hay algo que le dirías a alguien que todavía tiene dudas de contratarte?"
                  hint="Tu garantía, tu mensaje de cierre, o la razón final para dar el paso."
                  optional
                  onSkip={() => skipField("guarantee")}
                  skipped={skipped["guarantee"]}
                >
                  <textarea
                    rows={3}
                    placeholder="Ej: Sesión exploratoria sin compromiso. Te decimos desde el inicio si calificás. Si no sos candidato, te lo decimos antes de cobrar."
                    value={p5.guarantee ?? ""}
                    onChange={(e) => updateAnswers("part5", "guarantee", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400"
                  />
                </FieldWrapper>
              </>
            )}

            {/* ── Part 6: Tech Config ── */}
            {currentPart === 6 && (
              <div className={cn(!isRoot && "pointer-events-none")}>
                {!isRoot && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                    <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-700 font-medium">
                      Esta sección solo puede ser completada por el administrador del sistema. Los campos están visibles pero bloqueados.
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  <FieldWrapper
                    label="Stack tecnológico"
                    hint="¿Con qué tecnología se construirá la landing?"
                    optional={!isRoot}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TECH_STACKS.map((stack) => (
                        <button
                          key={stack}
                          type="button"
                          disabled={!isRoot}
                          onClick={() => updateTechConfig("stack", stack)}
                          className={cn(
                            "px-3 py-2 text-xs font-medium rounded-lg border-2 text-left transition-all duration-150",
                            techConfig.stack === stack
                              ? "border-orange bg-orange/5 text-navy"
                              : "border-gray-200 text-gray-600 hover:border-gray-300",
                            !isRoot && "opacity-60"
                          )}
                        >
                          {stack}
                        </button>
                      ))}
                    </div>
                  </FieldWrapper>

                  <FieldWrapper label="Base de datos / CRM" optional={!isRoot}>
                    <Input
                      placeholder="Ej: Supabase, PlanetScale, Firebase, Airtable"
                      value={techConfig.database ?? ""}
                      disabled={!isRoot}
                      onChange={(e) => updateTechConfig("database", e.target.value)}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Dominio" optional={!isRoot}>
                    <Input
                      placeholder="Ej: justmore.net, miempresa.com"
                      value={techConfig.domain ?? ""}
                      disabled={!isRoot}
                      onChange={(e) => updateTechConfig("domain", e.target.value)}
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="¿Necesita panel de administración?"
                    optional={!isRoot}
                  >
                    <div className="flex gap-2">
                      {[
                        { label: "Sí", value: true },
                        { label: "No", value: false },
                      ].map(({ label, value }) => (
                        <button
                          key={label}
                          type="button"
                          disabled={!isRoot}
                          onClick={() => updateTechConfig("needs_admin", value)}
                          className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all",
                            techConfig.needs_admin === value
                              ? "border-orange bg-orange/5 text-navy"
                              : "border-gray-200 text-gray-500 hover:border-gray-300",
                            !isRoot && "opacity-60"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </FieldWrapper>

                  <FieldWrapper
                    label="Tracking / Analytics"
                    optional={!isRoot}
                    onSkip={isRoot ? () => skipField("tracking") : undefined}
                    skipped={skipped["tracking"]}
                  >
                    <Input
                      placeholder="Ej: Google Analytics 4, Meta Pixel, Hotjar"
                      value={techConfig.tracking ?? ""}
                      disabled={!isRoot}
                      onChange={(e) => updateTechConfig("tracking", e.target.value)}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Notas técnicas adicionales" optional={!isRoot}>
                    <textarea
                      rows={3}
                      placeholder="Cualquier requerimiento especial, integraciones, restricciones..."
                      value={techConfig.notes ?? ""}
                      disabled={!isRoot}
                      onChange={(e) => updateTechConfig("notes", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none placeholder:text-gray-400 disabled:opacity-60 disabled:bg-gray-50"
                    />
                  </FieldWrapper>
                </div>
              </div>
            )}
          </div>

          {/* Footer navigation */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={goPrev}
              disabled={currentPart === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {isLastPart ? (
              <Button
                onClick={handleGenerate}
                disabled={generating || !projectId}
                variant="gold"
                className="gap-2"
                size="lg"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? "Generando con Gemini..." : "Generar landing con Gemini"}
              </Button>
            ) : (
              <Button onClick={goNext} className="gap-2">
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Hint for non-root on last part */}
        {isLastPart && !isRoot && (
          <p className="text-xs text-gray-400 text-center italic">
            El bloque técnico será completado por el administrador antes de generar.
            Podés generar ahora y el prompt se adaptará al stack por defecto.
          </p>
        )}
      </div>
    </div>
  )
}
