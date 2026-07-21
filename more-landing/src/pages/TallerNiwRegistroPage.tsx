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
      <div className="flex min-h-[100dvh] items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!isAccessible) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-paper px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-xl font-bold text-navy-deep">Evento no disponible</h1>
          <p className="text-sm text-ink-muted">{reason}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center bg-paper-warm px-2 py-8">
      <main className="flex-1 flex flex-col justify-center">
        <TNWhatsappJoinCard variant="ads" />
      </main>
    </div>
  )
}
