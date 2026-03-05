import { useState, useEffect } from "react"
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  LayoutTemplate,
  Contact,
  ShieldCheck,
  Library,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/leads", icon: Users, label: "Leads" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonios" },
  { href: "/admin/projects", icon: LayoutTemplate, label: "Proyectos" },
  { href: "/admin/clients", icon: Contact, label: "Clientes" },
  { href: "/admin/resources", icon: Library, label: "Recursos" },
  { href: "/admin/settings", icon: Settings, label: "Configuración" },
]

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  leads: "Leads",
  testimonials: "Testimonios",
  settings: "Configuración",
  projects: "Proyectos",
  new: "Nuevo proyecto",
  edit: "Editar",
  clients: "Clientes",
  resources: "Recursos",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (email: string) => {
  const parts = email.split("@")[0].split(/[._-]/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

const getDisplayName = (email: string) => {
  return email.split("@")[0].replace(/[._-]/g, " ")
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/")
        const label = BREADCRUMB_LABELS[seg] ?? seg
        const isLast = i === segments.length - 1

        return (
          <span key={href} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            )}
            {isLast ? (
              <span className="font-semibold text-[#2A3A4A]">{label}</span>
            ) : (
              <Link
                to={href}
                className="text-gray-400 hover:text-[#2A3A4A] transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const { user, signOut, role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true"
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem("admin_sidebar_collapsed", String(next))
    } catch {
      // ignore
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login")
  }

  const email = user?.email ?? ""
  const initials = getInitials(email)
  const displayName = getDisplayName(email)

  // ── Sidebar content (shared between desktop and mobile) ─────────────────────

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-white/10 shrink-0",
          collapsed && !isMobile ? "justify-center" : "gap-3"
        )}
      >
        <img
          src="/logo_more_light.png"
          alt="MORE"
          className={cn(
            "object-contain transition-all duration-200",
            collapsed && !isMobile ? "h-10 w-10" : "h-16 w-auto max-w-[200px]"
          )}
        />
        {(!collapsed || isMobile) && (
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest whitespace-nowrap">
            Admin
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/admin/dashboard"
              ? location.pathname === "/admin/dashboard"
              : location.pathname.startsWith(href)

          return (
            <Link
              key={href}
              to={href}
              aria-label={label}
              title={collapsed && !isMobile ? label : undefined}
              className={cn(
                "flex items-center rounded-xl transition-all duration-150 group",
                collapsed && !isMobile
                  ? "justify-center p-3"
                  : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-[#F37021] text-white shadow-md shadow-[#F37021]/30"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-transform",
                  collapsed && !isMobile ? "w-5 h-5" : "w-4.5 h-4.5",
                  isActive && "drop-shadow-sm"
                )}
              />
              {(!collapsed || isMobile) && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
              {(!collapsed || isMobile) && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout footer */}
      <div className="shrink-0 border-t border-white/10 p-3 space-y-1">
        {/* User info */}
        <div
          className={cn(
            "flex items-center rounded-xl p-2",
            collapsed && !isMobile ? "justify-center" : "gap-3"
          )}
          title={collapsed && !isMobile ? email : undefined}
        >
          <div className="w-8 h-8 rounded-lg bg-[#F37021]/20 border border-[#F37021]/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#F37021]">{initials}</span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate capitalize">
                  {displayName}
                </p>
                {role === "root" && (
                  <ShieldCheck className="w-3 h-3 text-[#F37021] shrink-0" aria-label="Administrador root" />
                )}
              </div>
              <p className="text-[10px] text-white/40 truncate">{email}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          title={collapsed && !isMobile ? "Cerrar sesión" : undefined}
          className={cn(
            "w-full flex items-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150",
            collapsed && !isMobile
              ? "justify-center p-3"
              : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-medium">Cerrar sesión</span>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-[#2A3A4A] fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={handleCollapse}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-[#2A3A4A] hover:border-[#2A3A4A] transition-all z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-[#2A3A4A] z-50 flex flex-col lg:hidden transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent isMobile />
      </aside>

      {/* ── Main content area ── */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out",
          "lg:ml-60",
          collapsed && "lg:ml-[72px]"
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-4 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex-1 min-w-0">
            <Breadcrumbs />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell (decorative for now) */}
            <button
              className="relative p-2 text-gray-400 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-4.5 h-4.5" />
            </button>

            {/* User avatar chip */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="w-7 h-7 rounded-lg bg-[#2A3A4A] flex items-center justify-center">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#2A3A4A] capitalize leading-none">
                  {displayName}
                </p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5 max-w-[120px] truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
