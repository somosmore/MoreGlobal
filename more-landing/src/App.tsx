import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
const UppPage = lazy(() => import("@/pages/UppPage"))
const TurboPage = lazy(() => import("@/pages/TurboPage"))
const WppEquipoPage = lazy(() => import("@/pages/WppEquipoPage"))
import TurboPdfPage from "@/pages/TurboPdfPage"
import UppPdfPage from "@/pages/UppPdfPage"

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-400 text-sm">Cargando…</p>
  </div>
)

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
          <Route path="/upp" element={<UppPage />} />
          <Route path="/upp/pdf" element={<UppPdfPage />} />
          <Route path="/turbo" element={<TurboPage />} />
          <Route path="/turbo/pdf" element={<TurboPdfPage />} />
          <Route path="/wppequipo" element={<WppEquipoPage />} />
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
