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

### [2026-11-11] — Kit del evento y sala de espera en el admin

- Agente: claude-code
- Archivos modificados: `src/lib/eventKit.ts`, `src/pages/AdminEventoKit.tsx`, `src/pages/AdminSala.tsx`, `src/components/admin/sala/{useLaunchTimer.ts,ClockRing.tsx,ChatBubbles.tsx,salaMessages.ts}` (nuevos); `src/App.tsx`, `src/components/admin/AdminLayout.tsx`
- Qué se implementó: `/admin/evento` (Kit del evento): páginas del evento, 4 links de pago con precio (de `site_settings`), URLs de redirección post-pago para GHL, sala de espera, WhatsApp y grupo de Facebook, generador de UTMs; todo con Copiar/Abrir. `/admin/sala`: cuenta regresiva a pantalla completa para proyectar en Zoom (protegida, sin layout), portada de MORE-WEBINAR-EB2-NIW/countdown.html y de la sala React de landing-webinar, con burbujas de mensajes reales de públicos de MORE. Estructura del evento activo en `lib/eventKit.ts` (para un webinar nuevo: agregar entrada y cambiar `ACTIVE_EVENT_ID`).
- También: los 4 links de pago (GHL `api.moremigracion.com/payment-link/…`) cargados en `site_settings` (MORE.WEB `pqextffbzzwadrlzgnvb`), verificados uno por uno.
- Qué se verificó: tsc, lint (11 preexistentes), build; en local con rutas temporales sin login: kit con los 4 links desde la base, sala con conteo, burbujas y pantalla final.
- Problemas encontrados: el worktree no tiene `.env` (en local la app usa DEFAULTS); se probó pasando las `VITE_SUPABASE_*` como variables de entorno. La animación de salida de dígitos se acumulaba con la pestaña en segundo plano → solo animación de entrada.
- Estado: ✅ completo

### [2026-11-11] — Taller: página de gracias post-pago (`/taller-23nov/gracias`)

- Agente: claude-code
- Archivos modificados: `src/pages/TallerNov26GraciasPage.tsx` (nuevo), `src/components/sections/taller-nov-26/tallerCalendar.ts` (nuevo), `src/components/sections/taller-nov-26/tallerNov26Copy.ts` (`parsePriceAmount`), `src/lib/tracking.ts` (`trackWorkshopPurchase` + ruta), `src/App.tsx`
- Qué se implementó: Página a la que redirige Stripe (`?entrada=general|vip&version=publico|comunidad&session_id={CHECKOUT_SESSION_ID}`): confirmación tipo pase de abordar, Google Calendar por día + .ics con los dos días (19:00 COT, 2 h estimadas), pasos siguientes (paso extra de revisión de perfil si es VIP), botón a la Comunidad y WhatsApp. Dispara Purchase (Meta) / purchase (GA4) con el monto en USD una sola vez por `session_id` (eventID para futura CAPI). `noindex`.
- Qué se verificó: tsc, lint (11 preexistentes), build; en local con `entrada=vip&version=comunidad`: textos, paso VIP, fechas de calendario correctas, `noindex`.
- Problemas encontrados: ninguno. El pago todavía no se valida contra Stripe (solo se usa el session_id para tracking); marcar "Pagado" sigue siendo manual.
- Estado: ✅ completo

### [2026-11-05] — Taller: un solo pago por los dos días (General / VIP)

- Agente: claude-code
- Archivos modificados: `src/components/sections/taller-nov-26/{tallerNov26Copy.ts,TCTickets,TCPains,TCRegistrationForm,TCPaymentCard,TCFAQ,TCHero,TCModules}.tsx`, `src/pages/AdminTaller.tsx`, `src/pages/AdminSettings.tsx`, `src/components/admin/settings/{TallerComunidadSection.tsx,useSettingsData.ts}`, `src/lib/supabase.ts`, `src/contexts/SiteSettingsContext.tsx`, `supabase/functions/masterclass-register/index.ts`
- Qué se implementó: Corrección de la estructura de entradas. El usuario aclaró que se paga una vez por las dos clases, así que se vuelve a **General ($67 / comunidad $50)** y **VIP ($127 / comunidad $97)**, ambas con Día 1 y Día 2. Se quitan la entrada "Día 2", el selector "¿En qué punto estás?", la recomendación de entrada del diagnóstico y los campos de precio/link del Día 2 en admin. Se mantienen la ruta en dos tramos y la fecha del Día 2. Tags GHL por entrada vuelven a `General` / `VIP`.
- Problemas encontrados: la estructura de 3 entradas había sido un supuesto del agente a partir de un "perfecto" ambiguo. No había inscritos con `dia2` (verificado), así que no hubo datos que migrar. Las claves `tc_*dia2*` quedan en `site_settings` sin uso.
- Qué se verificó: tsc, lint (11 preexistentes), build; en local `/taller-23nov/comunidad` muestra 2 pases con $67→$50 y $127→$97, sin selector de etapa.
- Estado: ✅ completo

### [2026-11-03] — Taller: segundo día (martes 24) "Destraba tu proceso"

- Agente: claude-code
- Archivos modificados: `src/components/sections/taller-nov-26/{tallerNov26Copy.ts,TCHero,TCPains,TCModules,TCTickets,TCRegistrationForm,TCPaymentCard,TCFAQ,TCStickyCTA,TCFinalCTA}.tsx`, `src/lib/supabase.ts` (5 claves `tc_event2_date`/`tc_*dia2*`, `ticket_type` con `dia2`), `src/contexts/SiteSettingsContext.tsx`, `src/components/admin/settings/{useSettingsData.ts,TallerComunidadSection.tsx}`, `src/pages/AdminSettings.tsx`, `src/pages/AdminTaller.tsx`, `supabase/functions/masterclass-register/index.ts` (etiquetas Dia1/Dia2/PaseCompleto), `supabase/migrations/039_partial_leads.sql` (acepta dia2; aún no aplicada), `supabase/migrations/043_taller_dia2.sql` (nueva)
- Qué se implementó: Entradas Día 1 (`general`), Día 2 (`dia2`, nueva) y Pase completo VIP (`vip`). Ruta de módulos en dos tramos (Día 1 · Diseña tu ruta / Día 2 · Destraba tu proceso con 5 paradas: diagnóstico de bloqueos, probar experiencia, cartas, RFE/negaciones, casos en vivo). Dolores mapeados a día+parada y recomendación de entrada en el diagnóstico. Selector "¿En qué punto estás?" que marca el pase recomendado. FAQ, garantías, hero, cierre y admin (precios/links del Día 2, fecha del Día 2, selector de 3 entradas en inscritos) actualizados.
- Supuestos (confirmar con el usuario): precio Día 2 = Día 1 ($67 / comunidad $50); Día 2 a las 19:00 COT; acceso gratis de clientes actuales al Día 2 no implementado (decisión comercial).
- Qué se verificó: tsc, lint (11 preexistentes), build. En local `/taller-23nov/comunidad`: 3 pases con fechas y precios tachados, selector de etapa recomienda Día 2, ruta con los dos tramos.
- Problemas encontrados: migración 043 bloqueada para el agente (permisos de producción). Orden: 043 → deploy de la función.
- Estado: ⚠️ bloqueado parcialmente (falta 043, deploy de función y links de pago)

### [2026-11-03] — Admin: pantalla "Inscritos al taller" (`/admin/taller`)

- Agente: claude-code
- Archivos modificados: `src/pages/AdminTaller.tsx` (nuevo), `src/components/admin/taller/useTallerInscritos.ts` (nuevo), `src/components/admin/AdminLayout.tsx` (menú "Taller 23 nov" + breadcrumb), `src/App.tsx`, `src/lib/supabase.ts` (tipo `MasterclassLead`), `supabase/migrations/042_taller_inscritos_pagos.sql`
- Qué se implementó: Lista de inscritos de `source = taller-comunidad-nov-26` con entrada y versión editables, monto según precios de Configuración, estado Por cobrar/Pagado (con fecha), marca de prueba, botón de WhatsApp con mensaje de cobro y link de pago (Stripe con correo precargado), filtros, búsqueda, KPIs (inscritos, pagados, por cobrar con monto, recaudado) y exportación CSV. Migración 042: `payment_status`, `paid_at`, `payment_note`, `is_test`; el rol `authenticated` solo puede actualizar esas columnas + `ticket_type`/`price_tier` (GRANT por columna).
- Datos: migraciones 041 y 042 aplicadas en producción. El único registro existente (prueba del usuario) quedó con `is_test = true`.
- Qué se verificó: tsc, lint, build. NO verificado en el navegador (requiere login admin).
- Estado: ✅ completo (pendiente publicar)

### [2026-11-03] — Taller: versión con precio Comunidad More (`/taller-23nov/comunidad`)

- Agente: claude-code
- Archivos modificados: `src/components/sections/taller-nov-26/{tallerNov26Copy.ts,priceTier.ts (nuevo),TCHero,TCTickets,TCRegistrationForm,TCPaymentCard}.tsx`, `src/pages/TallerNov26Page.tsx`, `src/pages/TallerNov26RegistroPage.tsx`, `src/App.tsx`, `src/lib/tracking.ts`, `src/lib/supabase.ts` (4 claves `tc_comunidad_*`), `src/contexts/SiteSettingsContext.tsx`, `src/components/admin/settings/{useSettingsData.ts,TallerComunidadSection.tsx}`, `src/pages/AdminSettings.tsx`, `supabase/functions/masterclass-register/index.ts` (`price_tier`, `extra_tags`), `supabase/migrations/041_taller_precio_comunidad.sql`, docs
- Qué se implementó: Misma landing con `PriceTierContext` ("publico" | "comunidad"). Comunidad: $50/$97 con precio público tachado, etiqueta en hero, nota en form, `noindex`, links de pago propios, `price_tier` y tag GHL extra para medir. La pública ya no dice "precio especial para la comunidad". Defaults de precio público $67/$127 en el contexto.
- Qué se verificó: tsc, lint (11 preexistentes) y build. En local: `/taller-23nov/comunidad` muestra $67→$50 y $127→$97 tachados, badge, nota del form, `noindex`; `/taller-23nov` sigue en $67/$127 sin tachados ni `noindex`.
- Problemas encontrados: la migración 041 quedó bloqueada para el agente (permisos de producción). Orden obligatorio: 041 antes de desplegar la función.
- Estado: ⚠️ bloqueado parcialmente (falta 041, deploy de función y links de pago de comunidad)

### [2026-11-03] — Taller: URL `/taller-23nov` (antes `/taller-nov-26`)

- Agente: claude-code
- Archivos modificados: `src/App.tsx` (rutas nuevas + redirección `RedirectKeepingQuery` desde las viejas), `src/lib/tracking.ts`, `src/pages/TallerNov26Page.tsx`, `src/pages/TallerNov26RegistroPage.tsx`, `index.html`, textos de admin/contexto, `supabase/migrations/040_taller_23nov_route.sql`, `Documentacion/manual_de_usuario.md`, `SPEC.md`
- Qué se implementó: La URL anterior se leía como "26 de noviembre". Nueva ruta `/taller-23nov` (y `/registro`); las viejas redirigen conservando UTMs y hash. En `landing_projects` se agregó una fila nueva para `/taller-23nov` (ya aplicada en producción), sin tocar la vieja para no romper la página durante el deploy. Source y tag GHL internos sin cambios (`taller-comunidad-nov-26`).
- Problemas encontrados: un `sed` rompió la regex de `index.html` (se corrigió a mano y se limitó a las rutas del taller para no pintar de navy `/taller-niw`).
- Estado: ✅ completo (pendiente publicar)

### [2026-11-03] — HANDOFF: cierre de sesión (comunidad + taller-nov-26)

- Agente: claude-code
- Estado del repo: `main` = `ef7e6a1` = `origin/main`; `dev` = `b805ee3` (mismo contenido que main). Sin cambios sin commitear (solo `.claude/worktrees/` sin seguimiento).
- Qué quedó en producción (Supabase `pqextffbzzwadrlzgnvb`): migraciones 037 y 038 aplicadas; `/comunidad` y `/taller-nov-26` activas; precios `tc_general_price = $67 USD`, `tc_vip_price = $127 USD`; pipeline GHL "Comunidad MORE — Facebook" + secrets `GHL_COMUNIDAD_*`; `masterclass-register` desplegada con el código del pipeline de comunidad (NO con el de `ticket_type` del taller).
- Qué se verificó: tsc, lint (11 errores preexistentes, ninguno nuevo) y `npm run build` en cada commit; landing del taller recorrida en Chrome (desktop). NO verificado: vista móvil, deploy de Dokploy del último push, flujo de pago real.
- Qué no funcionó / callejones:
  - Capturas de Chrome con timeout: la ventana corre a ~1 fps incluso en páginas livianas (problema de la extensión, no de la landing). `resize_window` no cambió el viewport.
  - El agente no puede: desplegar edge functions, aplicar algunas migraciones ni crear pipelines en GHL (bloqueo de permisos de producción). Scripts listos en `C:/Users/Sebastian/.claude/jobs/7edb984d/tmp/` para correr con `!`.
  - GHL responde 401 "Location is not active" (desde fecha desconocida): ningún lead llega a GHL; Supabase sí guarda.
  - API de logs de Supabase (`/analytics/endpoints/logs`) no devolvió datos de function_logs: no se pudo fechar la caída de GHL.
- Diagnóstico comercial (para contexto): mayo trajo 3.338 registros con UTM; los 5 lanzamientos posteriores 24–47 cada uno y casi sin UTM; los ~3.800 `masterclass_leads` siguen en `status = new` (no hay seguimiento registrado). Análisis de clientes 2023–2026 resumido en la entrada de contenido del taller.
- Estado: ⚠️ bloqueado parcialmente (ver SPEC.md → "P0 — Taller Comunidad 23 nov")

### [2026-11-03] — `/taller-nov-26`: contenido del análisis de clientes + tipografía sans

- Agente: claude-code
- Archivos modificados: `src/components/sections/taller-nov-26/{tallerNov26Copy.ts,TCAudience,TCTickets,TCFAQ,TCHero,...}.tsx`, nuevo `TCFears.tsx`, `src/pages/TallerNov26Page.tsx`
- Qué se implementó: Según "Dolores y deseos del cliente" (295 reuniones 2023–2026): perfiles P4 (padres con hijos 15–20, reloj de los 21) y P5 (rechazado/estancado) + tarjeta CTA; 2 dolores nuevos en el diagnóstico; bloque de los 3 miedos (negación, rumores de política, "¿mi perfil alcanza?"); compromisos operativos (fecha fija, grabación VIP en 24 h, un solo canal, todo por escrito); VIP = revisión de perfil + grabación 24 h + prioridad. Toda la landing en sans serif (Inter), sin Playfair, a pedido del usuario.
- Problemas encontrados: ninguno técnico. Beneficios VIP y "grabación en 24 h" son compromisos operativos aceptados por el usuario: el equipo debe cumplirlos.
- Estado: ✅ completo (pendiente publicar)

### [2026-11-03] — Leads parciales para remarketing + loader de marca

- Agente: claude-code
- Archivos modificados: `supabase/migrations/039_partial_leads.sql` (nuevo), `src/lib/partialLead.ts` (nuevo), `src/components/sections/taller-nov-26/TCRegistrationForm.tsx`, `src/components/brand/BrandLoader.tsx` (nuevo), `src/App.tsx`, `src/pages/TallerNov26*.tsx`, `src/index.css`, `index.html`
- Qué se implementó: El form del taller guarda el lead al salir del email (si es válido) y lo actualiza con teléfono/país/nombre/entrada; al enviar marca `completed = true`. Tabla `partial_leads` con RLS (sin acceso anon) y escritura solo vía `capture_partial_lead` (SECURITY DEFINER). Remarketing: `SELECT * FROM partial_leads WHERE completed = false`. Loader de marca (navy en el taller, claro en el resto) y fondo navy desde el primer paint en `/taller-nov-26`.
- Problemas encontrados: la migración 039 la debe ejecutar el usuario (bloqueada para el agente por permisos de producción). Sin ella la captura falla en silencio y el form funciona igual.
- Estado: ⚠️ bloqueado parcialmente (falta aplicar la migración 039)

### [2026-11-03] — `/taller-nov-26`: rediseño "Ruta en vivo"

- Agente: claude-code
- Archivos modificados: `src/components/sections/taller-nov-26/{TCHero,TCPains,TCModules,TCTickets,TCAudience,TCFinalCTA,TCStickyCTA,TCRegistrationForm,TCPaymentCard,TCTestimonials,tallerNov26Copy}.tsx/ts`, nuevos `TCDecor.tsx` (retícula de puntos + ruta punteada animada) y `painsStore.ts`; se elimina `TCManifesto.tsx` (integrado en dolores); `src/pages/TallerNov26Page.tsx`
- Qué se implementó: Escenario navy con la ruta punteada del manual animada (avión en tránsito), info del evento como datos de vuelo, contador como tablero de salidas, diagnóstico interactivo "¿Qué te pasa hoy?" que conecta cada dolor con su módulo, módulos como paradas de una ruta que se dibuja con el scroll y resalta las paradas elegidas, entradas como pases de abordar (General claro / VIP navy), formulario "Check-in" y pago "Embarque". Barra fija corregida (antes quedaba corrida a la izquierda). Se quitó "Cupos limitados" (urgencia inventada, prohibida en el manual).
- Problemas encontrados: no se pudo verificar la vista móvil en el navegador (la ventana no cambió de tamaño). Lint global: 11 errores preexistentes.
- Estado: 🔄 en progreso (pendiente aprobación del usuario antes de publicar)

### [2026-11-02] — Landing `/taller-nov-26`: Taller Comunidad More (evento pago virtual, 23 nov)

- Agente: claude-code
- Archivos modificados: `src/components/sections/taller-nov-26/*` (nuevo), `src/pages/TallerNov26Page.tsx`, `src/pages/TallerNov26RegistroPage.tsx`, `src/App.tsx`, `src/lib/tracking.ts`, `src/lib/supabase.ts` (6 claves `tc_*` en `SiteSettingsMap`), `src/contexts/SiteSettingsContext.tsx`, `src/components/admin/settings/{useSettingsData.ts,TallerComunidadSection.tsx,LandingCountdownsSection.tsx,index.ts}`, `src/pages/AdminSettings.tsx`, `supabase/functions/masterclass-register/index.ts`, `supabase/migrations/038_taller_comunidad_nov_26.sql`, `scripts/create-ghl-taller-comunidad-pipeline.mjs`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: Landing basada en `landing_taller_comunidad_more.html` + 5 dolores + 3 perfiles (mensaje propio por perfil). Formulario con elección de entrada → lead en Supabase/GHL antes de pagar → link de pago por entrada (Stripe con email precargado). Edge function: mapa de pipelines propios por source (comunidad + taller) y `ticket_type` opcional con tag por entrada. Admin: sección "Taller Comunidad" con fechas, precios y links.
- Problemas encontrados: precios, links de pago, beneficios VIP y política de reembolso pendientes (marcados con TODO). `node_modules` del checkout principal no existía; se reinstaló con `npm ci` en el worktree. Lint global: 11 errores preexistentes. Sin preview visual (requiere fila activa en `landing_projects`).
- Estado: 🔄 en progreso (falta migración 038, pipeline/secrets GHL, deploy de función y activar la landing)

### [2026-10-07] — Admin: mejorar contraste y legibilidad del tema dark

- Agente: claude-code
- Archivos modificados: `src/index.css`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: Tokens admin más claros (fondos, texto, bordes). `text-gray-500/600` → secundario (8.3:1), `text-gray-400` → tenue (5.6:1, antes 3.7:1). Tintes translúcidos por color para `bg-{red,green,blue,purple,amber}-50/100` + texto claro del mismo tono (antes 2.4–3.1:1, ahora 6.8–8.4:1). Cubiertos `text-[#2A3A4A]`, `text-navy/70`, `text-navy/40`, `text-navy-mid`. Encabezados de tabla más legibles (12px, secundario) y hover de filas visible.
- Problemas encontrados: lint global mantiene 11 errores preexistentes (archivos no tocados). Sin verificación visual en navegador (requiere login admin).
- Estado: ✅ completo

### [2026-10-07] — GHL: pipeline propio para la comunidad

- Agente: claude-code
- Archivos modificados: `supabase/functions/masterclass-register/index.ts`, `scripts/create-ghl-comunidad-pipeline.mjs` (nuevo), `.env.example`
- Qué se implementó: Pipeline "Comunidad MORE — Facebook" creado en GHL (`6X6qL6kFdbO3qa2Is5RW`, stage "Nuevo Registro" `35fea687-358d-4a3e-a98b-54d76be3ea85`). La edge function envía `source = comunidad-facebook` a ese pipeline si existen los secrets `GHL_COMUNIDAD_PIPELINE_ID` + `GHL_COMUNIDAD_STAGE_ID`; si no, cae al de masterclass.
- Problemas encontrados: las oportunidades de los registros previos siguen en el pipeline de masterclass. El deploy de la función lo ejecutó el usuario (bloqueado para el agente por permisos de producción).
- Estado: ✅ completo (secrets `GHL_COMUNIDAD_*` cargados y `masterclass-register` desplegada el 2026-10-07)

### [2026-09-25] — `/comunidad`: configurar enlace del grupo de Facebook

- Agente: claude-code
- Archivos modificados: `src/components/sections/comunidad/CMFacebookJoinCard.tsx`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: `COMUNIDAD_FACEBOOK_GROUP_URL` → `https://www.facebook.com/groups/1466363148722242`; el CTA post-registro queda habilitado. Migración 037 ya aplicada en producción.
- Problemas encontrados: ninguno.
- Estado: ✅ completo

### [2026-09-25] — Landing `/comunidad`: captación → grupo de Facebook

- Agente: claude-code
- Archivos modificados: `src/components/sections/comunidad/*` (nuevo), `src/pages/ComunidadPage.tsx`, `src/pages/ComunidadRegistroPage.tsx`, `src/App.tsx`, `src/lib/tracking.ts`, `src/components/brand/CtaButton.tsx` (variante `facebook`), `supabase/migrations/037_comunidad_facebook.sql`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: Landing inspirada en alvaroluque.com/luque-com-bog-sep-26, con formulario corto (nombre, email, WhatsApp) antes del grupo (opción B). Reutiliza `masterclass-register` con source `comunidad-facebook` y tag GHL `Comunidad-Facebook`. Éxito in-place con CTA al grupo de Facebook. Sin fechas en settings (no es evento).
- Problemas encontrados: URL del grupo de Facebook pendiente (`COMUNIDAD_FACEBOOK_GROUP_URL`, botón deshabilitado hasta configurarla). Frase de Ivon en `CMProof` es propuesta, validar. Lint global tiene 11 errores preexistentes en archivos no tocados.
- Estado: ⚠️ bloqueado parcialmente (falta URL del grupo)

### [2026-08-01] — Taller `/taller-niw`: Cambio de Estatus (6 ago 2026)

- Agente: cursor
- Archivos modificados: `src/components/sections/taller-niw/*`, `src/pages/TallerNiwPage.tsx`, `src/contexts/SiteSettingsContext.tsx`, `supabase/functions/masterclass-register/index.ts`, `supabase/migrations/033_taller_cambio_estatus_dates.sql`, `public/emails/*taller*`, `scripts/sync-ghl-taller-emails.mjs`, `EmailTemplatesSection.tsx`, `.env.example`, `Documentacion/manual_de_usuario.md`, `Documentacion/taller-redflags-ghl-workflow.md`
- Qué se implementó: Rebrand completo a «Estrategias para cambio de estatus». Fechas 6 ago 2026 19:00 CO. Nuevo tag/source `Taller-cambio-estatus-2026` / `taller-cambio-estatus-2026`. Zoom y WhatsApp nuevos. 6 emails (incluye +30 min). Docs y migración 033.
- Problemas encontrados: workflows GHL siguen siendo manuales (API no los crea).
- Estado: ✅ completo

<!-- Formato por entrada:
### [YYYY-MM-DD] — nombre del task
- Agente: claude | cursor | kilo | humano
- Archivos modificados: ...
- Qué se implementó: ...
- Problemas encontrados: ...
- Estado: ✅ completo / ⛔ bloqueado / 🔄 en progreso
-->

### [2026-07-20] - Fase 1: fundaciones del sistema de marca editorial 2026

- Agente: codex
- Archivos modificados: `src/index.css`, `src/components/brand/Backdrop.tsx`, `SPEC.md`, `Manual de marca/manual-marca-more-2026.html`
- Que se implemento: se centralizaron los tonos decorativos usados por olas, rutas, trama y pines en tokens del tema; `Backdrop` ahora consume esos tokens sin cambiar su composicion visual. Se actualizo el alcance de BR-04 para incluir `/turbo` y se aclaro que la externalizacion de fechas de masterclass/taller ya fue resuelta por BR-07.
- Verificacion: `npx tsc --noEmit` limpio; `npm run build` OK. `npm run lint` mantiene los 27 errores baseline ya existentes fuera de esta fase. La auditoria confirma que `Backdrop.tsx` ya no contiene hexadecimales decorativos hardcodeados.
- Estado: completo

### [2026-07-20] - Fase 2: migracion visual de landings de campana

- Agente: codex
- Archivos modificados: `src/components/brand/EventCountdown.tsx`, `src/locales/{es,en}/*`, `src/components/sections/{masterclass,taller-niw}/*`, `src/{upp,turbo}/components/*`, `src/pages/{MasterclassPage,TallerNiwPage,TallerNiwRegistroPage,UppPage,TurboPage}.tsx`
- Que se implemento: las cuatro landings publicas comparten tratamiento editorial claro, `Backdrop`, superficies `paper`/`paper-warm`, bordes finos y tipografia de marca. Se unifico el contador de UPP/Turbo con `EventCountdown`, se agregaron etiquetas traducibles y se mantuvieron intactos registro, pagos, WhatsApp, tracking, settings y countdowns.
- Verificacion: `npx tsc --noEmit` limpio; `npx vite build` OK (2423 modulos transformados; warning existente de chunks grandes); `npm run lint` conserva los 27 problemas baseline; la auditoria de rutas no encuentra `#0033A0`, `#001A52`, `#0A1F3D`, `blur-3xl`, `bg-clip-text` ni los gradientes legacy auditados.
- Estado: completo

### [2026-07-20] - Fase 3: panel admin y QA final

- Agente: codex
- Archivos modificados: `src/components/admin/**`, `src/pages/Admin*.tsx`, `src/index.css`
- Que se implemento: se migraron los colores hardcodeados del admin a tokens semanticos, incluyendo sidebar, topbar, dashboard, leads, testimonios, proyectos, clientes, recursos y configuracion. Se agregaron tokens funcionales para WhatsApp y se conservaron las operaciones existentes.
- Calidad: se corrigieron los 10 hallazgos de ESLint del alcance admin, incluyendo efectos de carga, dependencias de hooks, funciones declaradas despues de su uso y el render de SidebarContent.
- Checklist QA: revisar `/admin/login`, `/admin/dashboard`, `/admin/leads`, `/admin/testimonials`, `/admin/projects`, `/admin/clients`, `/admin/resources` y `/admin/settings` en 360, 390, 430 px y desktop; validar sidebar colapsado/movil, navegacion, logout, focus visible, contraste, formularios, guardado de settings, countdowns, tracking y WhatsApp.
- Verificacion: `npx eslint src/components/admin src/pages/Admin*.tsx` limpio; `npx tsc --noEmit` limpio; `npm run build` OK (2423 modulos, warning existente de chunks grandes). `npm run lint` queda con 11 problemas fuera del alcance admin: Success, UI shared, wizard y contexts.
- Estado: completo

### [2026-07-14] — BR-03: secciones internas Home al sistema editorial 2026

- Agente: cursor
- Archivos modificados: `src/components/brand/BrandIconCircle.tsx` (nuevo), `src/components/sections/{PainPoints,WhoWeHelp,Pricing,Success,Quiz}.tsx`, `SPEC.md`, `PROGRESS.md`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: skin editorial en PainPoints, WhoWeHelp, Pricing, Success y Quiz. `SectionHeading` + fondos paper/paper-warm/white, tarjetas `border-navy/15`, `BrandIconCircle` (navy/orange), CTAs con `CtaButton`. Pricing sin glass/ring naranja (plan popular = `bg-navy-deep` sólido). Quiz: progress sin glow/shine, panel diagnóstico navy sólido, hex → tokens; `lib/quizLogic.ts` intacto.
- Problemas encontrados: `npm run lint` sigue en ~27 errores de baseline (admin + hooks en Success preexistentes); build OK.
- Estado: ✅ completo

### [2026-07-13] — Número de WhatsApp unificado en una sola fuente

- Agente: claude
- Archivos modificados: `src/lib/whatsapp.ts` (nuevo), `src/hooks/useWhatsappUrl.ts` (nuevo), `src/lib/wppEquipo.ts`, `src/locales/{es,en}/{translation,uppPage,turboPage}.json`, `src/components/sections/{Footer,Quiz,Pricing}.tsx`, `src/pages/{UppPage,TurboPage,UppPdfPage,TurboPdfPage}.tsx`, `src/turbo/components/{TurboStickyCta,TurboRequirementsSection}.tsx`, `src/vip/components/VipOfferClosed.tsx`, `src/components/admin/settings/{ContactSection,useSettingsData,index}.ts(x)`, `src/pages/AdminSettings.tsx`.
- Qué se implementó: el número de WhatsApp estaba repetido en 14 URLs completas dentro de los archivos de traducción (ES y EN) más varios `.tsx`, y la clave `whatsapp_number` de `site_settings` casi no se usaba ni tenía campo en el panel. Ahora el número vive en un solo lugar: los JSON guardan **solo el mensaje** que se pre-carga en el chat (el patrón que ya usaba `vipPage.closed.whatsappMessage`) y el enlace lo arma `buildWhatsappUrl(phone, message)` en `lib/whatsapp.ts`, con el hook `useWhatsappUrl()` para los componentes. Nueva sección **Contacto** en Admin → Settings con el número de WhatsApp (validado: 10-15 dígitos, mismo criterio que `normalizePhone`) y el email de contacto, que tampoco era editable. Las páginas PDF de UPP y Turbo, que imprimían el número como texto, ahora lo leen de settings.
- No se tocó (a propósito): los enlaces de **grupo** de WhatsApp del taller y la masterclass (`chat.whatsapp.com`), el teléfono del **lead** en el admin, y los números de asesores del round-robin (`wpp_team_numbers`), que tienen su propia administración.
- Problemas encontrados: (1) reescribir los JSON con `json.dumps` reformateaba los arrays inline y generaba un diff de 1.100 líneas; se revirtió y se hizo un reemplazo línea por línea, quedando un diff de 14 líneas. (2) `TurboStickyCta` y `TurboRequirementsSection` llamaban a `t("turboPage.cta.whatsappUrl")` directo, sin recibir la prop de la página: si solo se cambiaban las páginas, quedaban rotos.
- Verificación: `tsc --noEmit` limpio, `lint` 27 problemas (mismo baseline), `build` OK. `grep 573132219798` en `src/` solo devuelve el fallback del helper, el default del contexto y el placeholder del panel. En el navegador se leyeron los `href` reales del DOM: home (2 planes + footer), `/upp` y `/turbo` (6 enlaces cada una, incluidos el sticky y la sección de requisitos) construyen bien el enlace con el número de la base y el mensaje de cada página.
- Pendiente: no probé el cambio de número end-to-end desde el panel porque implicaba modificar el valor en producción; el binding quedó verificado leyendo los enlaces del DOM. Las plantillas de email (`public/emails/*.html`) siguen con el número quemado: son estáticas y se sincronizan con GHL, así que si el número cambia hay que regenerarlas con los scripts de `more-landing/scripts/`.
- Estado: ✅ completo

### [2026-07-13] — CTA unificado con efecto + home editorial + countdowns configurables (BR-02, BR-06, BR-07)

- Agente: claude
- Archivos modificados: `src/index.css`, `src/components/brand/{CtaButton,Backdrop,SectionHeading,EventCountdown}.tsx` (los dos primeros nuevos; Backdrop y SectionHeading movidos desde `src/vip/components`), `src/components/ui/button.tsx`, `src/components/sections/{Hero,Navbar,Footer,VipSession,Success}.tsx`, `src/components/sections/masterclass/{MCHero,MCStickyCTA,MCRegistrationForm}.tsx`, `src/components/sections/taller-niw/{TNHero,TNStickyCTA,TNRegistrationForm,scrollToRegistro}.ts(x)`, `src/upp/components/{UppCtaButtons,UppStickyCta,UppPlansSection}.tsx`, `src/turbo/components/{TurboCtaButtons,TurboStickyCta}.tsx`, `src/vip/components/{VipCtaButton,VipCountdown}.tsx`, `src/hooks/useOfferWindow.ts` (nuevo), `src/components/admin/settings/{LandingCountdownsSection,useSettingsData,index}.ts(x)`, `src/pages/{AdminSettings,MasterclassPage,TallerNiwPage,VipSessionPage}.tsx`, `src/lib/supabase.ts`, `src/contexts/SiteSettingsContext.tsx`, `supabase/migrations/029_landing_countdowns.sql` (nuevo). Eliminados: `src/vip/hooks/useVipOffer.ts`, `MCCountdown.tsx`, `TNCountdown.tsx`.
- Qué se implementó: (1) **CTA único** `CtaButton` para todo el sitio público: pastilla naranja con barrido de luz en hover/foco (clase `.cta-shine`, reutiliza el keyframe `shine-sweep` existente pero una sola pasada en vez de loop), elevación de 2 px y tap a 0.97. Antes convivían 4 radios, 2 sintaxis de gradiente y 2 rellenos distintos. De paso se corrigieron dos fallas de accesibilidad reales: el CTA del Navbar medía 36 px (bajo el mínimo táctil de 44 px) y a los CTA de masterclass/taller les faltaba `focus-visible` y `aria-label`. Se agregó la primera regla `prefers-reduced-motion` del proyecto y se borró el CSS muerto `.vip-price-card-shine`. (2) **Home editorial**: Hero con Playfair, regla con estrella y `Backdrop` (olas, ruta punteada, avión); Navbar sobre papel; VipSession como tarjeta de borde fino; Footer con olas de cierre (variante `footer` nueva). Sin `blur-3xl` ni `bg-clip-text`. (3) **Countdowns configurables**: las fechas de taller y masterclass salieron del código a `site_settings`, con sección propia en Admin → Settings → Landings; `MCCountdown`/`TNCountdown` (código duplicado) se unificaron en `EventCountdown` y `useVipOffer` se generalizó a `useOfferWindow`.
- Problemas encontrados: (1) `tsc --noEmit` pasaba pero `npm run build` (que corre `tsc -b`) falló por el tipo de `scrollToRegistro`, que estaba fijado a `MouseEvent<HTMLAnchorElement>` — se amplió a `HTMLElement`. (2) Las fechas de campaña vienen en ISO con offset y `<input type="datetime-local">` solo acepta hora local, así que el hook de settings convierte en ambos sentidos (`toLocalInput`/`toIso`).
- Verificación: `npx tsc --noEmit` limpio; `npm run lint` 27 problemas contra 29 del baseline (ninguno nuevo, dos menos); `npm run build` OK. Probado en navegador: home, `/taller-niw` y `/asesoria-vip`; los 5 CTA de la home comparten clase, pastilla y color, y el contador del taller corre desde la configuración.
- Pendiente: aplicar `029_landing_countdowns.sql` en Supabase (sin ella las landings usan las fechas por defecto del código, no se rompen). Decisión del cliente: las cifras de urgencia (98 % cupos, +1.200 registrados, avatares) se dejan como están.
- Estado: ✅ completo

### [2026-07-13] — Rebrand editorial 2026 + rediseño de `/asesoria-vip` (BR-01)

- Agente: claude
- Archivos modificados: `index.html`, `src/index.css`, `src/vip/components/VipBackdrop.tsx` (nuevo), `VipSectionHeading.tsx` (nuevo), `VipSpecsBar.tsx` (nuevo), `VipCountdown.tsx` (nuevo), `VipOfferClosed.tsx` (nuevo), `VipWhySection.tsx` (nuevo), `VipReceiveSection.tsx` (nuevo), `VipHero.tsx`, `VipPricingSection.tsx`, `VipFitSection.tsx`, `VipFaq.tsx`, `VipAboutIvon.tsx`, `src/vip/hooks/useVipOffer.ts` (nuevo), `src/pages/VipSessionPage.tsx`, `src/locales/{es,en}/vipPage.json`, `src/lib/supabase.ts`, `src/contexts/SiteSettingsContext.tsx`, `src/components/admin/settings/{VipSessionSection,useSettingsData}.tsx`, `src/pages/AdminSettings.tsx`, `supabase/migrations/028_vip_countdown.sql` (nuevo), `Manual de marca/**`, `SPEC.md`. Eliminados: `VipSessionIncluded.tsx`, `VipValueSection.tsx`, `VipSocialProofSection.tsx`.
- Qué se implementó: sistema gráfico editorial 2026 tomado de la presentación del cliente (papel claro, olas navy/naranja con curvas de nivel, rutas punteadas con avión y pines, trama de puntos, iconos duotono en círculos sólidos, titulares en Playfair Display). Tokens nuevos en `index.css` (`navy-deep`, `orange-light`, `paper`, `paper-warm`, `ink-muted`, `font-display`) pensados para propagarse al resto del sitio. Página VIP reescrita con el copy del PDF: hero editorial, "¿Por qué tomar una Asesoría VIP?" (con la tarjeta "Ideal si quieres" y las visas E-2/EB2 NIW/O-1A/EB1A/EB1B), "¿Qué recibes?" (6 entregables, incluido el seguimiento por WhatsApp), barra de specs (60 min · Online · USD $97), filtro "para ti / no para ti", precio con garantía y FAQ. ES y EN. **Urgencia honesta:** se eliminaron el contador falso de "personas viendo ahora" (número aleatorio en el navegador) y las stats sin respaldo (92 % aprobaciones, +200 perfiles); en su lugar hay una ventana de oferta real (`vip_countdown_date` en `site_settings`, botón "Abrir 24 h desde ahora" en el admin) que muestra un contador y, al expirar, cierra la página dejando un aviso con CTA a WhatsApp. Manual de marca v2 regenerado (HTML fuente + `Manual_de_Marca_MORE_2026.pdf`, 8 páginas); el anterior quedó en `Manual de marca/archivo/`.
- Problemas encontrados: (1) el PDF del cliente trae cada slide rasterizada con el texto incrustado, así que no había fondo limpio que recortar → el sistema gráfico se recreó en SVG (escalable y sin peso de imagen). (2) El backdrop con `viewBox` deformaba la trama en secciones largas → variante `section` con patrón a escala real. (3) La regla `react-hooks` prohíbe `Date.now()` en render → el countdown deriva de un `now` en estado actualizado por intervalo. (4) Chrome headless no resuelve `bottom: 0` al paginar el PDF → las olas de portada van en flujo con márgenes negativos.
- Verificación: `npx tsc --noEmit` limpio; `npm run lint` sin errores nuevos (los 3 restantes son preexistentes en `useSettingsData`/`useWppTeamData`); `npm run build` OK. Probado en navegador: página completa, contador corriendo (05:28:47) y estado de oferta cerrada con el botón de WhatsApp.
- Pendiente: correr la migración `028_vip_countdown.sql` en Supabase antes de usar el contador en producción. Sprints BR-02 a BR-05 (resto del sitio) quedan planificados en SPEC.md.
- Estado: ✅ completo

### [2026-07-07] — Taller Red Flags: integración GHL (pipeline, 5 emails, scripts)

- Agente: cursor
- Archivos modificados: `more-landing/supabase/functions/masterclass-register/index.ts`, `more-landing/.env.example`, `more-landing/public/emails/recordatorio-taller-redflags.html`, `more-landing/public/emails/recordatorio-taller-redflags-manana.html` (nuevo), `more-landing/public/emails/recordatorio-taller-redflags-1h.html` (nuevo), `more-landing/scripts/sync-ghl-taller-emails.mjs`, `more-landing/scripts/create-ghl-taller-pipeline.mjs` (nuevo), `more-landing/scripts/verify-ghl-taller-workflow.mjs` (nuevo), `more-landing/scripts/ghl-taller-workflow-links.mjs` (nuevo), `more-landing/scripts/ghl-crm-url.mjs` (nuevo), `more-landing/scripts/enroll-ghl-taller-workflow.mjs` (nuevo), `more-landing/scripts/enroll-ghl-bienvenida.mjs` (nuevo), `more-landing/scripts/ghl-check-bienvenida.mjs` (nuevo), `more-landing/scripts/ghl-contact-emails.mjs` (nuevo), `more-landing/scripts/ghl-workflow-detail.mjs` (nuevo), `more-landing/src/components/admin/resources/EmailTemplatesSection.tsx`, `Documentacion/taller-redflags-ghl-workflow.md`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: Edge Function `masterclass-register` enruta registros con `source: taller-redflags-2026` al pipeline/tag del taller (`GHL_TALLER_*`). Secuencia de emails ampliada a 5: bienvenida, recordatorio 24 h (12 jul), mañana del evento (13 jul 9 AM), 1 h antes (13 jul 6 PM) y en vivo (13 jul 7 PM). Scripts operativos para crear pipeline, sincronizar plantillas HTML a GHL, verificar workflows, inscribir contactos de prueba y enlaces al CRM (`crm.moremigracion.com`). Admin → Recursos muestra las 5 plantillas. Documentación actualizada en manual y guía GHL.
- Problemas encontrados: la API de GHL no permite crear/publicar workflows ni leer pasos internos; workflow Bienvenida publicado manualmente en UI; Recordatorio sigue en draft pendiente de configurar/publicar.
- Estado: ✅ código y docs / ⚠️ workflow Recordatorio pendiente en GHL UI

### [2026-06-23] — `/taller-niw`: optimización de conversión (CRO)

- Agente: claude
- Archivos modificados: `src/components/sections/taller-niw/scrollToRegistro.ts` (nuevo), `TNTestimonials.tsx` (nuevo), `TNHero.tsx`, `TNStickyCTA.tsx`, `TNRegistrationForm.tsx`, `src/pages/TallerNiwPage.tsx`.
- Qué se implementó: Reducción de fricción y refuerzo de confianza para subir el % de inscripciones. (1) Formulario de 5 → 4 campos: profesión ahora **opcional** y se **eliminó el dropdown de país**, derivándolo del prefijo telefónico (`DIAL_TO_COUNTRY`) — la Edge Function sigue recibiendo `pais` como string. (2) CTA del hero y sticky con **scroll suave** + **autofocus por intención** (helper `scrollToRegistro` dispara evento `focus-registro`, el form enfoca el primer campo). (3) **Sticky CTA visible también en desktop** (centrado). (4) Barra de cupos creíble (98% → **82%**, constante `CUPOS_PCT`). (5) **Prueba social**: línea "+N profesionales ya reservaron" en el hero + nueva sección de testimonios antes del formulario. Microcopy "Gratis · En vivo · Cupos limitados" bajo el CTA.
- Problemas encontrados: ninguno. tsc/eslint/build limpios.
- Pendiente: reemplazar placeholders de prueba social marcados con `TODO` (`REGISTRANTS_COUNT` en `TNHero.tsx` y los testimonios en `TNTestimonials.tsx`) por datos reales antes de publicar.
- Estado: ✅ completo

### [2026-06-23] — Landing `/taller-niw` (Red flags de los abogados de inmigración)

- Agente: claude
- Archivos modificados: `src/pages/TallerNiwPage.tsx` (nuevo), `src/components/sections/taller-niw/*` (nuevos: TNHero, TNBenefits, TNRegistrationForm, TNFAQ, TNSpeaker, TNFooter, TNStickyCTA, TNCountdown), `src/App.tsx` (ruta `/taller-niw` + lazy import), `supabase/migrations/026_taller_niw.sql` (nuevo), `supabase/functions/masterclass-register/index.ts`, `src/pages/TurboPdfPage.tsx` (fix puntual).
- Qué se implementó: Nueva landing de webinar al estilo de `/masterclass` (Hero con countdown + barra de cupos, Benefits, formulario de registro, FAQ, Speaker, Footer, Sticky CTA). Evento: martes 30 de junio 2026, 7 PM Colombia, con Ivon More. El formulario captura **nombre, email, teléfono, país y profesión** (campo profesión añadido respecto a la masterclass) y, tras registrar, redirige al grupo de WhatsApp (placeholder `REEMPLAZAR_LINK_DEL_GRUPO` pendiente de reemplazar). Backend reutiliza la Edge Function `masterclass-register` de forma backward-compatible: acepta `profesion`, `source` (`taller-redflags-2026`) y `event_label`; si no llegan, mantiene el comportamiento de la masterclass. Migración `026` añade columna `profesion` a `masterclass_leads` y registra la landing en `landing_projects` (necesario para que `useLandingStatus` la deje accesible).
- Problemas encontrados: (1) El MCP de Supabase solo expone el proyecto `fozhnfxehbbgqaerprgf`, no el de esta app (`pqextffbzzwadrlzgnvb`), así que la migración y el deploy de la Edge Function quedan pendientes de aplicar manualmente con la CLI. (2) Bug preexistente en `TurboPdfPage.tsx:429` (clave `color` duplicada en un objeto `style`) que rompía `tsc -b` de todo el proyecto; corregido quitando el duplicado erróneo.
- Tag de GHL propio del taller: `Taller-julio-2026` (parametrizado vía `ghl_tag`; la masterclass cae al `GHL_TAG` por defecto). Grupo de WhatsApp configurado.
- Pendiente: aplicar migración `026` y desplegar `masterclass-register` en el proyecto de producción (`pqextffbzzwadrlzgnvb`) con la CLI.
- Estado: ✅ completo (frontend) / ⛔ backend pendiente de deploy manual

### [2026-05-28] — Script one-shot de importación Zoom a GHL

- Agente: cursor
- Archivos modificados: `more-landing/scripts/import-ghl-zoom27mayo.mjs`, `.gitignore`
- Qué se implementó: Script operativo para importar asistentes de Zoom a GoHighLevel usando credenciales desde `.env`, con lectura CSV, detección básica de país por teléfono, búsqueda de duplicados por email/teléfono, throttle y modo `--dry-run`. Se excluyeron de git los reportes generados en `more-landing/scripts/reports/` porque contienen datos personales de contactos.
- Problemas encontrados: los reportes generados tienen PII y no deben versionarse.
- Estado: ✅ completo

### [2026-05-28] — `/wppequipo`: importación masiva de números con formateo automático

- Agente: cursor
- Archivos modificados: `src/lib/wppEquipo.ts`, `src/components/admin/settings/useWppTeamData.ts`, `src/components/admin/settings/WppTeamSection.tsx`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: Botón **Importar lista** en `/admin/settings` → WhatsApp Equipo. Modal con textarea + selector de país por defecto (20 países: Ecuador, Colombia, México, Argentina, Perú, Chile, Bolivia, Paraguay, Uruguay, Honduras, Guatemala, El Salvador, Nicaragua, Costa Rica, Panamá, Haití, Venezuela, Brasil, España, USA/Canadá). El parser entiende el formato libre (índice + nombre + teléfono, una línea cada uno) usado en listas internas: ignora índices cortos, detecta nombres por letras y teléfonos por dígitos. `normalizePhone` aplica el código de país por defecto solo a los números que no lo traen, elimina ceros iniciales nacionales y respeta los que ya vienen con prefijo internacional conocido. Preview tabular con nombre/teléfono/URL editables y badge de errores (falta nombre o número inválido) antes de la inserción masiva vía `bulkCreateNumbers` (un solo INSERT).
- Problemas encontrados: ninguno nuevo en build/lint. Los errores de lint en `useWppTeamData.ts` son preexistentes (patrón `setState-in-effect` heredado).
- Estado: ✅ completo

### [2026-05-27] — `/wppequipo` autogestionable desde admin (CRUD + QR + activación)

- Agente: cursor
- Archivos modificados: `supabase/migrations/026_wpp_team_numbers.sql`, `src/lib/supabase.ts`, `src/lib/wppEquipo.ts`, `src/contexts/SiteSettingsContext.tsx`, `src/pages/WppEquipoPage.tsx`, `src/components/admin/settings/useWppTeamData.ts`, `src/components/admin/settings/WppTeamSection.tsx`, `src/components/admin/settings/index.ts`, `src/pages/AdminSettings.tsx`, `package.json`, `package-lock.json`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: Tabla `wpp_team_numbers` con RLS (público lee activos, admin CRUD completo). Flag `wppequipo_enabled` en `site_settings`. Sección admin en Configuración con switch de activación, lista CRUD de números, QR (`qrcode.react`) y copiar enlace `https://moremigracion.com/wppequipo`. Página pública lee números desde Supabase; si página desactivada o sin activos, fallback a `whatsapp_number` general; si no hay fallback, pantalla de indisponibilidad.
- Problemas encontrados: ninguno en build/lint. Requiere ejecutar migración `026_wpp_team_numbers.sql` en Supabase SQL Editor.
- Estado: ✅ completo

### [2026-05-26] — Página `/wppequipo` con redirección aleatoria a WhatsApp

- Agente: cursor
- Archivos modificados: `more-landing/src/pages/WppEquipoPage.tsx` (nuevo), `more-landing/src/App.tsx`, `Documentacion/manual_de_usuario.md`
- Qué se implementó: Nueva ruta pública `/wppequipo` que redirige automáticamente a un enlace aleatorio entre `https://wa.me/message/VRDWDC4SHZIOA1` y `https://wa.link/a1z0jm`. La página muestra una pantalla de carga con identidad visual MORE/WhatsApp (degradado verde, ícono animado y CTA fallback "¿No abrió solo? Tocá acá para continuar"). Se inyectan `meta description` y `meta robots="noindex, nofollow"` por SEO y se restauran al desmontar. La ruta se registra como lazy import en `App.tsx`.
- Problemas encontrados: warnings de Tailwind v4 (`min-h-[100dvh]` → `min-h-dvh`, `bg-gradient-to-br` → `bg-linear-to-br`) corregidos al primer pase.
- Estado: ✅ completo

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
