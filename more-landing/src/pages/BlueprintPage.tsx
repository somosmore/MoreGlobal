import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"

export default function BlueprintPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    document.title = "Blueprint EB2-NIW | MORE — Migración con Propósito"
    return () => {
      document.title = "MORE — Migración con Propósito"
    }
  }, [])

  const handleDownloadPDF = () => {
    const iframeWindow = iframeRef.current?.contentWindow
    if (!iframeWindow) return
    iframeWindow.focus()
    iframeWindow.print()
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617]">
      {/* Barra de navegación */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#020617] border-b border-slate-800 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Volver al sitio
        </Link>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410a] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-lg"
        >
          <Download size={16} />
          Descargar como PDF
        </button>
      </div>

      {/* Blueprint embebido */}
      <iframe
        ref={iframeRef}
        src="/blueprint.html"
        title="Blueprint EB2-NIW MORE"
        className="flex-1 w-full border-0"
      />
    </div>
  )
}
