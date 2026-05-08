import { Settings } from "lucide-react"
import {
  useSettingsData,
  TrackingSection,
  CalendarSection,
  VipSessionSection,
  SocialNetworksSection,
} from "@/components/admin/settings"

export default function AdminSettings() {
  const data = useSettingsData()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
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

      <div className="space-y-6">
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
      </div>
    </div>
  )
}
