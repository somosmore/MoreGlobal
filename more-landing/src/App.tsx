import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import BrandLoader from "@/components/brand/BrandLoader"
import { AuthProvider } from "@/contexts/AuthContext"
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext"
import ProtectedAdmin from "@/components/ProtectedAdmin"
import AdminLayout from "@/components/admin/AdminLayout"
import HomePage from "@/pages/HomePage"
import { TrackingBootstrap } from "@/components/TrackingBootstrap"

const AdminLogin = lazy(() => import("@/pages/AdminLogin"))
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"))
const AdminTestimonials = lazy(() => import("@/pages/AdminTestimonials"))
const AdminLeads = lazy(() => import("@/pages/AdminLeads"))
const AdminSettings = lazy(() => import("@/pages/AdminSettings"))
const AdminProjects = lazy(() => import("@/pages/AdminProjects"))
const AdminProjectWizard = lazy(() => import("@/pages/AdminProjectWizard"))
const AdminProjectResult = lazy(() => import("@/pages/AdminProjectResult"))
const AdminClients = lazy(() => import("@/pages/AdminClients"))
const AdminResources = lazy(() => import("@/pages/AdminResources"))
const BlueprintPage = lazy(() => import("@/pages/BlueprintPage"))
const VipSessionPage = lazy(() => import("@/pages/VipSessionPage"))
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"))
const MasterclassPage = lazy(() => import("@/pages/MasterclassPage"))
const TallerNiwPage = lazy(() => import("@/pages/TallerNiwPage"))
const TallerNiwRegistroPage = lazy(() => import("@/pages/TallerNiwRegistroPage"))
const WebinarEstatusPage = lazy(() => import("@/pages/WebinarEstatusPage"))
const WebinarEstatusRegistroPage = lazy(() => import("@/pages/WebinarEstatusRegistroPage"))
const WebinarSep26Page = lazy(() => import("@/pages/WebinarSep26Page"))
const WebinarSep26RegistroPage = lazy(() => import("@/pages/WebinarSep26RegistroPage"))
const ComunidadPage = lazy(() => import("@/pages/ComunidadPage"))
const ComunidadRegistroPage = lazy(() => import("@/pages/ComunidadRegistroPage"))
const TallerNov26Page = lazy(() => import("@/pages/TallerNov26Page"))
const TallerNov26RegistroPage = lazy(() => import("@/pages/TallerNov26RegistroPage"))
const UppPage = lazy(() => import("@/pages/UppPage"))
const TurboPage = lazy(() => import("@/pages/TurboPage"))
const WppEquipoPage = lazy(() => import("@/pages/WppEquipoPage"))
const ThankYouPage = lazy(() => import("@/pages/ThankYouPage"))
import TurboPdfPage from "@/pages/TurboPdfPage"
import UppPdfPage from "@/pages/UppPdfPage"

/** Rutas en navy: el loader global usa la versión oscura para no "parpadear" en blanco. */
const DARK_LOADER_PATHS = ["/taller-23nov", "/taller-nov-26"]

/** Redirección que conserva query string (UTMs) y hash. */
const RedirectKeepingQuery = ({ to }: { to: string }) => {
  const { search, hash } = useLocation()
  return <Navigate to={`${to}${search}${hash}`} replace />
}

const PageLoader = () => {
  const { pathname } = useLocation()
  const dark = DARK_LOADER_PATHS.some((p) => pathname.startsWith(p))
  return dark ? <BrandLoader tone="dark" label="Preparando tu ruta…" /> : <BrandLoader />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SiteSettingsProvider>
        <TrackingBootstrap />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/asesoria-vip" element={<VipSessionPage />} />
          <Route path="/privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/masterclass" element={<MasterclassPage />} />
          <Route path="/taller-niw" element={<TallerNiwPage />} />
          <Route path="/taller-niw/registro" element={<TallerNiwRegistroPage />} />
          <Route path="/webinar-estatus" element={<WebinarEstatusPage />} />
          <Route path="/webinar-estatus/registro" element={<WebinarEstatusRegistroPage />} />
          <Route path="/webinar-sep-26" element={<WebinarSep26Page />} />
          <Route path="/webinar-sep-26/registro" element={<WebinarSep26RegistroPage />} />
          <Route path="/comunidad" element={<ComunidadPage />} />
          <Route path="/comunidad/registro" element={<ComunidadRegistroPage />} />
          <Route path="/taller-23nov" element={<TallerNov26Page />} />
          <Route path="/taller-23nov/registro" element={<TallerNov26RegistroPage />} />
          {/* Versión con precio exclusivo Comunidad More (noindex). */}
          <Route path="/taller-23nov/comunidad" element={<TallerNov26Page tier="comunidad" />} />
          <Route path="/taller-23nov/comunidad/registro" element={<TallerNov26RegistroPage tier="comunidad" />} />
          {/* Ruta anterior (se leía como "26 de noviembre"): redirige conservando UTMs. */}
          <Route path="/taller-nov-26" element={<RedirectKeepingQuery to="/taller-23nov" />} />
          <Route path="/taller-nov-26/registro" element={<RedirectKeepingQuery to="/taller-23nov/registro" />} />
          <Route path="/upp" element={<UppPage />} />
          <Route path="/upp/pdf" element={<UppPdfPage />} />
          <Route path="/turbo" element={<TurboPage />} />
          <Route path="/turbo/pdf" element={<TurboPdfPage />} />
          <Route path="/wppequipo" element={<WppEquipoPage />} />
          <Route path="/gracias" element={<ThankYouPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin area with shared layout */}
          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <AdminLayout />
              </ProtectedAdmin>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<AdminProjectWizard />} />
            <Route path="projects/:id" element={<AdminProjectResult />} />
            <Route path="projects/:id/edit" element={<AdminProjectWizard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="resources" element={<AdminResources />} />
          </Route>

          <Route path="/blueprint" element={<BlueprintPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        </SiteSettingsProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
