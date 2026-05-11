import { Calendar, LineChart, Settings, Share2, Sparkles } from "lucide-react"
import {
  useSettingsData,
  TrackingSection,
  CalendarSection,
  VipSessionSection,
  SocialNetworksSection,
} from "@/components/admin/settings"

const SECTION_LINKS = [
  { id: "medicion", label: "Medición", Icon: LineChart },
  { id: "calendario", label: "Calendario", Icon: Calendar },
  { id: "vip", label: "Sesión VIP", Icon: Sparkles },
  { id: "redes", label: "Redes", Icon: Share2 },
] as const

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function AdminSettings() {
  const data = useSettingsData()

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50/60 via-white to-white">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#2A3A4A]/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#2A3A4A]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2A3A4A]">Configuración</h1>
              <p className="text-sm text-gray-500">
                Gestiona los parámetros globales del sitio web
              </p>
            </div>
          </div>
        </div>

        {/* Navegación por anclas */}
        <nav
          aria-label="Secciones de configuración"
          className="sticky top-16 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6 bg-white/80 backdrop-blur border-b border-gray-100"
        >
          <ul className="flex flex-wrap gap-2">
            {SECTION_LINKS.map(({ id, label, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-[#2A3A4A] hover:bg-[#F37021]/10 hover:border-[#F37021]/40 hover:text-[#F37021] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          <section id="medicion" className="scroll-mt-32">
            <TrackingSection
              settings={data.settings}
              loading={data.loading}
              metaPixelId={data.metaPixelId}
              setMetaPixelId={data.setMetaPixelId}
              gtmId={data.gtmId}
              setGtmId={data.setGtmId}
              ga4Id={data.ga4Id}
              setGa4Id={data.setGa4Id}
              trackingEnabled={data.trackingEnabled}
              setTrackingEnabled={data.setTrackingEnabled}
              trackingSaveState={data.trackingSaveState}
              setTrackingSaveState={data.setTrackingSaveState}
              trackingSaveError={data.trackingSaveError}
              handleSaveTracking={data.handleSaveTracking}
              metaPixelInvalid={data.metaPixelInvalid}
              gtmInvalid={data.gtmInvalid}
              ga4Invalid={data.ga4Invalid}
              trackingFieldsInvalid={data.trackingFieldsInvalid}
              gtmAndMetaConflict={data.gtmAndMetaConflict}
            />
          </section>

          <section id="calendario" className="scroll-mt-32">
            <CalendarSection
              loading={data.loading}
              calendarUrl={data.calendarUrl}
              setCalendarUrl={data.setCalendarUrl}
              saveState={data.saveState}
              setSaveState={data.setSaveState}
              saveError={data.saveError}
              handleSave={data.handleSave}
              urlInvalid={data.urlInvalid}
              vipPaymentLinkInvalid={data.vipPaymentLinkInvalid}
            />
          </section>

          <section id="vip" className="scroll-mt-32">
            <VipSessionSection
              loading={data.loading}
              vipPaymentLink={data.vipPaymentLink}
              setVipPaymentLink={data.setVipPaymentLink}
              vipPrice={data.vipPrice}
              setVipPrice={data.setVipPrice}
              saveState={data.saveState}
              setSaveState={data.setSaveState}
              saveError={data.saveError}
              vipPaymentLinkInvalid={data.vipPaymentLinkInvalid}
            />
          </section>

          <section id="redes" className="scroll-mt-32">
            <SocialNetworksSection
              loading={data.loading}
              instagramUrl={data.instagramUrl}
              setInstagramUrl={data.setInstagramUrl}
              linkedinUrl={data.linkedinUrl}
              setLinkedinUrl={data.setLinkedinUrl}
              facebookUrl={data.facebookUrl}
              setFacebookUrl={data.setFacebookUrl}
              youtubeUrl={data.youtubeUrl}
              setYoutubeUrl={data.setYoutubeUrl}
              socialSaveState={data.socialSaveState}
              setSocialSaveState={data.setSocialSaveState}
              socialSaveError={data.socialSaveError}
              handleSaveSocial={data.handleSaveSocial}
              socialUrlInvalid={data.socialUrlInvalid}
              isValidUrl={data.isValidUrl}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
