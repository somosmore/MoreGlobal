import { useEffect } from "react"
import { X, ExternalLink, Download } from "lucide-react"
import { cn } from "@/lib/utils"

type ResourcePreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
  format: "pdf" | "html" | "link"
}

export default function ResourcePreviewModal({
  isOpen,
  onClose,
  title,
  url,
  format,
}: ResourcePreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isExternal = url.startsWith("http")
  const downloadHref = format === "pdf" ? url : undefined

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-navy shrink-0">
        <span className="text-sm font-semibold text-white truncate max-w-[60%]">{title}</span>
        <div className="flex items-center gap-2">
          {isExternal && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir en nueva pestaña
            </a>
          )}
          {downloadHref && (
            <a
              href={downloadHref}
              download
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar
            </a>
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar vista previa"
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0">
        {format === "link" ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-white/60">
            <ExternalLink className="w-12 h-12 opacity-40" />
            <p className="text-sm">Este recurso se abre en una URL externa.</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-dark transition-colors"
            >
              Abrir recurso
            </a>
          </div>
        ) : (
          <iframe
            src={url}
            title={title}
            className={cn(
              "w-full h-full border-0",
              format === "pdf" && "bg-gray-100"
            )}
            allow="fullscreen"
          />
        )}
      </div>
    </div>
  )
}
