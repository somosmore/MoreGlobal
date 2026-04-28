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
