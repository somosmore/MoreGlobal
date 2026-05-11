# SPEC.md — MORE Landing

## Protocolo multi-agente

> Estas reglas aplican cuando múltiples IAs (Claude, Cursor, Kilo Code, etc.) trabajan en el repo simultáneamente.

1. **Antes de empezar un task:** `git pull` y verificar que no esté asignado a otro agente
2. **Tomar un task:** marcar `Asignado: tu-nombre` y `Estado: 🔄` en este archivo, commit y push
3. **Al terminar:** commit, marcar `Estado: ✅`, actualizar PROGRESS.md, push
4. **Nunca dos agentes trabajan en archivos que se solapan.** Si necesitás tocar un archivo listado en otro task en progreso → pausar y reportar al humano
5. **Archivos protegidos** (requieren consulta al humano antes de modificar):
   - `lib/supabase.ts` (tipos globales)
   - `App.tsx` (rutas)
   - `index.css` (tema global)

---

## Features pendientes

### P1 — Crítico / Deuda técnica

- [x] **Refactor AdminLeads.tsx**
  Asignado: cursor | Estado: ✅ completo
  El archivo tiene 82 líneas. Extraído en useLeadsData, LeadsKpiCards,
  LeadsToolbar, LeadsTable, LeadDetailSheet.
  Archivos: `pages/AdminLeads.tsx`, `components/admin/leads/*`

- [x] **Refactor AdminSettings.tsx**
  Asignado: claude | Estado: ✅ completo
  928 → 97 líneas. Extraído en useSettingsData, TrackingSection,
  CalendarSection, VipSessionSection, SocialNetworksSection.
  Archivos: `pages/AdminSettings.tsx`, `components/admin/settings/*`

- [ ] **Refactor Quiz.tsx**
  Asignado: — | Estado: ⬚ libre
  El archivo tiene ~45KB. Separar cada paso del quiz en su propio componente
  dentro de `components/sections/quiz/`.
  Archivos: `components/sections/Quiz.tsx`, `components/sections/quiz/*` (nuevo)
  NO tocar: `lib/quizLogic.ts`, `lib/supabase.ts`
  Criterio de éxito: Quiz.tsx < 300 líneas orquestando sub-componentes, build limpio

### P2 — Mejoras de producto

- [ ] **Loading states y skeletons en panel admin**
  Asignado: — | Estado: ⬚ libre
  Depende de: Refactor AdminLeads ✅, Refactor AdminSettings ✅ (completados primero)
  Las páginas admin muestran pantalla en blanco mientras cargan datos de Supabase.
  Agregar skeletons/spinners en Dashboard, Leads, Testimonials, Resources.
  Archivos: `pages/Admin*.tsx`, `components/admin/*/` (los ya refactorizados)
  Criterio de éxito: feedback visual inmediato al entrar a cada sección admin

- [ ] **Manejo de errores en API calls**
  Asignado: — | Estado: ⬚ libre
  Depende de: Refactor AdminLeads ✅, Refactor AdminSettings ✅ (completados primero)
  Los errores de Supabase y Gemini se loguean en console pero no se muestran al
  usuario. Agregar toasts o banners de error en operaciones CRUD del admin.
  Archivos: `pages/Admin*.tsx`, `components/admin/*/`, `lib/supabase.ts` (solo lectura)
  Criterio de éxito: errores de red/API muestran mensaje claro al usuario, no rompen la UI

- [ ] **Mejoras página VIP según plan existente**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias (archivos independientes del admin)
  Implementar las mejoras documentadas en `Documentacion/plan_mejora_pagina_vip.md`.
  Archivos: `vip/*`, `pages/VipSessionPage.tsx`, `locales/*/vipPage.json`
  Criterio de éxito: cambios alineados con el plan, página VIP actualizada

### P2b — UX/UI Refresh (landing + VIP)

> Objetivo: mejorar la experiencia visual y de interacción usando las librerías ya
> instaladas (Shadcn/UI, Framer Motion 12, Tailwind v4) y agregar solo dependencias
> mínimas donde el impacto lo justifique.

#### Fase 1 — Expandir componentes Shadcn/UI (locales, sin deps externas)

- [x] **UX-01: Agregar componentes Shadcn/UI base**
  Asignado: claude | Estado: ✅ completo
  Sin dependencias previas.
  Instalar con `npx shadcn@latest add`: `tooltip`, `badge`, `separator`,
  `avatar`, `skeleton`, `dropdown-menu`, `alert`.
  Son archivos locales copiados a `components/ui/`, no dependencias npm.
  Archivos: `components/ui/tooltip.tsx`, `badge.tsx`, `separator.tsx`,
  `avatar.tsx`, `skeleton.tsx`, `dropdown-menu.tsx`, `alert.tsx` (nuevos)
  Criterio de éxito: componentes instalados, importables, build limpio

- [ ] **UX-02: Integrar skeletons en landing pública**
  Asignado: — | Estado: ⬚ libre
  Depende de: UX-01 ✅
  Las secciones que cargan datos de Supabase (Success/testimonials, Hero/initials)
  muestran vacío mientras cargan. Agregar `<Skeleton>` donde corresponda.
  Archivos: `components/sections/Hero.tsx`, `components/sections/Success.tsx`
  Criterio de éxito: feedback visual inmediato mientras carga contenido dinámico

- [ ] **UX-03: Badges y avatares en social proof del Hero**
  Asignado: — | Estado: ⬚ libre
  Depende de: UX-01 ✅
  Reemplazar los círculos de iniciales del Hero con `<Avatar>` de Shadcn.
  Agregar `<Badge>` para el contador "+200 profesionales" y "98% aprobación".
  Archivos: `components/sections/Hero.tsx`
  Criterio de éxito: social proof visualmente más pulido, consistente con design system

#### Fase 2 — Animaciones avanzadas con Framer Motion 12 (ya instalado)

- [ ] **UX-04: Parallax en Hero con useScroll**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Usar `useScroll` + `useTransform` de Framer Motion para efecto parallax
  sutil en el Hero: el headline se mueve más lento que el background al scrollear.
  Archivos: `components/sections/Hero.tsx`
  NO tocar: `index.css`
  Criterio de éxito: efecto parallax suave, sin jank en mobile, performance ok

- [ ] **UX-05: Transiciones de página con AnimatePresence**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Envolver las rutas en `<AnimatePresence mode="wait">` para fade/slide
  entre Home ↔ VIP ↔ Privacy. Crear wrapper `PageTransition.tsx`.
  Archivos: `App.tsx` (⚠️ archivo protegido — verificar con humano),
  `components/PageTransition.tsx` (nuevo)
  Criterio de éxito: transición suave entre páginas, sin flash blanco

- [ ] **UX-06: Layout animations en pasos del Quiz**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas. Recomendado después de Refactor Quiz (P1).
  Usar `layout` prop de Framer Motion para animar el cambio entre pasos
  del quiz con morphing fluido en vez de fade in/out abrupto.
  Archivos: `components/sections/Quiz.tsx` (o sub-componentes si ya se refactorizó)
  Criterio de éxito: transición entre pasos se siente fluida y profesional

#### Fase 3 — Mejoras de conversión y contenido

- [ ] **UX-07: Persistencia de resultado del quiz en localStorage**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Un usuario que completa el quiz pero no deja datos pierde su resultado.
  Guardar el diagnóstico en localStorage y mostrarlo si vuelve a la página.
  Archivos: `components/sections/Quiz.tsx` (o sub-componentes),
  `lib/quizLogic.ts` (solo lectura)
  Criterio de éxito: al volver a la página, el quiz muestra el resultado previo
  con opción de "Volver a hacer el diagnóstico"

- [ ] **UX-08: Exit-intent modal para quiz abandonado**
  Asignado: — | Estado: ⬚ libre
  Depende de: UX-01 ✅ (usa Dialog de Radix, ya instalado)
  Si el usuario empezó el quiz (paso ≥ 2) y mueve el mouse hacia arriba
  (desktop) o intenta salir, mostrar modal: "Tu diagnóstico está casi listo".
  Solo se muestra una vez por sesión.
  Archivos: `components/sections/Quiz.tsx`, `components/ExitIntentModal.tsx` (nuevo)
  Criterio de éxito: modal aparece al intentar salir con quiz en progreso,
  no es invasivo, solo 1 vez por sesión

- [ ] **UX-09: Mejorar calidad del copy EN**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  El copy en inglés es funcional pero no tiene la fuerza emocional del español.
  Revisar y reescribir: Hero, PainPoints, WhoWeHelp, Quiz results, Pricing.
  Archivos: `locales/en/translation.json`
  Criterio de éxito: copy EN con misma calidad persuasiva que ES,
  no suena a traducción literal

#### Fase 4 — Dependencias externas mínimas (requiere aprobación)

> ⚠️ Estas tareas agregan dependencias npm nuevas. Requieren aprobación del humano
> antes de empezar según reglas de CLAUDE.md.

- [ ] **UX-10: Carousel de testimonios con Embla**
  Asignado: — | Estado: ⬚ libre
  Depende de: UX-01 ✅ + aprobación humana para `embla-carousel-react`
  Instalar componente carousel de Shadcn (trae `embla-carousel-react` ~7KB).
  Reemplazar el scroll manual de testimonios en Success.tsx con carousel
  touch-friendly, autoplay, dots de navegación.
  Archivos: `components/ui/carousel.tsx` (nuevo via shadcn),
  `components/sections/Success.tsx`
  Criterio de éxito: carousel fluido, swipeable en mobile, autoplay con pausa on hover

- [ ] **UX-11: Toast notifications con Sonner**
  Asignado: — | Estado: ⬚ libre
  Depende de: aprobación humana para `sonner` (~5KB)
  Agregar toasts para feedback del quiz (resultado guardado), errores de red,
  y confirmaciones en la VIP page (enlace copiado, etc.).
  Archivos: `App.tsx` (⚠️ protegido), `components/sections/Quiz.tsx`,
  `vip/components/*.tsx`
  Criterio de éxito: feedback visual no intrusivo en acciones del usuario

- [ ] **UX-12: Drawer mobile con Vaul**
  Asignado: — | Estado: ⬚ libre
  Depende de: aprobación humana para `vaul` (~4KB)
  Reemplazar Sheet (side panel) por Drawer (bottom sheet) en mobile para
  el menú de navegación y paneles del quiz. Mejor patrón UX en móvil.
  Archivos: `components/ui/drawer.tsx` (nuevo via shadcn),
  `components/sections/Navbar.tsx`
  Criterio de éxito: menú mobile se abre desde abajo, gesture-friendly,
  se mantiene Sheet en desktop

### P3 — Masterclass Landing: UI/UX premium

> Objetivo: elevar la landing `/masterclass` a nivel de lanzamiento digital
> de infoproductor. Diseño persuasivo, componentes Shadcn/UI, animaciones
> pulidas, optimización de conversión.

- [x] **MC-00: Hero con imagen de Ivon More + layout split**
  Asignado: claude | Estado: ✅ completo
  Sin dependencias previas.
  Cambiar el hero de layout centrado a layout split (dos columnas en desktop):
  - **Izquierda:** logo, badge, headline, subtítulo, detalles, CTA, barra de cupos
  - **Derecha:** foto profesional de Ivon More con efecto de recorte/fade
  En mobile se apila: texto arriba, imagen abajo (o imagen como fondo sutil).
  El countdown se mantiene debajo del bloque split (full width).

  **Imagen requerida:** `public/ivon-hero.png`
  - Dimensiones: **800×1000px** (retina-ready, se muestra a ~400×500px)
  - Formato: **PNG con fondo transparente** (para integrar con el degradado azul)
  - Contenido: foto profesional de Ivon More, de cintura para arriba,
    mirando al frente o ligeramente hacia la izquierda (hacia el texto)
  - Estilo: vestimenta formal/business, buena iluminación, alta resolución
  - Si no hay PNG transparente, se acepta JPG con fondo oscuro/azul
    que se mimetice con el gradiente `#0033A0` → `#001A52`
  - Peso máximo recomendado: **150KB** (comprimir con TinyPNG/Squoosh)
  - Alternativa WebP: `ivon-hero.webp` como fallback optimizado

  Inspiración: layout del hero de EXMA Summit (form izquierda + speakers derecha),
  adaptado a una sola speaker con foto prominente.
  Archivos: `components/sections/masterclass/MCHero.tsx`,
  `public/ivon-hero.png` (nuevo — provisto por el humano)
  Criterio de éxito: hero con imagen visible en desktop y mobile,
  no rompe el countdown ni el CTA, imagen optimizada < 150KB

- [x] **MC-01: Componentes Shadcn/UI en formulario de registro**
  Asignado: claude | Estado: ✅ completo
  Depende de: UX-01 ✅ (componentes Shadcn base instalados)
  Reemplazar inputs HTML nativos del form por `<Input>`, `<Select>` de Shadcn/UI.
  Agregar `<Badge>` para "CUPOS LIMITADOS", `<Separator>` entre secciones.
  Usar `<Tooltip>` en el icono de seguridad del footer del form.
  Archivos: `components/sections/masterclass/MCRegistrationForm.tsx`
  Criterio de éxito: formulario visualmente consistente con el design system,
  validación mantiene funcionalidad actual

- [x] **MC-02: Countdown timer y urgencia**
  Asignado: claude | Estado: ✅ completo
  Sin dependencias previas.
  Agregar countdown en tiempo real hasta el 25 de mayo 2026 7PM COT en el Hero.
  Mostrar días/horas/minutos/segundos en cards estilizadas.
  Si el evento ya pasó, mostrar "Evento finalizado" en vez del form.
  Agregar barra de progreso falsa "87% de cupos ocupados" (configurable).
  Archivos: `components/sections/masterclass/MCHero.tsx`,
  `components/sections/masterclass/MCRegistrationForm.tsx`
  Criterio de éxito: countdown funcional, urgencia visible, no se rompe post-evento

- [x] ~~**MC-03: Social proof y testimonios en landing**~~ — Descartado (no necesario)

- [x] **MC-05: Actualización de PUV en hero de masterclass**
  Asignado: claude | Estado: ✅ completo
  Sin dependencias previas.
  Reemplazar el titular y subtítulo del hero por el PUV recomendado en español neutro.
  - Titular: "Descubre si tu perfil profesional puede calificar para la Green Card EB-2 y llévate un plan paso a paso para buscar la residencia en EE. UU."
  - Subtítulo/objeción: "Sin depender de un empleador patrocinador, sin inversiones altas de capital y evitando gastos innecesarios en abogados desde el inicio."
  Archivos: `components/sections/masterclass/MCHero.tsx`
  Criterio de éxito: copy claro, en español neutro, sin promesas absolutas, build limpio

- [x] **MC-04: Mejoras visuales generales**
  Asignado: claude | Estado: ✅ completo
  Sin dependencias previas.
  - Agregar sección FAQ (3-4 preguntas) con `<Accordion>` de Shadcn (ya instalado)
  - Sticky CTA en mobile (botón flotante "Reservar lugar" que scroll al form)
  - Micro-interacciones: hover en benefit cards, pulse en CTA
  - Mejorar spacing y tipografía para mobile
  Archivos: `components/sections/masterclass/MCFAQ.tsx` (nuevo),
  `components/sections/masterclass/MCStickyCTA.tsx` (nuevo),
  `components/sections/masterclass/MCBenefits.tsx`,
  `pages/MasterclassPage.tsx`
  Criterio de éxito: landing se siente profesional y pulida en mobile y desktop

### P4 — Admin: gestión de landings con activación/desactivación

> Objetivo: poder ver, activar y desactivar landings desde el admin panel,
> incluyendo programación de fechas de activación/desactivación.

#### Fase 1 — Switch activo/inactivo (frontend + backend)

- [x] **LAND-01: Modelo de datos y migración**
  Asignado: claude | Estado: ✅ completo
  Sin dependencias previas.
  Agregar columnas a tabla `landing_projects` (o crear tabla `landings` nueva):
  - `is_active` boolean default false
  - `activate_at` timestamptz nullable
  - `deactivate_at` timestamptz nullable
  - `route` text nullable (ej: "/masterclass")
  Registrar la landing de masterclass como entrada.
  Actualizar tipos en `lib/supabase.ts` (⚠️ archivo protegido).
  Archivos: `supabase/migrations/023_landings_activation.sql` (nuevo),
  `lib/supabase.ts`
  Criterio de éxito: migración ejecutable, tipos actualizados, build limpio

- [x] **LAND-02: Switch activo/inactivo en admin/resources/landings**
  Asignado: claude | Estado: ✅ completo
  Depende de: LAND-01 ✅
  Agregar toggle switch en cada `LandingPreviewCard` para activar/desactivar.
  El switch actualiza `is_active` en Supabase inmediatamente.
  Mostrar badge "Activa" (verde) o "Inactiva" (gris) en la card.
  Las landings desactivadas en el router devuelven redirect a `/` o página
  "Evento no disponible".
  Archivos: `components/admin/resources/LandingPreviewCard.tsx`,
  `pages/MasterclassPage.tsx` (guard de activación),
  `App.tsx` (⚠️ protegido — verificar)
  Criterio de éxito: toggle funciona, landing se activa/desactiva en tiempo real

#### Fase 2 — Activación/desactivación programada

> Análisis de opciones para la automatización:
>
> | Opción | Pros | Contras |
> |--------|------|---------|
> | **Supabase pg_cron** | Nativo en Supabase, sin infra extra, SQL directo | Solo resolución por minuto, requiere plan Pro |
> | **n8n workflow** | Visual, fácil de modificar, ya se usa GHL | Infra adicional (hosting n8n), otro punto de fallo |
> | **Supabase Edge Function + cron** | Lógica en TS, mismo stack | Necesita trigger externo (cron.org, GitHub Actions) |
> | **Check en runtime (lazy)** | Sin cron, el frontend verifica `activate_at/deactivate_at` en cada request | Sin latencia de cron, pero no actualiza `is_active` en DB |
>
> **Recomendación:** Usar **check en runtime (lazy)** como primera implementación
> porque no agrega infra y funciona inmediatamente. El frontend/Edge Function
> compara las fechas al servir la página. Si se necesita que `is_active` esté
> sincronizado en DB (para reportes, etc.), agregar **pg_cron** como segunda capa.

- [x] **LAND-03: Programación de fechas en admin**
  Asignado: claude | Estado: ✅ completo
  Depende de: LAND-02 ✅
  Agregar campos de fecha en la UI del admin para `activate_at` y `deactivate_at`.
  Usar date picker (o input type="datetime-local" simple).
  Mostrar estado calculado: "Se activa en X días" / "Se desactiva el DD/MM".
  Archivos: `components/admin/resources/LandingPreviewCard.tsx` (o modal de config),
  Criterio de éxito: fechas editables desde admin, se guardan en DB

- [x] **LAND-04: Runtime check de activación**
  Asignado: cursor | Estado: ✅ completo
  Depende de: LAND-03 ✅
  Implementar lógica lazy: al cargar una landing, verificar si
  `now() >= activate_at` y `now() < deactivate_at` (si están seteados).
  Si no cumple, mostrar página "Evento no disponible" o redirect.
  Crear hook `useLandingStatus(route)` reutilizable.
  Archivos: `hooks/useLandingStatus.ts` (nuevo),
  `pages/MasterclassPage.tsx`
  Criterio de éxito: landing respeta las fechas programadas sin cron externo

### P5 — Sincronización de leads con GHL

> Objetivo: unificar la estructura de leads con GHL como fuente de verdad.
> Los leads actuales de la tabla `leads` (del quiz) son de prueba y se pueden borrar.
> Los leads de `masterclass_leads` deben migrarse a la nueva estructura.
>
> **Estructura objetivo (alineada con GHL):**
> Los campos principales de un contacto en GHL son: firstName, lastName, email,
> phone, source, tags[], customFields[], dateAdded, assignedTo.
> La tabla unificada debe mapear estos campos + conservar UTM y metadata local.

#### Sub-tarea 1 — Nueva estructura de datos

- [ ] **LEADS-01: Migración a tabla unificada `contacts`**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Crear tabla `contacts` con estructura alineada a GHL:
  - `id` uuid PK
  - `ghl_contact_id` text nullable (ID en GHL, para sync)
  - `first_name` text not null
  - `last_name` text
  - `email` text not null unique
  - `phone` text
  - `country` text
  - `source` text (ej: "masterclass-eb2niw-2026", "quiz-diagnostico", "vip-session")
  - `tags` text[] (ej: ["Webinar-EB2NIW-2026", "quiz-alto-impacto"])
  - `status` text default 'new'
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` text nullable
  - `custom_fields` jsonb default '{}'
  - `synced_at` timestamptz nullable (última sync con GHL)
  - `created_at` timestamptz default now()
  - `updated_at` timestamptz default now()
  Migrar datos de `masterclass_leads` a `contacts`.
  Borrar datos de prueba de tabla `leads`.
  Archivos: `supabase/migrations/024_contacts_unified.sql` (nuevo)
  Criterio de éxito: tabla creada, datos de masterclass migrados, RLS configurado

- [ ] **LEADS-02: Actualizar tipos y admin panel**
  Asignado: — | Estado: ⬚ libre
  Depende de: LEADS-01 ✅
  Actualizar `lib/supabase.ts` con tipo `Contact` (⚠️ protegido).
  Adaptar `AdminLeads` y sus sub-componentes para leer de `contacts` en vez de `leads`.
  Actualizar filtros: agregar filtro por `source` y `tags`.
  Archivos: `lib/supabase.ts`, `components/admin/leads/*`, `pages/AdminLeads.tsx`
  Criterio de éxito: admin muestra contacts unificados, filtro por source funciona

- [ ] **LEADS-03: Actualizar formulario masterclass y quiz**
  Asignado: — | Estado: ⬚ libre
  Depende de: LEADS-02 ✅
  Actualizar Edge Function `masterclass-register` para insertar en `contacts`.
  Actualizar quiz para insertar en `contacts` con source="quiz-diagnostico".
  Los campos específicos del quiz (academic_level, achievements, etc.) van en
  `custom_fields` jsonb.
  Archivos: `supabase/functions/masterclass-register/index.ts`,
  `components/sections/Quiz.tsx` (o sub-componentes), `lib/quizLogic.ts` (lectura)
  Criterio de éxito: ambos flujos insertan en `contacts`, datos legacy migrados

#### Sub-tarea 2 — Sincronización bidireccional con GHL

- [ ] **LEADS-04: Sync Supabase → GHL (al crear contacto)**
  Asignado: — | Estado: ⬚ libre
  Depende de: LEADS-03 ✅
  Cada vez que se crea un contacto en `contacts`, la Edge Function:
  1. Upsert en GHL (ya implementado en masterclass-register)
  2. Guardar `ghl_contact_id` en la tabla `contacts`
  3. Actualizar `synced_at`
  Extraer la lógica de GHL a función reutilizable `lib/ghl.ts` (Edge Function side).
  Archivos: `supabase/functions/masterclass-register/index.ts`,
  `supabase/functions/_shared/ghl.ts` (nuevo)
  Criterio de éxito: todo contacto nuevo tiene `ghl_contact_id` y `synced_at`

- [ ] **LEADS-05: Sync GHL → Supabase (webhook)**
  Asignado: — | Estado: ⬚ libre
  Depende de: LEADS-04 ✅
  Crear Edge Function `ghl-webhook` que reciba webhooks de GHL
  (contact.created, contact.updated, contact.tag.added) y actualice `contacts`.
  Configurar el webhook en GHL apuntando a la Edge Function.
  Archivos: `supabase/functions/ghl-webhook/index.ts` (nuevo)
  Criterio de éxito: cambios en GHL se reflejan en Supabase automáticamente

### P7 — Tracking & Analytics

> Objetivo: medir el embudo completo de cada landing y mejorar la atribución de
> campañas. Cubierto por el módulo central `lib/tracking.ts`, que soporta Meta
> Pixel directo, GTM (prioritario) y GA4 directo, gobernados desde
> `admin/settings → Medición y píxeles`.

- [x] **TRK-01: Embudo masterclass en píxel de Meta**
  Asignado: claude | Estado: ✅ completo
  Eventos del embudo `/masterclass`:
  - Entrada a la landing → `ViewContent` (Meta) / `masterclass_landing_view` (dataLayer).
  - Registro exitoso → `CompleteRegistration` (Meta) / `masterclass_registration` (dataLayer) + `sign_up` en GA4.
  Funciona con el mismo `meta_pixel_id` global; con GTM, mapear los nombres del `dataLayer` a las etiquetas Meta correspondientes.
  Archivos: `src/lib/tracking.ts`, `src/components/sections/masterclass/MCRegistrationForm.tsx`

- [x] **TRK-02: Documentación en español de `tracking.ts`**
  Asignado: claude | Estado: ✅ completo
  Cabecera del módulo + comentarios por bloque (caché de carga, helpers Meta/GTM/GA4, `ensureTrackingScripts`, `sendPageView`) y bloque `/** ... */` antes de cada export público (`bootstrapTracking`, `trackLeadFromQuiz`, `trackMasterclassRegistration`, `trackScheduleCta`) explicando cuándo se llama y qué evento se dispara en cada modo (GTM / Meta directo / GA4).
  Archivos: `src/lib/tracking.ts`

- [x] **TRK-03: UX/UI de `admin/settings` (medición)**
  Asignado: claude | Estado: ✅ completo
  - Página: fondo en degradado, ancho `max-w-4xl`, barra sticky de navegación por anclas (Medición · Calendario · Sesión VIP · Redes) con `scrollIntoView` suave.
  - `TrackingSection`: estado actual en pills, guía colapsable (Accordion), tabla de eventos con columnas Meta / dataLayer / Cuándo / Destino — incluye filas de masterclass; en móvil colapsa a tarjetas. Toggle "Medición activa" migrado al componente `Switch` de Shadcn.
  Archivos: `src/pages/AdminSettings.tsx`, `src/components/admin/settings/TrackingSection.tsx`

#### Mejoras pendientes

- [ ] **TRK-04: Persistencia de UTMs entre sesiones**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Hoy los UTMs solo se leen al cargar `MCRegistrationForm`. Si el usuario llega por una campaña y vuelve días después sin UTMs en la URL, perdemos la atribución. Persistir UTMs en `localStorage` (o cookie de 30 días) y rehidratarlos en quiz, masterclass y CTA VIP cuando el usuario convierta.
  Archivos: `src/lib/utm.ts` (nuevo), `src/components/sections/Quiz.tsx`, `src/components/sections/masterclass/MCRegistrationForm.tsx`, `src/vip/components/VipCtaButton.tsx`
  Criterio de éxito: UTMs persisten ≥30 días, se envían junto al lead aunque la URL final no los tenga.

- [ ] **TRK-05: Scroll-depth y dwell time en `/masterclass`**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Disparar eventos extra (`masterclass_scroll_25/50/75/100` y `masterclass_dwell_30s`) para medir engagement real de la landing y optimizar el copy. Útil para audiencias de remarketing.
  Archivos: `src/lib/tracking.ts`, `src/pages/MasterclassPage.tsx`
  Criterio de éxito: eventos visibles en Meta Events Manager / GA4 sin degradar performance (throttle + observer).

- [ ] **TRK-06: Conversions API (CAPI) de Meta server-side**
  Asignado: — | Estado: ⬚ libre
  Depende de: TRK-01 ✅
  Crear Edge Function `meta-capi` que reciba los eventos críticos (Lead, CompleteRegistration, Schedule) y los reenvíe al Conversions API de Meta usando `access_token` y `event_id` compartido con el navegador para deduplicación. Mitiga pérdidas por iOS 14.5+ / bloqueadores.
  Archivos: `supabase/functions/meta-capi/index.ts` (nuevo), `src/lib/tracking.ts`, settings nuevo `meta_capi_access_token` en `site_settings`.
  Criterio de éxito: Meta Events Manager muestra eventos browser + server con match >70% deduplicados por `event_id`.

- [ ] **TRK-07: Consent Mode (banner de cookies)**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Hoy el tracking se carga sin pedir consentimiento (la política de privacidad lo declara pero no hay banner). Implementar Consent Mode v2 con banner aceptar/rechazar/preferencias; mientras no haya consentimiento, los scripts no se cargan o se cargan en modo "ad_storage=denied".
  Archivos: `src/components/CookieConsent.tsx` (nuevo), `src/lib/tracking.ts`
  Criterio de éxito: cumplimiento GDPR/CCPA, sin scripts hasta consentimiento, preferencia persistida.

- [ ] **TRK-08: Modo debug en admin (eventos disparados en sesión)**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias previas.
  Tablero interno en `admin/settings → Medición` que muestre, en sesión, los últimos eventos que disparó el sitio (capturando `window.dataLayer` / wrap de `fbq`). Ayuda a debuggear sin tener que abrir Meta Pixel Helper.
  Archivos: `src/lib/tracking.ts`, `src/components/admin/settings/TrackingDebugPanel.tsx` (nuevo)
  Criterio de éxito: el panel muestra evento, payload y timestamp; toggleable y limitado al rol root.

- [ ] **TRK-09: Pixels por landing (no global)**
  Asignado: — | Estado: ⬚ libre
  Depende de: LAND-01 ✅
  Permitir que cada `landing_project` tenga su propio `meta_pixel_id` y `ga4_id`, sobreescribiendo el global. Útil cuando una campaña concreta usa otra cuenta publicitaria.
  Archivos: nueva migración `supabase/migrations/0XX_landing_pixels.sql`, `src/lib/tracking.ts`, `src/components/admin/resources/LandingPreviewCard.tsx`
  Criterio de éxito: cargar `/masterclass` envía eventos al pixel configurado en la landing si está seteado; cae al global si no.

### P6 — Tests y calidad

- [ ] **Tests unitarios para lógica crítica**
  Asignado: — | Estado: ⬚ libre
  Sin dependencias (solo lee funciones, no las modifica)
  Agregar tests para quizLogic.ts, resourceUrl.ts, y utils.ts con Vitest.
  Archivos: `lib/__tests__/*` (nuevo), `vitest.config.ts` (nuevo si no existe)
  NO tocar: archivos en `lib/` (solo importar)
  Criterio de éxito: cobertura de funciones puras en lib/, tests pasan

---

## Criterios globales (aplican a todos los tasks)

- `npm run build` y `npm run lint` deben pasar limpios al finalizar cada task
- No agregar dependencias sin consultar al humano
- Los tipos/interfaces globales (`lib/supabase.ts`) no se modifican sin consultar
- PROGRESS.md se actualiza al terminar cada task
- Un commit por task completado

## Leyenda de estados

| Símbolo | Significado |
|---------|-------------|
| ⬚ libre | Nadie lo tomó, disponible |
| 🔄 en progreso | Un agente lo está trabajando |
| ✅ completado | Terminado, en PROGRESS.md |
| ⛔ bloqueado | Esperando dependencia o decisión humana |
