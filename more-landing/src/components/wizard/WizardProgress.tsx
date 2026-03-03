import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type WizardPart = {
  id: number
  label: string
  description: string
}

export const WIZARD_PARTS: WizardPart[] = [
  { id: 0, label: "Cliente", description: "Vincular contacto" },
  { id: 1, label: "Identidad", description: "Marca y propósito" },
  { id: 2, label: "Problema", description: "Dolor y solución" },
  { id: 3, label: "Audiencia", description: "Cliente ideal" },
  { id: 4, label: "Oferta", description: "Servicios y acción" },
  { id: 5, label: "Confianza", description: "Prueba social" },
  { id: 6, label: "Técnico", description: "Stack y config" },
]

type Props = {
  currentPart: number
  completedParts: number[]
  onNavigate?: (part: number) => void
}

export default function WizardProgress({ currentPart, completedParts, onNavigate }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: step indicator */}
      <div className="flex items-center justify-between mb-1 sm:hidden">
        <span className="text-xs font-medium text-gray-500">
          Paso {currentPart + 1} de {WIZARD_PARTS.length}
        </span>
        <span className="text-xs font-semibold text-[#F37021]">
          {WIZARD_PARTS[currentPart]?.label}
        </span>
      </div>
      {/* Mobile progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full sm:hidden mb-4">
        <div
          className="h-full bg-[#F37021] rounded-full transition-all duration-500"
          style={{ width: `${((currentPart + 1) / WIZARD_PARTS.length) * 100}%` }}
        />
      </div>

      {/* Desktop: full step nav */}
      <div className="hidden sm:flex items-center gap-0">
        {WIZARD_PARTS.map((part, i) => {
          const isCompleted = completedParts.includes(part.id)
          const isCurrent = currentPart === part.id
          const isAccessible = isCompleted || isCurrent || part.id === 0
          const isLast = i === WIZARD_PARTS.length - 1

          return (
            <div key={part.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => isAccessible && onNavigate?.(part.id)}
                disabled={!isAccessible}
                className={cn(
                  "flex flex-col items-center gap-1 group transition-all duration-200",
                  !isAccessible && "cursor-not-allowed opacity-40",
                  isAccessible && !isCurrent && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2",
                    isCompleted && !isCurrent
                      ? "bg-[#F37021] border-[#F37021] text-white"
                      : isCurrent
                      ? "bg-white border-[#F37021] text-[#F37021] shadow-md shadow-[#F37021]/20"
                      : "bg-white border-gray-200 text-gray-400"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{part.id + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap",
                    isCurrent ? "text-[#F37021]" : isCompleted ? "text-gray-600" : "text-gray-400"
                  )}
                >
                  {part.label}
                </span>
              </button>

              {!isLast && (
                <div className="flex-1 mx-1 mb-4">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-all duration-500",
                      completedParts.includes(part.id) ? "bg-[#F37021]" : "bg-gray-200"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
