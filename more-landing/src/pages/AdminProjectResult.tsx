import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Code2,
  LayoutTemplate,
  Download,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { LandingProject, GeneratedLandingJson, WizardAnswers, TechConfig } from "@/lib/supabase"
import { generateLandingContent } from "@/lib/gemini"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Tab = "content" | "prompt"

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150",
        copied
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-[#2A3A4A]",
        className
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  )
}

// ─── Collapsible Section ──────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-[#2A3A4A]">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-5 py-4 space-y-3">{children}</div>}
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="space-y-1">
      <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-400">
        {label}
      </span>
      <p className="text-sm text-[#2A3A4A] leading-relaxed">{value}</p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminProjectResult() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<LandingProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("content")
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    if (!id || !supabase) return
    supabase
      .from("landing_projects")
      .select("*, clients(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setProject(data as LandingProject)
        setLoading(false)
      })
  }, [id])

  const handleRegenerate = async () => {
    if (!project || !supabase) return
    setRegenerating(true)
    try {
      const { landingJson, codePrompt } = await generateLandingContent(
        project.answers as WizardAnswers,
        project.tech_config as TechConfig
      )
      await supabase
        .from("landing_projects")
        .update({
          generated_json: landingJson,
          generated_prompt: codePrompt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id)
      setProject((p) =>
        p ? { ...p, generated_json: landingJson, generated_prompt: codePrompt } : p
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al regenerar")
    } finally {
      setRegenerating(false)
    }
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Cargando resultado...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-500 text-sm">Proyecto no encontrado.</p>
        <Link to="/admin/projects" className="text-[#F37021] text-sm hover:underline">
          ← Volver a proyectos
        </Link>
      </div>
    )
  }

  const json = project.generated_json as GeneratedLandingJson | null
  const prompt = project.generated_prompt

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/projects")}
            className="p-2 text-gray-400 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-[#2A3A4A] truncate">
              {project.name}
            </h1>
            {project.clients && (
              <p className="text-xs text-gray-400 truncate">
                {(project.clients as { name: string }).name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", regenerating && "animate-spin")} />
              {regenerating ? "Regenerando..." : "Regenerar"}
            </Button>
            <Button size="sm" variant="ghost" asChild className="gap-1.5 text-xs">
              <Link to={`/admin/projects/${id}/edit`}>
                <Edit3 className="w-3.5 h-3.5" />
                Editar respuestas
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Status banner */}
        {json ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mb-6">
            <Sparkles className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-xs text-green-700 font-medium">
              Landing generada por Gemini — Revisá el contenido y copiá el prompt para empezar a desarrollar.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-800">
                Aún no se generó el contenido con Gemini.
              </p>
              <p className="text-xs text-amber-600">
                Completá el wizard y presioná "Generar landing con Gemini".
              </p>
            </div>
            <Button
              size="sm"
              variant="gold"
              asChild
              className="gap-1.5 shrink-0"
            >
              <Link to={`/admin/projects/${id}/edit`}>
                <Edit3 className="w-3.5 h-3.5" />
                Ir al wizard
              </Link>
            </Button>
          </div>
        )}

        {json && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
              <button
                onClick={() => setTab("content")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150",
                  tab === "content"
                    ? "bg-white text-[#2A3A4A] shadow-sm"
                    : "text-gray-500 hover:text-[#2A3A4A]"
                )}
              >
                <LayoutTemplate className="w-4 h-4" />
                Contenido generado
              </button>
              <button
                onClick={() => setTab("prompt")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150",
                  tab === "prompt"
                    ? "bg-white text-[#2A3A4A] shadow-sm"
                    : "text-gray-500 hover:text-[#2A3A4A]"
                )}
              >
                <Code2 className="w-4 h-4" />
                Prompt de código
              </button>
            </div>

            {/* Content Tab */}
            {tab === "content" && (
              <div className="space-y-4">
                {/* Hero */}
                {json.hero && (
                  <Section title="Hero Section">
                    <Field label="Badge" value={json.hero.badge} />
                    <Field label="H1 — Headline principal" value={json.hero.h1} />
                    <Field label="H2 — Subtítulo" value={json.hero.h2} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="CTA Primario" value={json.hero.cta_primary} />
                      <Field label="CTA Secundario" value={json.hero.cta_secondary} />
                    </div>
                    <Field label="Trust Line" value={json.hero.trust_line} />
                    <Field label="Urgency Line" value={json.hero.urgency_line} />
                  </Section>
                )}

                {/* Pain Points */}
                {json.pain_points && json.pain_points.length > 0 && (
                  <Section title="Pain Points">
                    {json.pain_points.map((p, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-1">
                        <p className="text-sm font-semibold text-[#2A3A4A]">{p.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                      </div>
                    ))}
                  </Section>
                )}

                {/* Who We Help */}
                {json.who_we_help && json.who_we_help.length > 0 && (
                  <Section title="¿A quién ayudamos?" defaultOpen={false}>
                    {json.who_we_help.map((w, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-1">
                        <p className="text-sm font-semibold text-[#2A3A4A]">{w.segment}</p>
                        <p className="text-sm text-gray-600">{w.description}</p>
                        <p className="text-xs text-[#F37021] font-medium">→ {w.result}</p>
                      </div>
                    ))}
                  </Section>
                )}

                {/* Pricing */}
                {json.pricing && json.pricing.length > 0 && (
                  <Section title="Planes / Precios" defaultOpen={false}>
                    {json.pricing.map((p, i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-2">
                        <p className="text-sm font-bold text-[#2A3A4A]">{p.name}</p>
                        <p className="text-sm text-gray-600">{p.description}</p>
                        <ul className="space-y-1">
                          {p.features.map((f, j) => (
                            <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                              <span className="text-[#F37021] mt-0.5">•</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs font-medium text-[#F37021]">CTA: "{p.cta}"</p>
                      </div>
                    ))}
                  </Section>
                )}

                {/* Testimonials */}
                {json.testimonials && json.testimonials.length > 0 && (
                  <Section title="Testimonios" defaultOpen={false}>
                    {json.testimonials.map((t, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#2A3A4A]">
                            {t.name} · {t.role}
                          </p>
                          {t.metric && (
                            <span className="text-xs font-medium text-[#F37021] bg-[#F37021]/10 px-2 py-0.5 rounded-full">
                              {t.metric}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 italic">"{t.text}"</p>
                      </div>
                    ))}
                  </Section>
                )}

                {/* FAQ */}
                {json.faq && json.faq.length > 0 && (
                  <Section title="FAQ" defaultOpen={false}>
                    {json.faq.map((f, i) => (
                      <div key={i} className="p-3 border-l-2 border-[#F37021]/30 space-y-1">
                        <p className="text-sm font-semibold text-[#2A3A4A]">{f.question}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
                      </div>
                    ))}
                  </Section>
                )}

                {/* Trust Stats & Risk Reversal */}
                {(json.trust_stats || json.risk_reversal) && (
                  <Section title="Trust Stats y Garantía" defaultOpen={false}>
                    {json.trust_stats && (
                      <div className="flex flex-wrap gap-2">
                        {json.trust_stats.map((s, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-[#2A3A4A]/5 rounded-lg text-xs font-medium text-[#2A3A4A]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {json.risk_reversal && (
                      <p className="text-sm text-gray-600 italic border-l-2 border-green-400 pl-3">
                        {json.risk_reversal}
                      </p>
                    )}
                  </Section>
                )}
              </div>
            )}

            {/* Prompt Tab */}
            {tab === "prompt" && prompt && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Copiá este prompt y pegalo en Cursor, ChatGPT o Claude para generar el código de la landing.
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <CopyButton text={prompt} />
                    <button
                      onClick={() =>
                        handleDownload(prompt, `prompt-${project.name.replace(/\s+/g, "-")}.md`)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#2A3A4A] transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar .md
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <pre className="bg-[#1e2d3d] text-gray-100 text-xs leading-relaxed p-5 rounded-xl overflow-x-auto whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto">
                    {prompt}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
