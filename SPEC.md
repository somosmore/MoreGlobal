# SPEC.md — MORE Landing

## Features pendientes

### P1 — Crítico / Deuda técnica

- [ ] **Refactor AdminLeads.tsx**
  El archivo tiene 1029 líneas. Extraer filtros, tabla y modales en componentes
  separados dentro de `components/admin/leads/`.
  Criterio de éxito: AdminLeads.tsx < 200 líneas, misma funcionalidad, build limpio

- [ ] **Refactor AdminSettings.tsx**
  El archivo tiene 928 líneas. Separar cada sección (tracking, contacto, precios)
  en componentes independientes dentro de `components/admin/settings/`.
  Criterio de éxito: AdminSettings.tsx < 200 líneas, misma funcionalidad, build limpio

- [ ] **Refactor Quiz.tsx**
  El archivo tiene ~45KB. Separar cada paso del quiz en su propio componente
  dentro de `components/sections/quiz/`.
  Criterio de éxito: Quiz.tsx < 300 líneas orquestando sub-componentes, build limpio

### P2 — Mejoras de producto

- [ ] **Loading states y skeletons en panel admin**
  Las páginas admin muestran pantalla en blanco mientras cargan datos de Supabase.
  Agregar skeletons/spinners en Dashboard, Leads, Testimonials, Resources.
  Criterio de éxito: feedback visual inmediato al entrar a cada sección admin

- [ ] **Manejo de errores en API calls**
  Los errores de Supabase y Gemini se loguean en console pero no se muestran al
  usuario. Agregar toasts o banners de error en operaciones CRUD del admin.
  Criterio de éxito: errores de red/API muestran mensaje claro al usuario, no rompen la UI

- [ ] **Mejoras página VIP según plan existente**
  Implementar las mejoras documentadas en `Documentacion/plan_mejora_pagina_vip.md`.
  Criterio de éxito: cambios alineados con el plan, página VIP actualizada

### P3 — Nuevas capacidades

- [ ] **Tests unitarios para lógica crítica**
  Agregar tests para quizLogic.ts, resourceUrl.ts, y utils.ts con Vitest.
  Criterio de éxito: cobertura de funciones puras en lib/, tests pasan

---

## Criterios globales (aplican a todos los tasks)

- `npm run build` y `npm run lint` deben pasar limpios al finalizar cada task
- No agregar dependencias sin consultar al humano
- Los tipos/interfaces globales (`lib/supabase.ts`) no se modifican sin consultar
- PROGRESS.md se actualiza al terminar cada task
- Un commit por task completado
