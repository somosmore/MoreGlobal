import { cn } from "@/lib/utils"

type VipSectionHeadingProps = {
  /** Parte del título en navy. */
  title: string
  /** Parte final del título, en naranja. */
  highlight?: string
  /** Bajada con la regla navy/naranja a los lados, como en la presentación. */
  kicker?: string
  description?: string
  id?: string
  align?: "center" | "left"
  className?: string
}

export const VipSectionHeading = ({
  title,
  highlight,
  kicker,
  description,
  id,
  align = "center",
  className,
}: VipSectionHeadingProps) => {
  const centered = align === "center"

  return (
    <header className={cn(centered && "text-center", className)}>
      <h2
        id={id}
        className="text-balance font-display text-3xl leading-tight text-navy-deep sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
        {highlight ? <span className="text-orange">{highlight}</span> : null}
      </h2>

      {kicker ? (
        <div
          className={cn(
            "mt-4 flex items-center gap-3",
            centered ? "justify-center" : "justify-start",
          )}
        >
          <span className="hidden h-px w-10 bg-orange sm:block" aria-hidden />
          <p className="font-display text-lg italic text-navy sm:text-xl">{kicker}</p>
          <span className="hidden h-px w-10 bg-navy/40 sm:block" aria-hidden />
        </div>
      ) : null}

      {description ? (
        <p
          className={cn(
            "mt-4 font-sans text-[15px] leading-relaxed text-ink-muted sm:text-base",
            centered && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  )
}
