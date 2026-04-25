import { supabase } from "@/lib/supabase"
import type {
  WizardAnswers,
  TechConfig,
  GeneratedLandingJson,
} from "@/lib/supabase"

export type GeminiOutput = {
  landingJson: GeneratedLandingJson
  codePrompt: string
}

export const generateLandingContent = async (
  answers: WizardAnswers,
  techConfig?: TechConfig
): Promise<GeminiOutput> => {
  if (!supabase) {
    throw new Error(
      "Supabase no configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env"
    )
  }

  const { data, error } = await supabase.functions.invoke("generate-landing", {
    body: { answers, techConfig },
  })

  if (error) {
    throw new Error(
      error.message ?? "Error al generar contenido. Intentá de nuevo."
    )
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data as GeminiOutput
}
