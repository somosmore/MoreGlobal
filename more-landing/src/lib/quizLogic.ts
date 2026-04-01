export type InUsStatus = "en_usa_status" | "en_usa_sin_status" | "fuera_usa"

export type MigrationGoal =
  | "crecer_profesionalmente"
  | "crear_o_expandir_negocio"
  | "obtener_residencia_permanente"
  | "trabajar_temporalmente"
  | "explorar_oportunidades"

export type BusinessExperience = "tiene_activo" | "tuvo" | "no"
export type InvestmentCapacity = "mas_100k" | "menos_100k" | "no"
export type CompanyCanExpand = "si" | "no" | "no_se"
export type ExtraordinaryProfile = "alto" | "medio" | "no"
export type ProjectClarity = "estructurado" | "idea" | "no"
export type EvidenceReadiness = "si" | "parcialmente" | "no"
export type Timeframe = "0_3" | "3_6" | "6_12" | "explorando"

export type EligibilitySegment = "listo" | "necesita_estructura" | "no_califica_aun"
export type RecommendedRoute = "unsung_program" | "mentoria_more" | "abogado" | "contenido"

export type VisaBucket = "eb1" | "eb2" | "o1" | "e2" | "l1" | "otra"

export type QuizAnswers = {
  country_residence: string | null
  nationality: string | null
  in_us_status: InUsStatus | null
  migration_goal: MigrationGoal | null
  has_treaty_country: boolean | null
  academic_level: string | null
  impact_area: string | null
  achievements: string[]
  has_business: BusinessExperience | null
  investment_capacity: InvestmentCapacity | null
  company_can_expand: CompanyCanExpand | null
  extraordinary_profile: ExtraordinaryProfile | null
  high_level_connections: string[]
  project_clarity: ProjectClarity | null
  evidence_readiness: EvidenceReadiness | null
  timeframe: Timeframe | null
  years_experience_5_plus: boolean | null
}

const TREATY_COUNTRIES = new Set(
  [
    "argentina",
    "australia",
    "austria",
    "belgium",
    "bosnia and herzegovina",
    "bulgaria",
    "canada",
    "chile",
    "colombia",
    "costa rica",
    "croatia",
    "czech republic",
    "denmark",
    "estonia",
    "ethiopia",
    "finland",
    "france",
    "germany",
    "greece",
    "honduras",
    "ireland",
    "israel",
    "italy",
    "jamaica",
    "japan",
    "jordan",
    "kosovo",
    "latvia",
    "liberia",
    "lithuania",
    "luxembourg",
    "mexico",
    "montenegro",
    "morocco",
    "netherlands",
    "new zealand",
    "north macedonia",
    "norway",
    "oman",
    "pakistan",
    "panama",
    "paraguay",
    "philippines",
    "poland",
    "romania",
    "senegal",
    "serbia",
    "singapore",
    "slovak republic",
    "slovenia",
    "south korea",
    "spain",
    "sri lanka",
    "suriname",
    "sweden",
    "switzerland",
    "taiwan",
    "thailand",
    "trinidad and tobago",
    "turkey",
    "ukraine",
    "united kingdom",
    "uruguay",
  ].map((c) => c.toLowerCase())
)

export const hasTreatyCountry = (nationality: string | null | undefined) => {
  if (!nationality) return false
  const normalized = nationality.trim().toLowerCase()
  if (!normalized) return false
  return TREATY_COUNTRIES.has(normalized)
}

export const computeVisaBuckets = (answers: QuizAnswers): VisaBucket[] => {
  const buckets = new Set<VisaBucket>()

  const academicStrong =
    answers.academic_level === "maestria" ||
    answers.academic_level === "doctorado" ||
    answers.academic_level === "grado5"

  const achievementStrong =
    answers.achievements.length > 0 ||
    answers.extraordinary_profile === "alto" ||
    answers.high_level_connections.length > 0

  const isHighImpactArea =
    answers.impact_area === "salud" ||
    answers.impact_area === "energia" ||
    answers.impact_area === "tecnologia" ||
    answers.impact_area === "educacion" ||
    answers.impact_area === "medio_ambiente" ||
    answers.impact_area === "desarrollo_economico"

  if (academicStrong && achievementStrong && isHighImpactArea) {
    buckets.add("eb1")
  }

  if (
    academicStrong &&
    (answers.years_experience_5_plus || false) &&
    (isHighImpactArea || answers.impact_area === "otro")
  ) {
    buckets.add("eb2")
  }

  if (achievementStrong && (answers.extraordinary_profile === "alto" || answers.extraordinary_profile === "medio")) {
    buckets.add("o1")
  }

  const canDoBusiness =
    (answers.has_business === "tiene_activo" || answers.has_business === "tuvo") &&
    (answers.investment_capacity === "mas_100k" || answers.investment_capacity === "menos_100k")

  if (canDoBusiness && answers.has_treaty_country) {
    buckets.add("e2")
  }

  if (answers.company_can_expand === "si" && answers.has_business === "tiene_activo") {
    buckets.add("l1")
  }

  if (buckets.size === 0 && answers.migration_goal) {
    buckets.add("otra")
  }

  return Array.from(buckets)
}

export const classifyReadiness = (answers: QuizAnswers): EligibilitySegment => {
  const strongProject =
    answers.project_clarity === "estructurado" && answers.evidence_readiness === "si" && answers.timeframe !== "explorando"

  if (strongProject) {
    return "listo"
  }

  const weakSignals =
    answers.project_clarity === "no" &&
    answers.evidence_readiness === "no" &&
    (answers.timeframe === "explorando" || answers.timeframe === null)

  if (weakSignals) {
    return "no_califica_aun"
  }

  return "necesita_estructura"
}

export const recommendRoute = (
  answers: QuizAnswers,
  visaBuckets: VisaBucket[],
  segment: EligibilitySegment
): RecommendedRoute => {
  const wantsResidency =
    answers.migration_goal === "obtener_residencia_permanente" ||
    answers.migration_goal === "crear_o_expandir_negocio"

  const urgent =
    answers.timeframe === "0_3" || answers.timeframe === "3_6"

  const hasStrongVisa =
    visaBuckets.includes("eb1") ||
    visaBuckets.includes("eb2") ||
    visaBuckets.includes("o1")

  if (segment === "listo" && hasStrongVisa && urgent) {
    return "unsung_program"
  }

  if (segment === "necesita_estructura" && (hasStrongVisa || visaBuckets.includes("e2") || visaBuckets.includes("l1"))) {
    return "mentoria_more"
  }

  if (segment === "listo" && !hasStrongVisa && wantsResidency) {
    return "abogado"
  }

  return "contenido"
}

