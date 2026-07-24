import { useState, type KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"
import { SectionHeading } from "@/components/brand/SectionHeading"
import { cn } from "@/lib/utils"

export const ThankYouChecklist = () => {
  const { t } = useTranslation()
  const rawItems = t("thankYouPage.checklist.items", { returnObjects: true })
  const items = Array.isArray(rawItems) ? (rawItems as string[]) : []
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false))

  if (items.length === 0) return null

  const handleToggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleToggle(index)
    }
  }

  const doneCount = checked.filter(Boolean).length

  return (
    <div>
      <SectionHeading
        title={t("thankYouPage.checklist.title")}
        highlight={t("thankYouPage.checklist.titleHighlight")}
        description={t("thankYouPage.checklist.description")}
      />

      <p className="mt-2 text-center font-sans text-xs font-semibold uppercase tracking-[0.18em] text-orange">
        {t("thankYouPage.checklist.eyebrow")} · {doneCount}/{items.length}
      </p>

      <ul className="mx-auto mt-8 max-w-xl space-y-3" role="list">
        {items.map((item, index) => {
          const isChecked = checked[index]
          const id = `thank-you-check-${index}`

          return (
            <li key={id}>
              <button
                type="button"
                id={id}
                role="checkbox"
                aria-checked={isChecked}
                aria-label={item}
                tabIndex={0}
                onClick={() => handleToggle(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  "flex w-full min-h-[44px] items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
                  isChecked
                    ? "border-orange/40 bg-orange-wash/60"
                    : "border-navy/15 bg-white hover:border-navy/30",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 font-sans text-xs font-bold transition-colors",
                    isChecked
                      ? "border-orange bg-orange text-white"
                      : "border-navy/25 bg-paper text-navy",
                  )}
                  aria-hidden
                >
                  {isChecked ? "✓" : index + 1}
                </span>
                <span
                  className={cn(
                    "font-sans text-sm leading-relaxed sm:text-[15px]",
                    isChecked ? "text-navy-deep" : "text-ink-muted",
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
