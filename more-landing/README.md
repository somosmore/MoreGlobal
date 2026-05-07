# MORE — Migración con Propósito

Landing page premium para **MORE**, consultora de inmigración especializada en visas **EB-2 NIW** (National Interest Waiver) para profesionales que buscan la Residencia Permanente en Estados Unidos.

## Vista General

Aplicación web de alta conversión con estética minimalista y profesional. Incluye un quiz interactivo de elegibilidad, sección de precios con glassmorphism, carrusel de casos de éxito, FAQ con acordeones animados y un **panel de administración completo** con gestión de leads, testimonios, clientes, proyectos y recursos. Integra Supabase como backend y Gemini AI para generación de landings.

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** + **TypeScript** | Framework principal |
| **Vite 7** | Bundler y servidor de desarrollo |
| **Tailwind CSS 4** | Estilos utilitarios |
| **React Router DOM 7** | Routing SPA (landing + panel admin) |
| **Shadcn/UI** (Radix UI) | Componentes (Button, Card, Accordion, Progress, Dialog, Tabs, Sheet) |
| **Framer Motion** | Animaciones de scroll reveal y transiciones |
| **Lucide React** | Iconografía |
| **Supabase JS** | Base de datos PostgreSQL, autenticación y RLS |
| **Gemini AI** | Generación de landings con IA (Edge Function) |
| **i18next** | Internacionalización (ES / EN) |
| **DnD Kit** | Drag & drop en wizard de proyectos |
| **html2canvas + jsPDF** | Exportación de proyectos a PDF |

## Estructura del Proyecto

```
more-landing/
├── public/                        # Assets estáticos (logos MORE)
├── src/
│   ├── components/
│   │   ├── sections/              # Secciones de la landing page pública
│   │   │   ├── Navbar.tsx             # Navegación con transparencia dinámica
│   │   │   ├── Hero.tsx               # Sección principal con CTAs
│   │   │   ├── PainPoints.tsx         # Tarjetas de problemas comunes
│   │   │   ├── WhoWeHelp.tsx          # Perfil de cliente ideal
│   │   │   ├── Quiz.tsx               # Quiz interactivo de elegibilidad
│   │   │   ├── Pricing.tsx            # Planes y precios
│   │   │   ├── Success.tsx            # Casos de éxito y perfil de Ivon
│   │   │   ├── VipSession.tsx         # Bloque de asesoría VIP
│   │   │   └── Footer.tsx             # FAQ, CTA final y pie de página
│   │   ├── admin/                 # Componentes del panel de administración
│   │   │   ├── AdminLayout.tsx        # Shell/layout del admin con sidebar
│   │   │   ├── leads/                 # Módulo de gestión de leads
│   │   │   │   ├── LeadsTable.tsx
│   │   │   │   ├── LeadDetailSheet.tsx
│   │   │   │   ├── LeadsToolbar.tsx
│   │   │   │   ├── LeadsKpiCards.tsx
│   │   │   │   ├── useLeadsData.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── helpers.ts
│   │   │   └── resources/             # Módulo de recursos descargables
│   │   │       ├── ResourceCard.tsx
│   │   │       ├── ResourcePreviewModal.tsx
│   │   │       └── LandingPreviewCard.tsx
│   │   ├── wizard/                # Wizard de creación de proyectos
│   │   │   ├── ClientSelector.tsx
│   │   │   └── WizardProgress.tsx
│   │   ├── ui/                    # Componentes base reutilizables (Shadcn)
│   │   │   ├── accordion.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── ImageUploader.tsx
│   │   ├── ProtectedAdmin.tsx     # Guard de rutas admin (requiere auth)
│   │   └── TrackingBootstrap.tsx  # Inicialización del tracking dinámico
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Sesión de usuario con Supabase Auth
│   │   └── SiteSettingsContext.tsx # Configuración global del sitio (DB)
│   ├── hooks/
│   │   ├── useSiteSettings.ts
│   │   └── useUserRole.ts
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase + helpers tipados
│   │   ├── gemini.ts              # Cliente Gemini AI
│   │   ├── tracking.ts            # Sistema de tracking de eventos
│   │   ├── quizLogic.ts           # Lógica de evaluación del quiz
│   │   ├── resourceUrl.ts         # Utilidad para URLs de recursos
│   │   └── utils.ts               # Utilidad cn() para clases CSS
│   ├── pages/                     # Páginas del router
│   │   ├── HomePage.tsx               # Landing pública principal
│   │   ├── VipSessionPage.tsx         # Página de asesoría VIP (/asesoria-vip)
│   │   ├── BlueprintPage.tsx          # Blueprint descargable (/blueprint)
│   │   ├── PrivacyPolicyPage.tsx      # Política de privacidad (/privacidad)
│   │   ├── AdminLogin.tsx             # Login del panel (/admin/login)
│   │   ├── AdminDashboard.tsx         # Dashboard con métricas (/admin/dashboard)
│   │   ├── AdminLeads.tsx             # Gestión de leads (/admin/leads)
│   │   ├── AdminTestimonials.tsx      # Testimonios editables (/admin/testimonials)
│   │   ├── AdminSettings.tsx          # Configuración del sitio (/admin/settings)
│   │   ├── AdminProjects.tsx          # Lista de proyectos (/admin/projects)
│   │   ├── AdminProjectWizard.tsx     # Creación/edición de proyecto (/admin/projects/new)
│   │   ├── AdminProjectResult.tsx     # Resultado del proyecto (/admin/projects/:id)
│   │   ├── AdminClients.tsx           # Gestión de clientes (/admin/clients)
│   │   └── AdminResources.tsx         # Recursos descargables (/admin/resources)
│   ├── vip/                       # Módulo de asesoría VIP
│   │   ├── components/
│   │   ├── data/
│   │   └── pages/
│   ├── locales/                   # Traducciones i18n
│   │   ├── es/
│   │   └── en/
│   ├── assets/                    # Imágenes y recursos estáticos
│   ├── App.tsx                    # Router principal + providers
│   ├── i18n.ts                    # Configuración de i18next
│   ├── main.tsx                   # Punto de entrada
│   └── index.css                  # Tema global y variables de color
├── supabase/
│   ├── functions/
│   │   └── generate-landing/      # Edge Function: genera landing con Gemini AI
│   ├── migrations/                # 21 migraciones SQL (testimonials → rate limit)
│   ├── seed_testimonials.sql      # Datos iniciales de testimonios
│   └── README.md
├── .env.example                   # Variables de entorno requeridas
├── index.html                     # HTML base con fuente Inter + tracking script
├── vite.config.ts                 # Configuración Vite + Tailwind + alias @
├── tsconfig.app.json              # TypeScript con path aliases
├── vercel.json                    # Configuración de despliegue en Vercel
└── package.json
```

## Rutas de la Aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `HomePage` | Público |
| `/asesoria-vip` | `VipSessionPage` | Público |
| `/blueprint` | `BlueprintPage` | Público |
| `/privacidad` | `PrivacyPolicyPage` | Público |
| `/admin/login` | `AdminLogin` | Público |
| `/admin/dashboard` | `AdminDashboard` | Autenticado |
| `/admin/leads` | `AdminLeads` | Autenticado |
| `/admin/testimonials` | `AdminTestimonials` | Autenticado |
| `/admin/settings` | `AdminSettings` | Autenticado |
| `/admin/projects` | `AdminProjects` | Autenticado |
| `/admin/projects/new` | `AdminProjectWizard` | Autenticado |
| `/admin/projects/:id` | `AdminProjectResult` | Autenticado |
| `/admin/clients` | `AdminClients` | Autenticado |
| `/admin/resources` | `AdminResources` | Autenticado |

## Paleta de Colores (Manual de Marca)

| Color | Hex | Uso |
|---|---|---|
| Navy oscuro | `#2A3A4A` | Textos principales, fondos oscuros |
| Navy claro | `#3A4D5E` | Gradientes, fondos secundarios |
| Naranja MORE | `#F37021` | Acento primario, CTAs, iconos |
| Naranja oscuro | `#D4611A` | Gradientes, hover states |
| Blanco | `#FFFFFF` | Fondos de sección |
| Gris suave | `#6B7280` | Textos secundarios |

## Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

La clave de Gemini AI **no va en el frontend**. Configurarla como secret en la Edge Function de Supabase:

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Sergio726/More-Webpage.git
cd More-Webpage/more-landing

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores de tu proyecto Supabase

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

## Base de Datos (Supabase)

El esquema se gestiona con migraciones SQL en `supabase/migrations/`. Las tablas principales son:

| Tabla | Descripción |
|---|---|
| `testimonials` | Casos de éxito editables desde el admin |
| `leads` | Registros del quiz + notas + seguimiento |
| `lead_notes` | Notas internas por lead |
| `profiles` | Perfiles de usuarios admin |
| `clients` | Clientes gestionados en el panel |
| `landing_projects` | Proyectos de landing generados con IA |
| `resources` | Recursos descargables |
| `site_settings` | Configuración global del sitio (textos, precios, tracking) |

Para aplicar las migraciones en tu proyecto Supabase:

```bash
supabase db push
```

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera el build de producción |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

## Integraciones Externas

- **Go High Level Tracking** — el script de analítica se carga dinámicamente desde `site_settings` en Supabase. El `TrackingBootstrap` inyecta el pixel configurado en el admin.
- **Script de tracking**: `https://api.moremigracion.com/js/external-tracking.js`
- **Supabase** — backend serverless con PostgreSQL, autenticación, RLS y Edge Functions
- **Gemini AI** — Edge Function `generate-landing` que genera landings personalizadas para clientes

## Secciones de la Landing Pública

1. **Navbar** — Logo MORE con transparencia dinámica al hacer scroll
2. **Hero** — Headline principal, badge animado y doble CTA
3. **Pain Points** — 3 tarjetas con problemas comunes del proceso migratorio
4. **Who We Help** — Perfil del cliente ideal que atiende MORE
5. **Quiz de Elegibilidad** — Formulario interactivo multi-paso con lógica condicional
6. **Precios** — Programa Unsung (DIY) y Plan Plus (Premium)
7. **Casos de Éxito** — Perfil de Ivon MORE + carrusel de testimonios
8. **VIP Session** — Bloque de llamada a asesoría personalizada
9. **FAQ** — Preguntas frecuentes con acordeones animados
10. **Footer** — Enlaces, contacto y CTA final hacia WhatsApp

## Despliegue

El build de producción se genera en la carpeta `dist/`:

```bash
npm run build
```

Compatible con cualquier hosting de archivos estáticos: **Vercel** (recomendado, incluye `vercel.json`), **Netlify**, **GitHub Pages**, **AWS S3**, etc.

## Licencia

Proyecto privado — MORE Immigration Consulting. Todos los derechos reservados.
