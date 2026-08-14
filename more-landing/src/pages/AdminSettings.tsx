import {
  BookOpen,
  Calendar,
  CalendarClock,
  LineChart,
  MessageCircle,
  Settings,
  Share2,
  Sparkles,
  Users,
} from "lucide-react"
import {
  useSettingsData,
  TrackingSection,
  CalendarSection,
  VipSessionSection,
  LandingCountdownsSection,
  ContactSection,
  SocialNetworksSection,
  UppSection,
  WppTeamSection,
} from "@/components/admin/settings"

const SECTION_LINKS = [
  { id: "medicion", label: "Medición", Icon: LineChart },
  { id: "contacto", label: "Contacto", Icon: MessageCircle },
  { id: "calendario", label: "Calendario", Icon: Calendar },
  { id: "vip", label: "Sesión VIP", Icon: Sparkles },
  { id: "landings", label: "Landings", Icon: CalendarClock },
  { id: "upp", label: "Programa UPP", Icon: BookOpen },
  { id: "wppequipo", label: "WhatsApp Equipo", Icon: Users },
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
    <div className="min-h-full bg-admin-app">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-admin bg-admin-subtle border border-admin-border flex items-center justify-center">
              <Settings className="w-5 h-5 text-orange" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-admin-text tracking-tight">
                Configuración
              </h1>
              <p className="text-sm text-admin-faint">
                Gestiona los parámetros globales del sitio web
              </p>
            </div>
          </div>
        </div>

        {/* Navegación por anclas */}
        <nav
          aria-label="Secciones de configuración"
          className="sticky top-16 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6 bg-admin-app/95 backdrop-blur-md border-b border-admin-border"
        >
          <ul className="flex flex-wrap gap-2">
            {SECTION_LINKS.map(({ id, label, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-admin-sm bg-admin-elevated border border-admin-border text-xs font-medium text-admin-secondary hover:bg-admin-accent-soft hover:border-orange/40 hover:text-orange transition-colors"
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

          <section id="contacto" className="scroll-mt-32">
            <ContactSection
              loading={data.loading}
              whatsappNumber={data.whatsappNumber}
              setWhatsappNumber={data.setWhatsappNumber}
              contactPhone={data.contactPhone}
              setContactPhone={data.setContactPhone}
              contactEmail={data.contactEmail}
              setContactEmail={data.setContactEmail}
              contactSaveState={data.contactSaveState}
              setContactSaveState={data.setContactSaveState}
              contactSaveError={data.contactSaveError}
              handleSaveContact={data.handleSaveContact}
              whatsappNumberInvalid={data.whatsappNumberInvalid}
              contactEmailInvalid={data.contactEmailInvalid}
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
              vipCountdownDate={data.vipCountdownDate}
              setVipCountdownDate={data.setVipCountdownDate}
              saveState={data.saveState}
              setSaveState={data.setSaveState}
              saveError={data.saveError}
              handleSave={data.handleSave}
              vipPaymentLinkInvalid={data.vipPaymentLinkInvalid}
            />
          </section>

          <section id="landings" className="scroll-mt-32">
            <LandingCountdownsSection
              loading={data.loading}
              mcEventDate={data.mcEventDate}
              setMcEventDate={data.setMcEventDate}
              mcRegistrationClosesAt={data.mcRegistrationClosesAt}
              setMcRegistrationClosesAt={data.setMcRegistrationClosesAt}
              tnEventDate={data.tnEventDate}
              setTnEventDate={data.setTnEventDate}
              tnRegistrationClosesAt={data.tnRegistrationClosesAt}
              setTnRegistrationClosesAt={data.setTnRegistrationClosesAt}
              weEventDate={data.weEventDate}
              setWeEventDate={data.setWeEventDate}
              weRegistrationClosesAt={data.weRegistrationClosesAt}
              setWeRegistrationClosesAt={data.setWeRegistrationClosesAt}
              landingsSaveState={data.landingsSaveState}
              setLandingsSaveState={data.setLandingsSaveState}
              landingsSaveError={data.landingsSaveError}
              handleSaveLandings={data.handleSaveLandings}
            />
          </section>

          <section id="upp" className="scroll-mt-32">
            <UppSection
              loading={data.loading}
              uppPaymentLink={data.uppPaymentLink}
              setUppPaymentLink={data.setUppPaymentLink}
              uppPrice={data.uppPrice}
              setUppPrice={data.setUppPrice}
              uppCountdownDate={data.uppCountdownDate}
              setUppCountdownDate={data.setUppCountdownDate}
              uppSaveState={data.uppSaveState}
              setUppSaveState={data.setUppSaveState}
              uppSaveError={data.uppSaveError}
              handleSaveUpp={data.handleSaveUpp}
              uppPaymentLinkInvalid={data.uppPaymentLinkInvalid}
            />
          </section>

          <section id="wppequipo" className="scroll-mt-32">
            <WppTeamSection />
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
