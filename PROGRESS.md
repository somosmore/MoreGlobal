# PROGRESS.md — Bitácora de desarrollo

> Cada entrada debe incluir el campo **Agente** para saber quién hizo el trabajo.

## Tasks completados (desde SPEC.md)

- [x] Setup inicial del proyecto
- [x] Landing page pública (Navbar, Hero, PainPoints, Quiz, Pricing, Success, Footer)
- [x] Panel admin (Dashboard, Leads, Testimonials, Projects, Clients, Resources, Settings)
- [x] Sistema de autenticación con Supabase (roles standard/root)
- [x] Quiz interactivo de elegibilidad EB-2 NIW (3 pasos con lógica condicional)
- [x] Generación de landings con Gemini 2.0 Flash (wizard + preview)
- [x] Sistema de gestión de recursos (CRUD, pinned, categorías)
- [x] Internacionalización ES/EN con i18next
- [x] Tracking integrado (Meta Pixel, GTM, GA4) configurable desde admin
- [x] Página VIP Session con landing dedicada
- [x] Funcionalidad de edición y normalización de URLs en recursos

---

## Bitácora

<!-- Formato por entrada:
### [YYYY-MM-DD] — nombre del task
- Agente: claude | cursor | kilo | humano
- Archivos modificados: ...
- Qué se implementó: ...
- Problemas encontrados: ...
- Estado: ✅ completo / ⛔ bloqueado / 🔄 en progreso
-->

### [2026-05-11] — TRK-03: UX/UI de admin/settings (medición)

- Agente: claude
- Archivos modificados: `src/pages/AdminSettings.tsx`, `src/components/admin/settings/TrackingSection.tsx`
- Qué se implementó: Página de ajustes con fondo en degradado, ancho ampliado a `max-w-4xl` y barra sticky de navegación por anclas (Medición · Calendario · Sesión VIP · Redes) con scroll suave dentro del `main` del layout. Cada bloque envuelto en `<section id className="scroll-mt-32">`. `TrackingSection` reorganizada: aviso GTM+Meta arriba, estado actual en grid de pills, guía plegable (Accordion) con tabla de eventos (Meta / dataLayer / Cuándo / Destino) que incluye filas de masterclass (`ViewContent` / `CompleteRegistration`) y en mobile colapsa a tarjetas. Toggle "Medición activa" migrado de checkbox nativo al componente `Switch` Shadcn.
- Problemas encontrados: ninguno. Warnings de Tailwind sugiriendo aliases (`text-navy`, `bg-orange`) ignorados por consistencia con el resto del proyecto que usa hex literales.
- Estado: ✅ completo

### [2026-05-11] — TRK-02: Documentación en español de tracking.ts

- Agente: claude
- Archivos modificados: `src/lib/tracking.ts`
- Qué se implementó: Cabecera de módulo con resumen, regla GTM-prioritario y lista de eventos. Comentarios por bloque (caché `loadPromise`, helpers Meta/GTM/GA4, `ensureTrackingScripts`, `sendPageView`) y bloques `/** ... */` antes de cada export público (`bootstrapTracking`, `trackLeadFromQuiz`, `trackMasterclassRegistration`, `trackScheduleCta`) describiendo cuándo se dispara y qué evento se envía en cada modo.
- Problemas encontrados: ninguno
- Estado: ✅ completo

### [2026-05-11] — TRK-01: Embudo masterclass en píxel de Meta

- Agente: claude
- Archivos modificados: `src/lib/tracking.ts`, `src/components/sections/masterclass/MCRegistrationForm.tsx`
- Qué se implementó: En `sendPageView`, al entrar a `/masterclass` se dispara además del `PageView` un `ViewContent` con `content_name: masterclass_eb2niw` (Meta) o `masterclass_landing_view` en `dataLayer` (GTM). Nueva función `trackMasterclassRegistration` que tras el POST OK del registro envía `CompleteRegistration` (Meta) / `masterclass_registration` (dataLayer) / `sign_up` (GA4). `MCRegistrationForm` la invoca antes de `setSubmitted(true)`.
- Problemas encontrados: ninguno
- Estado: ✅ completo

### [2026-05-08] — MC-05: Actualización de PUV en hero de masterclass

- Agente: claude
- Archivos modificados: `components/sections/masterclass/MCHero.tsx`
- Qué se implementó: Titular y subtítulo del hero reemplazados por el PUV recomendado en español neutro. Titular: "Descubre si tu perfil profesional puede calificar para la Green Card EB-2 y llévate un plan paso a paso para buscar la residencia en EE. UU." Frase complementaria de objeciones: "Sin depender de un empleador patrocinador, sin inversiones altas de capital y evitando gastos innecesarios en abogados desde el inicio." Se conservó la frase de cierre "Una clase en vivo que puede cambiarlo todo." y el fragmento destacado en naranja para refuerzo visual de la promesa principal.
- Problemas encontrados: ninguno
- Estado: ✅ completo

### [2026-05-08] — MC-00: Hero con imagen + layout split

- Agente: claude
- Archivos modificados: `components/sections/masterclass/MCHero.tsx`
- Qué se implementó: Layout split dos columnas en desktop (texto izquierda, foto Ivon derecha). Foto con glow naranja, fade inferior y nombre/título. Mobile apilado. Countdown full-width debajo del split.
- Problemas encontrados: ninguno
- Estado: ✅ completo

### [2026-05-08] — Refactor AdminSettings.tsx

- Agente: claude
- Archivos modificados: `pages/AdminSettings.tsx`, `components/admin/settings/useSettingsData.ts` (nuevo), `TrackingSection.tsx` (nuevo), `CalendarSection.tsx` (nuevo), `VipSessionSection.tsx` (nuevo), `SocialNetworksSection.tsx` (nuevo), `index.ts` (nuevo)
- Qué se implementó: Refactor de 928 a 97 líneas. Hook useSettingsData con todo el estado y lógica. 4 secciones como componentes independientes.
- Problemas encontrados: ninguno
- Estado: ✅ completo

### [2026-05-08] — UX-01: Componentes Shadcn/UI base

- Agente: claude
- Archivos modificados: `components/ui/tooltip.tsx` (nuevo), `avatar.tsx` (nuevo), `skeleton.tsx` (nuevo), `dropdown-menu.tsx` (nuevo), `alert.tsx` (nuevo)
- Qué se implementó: 5 componentes Shadcn/UI instalados manualmente (sin shadcn CLI por falta de components.json). Dependencias Radix instaladas: @radix-ui/react-tooltip, react-avatar, react-dropdown-menu.
- Problemas encontrados: shadcn CLI no disponible, se crearon manualmente siguiendo patrones existentes
- Estado: ✅ completo

### [2026-05-08] — LAND-04: Runtime check de activación

- Agente: cursor
- Archivos modificados: `src/hooks/useLandingStatus.ts` (nuevo), `src/pages/MasterclassPage.tsx`, `supabase/migrations/025_landing_projects_public_select.sql` (nuevo)
- Qué se implementó: Hook `useLandingStatus(route)` reutilizable que consulta `landing_projects` por ruta y calcula el estado efectivo evaluando `deactivate_at`, `activate_at` e `is_active` en este orden. Estados posibles: `loading | active | inactive | scheduled | expired | error`. Retorna `isAccessible` (boolean) y `reason` (string para fallback). `MasterclassPage` refactorizado para consumir el hook en lugar de lógica hardcodeada. Migración SQL que abre política `SELECT` mínima al rol `anon` para rutas públicas (solo filas con `route IS NOT NULL`).
- Problemas encontrados: lint bloqueaba `setStatus` síncrono en efecto; resuelto con inicialización lazy del useState.
- Estado: ✅ completo

### [2026-05-07] — LAND-03: Programación de fechas en admin

- Agente: claude
- Archivos modificados: `components/admin/resources/LandingPreviewCard.tsx`
- Qué se implementó: Date pickers para `activate_at` y `deactivate_at` con guardado automático en Supabase. Botón de calendario para mostrar/ocultar panel de programación. Funciones helper `toLocalInput()` (conversión a datetime-local) y `scheduleLabel()` (estado calculado: "Se activa en X días" / "Se desactiva el DD/MM" / "Periodo finalizado").
- Problemas encontrados: tarea quedó sin commitear en sesión anterior
- Estado: ✅ completo

### [2026-05-07] — LAND-02: Switch activo/inactivo en admin

- Agente: claude
- Archivos modificados: `components/ui/switch.tsx` (nuevo), `components/admin/resources/LandingPreviewCard.tsx`, `pages/MasterclassPage.tsx`
- Qué se implementó: Componente Switch (toggle). Toggle en LandingPreviewCard que actualiza `is_active` en Supabase en tiempo real con badge Activa/Inactiva. Guard de activación en MasterclassPage: consulta `is_active` de la landing, muestra spinner mientras carga, página "Evento no disponible" si está inactiva.
- Problemas encontrados: ninguno
- Estado: ✅ completo

### [2026-05-07] — LAND-01: Modelo de datos y migración

- Agente: claude
- Archivos modificados: `supabase/migrations/023_landings_activation.sql` (nuevo), `src/lib/supabase.ts`
- Qué se implementó: Columnas `is_active`, `activate_at`, `deactivate_at`, `route` en `landing_projects`. Índice único en `route`. INSERT de la masterclass como landing activa. Tipos actualizados en LandingProject y LandingProjectInsert. Reparación del historial de migraciones de Supabase CLI (006-022 marcadas como applied).
- Problemas encontrados: Supabase CLI no tenía registradas las migraciones 006-022 como aplicadas. Se reparó con `migration repair --status applied`.
- Estado: ✅ completo

### [2026-04-28] — Mejora estructura multi-agente

- Agente: claude
- Archivos modificados: SPEC.md, PROGRESS.md
- Qué se implementó: Protocolo multi-agente en SPEC.md (ownership, locking, dependencias, archivos por task). Campo Agente en PROGRESS.md.
- Problemas encontrados: ninguno
- Estado: ✅ completo

### [2026-04-25] — Estado inicial del proyecto (baseline)

- Agente: claude
- Archivos auditados: package.json, App.tsx, todas las pages/, components/, lib/, hooks/, contexts/
- Qué se implementó: Auditoría completa para establecer baseline del sistema autónomo
- Problemas encontrados:
  - AdminLeads.tsx (1029 líneas), AdminSettings.tsx (928 líneas), Quiz.tsx (~45KB) — archivos excesivamente largos
  - Sin loading states en panel admin (pantalla blanca durante carga)
  - Errores de API se loguean en console pero no se muestran al usuario
  - Sin tests unitarios
- Estado: ✅ baseline establecido — CLAUDE.md, SPEC.md y PROGRESS.md creados

#### Resumen al 2026-04-25

**Completado y funcionando:**
- Landing pública con todas las secciones (quiz, pricing, success stories, FAQ)
- Panel admin completo (7 secciones con CRUD)
- Auth con Supabase + roles
- Generación de landings con IA
- i18n ES/EN
- Tracking configurable
- Página VIP

**Pendiente (ver SPEC.md):**
- P1: Refactor de 3 archivos grandes (AdminLeads, AdminSettings, Quiz)
- P2: Loading states, manejo de errores UI, mejoras VIP
- P3: Tests unitarios

---

## Archivo
(Entradas antiguas se mueven aquí cuando la bitácora supera 15 entradas)
