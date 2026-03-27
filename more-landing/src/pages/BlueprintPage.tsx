import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function BlueprintPage() {
  const { t } = useTranslation()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    document.title = t("blueprint.pageTitle")
    return () => {
      document.title = t("blueprint.defaultTitle")
    }
  }, [t])

  const handleDownloadPDF = () => {
    const iframeWindow = iframeRef.current?.contentWindow
    if (!iframeWindow) return
    iframeWindow.focus()
    iframeWindow.print()
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617]">
      <div className="flex items-center justify-between px-6 py-3 bg-[#020617] border-b border-slate-800 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          {t("blueprint.back")}
        </Link>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410a] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-lg"
        >
          <Download size={16} />
          {t("blueprint.download")}
        </button>
      </div>

      <iframe
        ref={iframeRef}
        src="/blueprint.html"
        title={t("blueprint.iframeTitle")}
        className="flex-1 w-full border-0"
      />
    </div>
  )
}
