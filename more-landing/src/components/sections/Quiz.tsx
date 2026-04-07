import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle2, MessageCircle, Sparkles, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase, type LeadInsert } from "@/lib/supabase"
import { useTranslation } from "react-i18next"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { trackLeadFromQuiz } from "@/lib/tracking"
import {
  hasTreatyCountry,
  computeVisaBuckets,
  classifyReadiness,
  recommendRoute,
  type QuizAnswers,
  type EligibilitySegment,
  type RecommendedRoute,
  type VisaBucket,
} from "@/lib/quizLogic"

type QuizState = {
  step: number
  answers: QuizAnswers
}

type LeadForm = {
  nombre: string
  email: string
  whatsapp: string
}

type Diagnosis = {
  segment: EligibilitySegment
  route: RecommendedRoute
  visaBuckets: VisaBucket[]
  resultType: "alto_impacto" | "unsung"
}

const TOTAL_STEPS = 7

const initialAnswers: QuizAnswers = {
  country_residence: null,
  nationality: null,
  in_us_status: null,
  migration_goal: null,
  has_treaty_country: null,
  academic_level: null,
  impact_area: null,
  achievements: [],
  has_business: null,
  investment_capacity: null,
  company_can_expand: null,
  extraordinary_profile: null,
  high_level_connections: [],
  project_clarity: null,
  evidence_readiness: null,
  timeframe: null,
  years_experience_5_plus: null,
}

const getResultTypeFromBuckets = (buckets: VisaBucket[]): "alto_impacto" | "unsung" => {
  if (buckets.includes("eb1") || buckets.includes("eb2") || buckets.includes("o1")) {
    return "alto_impacto"
  }
  return "unsung"
}

export default function Quiz() {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()

  const basicOptions = t("quiz.diagnostic.basic", { returnObjects: true }) as {
    countries: Array<{ id: string; label: string }>
    goals: Array<{ id: string; label: string; description?: string }>
  }

  const professionalOptions = t("quiz.diagnostic.professional", { returnObjects: true }) as {
    education: Array<{ id: string; label: string; description?: string }>
    achievements: Array<{ id: string; label: string }>
    sectors: Array<{ id: string; label: string }>
  }

  const businessOptions = t("quiz.diagnostic.business", { returnObjects: true }) as {
    business: Array<{ id: string; label: string }>
    investment: Array<{ id: string; label: string }>
    expansion: Array<{ id: string; label: string }>
  }

  const extraordinaryOptions = t("quiz.diagnostic.extraordinary", { returnObjects: true }) as {
    recognition: Array<{ id: string; label: string }>
    connections: Array<{ id: string; label: string }>
  }

  const preparationOptions = t("quiz.diagnostic.preparation", { returnObjects: true }) as {
    project: Array<{ id: string; label: string }>
    evidence: Array<{ id: string; label: string }>
    timeframe: Array<{ id: string; label: string }>
  }

  const [quiz, setQuiz] = useState<QuizState>({
    step: 1,
    answers: initialAnswers,
  })

  const [leadForm, setLeadForm] = useState<LeadForm>({
    nombre: "",
    email: "",
    whatsapp: "",
  })
  const [showResult, setShowResult] = useState(false)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState<string | null>(null)
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)

  const canProceed = () => {
    const a = quiz.answers
    if (quiz.step === 1) return !!a.country_residence && !!a.nationality
    if (quiz.step === 2) return !!a.in_us_status && !!a.migration_goal
    if (quiz.step === 3) return true
    if (quiz.step === 4) return !!a.academic_level && a.years_experience_5_plus !== null
    if (quiz.step === 5) return a.achievements.length > 0 && !!a.impact_area
    if (quiz.step === 6)
      return !!a.has_business && !!a.investment_capacity && !!a.company_can_expand && !!a.extraordinary_profile
    if (quiz.step === 7) return !!a.project_clarity && !!a.evidence_readiness && !!a.timeframe
    return false
  }

  const handleToggleInArray = (key: keyof QuizAnswers, id: string) => {
    setQuiz((prev) => {
      const current = (prev.answers[key] as string[]) ?? []
      const exists = current.includes(id)
      const next = exists ? current.filter((x) => x !== id) : [...current, id]
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [key]: next,
        },
      }
    })
  }

  const progressValue = leadSubmitted
    ? 100
    : showLeadCapture
    ? 90
    : showResult
    ? 80
    : ((quiz.step - 1) / (TOTAL_STEPS - 1)) * 75

  const nextStep = () => {
    if (quiz.step < TOTAL_STEPS) {
      setQuiz((prev) => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const prevStep = () => {
    if (quiz.step > 1) {
      setQuiz((prev) => ({ ...prev, step: prev.step - 1 }))
    }
  }

  const resetQuiz = () => {
    setQuiz({ step: 1, answers: initialAnswers })
    setLeadForm({ nombre: "", email: "", whatsapp: "" })
    setShowResult(false)
    setShowLeadCapture(false)
    setLeadSubmitted(false)
    setLeadError(null)
    setDiagnosis(null)
  }

  const computeDiagnosis = () => {
    const answers = {
      ...quiz.answers,
      has_treaty_country: hasTreatyCountry(quiz.answers.nationality),
    }

    const visaBuckets = computeVisaBuckets(answers)
    const segment = classifyReadiness(answers)
    const route = recommendRoute(answers, visaBuckets, segment)
    const resultType = getResultTypeFromBuckets(visaBuckets)

    setQuiz((prev) => ({
      ...prev,
      answers: {
        ...answers,
      },
    }))

    setDiagnosis({
      segment,
      route,
      visaBuckets,
      resultType,
    })
    setShowResult(true)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadForm.nombre.trim() || !leadForm.email.trim()) return

    setLeadSubmitting(true)
    setLeadError(null)

    const diag = diagnosis
      ? diagnosis
      : (() => {
          const answers = {
            ...quiz.answers,
            has_treaty_country: hasTreatyCountry(quiz.answers.nationality),
          }
          const visaBuckets = computeVisaBuckets(answers)
          const segment = classifyReadiness(answers)
          const route = recommendRoute(answers, visaBuckets, segment)
          const resultType = getResultTypeFromBuckets(visaBuckets)
          setDiagnosis({ segment, route, visaBuckets, resultType })
          return { segment, route, visaBuckets, resultType }
        })()

    const lead: LeadInsert = {
      nombre: leadForm.nombre.trim(),
      email: leadForm.email.trim(),
      whatsapp: leadForm.whatsapp.trim() || null,
      country_residence: quiz.answers.country_residence ?? "",
      nationality: quiz.answers.nationality ?? "",
      in_us_status: quiz.answers.in_us_status ?? "",
      migration_goal: quiz.answers.migration_goal ?? "",
      academic_level: quiz.answers.academic_level ?? "",
      impact_area: quiz.answers.impact_area ?? "",
      achievements: quiz.answers.achievements,
      result_type: diag.resultType,
      treaty_visa_eligible: quiz.answers.has_treaty_country ?? null,
      business_experience: quiz.answers.has_business ?? "",
      investment_capacity: quiz.answers.investment_capacity ?? "",
      company_can_expand: quiz.answers.company_can_expand ?? "",
      extraordinary_profile: quiz.answers.extraordinary_profile ?? "",
      high_level_connections: quiz.answers.high_level_connections,
      project_clarity: quiz.answers.project_clarity ?? "",
      evidence_readiness: quiz.answers.evidence_readiness ?? "",
      timeframe: quiz.answers.timeframe ?? "",
      eligibility_segment: diag.segment,
      recommended_route: diag.route,
      visa_buckets: diag.visaBuckets,
    }

    try {
      if (!supabase) throw new Error(t("quiz.errorUnavailable"))
      const { error } = await supabase.from("leads").insert([lead])
      if (error) throw error
      setLeadSubmitted(true)
      await trackLeadFromQuiz(settings)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado"
      setLeadError(
        msg.includes("duplicate") || msg.includes("already")
          ? t("quiz.errorDuplicate")
          : t("quiz.errorGeneral")
      )
    } finally {
      setLeadSubmitting(false)
    }
  }

  const whatsappBase =
    diagnosis && diagnosis.resultType === "alto_impacto"
      ? t("quiz.whatsappHighImpact")
      : t("quiz.whatsappUnsung")

  const stepLabel = leadSubmitted
    ? t("quiz.completed")
    : showLeadCapture
    ? t("quiz.step4Data")
    : showResult
    ? t("quiz.step4Result")
    : t("quiz.stepOf", { step: quiz.step })

  const cardTitle = leadSubmitted
    ? t("quiz.profileRegistered")
    : !showResult
    ? t(`quiz.step${quiz.step}Title`)
    : t("quiz.yourEvaluation")

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mt-4"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.countryResidenceQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {basicOptions.countries.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: { ...prev.answers, country_residence: option.id },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.country_residence === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.nationalityQuestion")}</p>
        <Input
          placeholder={t("quiz.diagnostic.nationalityPlaceholder")}
          value={quiz.answers.nationality ?? ""}
          onChange={(e) =>
            setQuiz((prev) => ({
              ...prev,
              answers: { ...prev.answers, nationality: e.target.value },
            }))
          }
        />
        <p className="text-[11px] text-gray-400">
          {t("quiz.diagnostic.nationalityHint")}
        </p>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 mt-4"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.inUsQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "en_usa_status", label: t("quiz.diagnostic.inUsWithStatus") },
            { id: "en_usa_sin_status", label: t("quiz.diagnostic.inUsWithoutStatus") },
            { id: "fuera_usa", label: t("quiz.diagnostic.outsideUs") },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: { ...prev.answers, in_us_status: option.id as QuizAnswers["in_us_status"] },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.in_us_status === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.mainGoalQuestion")}</p>
        <div className="space-y-2">
          {basicOptions.goals.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: { ...prev.answers, migration_goal: option.id as QuizAnswers["migration_goal"] },
                }))
              }
              className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.migration_goal === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              <span className="block">{option.label}</span>
              {option.description && (
                <span className="block text-[11px] text-gray-400 mt-0.5">
                  {option.description}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderStep3 = () => {
    const hasTreaty = hasTreatyCountry(quiz.answers.nationality)
    return (
      <motion.div
        key="step3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 mt-4"
      >
        <p className="text-sm font-medium text-[#2A3A4A]">
          {t("quiz.diagnostic.treatyIntro")}
        </p>
        <div className="p-4 rounded-2xl border-2 bg-white flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            {quiz.answers.nationality
              ? t(hasTreaty ? "quiz.diagnostic.treatyYes" : "quiz.diagnostic.treatyNo", {
                  country: quiz.answers.nationality,
                })
              : t("quiz.diagnostic.treatyUnknown")}
          </p>
          <p className="text-xs text-gray-400">
            {t("quiz.diagnostic.treatyNote")}
          </p>
        </div>
      </motion.div>
    )
  }

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 mt-4"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.educationQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {professionalOptions.education.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: { ...prev.answers, academic_level: option.id },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.academic_level === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              <span className="block">{option.label}</span>
              {option.description && (
                <span className="block text-[11px] text-gray-400 mt-0.5">
                  {option.description}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.yearsExperienceQuestion")}</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: true, label: t("quiz.diagnostic.yes") },
            { id: false, label: t("quiz.diagnostic.no") },
          ].map((option) => (
            <button
              key={String(option.id)}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: { ...prev.answers, years_experience_5_plus: option.id },
                }))
              }
              className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${
                quiz.answers.years_experience_5_plus === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderStep5 = () => {
    const achievements = professionalOptions.achievements
    const sectors = professionalOptions.sectors
    const hasNone = quiz.answers.achievements.includes("ninguno")

    const handleAchievementClick = (id: string) => {
      if (id === "ninguno") {
        setQuiz((prev) => ({
          ...prev,
          answers: { ...prev.answers, achievements: ["ninguno"] },
        }))
        return
      }
      const current = quiz.answers.achievements
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current.filter((x) => x !== "ninguno"), id]
      setQuiz((prev) => ({
        ...prev,
        answers: { ...prev.answers, achievements: next },
      }))
    }

    return (
      <motion.div
        key="step5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-5 mt-4"
      >
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.achievementsQuestion")}</p>
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const selected = quiz.answers.achievements.includes(achievement.id)
              return (
                <button
                  key={achievement.id}
                  type="button"
                  onClick={() => handleAchievementClick(achievement.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl border-2 text-left text-sm transition-all ${
                    selected
                      ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                      : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      selected ? "border-[#F37021] bg-[#F37021]" : "border-gray-300"
                    }`}
                  >
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span>{achievement.label}</span>
                </button>
              )
            })}
          </div>
          {hasNone && (
            <p className="text-[11px] text-gray-400 mt-1">
              {t("quiz.diagnostic.achievementsNoneHint")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.sectorQuestion")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sectors.map((sector) => (
              <button
                key={sector.id}
                type="button"
                onClick={() =>
                  setQuiz((prev) => ({
                    ...prev,
                    answers: { ...prev.answers, impact_area: sector.id },
                  }))
                }
                className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                  quiz.answers.impact_area === sector.id
                    ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
                }`}
              >
                {sector.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const renderStep6 = () => (
    <motion.div
      key="step6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 mt-4"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.businessQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {businessOptions.business.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: { ...prev.answers, has_business: option.id as QuizAnswers["has_business"] },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.has_business === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.investmentQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {businessOptions.investment.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: {
                    ...prev.answers,
                    investment_capacity: option.id as QuizAnswers["investment_capacity"],
                  },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.investment_capacity === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.expansionQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {businessOptions.expansion.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: {
                    ...prev.answers,
                    company_can_expand: option.id as QuizAnswers["company_can_expand"],
                  },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.company_can_expand === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.recognitionQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {extraordinaryOptions.recognition.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: {
                    ...prev.answers,
                    extraordinary_profile: option.id as QuizAnswers["extraordinary_profile"],
                  },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.extraordinary_profile === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.connectionsQuestion")}</p>
        <div className="space-y-3">
          {extraordinaryOptions.connections.map((option) => {
            const selected = (quiz.answers.high_level_connections ?? []).includes(option.id)
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleToggleInArray("high_level_connections", option.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl border-2 text-left text-sm transition-all ${
                  selected
                    ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected ? "border-[#F37021] bg-[#F37021]" : "border-gray-300"
                  }`}
                >
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )

  const renderStep7 = () => (
    <motion.div
      key="step7"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 mt-4"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.projectQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {preparationOptions.project.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: {
                    ...prev.answers,
                    project_clarity: option.id as QuizAnswers["project_clarity"],
                  },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.project_clarity === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.evidenceQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {preparationOptions.evidence.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: {
                    ...prev.answers,
                    evidence_readiness: option.id as QuizAnswers["evidence_readiness"],
                  },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.evidence_readiness === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2A3A4A]">{t("quiz.diagnostic.timeframeQuestion")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {preparationOptions.timeframe.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setQuiz((prev) => ({
                  ...prev,
                  answers: {
                    ...prev.answers,
                    timeframe: option.id as QuizAnswers["timeframe"],
                  },
                }))
              }
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                quiz.answers.timeframe === option.id
                  ? "border-[#F37021] bg-[#F37021]/5 shadow-md text-[#2A3A4A]"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderDiagnosis = () => {
    if (!diagnosis) return null

    const segmentKey =
      diagnosis.segment === "listo"
        ? "quiz.diagnostic.segment.ready"
        : diagnosis.segment === "necesita_estructura"
        ? "quiz.diagnostic.segment.needsStructure"
        : "quiz.diagnostic.segment.notReady"

    const routeKeyMap: Record<RecommendedRoute, string> = {
      unsung_program: "quiz.diagnostic.route.unsung",
      mentoria_more: "quiz.diagnostic.route.mentoring",
      abogado: "quiz.diagnostic.route.lawyer",
      contenido: "quiz.diagnostic.route.content",
    }

    const routeKey = routeKeyMap[diagnosis.route]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="mt-8"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2A3A4A] to-[#3A4D5E] text-white">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-[#F37021]" />
            <h3 className="text-lg font-semibold">
              {t("quiz.diagnostic.resultTitle")}
            </h3>
          </div>

          <p className="text-white/80 text-sm mb-4 leading-relaxed">
            {t("quiz.diagnostic.resultIntro")}
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-1">
                {t("quiz.diagnostic.segmentLabel")}
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                {t(segmentKey)}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-1">
                {t("quiz.diagnostic.visaBucketsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {diagnosis.visaBuckets.length === 0 ? (
                  <span className="text-xs text-white/70">
                    {t("quiz.diagnostic.visaBucketsEmpty")}
                  </span>
                ) : (
                  diagnosis.visaBuckets.map((bucket) => (
                    <span
                      key={bucket}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-[#F37021]/15 text-xs font-medium text-white"
                    >
                      {t(`quiz.diagnostic.bucket.${bucket}`)}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-1">
                {t("quiz.diagnostic.recommendedRouteLabel")}
              </p>
              <p className="text-sm text-white">
                {t(routeKey)}
              </p>
            </div>
          </div>

          {!showLeadCapture && !leadSubmitted && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="gold"
                className="gap-2"
                onClick={() => setShowLeadCapture(true)}
              >
                <Send className="w-4 h-4" />
                {t("quiz.diagnostic.ctaLead")}
              </Button>
              <Button
                variant="outline"
                className="bg-white text-[#2A3A4A] hover:bg-[#2A3A4A] hover:text-white"
                onClick={resetQuiz}
              >
                {t("quiz.restartQuiz")}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <section id="quiz" className="py-24 sm:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
            {t("quiz.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            {t("quiz.title")}
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            {t("quiz.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">{stepLabel}</span>
                <motion.span
                  key={quiz.step}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-xs font-semibold text-[#F37021]"
                >
                  {Math.round(progressValue)}%
                </motion.span>
              </div>
              <div
                className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressValue)}
              >
                <motion.div
                  key={quiz.step}
                  initial={{
                    width: `${Math.max(progressValue - 15, 0)}%`,
                    boxShadow: "0 0 0 rgba(243,112,33,0)",
                  }}
                  animate={{
                    width: `${progressValue}%`,
                    boxShadow: [
                      "0 0 0 rgba(243,112,33,0)",
                      "0 0 18px rgba(243,112,33,0.85)",
                      "0 0 0 rgba(243,112,33,0)",
                    ],
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#F37021] via-[#FF8A3C] to-[#D4611A]"
                />
                <motion.div
                  key={`shine-${quiz.step}`}
                  initial={{ x: "-100%" }}
                  animate={{ x: "120%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-screen"
                />
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#2A3A4A]">{cardTitle}</CardTitle>
            </CardHeader>

            <CardContent className="pb-8">
              <AnimatePresence mode="wait">
                {!showResult && (
                  <>
                    {quiz.step === 1 && renderStep1()}
                    {quiz.step === 2 && renderStep2()}
                    {quiz.step === 3 && renderStep3()}
                    {quiz.step === 4 && renderStep4()}
                    {quiz.step === 5 && renderStep5()}
                    {quiz.step === 6 && renderStep6()}
                    {quiz.step === 7 && renderStep7()}
                  </>
                )}
              </AnimatePresence>

              {!showResult && !showLeadCapture && !leadSubmitted && (
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={quiz.step === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("quiz.back")}
                  </Button>

                  {quiz.step < TOTAL_STEPS ? (
                    <Button onClick={nextStep} disabled={!canProceed()} className="gap-2">
                      {t("quiz.continue")}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (canProceed()) computeDiagnosis()
                      }}
                      disabled={!canProceed()}
                      variant="gold"
                      className="gap-2"
                    >
                      {t("quiz.seeMyEvaluation")}
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}

              <AnimatePresence>{showResult && !leadSubmitted && renderDiagnosis()}</AnimatePresence>

              <AnimatePresence>
                {showLeadCapture && !leadSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6"
                  >
                    <div className="p-6 rounded-2xl border-2 border-[#F37021]/30 bg-white">
                      <p className="text-sm font-semibold text-[#2A3A4A] mb-1">
                        {t("quiz.leadTitle")}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        {t("quiz.leadDesc")}
                      </p>
                      <form onSubmit={handleLeadSubmit} className="space-y-3">
                        <Input
                          placeholder={t("quiz.namePlaceholder")}
                          value={leadForm.nombre}
                          onChange={(e) => setLeadForm((p) => ({ ...p, nombre: e.target.value }))}
                          required
                          disabled={leadSubmitting}
                        />
                        <Input
                          type="email"
                          placeholder={t("quiz.emailPlaceholder")}
                          value={leadForm.email}
                          onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))}
                          required
                          disabled={leadSubmitting}
                        />
                        <Input
                          type="tel"
                          placeholder={t("quiz.whatsappPlaceholder")}
                          value={leadForm.whatsapp}
                          onChange={(e) => setLeadForm((p) => ({ ...p, whatsapp: e.target.value }))}
                          disabled={leadSubmitting}
                        />
                        {leadError && <p className="text-xs text-red-500">{leadError}</p>}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                          <Button
                            type="submit"
                            variant="gold"
                            className="gap-2 flex-1"
                            disabled={leadSubmitting}
                          >
                            <Send className="w-4 h-4" />
                            {leadSubmitting ? t("quiz.submitting") : t("quiz.submitCta")}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={resetQuiz}
                            disabled={leadSubmitting}
                          >
                            {t("quiz.cancel")}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {leadSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 p-6 rounded-2xl bg-green-50 border border-green-200 text-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-[#2A3A4A] mb-1">
                      {t("quiz.successTitle")}
                    </h3>
                    <p className="text-sm text-gray-600 mb-5">{t("quiz.successDesc")}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="gold" className="gap-2" asChild>
                        <a href={whatsappBase} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-4 h-4" />
                          {t("quiz.whatsappCta")}
                        </a>
                      </Button>
                      <Button variant="outline" onClick={resetQuiz}>
                        {t("quiz.restartQuiz")}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-gray-400 mt-10 italic"
        >
          {t("quiz.bridge")}
        </motion.p>
      </div>
    </section>
  )
}

