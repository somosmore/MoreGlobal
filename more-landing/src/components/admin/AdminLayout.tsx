import { useState } from "react"
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

function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean)

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em]"
    >
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/")
        const label = BREADCRUMB_LABELS[seg] ?? seg
        const isLast = i === segments.length - 1

        return (
          <span key={href} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 text-admin-faint shrink-0" />
            )}
            {isLast ? (
              <span className="font-semibold text-admin-text">{label}</span>
            ) : (
              <Link
                to={href}
                className="text-admin-faint hover:text-admin-text transition-colors"
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

  const renderSidebarContent = ({ isMobile = false }: { isMobile?: boolean } = {}) => (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex items-center border-b border-admin-border shrink-0",
          collapsed && !isMobile
            ? "justify-center px-2 py-4"
            : "gap-3 px-3.5 py-4"
        )}
      >
        <img
          src="/icon.png"
          alt="MORE"
          className={cn(
            "object-contain shrink-0 rounded-admin-sm border border-admin-border-strong",
            collapsed && !isMobile ? "h-10 w-10" : "h-12 w-12"
          )}
        />
        {(!collapsed || isMobile) && (
          <div className="min-w-0">
            <p className="text-xs font-bold text-white tracking-[0.12em] uppercase leading-none">
              MORE
            </p>
            <p className="text-[9px] font-medium text-admin-faint tracking-[0.14em] uppercase mt-1.5">
              Admin // OS
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/admin/dashboard"
              ? location.pathname === "/admin/dashboard"
              : location.pathname.startsWith(href)

          return (
            <Link
              key={href}
              to={href}
              onClick={() => isMobile && setMobileOpen(false)}
              aria-label={label}
              title={collapsed && !isMobile ? label : undefined}
              className={cn(
                "flex items-center transition-all duration-150 border border-transparent",
                "rounded-admin-sm",
                collapsed && !isMobile
                  ? "justify-center p-3"
                  : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-admin-subtle text-white border-admin-border shadow-[inset_2px_0_0_0_var(--color-orange)]"
                  : "text-admin-secondary hover:bg-admin-sidebar hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0",
                  collapsed && !isMobile ? "w-5 h-5" : "w-4 h-4",
                  isActive && "text-orange"
                )}
              />
              {(!collapsed || isMobile) && (
                <span className="text-[13px] font-medium truncate">{label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-admin-border p-3 space-y-1">
        <div
          className={cn(
            "flex items-center rounded-admin-sm p-2",
            collapsed && !isMobile ? "justify-center" : "gap-3"
          )}
          title={collapsed && !isMobile ? email : undefined}
        >
          <div className="w-8 h-8 rounded-admin-sm bg-admin-accent-soft border border-admin-border flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-orange">{initials}</span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate capitalize">
                  {displayName}
                </p>
                {role === "root" && (
                  <ShieldCheck
                    className="w-3 h-3 text-orange shrink-0"
                    aria-label="Administrador root"
                  />
                )}
              </div>
              <p className="text-[10px] text-admin-faint truncate tracking-wide uppercase">
                {role === "root" ? "ROOT" : "ADMIN"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          title={collapsed && !isMobile ? "Cerrar sesión" : undefined}
          className={cn(
            "w-full flex items-center rounded-admin-sm text-admin-faint hover:text-white hover:bg-admin-subtle transition-all duration-150",
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
    <div className="admin-shell flex h-screen bg-admin overflow-hidden">
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-admin-sidebar fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out border-r border-admin-border",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        {renderSidebarContent()}

        <button
          onClick={handleCollapse}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          className="absolute -right-3 top-20 w-6 h-6 rounded-admin-sm bg-admin-elevated border border-admin-border-strong flex items-center justify-center text-admin-faint hover:text-orange hover:border-orange transition-all z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-admin-sidebar z-50 flex flex-col lg:hidden transition-transform duration-300 ease-in-out border-r border-admin-border",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-admin-faint hover:text-white hover:bg-admin-subtle rounded-admin-sm transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
        {renderSidebarContent({ isMobile: true })}
      </aside>

      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out bg-admin-app",
          "lg:ml-60",
          collapsed && "lg:ml-[72px]"
        )}
      >
        <header className="sticky top-0 z-20 h-16 bg-admin-app/95 backdrop-blur-md border-b border-admin-border flex items-center px-4 sm:px-6 gap-3 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-admin-faint hover:text-admin-text hover:bg-admin-subtle rounded-admin-sm transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <img
            src="/icon.png"
            alt=""
            className="hidden sm:block h-8 w-8 rounded-admin-sm border border-admin-border opacity-90"
          />

          <div className="flex-1 min-w-0">
            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="relative p-2 text-admin-faint hover:text-admin-text hover:bg-admin-subtle rounded-admin-sm transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-admin bg-admin-elevated border border-admin-border">
              <div className="w-7 h-7 rounded-admin-sm bg-admin-subtle border border-admin-border flex items-center justify-center">
                <span className="text-[10px] font-bold text-admin-text">
                  {initials}
                </span>
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-admin-text capitalize leading-none">
                  {displayName}
                </p>
                <p className="text-[10px] text-admin-faint leading-none mt-0.5 max-w-[120px] truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-admin-app">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
