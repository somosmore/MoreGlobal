import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import ProtectedAdmin from "@/components/ProtectedAdmin"
import AdminLayout from "@/components/admin/AdminLayout"
import HomePage from "@/pages/HomePage"
import AdminLogin from "@/pages/AdminLogin"
import AdminDashboard from "@/pages/AdminDashboard"
import AdminTestimonials from "@/pages/AdminTestimonials"
import AdminLeads from "@/pages/AdminLeads"
import AdminSettings from "@/pages/AdminSettings"
import AdminProjects from "@/pages/AdminProjects"
import AdminProjectWizard from "@/pages/AdminProjectWizard"
import AdminProjectResult from "@/pages/AdminProjectResult"
import AdminClients from "@/pages/AdminClients"
import AdminResources from "@/pages/AdminResources"
import BlueprintPage from "@/pages/BlueprintPage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
