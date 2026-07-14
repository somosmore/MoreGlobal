import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type BrandIconCircleProps = {
  icon: LucideIcon
  tone?: "navy" | "orange"
  size?: "md" | "lg"
  className?: string
}

const SIZES = {
  md: "h-14 w-14",
  lg: "h-16 w-16",
} as const

const ICON_SIZES = {
  md: "h-6 w-6",
  lg: "h-7 w-7",
} as const

const TONES = {
  navy: "bg-navy-deep",
  orange: "bg-orange",
} as const

export const BrandIconCircle = ({
  icon: Icon,
  tone = "navy",
  size = "md",
  className,
}: BrandIconCircleProps) => (
  <span
    className={cn(
      "flex shrink-0 items-center justify-center rounded-full text-white",
      SIZES[size],
      TONES[tone],
      className,
    )}
    aria-hidden
  >
    <Icon className={cn(ICON_SIZES[size], "stroke-2")} />
  </span>
)
