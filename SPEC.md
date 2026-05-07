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

- [ ] **Refactor AdminLeads.tsx**
  Asignado: — | Estado: ⬚ libre
  El archivo tiene 1029 líneas. Extraer filtros, tabla y modales en componentes
  separados dentro de `components/admin/leads/`.
  Archivos: `pages/AdminLeads.tsx`, `components/admin/leads/*` (nuevo)
  NO tocar: `lib/supabase.ts`
  Criterio de éxito: AdminLeads.tsx < 200 líneas, misma funcionalidad, build limpio

- [ ] **Refactor AdminSettings.tsx**
  Asignado: — | Estado: ⬚ libre
  El archivo tiene 928 líneas. Separar cada sección (tracking, contacto, precios)
  en componentes independientes dentro de `components/admin/settings/`.
  Archivos: `pages/AdminSettings.tsx`, `components/admin/settings/*` (nuevo)
  NO tocar: `lib/supabase.ts`
  Criterio de éxito: AdminSettings.tsx < 200 líneas, misma funcionalidad, build limpio

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

- [ ] **UX-01: Agregar componentes Shadcn/UI base**
  Asignado: — | Estado: ⬚ libre
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

### P3 — Nuevas capacidades

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
