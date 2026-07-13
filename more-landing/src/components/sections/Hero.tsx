import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Play, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Backdrop } from "@/components/brand/Backdrop"
import { CtaButton } from "@/components/brand/CtaButton"
import { useTranslation } from "react-i18next"
import { supabase } from "@/lib/supabase"

const FALLBACK_INITIALS = ["IM", "CR", "JR", "AP"]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export default function Hero() {
  const { t } = useTranslation()
  const [initials, setInitials] = useState<string[]>(FALLBACK_INITIALS)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from("testimonials")
      .select("name")
      .order("sort_order", { ascending: true })
      .limit(4)
      .then(({ data }) => {
        if (data && data.length >= 4) {
          setInitials(data.map((t: { name: string }) => getInitials(t.name)))
        }
      })
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Backdrop variant="hero" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/80 px-4 py-2 backdrop-blur-sm"
          >
            <Star className="h-3.5 w-3.5 fill-orange text-orange" aria-hidden />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-navy">
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-balance font-display text-5xl leading-[1.05] text-navy-deep sm:text-6xl lg:text-7xl"
          >
            {t("hero.title")} <span className="text-orange">{t("hero.titleHighlight")}</span>{" "}
            {t("hero.titleEnd")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 flex items-center justify-center gap-3"
            aria-hidden
          >
            <span className="h-px w-16 bg-navy/50 sm:w-24" />
            <Star className="h-4 w-4 fill-orange text-orange" />
            <span className="h-px w-16 bg-orange sm:w-24" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted sm:text-xl"
          >
            {t("hero.subtitle")}{" "}
            <strong className="font-semibold text-navy">{t("hero.subtitleStrong")}</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <CtaButton
              label={t("hero.cta1")}
              href="#quiz"
              size="lg"
              icon={ArrowRight}
              className="w-auto"
            />
            <Button size="lg" variant="secondary" className="group rounded-full" asChild>
              <Link to="/blueprint">
                <Play className="mr-2 h-4 w-4" />
                {t("hero.cta2")}
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mx-auto mt-6 max-w-xl font-sans text-sm italic text-ink-muted"
          >
            {t("hero.urgency")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex flex-col items-center justify-center gap-6 font-sans text-sm text-ink-muted sm:flex-row sm:gap-8"
          >
            <span className="font-medium text-navy">{t("hero.audienceLabel")}</span>
            <div className="hidden h-4 w-px bg-navy/15 sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {initials.map((ini) => (
                  <div
                    key={ini}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-navy-deep text-[9px] font-bold text-white"
                  >
                    {ini}
                  </div>
                ))}
              </div>
              <span>{t("hero.socialProof")}</span>
            </div>
            <div className="hidden h-4 w-px bg-navy/15 sm:block" />
            <span>{t("hero.approvalRate")}</span>
            <div className="hidden h-4 w-px bg-navy/15 sm:block" />
            <span>{t("hero.noSponsor")}</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
