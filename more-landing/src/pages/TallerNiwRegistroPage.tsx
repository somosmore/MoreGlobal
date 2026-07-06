import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import TNWhatsappJoinCard from "@/components/sections/taller-niw/TNWhatsappJoinCard"
import { TALLER_NIW_REGISTRO_PAGE_META } from "@/components/sections/taller-niw/tallerNiwCopy"

export default function TallerNiwRegistroPage() {
  const { status, isAccessible, reason } = useLandingStatus("/taller-niw")

  useEffect(() => {
    document.title = TALLER_NIW_REGISTRO_PAGE_META.title

    const metas: HTMLMetaElement[] = []

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`
      )
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, key)
        document.head.appendChild(el)
        metas.push(el)
      }
      el.setAttribute("content", content)
    }

    setMeta("name", "description", TALLER_NIW_REGISTRO_PAGE_META.description)
    setMeta("property", "og:title", TALLER_NIW_REGISTRO_PAGE_META.ogTitle)
    setMeta(
      "property",
      "og:description",
      TALLER_NIW_REGISTRO_PAGE_META.ogDescription
    )
    setMeta("property", "og:type", "website")

    return () => {
      metas.forEach((el) => el.remove())
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#001A52] via-[#0033A0] to-[#001233]">
        <div className="w-8 h-8 border-4 border-[#F37021] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAccessible) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#0033A0] to-[#001A52] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-3">Evento no disponible</h1>
          <p className="text-white/60 text-sm">{reason}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center bg-gradient-to-b from-[#001A52] via-[#0033A0] to-[#001233] py-8 px-2">
      <main className="flex-1 flex flex-col justify-center">
        <TNWhatsappJoinCard variant="ads" />
      </main>
    </div>
  )
}
