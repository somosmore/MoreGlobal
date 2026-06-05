import { motion } from "framer-motion"
import { Crown, FileSearch, Gift, Sparkles, UsersRound } from "lucide-react"
import { useTranslation } from "react-i18next"

type UppBonusStackSectionProps = {
  price?: string | null
  loading?: boolean
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  fileSearch: FileSearch,
  sparkles: Sparkles,
  crown: Crown,
  usersRound: UsersRound,
}

export function UppBonusStackSection({ price, loading }: UppBonusStackSectionProps) {
  const { t } = useTranslation()
  const effectivePrice = price || "$2,500"
  const bonuses = t("uppPage.bonusStack.bonuses", { returnObjects: true }) as Array<{
    icon: string
    tag: string
    title: string
    text: string
  }>

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0A3161] via-[#0D3B6E] to-[#14477A] p-8 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-10 max-w-2xl text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-orange">
          <Gift className="h-3.5 w-3.5" />
          {t("uppPage.bonusStack.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("uppPage.bonusStack.title")}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {bonuses.map((bonus, i) => {
          const Icon = iconMap[bonus.icon] ?? Gift
          return (
            <motion.div
              key={bonus.tag}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 150 }}
              whileHover={{ y: -5 }}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-orange/30 hover:bg-white/10"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-dark text-white shadow-lg shadow-orange/25"
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange">
                  {bonus.tag}
                </span>
                <h3 className="mt-1 text-base font-semibold text-white">{bonus.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{bonus.text}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 150 }}
        className="mx-auto mt-8 max-w-xl rounded-2xl border border-orange/20 bg-white/5 p-6 text-center backdrop-blur-sm"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-white/70">
            {t("uppPage.bonusStack.stackValueLabel")}
          </span>
          <span className="text-lg font-bold text-white/50 line-through sm:text-xl">
            {t("uppPage.bonusStack.stackValueAmount")}
          </span>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-orange sm:text-4xl">
          {t("uppPage.bonusStack.freeLabel")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {loading ? (
            <span className="inline-block h-4 w-48 animate-pulse rounded bg-white/20 align-middle" />
          ) : (
            t("uppPage.bonusStack.priceNote", { price: effectivePrice })
          )}
        </p>
      </motion.div>
    </div>
  )
}
