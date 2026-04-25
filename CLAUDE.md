# CLAUDE.md — MORE Landing

## Descripción del proyecto
Landing page premium + panel admin para MORE, consultora de inmigración especializada en visas EB-2 NIW. Incluye quiz de elegibilidad, gestión de leads, testimonios, generación de landings con IA (Gemini), sistema de recursos, y página VIP. Soporte bilingüe ES/EN.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 7 |
| Estilos | Tailwind CSS 4 + PostCSS |
| UI Components | Shadcn/UI (Radix) + Lucide React |
| Animaciones | Framer Motion |
| Routing | React Router v7 |
| Base de datos | Supabase (PostgreSQL + Auth + Storage) |
| IA | Google Gemini 2.0 Flash |
| i18n | i18next (ES/EN) |
| PDF/Canvas | html2canvas + jsPDF |
| Drag & Drop | @dnd-kit |

---

## Comandos esenciales

```bash
cd more-landing
npm run dev        # servidor de desarrollo (Vite, port 5173)
npm run build      # tsc -b && vite build
npm run lint       # eslint .
npm run preview    # preview del build
npx tsc --noEmit   # verificar TypeScript sin compilar
```

---

## Arquitectura de archivos

```
more-landing/
├── src/
│   ├── components/
│   │   ├── sections/        # Secciones de landing (Navbar, Hero, Quiz, Pricing, etc.)
│   │   ├── admin/           # Componentes del panel admin
│   │   │   └── resources/   # Cards y modales de recursos
│   │   ├── ui/              # Shadcn/UI base (button, card, accordion, etc.)
│   │   ├── wizard/          # Wizard de proyectos (ClientSelector, WizardProgress)
│   │   ├── ProtectedAdmin.tsx  # Auth guard para rutas admin
│   │   └── TrackingBootstrap.tsx
│   ├── pages/               # Páginas/rutas
│   │   ├── HomePage.tsx     # Landing pública
│   │   ├── Admin*.tsx       # Panel admin (Dashboard, Leads, Settings, etc.)
│   │   └── VipSessionPage.tsx
│   ├── vip/                 # Página VIP (components, pages, data)
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth Supabase + roles (standard/root)
│   ├── hooks/               # useSiteSettings, useUserRole
│   ├── lib/
│   │   ├── supabase.ts      # Cliente Supabase + tipos (Lead, Testimonial, Client, etc.)
│   │   ├── quizLogic.ts     # Lógica del quiz de elegibilidad
│   │   ├── gemini.ts        # Integración Gemini para generación de landings
│   │   ├── tracking.ts      # Meta Pixel, GTM, GA4
│   │   ├── utils.ts         # cn() utility (clsx + tailwind-merge)
│   │   └── resourceUrl.ts   # Normalización URLs de recursos
│   ├── locales/             # Traducciones ES/EN (translation.json, vipPage.json)
│   ├── App.tsx              # Router setup
│   ├── main.tsx             # Entry point (React 19)
│   └── index.css            # Tema Tailwind v4 + animaciones custom
├── supabase/migrations/     # SQL migrations
├── public/                  # Assets estáticos (resources/, testimonials/)
└── [configs]                # vite.config.ts, tsconfig.*.json, eslint, postcss, vercel.json
```

---

## Convenciones de código
- Path alias: `@/*` → `./src/*`
- Componentes: PascalCase (Hero.tsx, AdminDashboard.tsx)
- Utilities/hooks: camelCase (quizLogic.ts, useSiteSettings.ts)
- Tipos: PascalCase, centralizados en `lib/supabase.ts`
- Estilos: Tailwind utility-first + cn() para composición de clases
- Componentes UI: Shadcn/UI pattern (Radix + CVA + Tailwind)
- Estado: React hooks (useState, useEffect, useContext) — sin Redux/Zustand
- SQL: siempre en archivos de migración en `supabase/migrations/`
- i18n: keys en archivos JSON en `locales/{lang}/`
- Contenido/labels en español, código en inglés

---

## Modo de trabajo autónomo

### Flujo por task
1. Leer el task activo en SPEC.md antes de escribir código
2. Implementar solo lo que el task describe, sin scope creep
3. Correr `npm run lint` y `npx tsc --noEmit` en `more-landing/` al terminar cada task
4. Si hay errores, autocorregir antes de continuar
5. Si un error no se resuelve en 2 intentos, pausar y reportar
6. Marcar el task como [x] en SPEC.md y moverlo a PROGRESS.md
7. Registrar en PROGRESS.md: fecha, archivos tocados, qué se hizo, problemas
8. Hacer commit con formato: `type(scope): descripción`
9. Pasar al siguiente task

### Estrategia de git
- Un commit por task completado
- Formato: `feat(scope)`, `fix(scope)`, `refactor(scope)`, `style(scope)`, `chore(scope)`
- No hacer push automático — solo commit local
- Para features que tocan 4+ archivos, considerar branch separado

### Cuándo pausar y preguntar al humano
- Decisión de arquitectura que afecta más de 2 archivos core
- Cambio en tipos o interfaces globales (`lib/supabase.ts`)
- Ambigüedad en lógica de negocio
- Error que no se resuelve tras 2 intentos
- Agregar dependencias npm nuevas

### Cuándo NO pausar
- Errores de TypeScript resolubles con el contexto disponible
- Ajustes de estilos o layout
- Refactors internos de un solo componente
- Agregar funcionalidad siguiendo un patrón ya existente

### Definición de "terminado"
Un task está terminado cuando:
- `npm run build` pasa sin errores nuevos (en more-landing/)
- `npm run lint` pasa sin warnings nuevos
- La feature funciona según la descripción del task
- PROGRESS.md está actualizado
- Commit realizado

---

## Gestión de archivos de trabajo

- **SPEC.md** → fuente de verdad de qué construir. Solo mantener tasks pendientes.
  Al completar un task, marcarlo [x] y moverlo a PROGRESS.md.
- **PROGRESS.md** → bitácora de lo que se fue haciendo + tasks completados.
  Mantener las últimas 15 entradas activas. Si supera ese límite, mover las
  más antiguas al final bajo "## Archivo". Formato por entry:

  ### [YYYY-MM-DD] — nombre del task
  - Archivos modificados: ...
  - Qué se implementó: ...
  - Problemas encontrados: ...
  - Estado: ✅ completo / ⚠️ bloqueado / 🔄 en progreso
