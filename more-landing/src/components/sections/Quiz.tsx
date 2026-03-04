import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  BookOpen,
  Sparkles,
  Send,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { supabase, type LeadInsert } from "@/lib/supabase";

type AcademicLevel =
  | "maestria"
  | "doctorado"
  | "grado5"
  | "otros"
  | null;

type ImpactArea = string | null;

interface QuizState {
  step: number;
  academicLevel: AcademicLevel;
  impactArea: ImpactArea;
  achievements: string[];
}

interface LeadForm {
  nombre: string;
  email: string;
  whatsapp: string;
}

const TOTAL_STEPS = 4;

const academicOptions = [
  { id: "maestria", label: "Maestría", sublabel: null, icon: GraduationCap },
  { id: "doctorado", label: "Doctorado / PhD", sublabel: null, icon: GraduationCap },
  { id: "grado5", label: "Grado + 5 años experiencia", sublabel: null, icon: Briefcase },
  { id: "otros", label: "En proceso / Otra formación", sublabel: "Te evaluamos en consulta", icon: BookOpen },
];

const impactAreas = [
  { id: "salud", label: "Salud & Medicina" },
  { id: "stem", label: "STEM & Tecnología" },
  { id: "social", label: "Impacto Social" },
  { id: "negocios", label: "Negocios & Emprendimiento" },
];

const achievementOptions = [
  { id: "premios", label: "Premios o reconocimientos profesionales" },
  { id: "publicaciones", label: "Publicaciones académicas o artículos" },
  { id: "liderazgo", label: "Roles de liderazgo en organizaciones" },
  { id: "patentes", label: "Patentes o propiedad intelectual" },
  { id: "conferencias", label: "Ponencias en conferencias internacionales" },
];

export default function Quiz() {
  const [quiz, setQuiz] = useState<QuizState>({
    step: 1,
    academicLevel: null,
    impactArea: null,
    achievements: [],
  });

  const [leadForm, setLeadForm] = useState<LeadForm>({
    nombre: "",
    email: "",
    whatsapp: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const progressValue = leadSubmitted
    ? 100
    : showLeadCapture
    ? 87.5
    : showResult
    ? 75
    : ((quiz.step - 1) / (TOTAL_STEPS - 1)) * 75;

  const isHighImpact =
    quiz.academicLevel === "maestria" ||
    quiz.academicLevel === "doctorado" ||
    quiz.academicLevel === "grado5";

  const canProceed = () => {
    if (quiz.step === 1) return quiz.academicLevel !== null
    if (quiz.step === 2) return quiz.impactArea !== null
    if (quiz.step === 3) return quiz.achievements.length > 0
    return false
  }

  const toggleAchievement = (id: string) => {
    setQuiz((prev) => ({
      ...prev,
      achievements: prev.achievements.includes(id)
        ? prev.achievements.filter((a) => a !== id)
        : [...prev.achievements, id],
    }));
  };

  const nextStep = () => {
    if (quiz.step < TOTAL_STEPS) {
      setQuiz((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const prevStep = () => {
    if (quiz.step > 1) {
      setQuiz((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const resetQuiz = () => {
    setQuiz({ step: 1, academicLevel: null, impactArea: null, achievements: [] })
    setLeadForm({ nombre: "", email: "", whatsapp: "" })
    setShowResult(false)
    setShowLeadCapture(false)
    setLeadSubmitted(false)
    setLeadError(null)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.nombre.trim() || !leadForm.email.trim()) return;

    setLeadSubmitting(true);
    setLeadError(null);

    const lead: LeadInsert = {
      nombre: leadForm.nombre.trim(),
      email: leadForm.email.trim(),
      whatsapp: leadForm.whatsapp.trim() || null,
      academic_level: quiz.academicLevel ?? "",
      impact_area: quiz.impactArea ?? "",
      achievements: quiz.achievements,
      result_type: isHighImpact ? "alto_impacto" : "unsung",
    };

    try {
      if (!supabase) throw new Error("Servicio no disponible. Por favor escríbenos por WhatsApp.")
      const { error } = await supabase.from("leads").insert([lead])
      if (error) throw error
      setLeadSubmitted(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado"
      setLeadError(msg.includes("duplicate") || msg.includes("already")
        ? "Ya registramos tu perfil con ese email. ¡Pronto te contactamos!"
        : "No pudimos guardar tu perfil. Por favor escríbenos por WhatsApp."
      )
    } finally {
      setLeadSubmitting(false)
    }
  };

  const whatsappBase = isHighImpact
    ? "https://wa.me/15483122105?text=Hola%20MORE,%20obtuve%20Perfil%20de%20Alto%20Impacto%20en%20el%20quiz.%20Quiero%20agendar%20mi%20evaluación%20gratuita."
    : "https://wa.me/15483122105?text=Hola%20MORE,%20completé%20el%20quiz%20y%20quiero%20conocer%20el%20programa%20Unsung.";

  return (
    <section id="quiz" className="py-24 sm:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
            Evaluación de elegibilidad
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            Descubre tu potencial para la EB-2 NIW
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Responde 3 preguntas rápidas y conoce si tu perfil califica.
          </p>
        </motion.div>

        {/* Quiz Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">
                  {leadSubmitted
                    ? "Completado"
                    : showLeadCapture
                    ? "Paso 4 de 4 — Tus datos"
                    : showResult
                    ? "Paso 4 de 4 — Tu resultado"
                    : `Paso ${quiz.step} de 3`}
                </span>
                <span className="text-xs font-medium text-[#F37021]">
                  {Math.round(progressValue)}%
                </span>
              </div>
              <Progress value={progressValue} />
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#2A3A4A]">
                {leadSubmitted && "¡Perfil registrado!"}
                {!leadSubmitted && showResult && "Tu evaluación de elegibilidad"}
                {!leadSubmitted && !showResult && quiz.step === 1 && "¿Cuál es tu nivel académico más alto?"}
                {!leadSubmitted && !showResult && quiz.step === 2 && "¿Cuál es tu área de impacto principal?"}
                {!leadSubmitted && !showResult && quiz.step === 3 && "¿Cuáles de estos logros aplican a tu perfil?"}
              </CardTitle>
            </CardHeader>

            <CardContent className="pb-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Academic Level */}
                {quiz.step === 1 && !showResult && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
                  >
                    {academicOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          setQuiz((prev) => ({
                            ...prev,
                            academicLevel: option.id as AcademicLevel,
                          }))
                        }
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                          quiz.academicLevel === option.id
                            ? "border-[#F37021] bg-[#F37021]/5 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <option.icon
                          className={`w-5 h-5 shrink-0 ${
                            quiz.academicLevel === option.id
                              ? "text-[#F37021]"
                              : "text-gray-400"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-medium ${
                              quiz.academicLevel === option.id
                                ? "text-[#2A3A4A]"
                                : "text-gray-600"
                            }`}
                          >
                            {option.label}
                          </span>
                          {option.sublabel && (
                            <span className="text-xs text-gray-400 mt-0.5">
                              {option.sublabel}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 2: Impact Area */}
                {quiz.step === 2 && !showResult && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
                  >
                    {impactAreas.map((area) => (
                      <button
                        key={area.id}
                        onClick={() =>
                          setQuiz((prev) => ({ ...prev, impactArea: area.id }))
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                          quiz.impactArea === area.id
                            ? "border-[#F37021] bg-[#F37021]/5 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            quiz.impactArea === area.id
                              ? "text-[#2A3A4A]"
                              : "text-gray-600"
                          }`}
                        >
                          {area.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 3: Achievements */}
                {quiz.step === 3 && !showResult && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 mt-4"
                  >
                    {achievementOptions.map((achievement) => (
                      <button
                        key={achievement.id}
                        onClick={() => toggleAchievement(achievement.id)}
                        className={`flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                          quiz.achievements.includes(achievement.id)
                            ? "border-[#F37021] bg-[#F37021]/5 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                            quiz.achievements.includes(achievement.id)
                              ? "border-[#F37021] bg-[#F37021]"
                              : "border-gray-300"
                          }`}
                        >
                          {quiz.achievements.includes(achievement.id) && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            quiz.achievements.includes(achievement.id)
                              ? "text-[#2A3A4A]"
                              : "text-gray-600"
                          }`}
                        >
                          {achievement.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {!showResult && !showLeadCapture && !leadSubmitted && (
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={quiz.step === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </Button>

                  {quiz.step < 3 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="gap-2"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowResult(true)}
                      disabled={!canProceed()}
                      variant="gold"
                      className="gap-2"
                    >
                      Ver mi evaluación
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}

              {/* Result */}
              <AnimatePresence>
                {showResult && !leadSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="mt-8"
                  >
                    {isHighImpact ? (
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2A3A4A] to-[#3A4D5E] text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <Sparkles className="w-6 h-6 text-[#F37021]" />
                          <h3 className="text-lg font-semibold">
                            ¡Perfil de Alto Impacto!
                          </h3>
                        </div>
                        <p className="text-white/70 text-sm mb-5 leading-relaxed">
                          Tu combinación de nivel académico, área de impacto y
                          logros profesionales te posiciona como un candidato
                          fuerte para la EB-2 NIW. Agenda una consulta
                          personalizada.
                        </p>
                        {!showLeadCapture ? (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="gold"
                              className="gap-2"
                              onClick={() => setShowLeadCapture(true)}
                            >
                              <Send className="w-4 h-4" />
                              Sí, quiero agendar mi evaluación personalizada
                            </Button>
                            <Button
                              variant="outline"
                              className="bg-white border-2 border-[#2A3A4A] text-[#2A3A4A] hover:bg-[#2A3A4A] hover:text-white"
                              onClick={resetQuiz}
                            >
                              Reiniciar Quiz
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-[#F37021]/10 border border-[#F37021]/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Award className="w-6 h-6 text-[#F37021]" />
                          <h3 className="text-lg font-semibold text-[#2A3A4A]">
                            ¡Tu potencial es enorme!
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                          Tu perfil tiene potencial, pero necesitas construir una
                          narrativa más sólida. Nuestro programa{" "}
                          <strong>Unsung Professional</strong> te ayudará a
                          posicionarte estratégicamente.
                        </p>
                        {!showLeadCapture ? (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="gold"
                              className="gap-2"
                              onClick={() => setShowLeadCapture(true)}
                            >
                              <BookOpen className="w-4 h-4" />
                              Sí, quiero conocer el programa Unsung
                            </Button>
                            <Button variant="outline" onClick={resetQuiz}>
                              Reiniciar Quiz
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lead Capture — Paso 4 */}
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
                        Un paso más — recibe tu evaluación personalizada
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Déjanos tus datos y uno de nuestros asesores se pondrá en contacto contigo.
                      </p>
                      <form onSubmit={handleLeadSubmit} className="space-y-3">
                        <Input
                          placeholder="Nombre completo *"
                          value={leadForm.nombre}
                          onChange={(e) =>
                            setLeadForm((p) => ({ ...p, nombre: e.target.value }))
                          }
                          required
                          disabled={leadSubmitting}
                        />
                        <Input
                          type="email"
                          placeholder="Correo electrónico *"
                          value={leadForm.email}
                          onChange={(e) =>
                            setLeadForm((p) => ({ ...p, email: e.target.value }))
                          }
                          required
                          disabled={leadSubmitting}
                        />
                        <Input
                          type="tel"
                          placeholder="WhatsApp (opcional)"
                          value={leadForm.whatsapp}
                          onChange={(e) =>
                            setLeadForm((p) => ({ ...p, whatsapp: e.target.value }))
                          }
                          disabled={leadSubmitting}
                        />
                        {leadError && (
                          <p className="text-xs text-red-500">{leadError}</p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                          <Button
                            type="submit"
                            variant="gold"
                            className="gap-2 flex-1"
                            disabled={leadSubmitting}
                          >
                            <Send className="w-4 h-4" />
                            {leadSubmitting ? "Enviando..." : "Quiero recibir mi evaluación"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={resetQuiz}
                            disabled={leadSubmitting}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirmación post-envío */}
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
                      ¡Perfil enviado con éxito!
                    </h3>
                    <p className="text-sm text-gray-600 mb-5">
                      Uno de nuestros asesores revisará tu caso y se pondrá en contacto contigo pronto.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="gold" className="gap-2" asChild>
                        <a
                          href={whatsappBase}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Hablar por WhatsApp ahora
                        </a>
                      </Button>
                      <Button variant="outline" onClick={resetQuiz}>
                        Reiniciar Quiz
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bridge → Success */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-gray-400 mt-10 italic"
        >
          Mira lo que pasa cuando el perfil correcto recibe la estrategia correcta.
        </motion.p>
      </div>
    </section>
  );
}
