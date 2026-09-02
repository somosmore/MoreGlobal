# Playbook: Crear un webinar nuevo

> Última actualización: 2026-09-01  
> Plantilla de referencia: `/webinar-sep-26` (`src/components/sections/webinar-sep-26/`)

Este documento es la fuente de verdad para que un agente (o desarrollador) cree una landing de webinar sin re-explorar el código cada vez.

---

## Qué es un webinar en MORE

Un webinar es una **landing de campaña hardcodeada en React** para captar registros a un evento en vivo gratuito. No hay tabla `webinars` ni generador dinámico: cada evento es una carpeta de componentes + 2 páginas + 1 migración SQL.

**Embudo:** Landing → formulario → lead en `masterclass_leads` + contacto en GHL → tarjeta de éxito con CTA al grupo de WhatsApp.

**Webinars existentes (referencia):**

| Ruta | Prefijo | Claves settings | Source |
|------|---------|-----------------|--------|
| `/masterclass` | `MC` | `mc_*` | `masterclass-eb2niw-2026` |
| `/taller-niw` | `TN` | `tn_*` | `taller-cambio-estatus-2026` |
| `/webinar-estatus` | `WE` | `we_*` | `webinar-estatus-2026` |
| `/webinar-sep-26` | `WS` | `ws_*` | `webinar-sep-26` |

---

## Inputs que debe dar el usuario

Antes de implementar, confirmar o inferir:

| Input | Ejemplo | Obligatorio |
|-------|---------|-------------|
| **Título del evento** | "El nuevo panorama migratorio de EE.UU." | Sí |
| **Fecha y hora** | Jueves 3 de septiembre 2026, 19:00 Colombia | Sí |
| **Ruta** | `/webinar-oct-26` | Sí (proponer si no la dan) |
| **Copy** | H1, beneficios, tensión, FAQ, etc. | Sí (o redactar con MOS/CRO) |
| **Tag GHL** | `Webinar-Oct-26` | Sí (proponer convención) |
| **Link grupo WhatsApp** | `https://chat.whatsapp.com/...` | Puede quedar `PENDIENTE` |
| **Secciones extra** | Roadmap de masterclasses, etc. | Opcional |

**Convenciones de naming:**

- `source` (Supabase): kebab-case, ej. `webinar-oct-26`
- `event_label` (GHL): título legible, ej. `Masterclass 1 — El nuevo panorama migratorio de EE.UU.`
- `ghl_tag`: PascalCase con guiones, ej. `Webinar-Oct-26`
- **Prefijo componentes**: 2 letras únicas no usadas (`MC`, `TN`, `WE`, `WS` ya ocupados → elegir otro, ej. `WO`)
- **Claves settings**: `{prefijo_lowercase}_event_date` y `{prefijo_lowercase}_registration_closes_at`

**Fechas en SQL:** siempre ISO con offset Colombia `-05:00`.  
Cierre de registro: típicamente el día siguiente a las `23:59:59-05:00`.

---

## Estructura de la landing

### Rutas (2 por webinar)

| Ruta | Archivo página | Propósito |
|------|----------------|-----------|
| `/webinar-xxx` | `WebinarXxxPage.tsx` | Landing completa con formulario |
| `/webinar-xxx/registro` | `WebinarXxxRegistroPage.tsx` | Solo tarjeta WhatsApp (Meta Lead Ads) |

### Orden de secciones en la página principal

1. `XXHero` — H1, fecha, countdown (`settings.{prefix}_event_date`), barra cupos, CTA a `#registro`
2. `XXBenefits` — bullets de lo que aprenderá
3. `XXTension` — bloque dolor/solución + CTA
4. `XXRoadmap` — *(opcional)* ruta de aprendizaje
5. `XXTestimonials` — prueba social
6. `XXRegistrationForm` — formulario (`id="registro"`)
7. `XXFAQ` — accordion
8. `XXSpeaker` — Ivon More
9. `XXFooter`
10. `XXStickyCTA` — barra fija al scroll

### Archivos en `src/components/sections/webinar-xxx/`

```
scrollToRegistro.ts          # scroll suave + evento focus-registro
webinarXxxCopy.ts            # copy form, éxito, metas /registro
XXHero.tsx
XXBenefits.tsx
XXTension.tsx
XXRoadmap.tsx                # opcional
XXTestimonials.tsx
XXRegistrationForm.tsx       # SOURCE, EVENT_LABEL, GHL_TAG aquí
XXFAQ.tsx
XXSpeaker.tsx
XXFooter.tsx
XXStickyCTA.tsx
XXWhatsappJoinCard.tsx       # URL del grupo aquí
```

**Clonar desde:** `webinar-sep-26/` (más reciente) o `webinar-estatus/`.

---

## Formulario de registro

### Campos

| Campo | Obligatorio |
|-------|-------------|
| Nombre completo | Sí |
| Email | Sí |
| WhatsApp (lada + número) | Sí |
| Profesión | No |

País se deriva de la lada (`DIAL_TO_COUNTRY`). No agregar campo país visible.

### Constantes en `XXRegistrationForm.tsx`

```ts
const WEBINAR_SOURCE = "webinar-xxx"
const WEBINAR_EVENT_LABEL = "Título legible del evento"
const WEBINAR_GHL_TAG = "Webinar-Xxx-2026"
```

### Estados del formulario

- **Activo** → formulario visible
- **Enviado** → `XXWhatsappJoinCard` in-place (sin redirect)
- **Cerrado** → `ExpiredCard` si `useOfferWindow(settings.{prefix}_registration_closes_at).expired`

### Backend (no crear endpoint nuevo)

POST a `VITE_MASTERCLASS_REGISTER_URL` con body:

```json
{
  "nombre", "email", "phone", "pais", "profesion",
  "source", "event_label", "ghl_tag",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "capi_event_id", "client_user_agent", "event_source_url", "fbp", "fbc"
}
```

Tabla destino: `masterclass_leads`. Edge function: `supabase/functions/masterclass-register`.

---

## Checklist de implementación

### 1. Componentes y páginas

- [ ] Crear `src/components/sections/webinar-xxx/` (clonar `webinar-sep-26`)
- [ ] Renombrar prefijo `WS` → `XX` en todos los archivos
- [ ] Actualizar copy en cada sección + `webinarXxxCopy.ts`
- [ ] Setear `WEBINAR_SOURCE`, `WEBINAR_EVENT_LABEL`, `WEBINAR_GHL_TAG` en el form
- [ ] Setear `WEBINAR_XXX_WHATSAPP_GROUP_URL` en `XXWhatsappJoinCard.tsx`
- [ ] Crear `src/pages/WebinarXxxPage.tsx` y `WebinarXxxRegistroPage.tsx`
- [ ] `useLandingStatus("/webinar-xxx")` en ambas páginas
- [ ] SEO: `document.title` + meta description + og:* en `useEffect`

### 2. Router y tracking

- [ ] `App.tsx`: `lazy()` + `<Route path="/webinar-xxx">` y `/webinar-xxx/registro`
- [ ] `src/lib/tracking.ts`: agregar ambas rutas a `MASTERCLASS_LANDING_PATHS`

### 3. Settings (fechas editables en admin)

Agregar claves `{xx}_event_date` y `{xx}_registration_closes_at` en:

- [ ] `src/lib/supabase.ts` → `SiteSettingsMap`
- [ ] `src/contexts/SiteSettingsContext.tsx` → `DEFAULTS`
- [ ] `src/components/admin/settings/useSettingsData.ts` → state, load, upsert en `handleSaveLandings`
- [ ] `src/components/admin/settings/LandingCountdownsSection.tsx` → bloque `DateField`
- [ ] `src/pages/AdminSettings.tsx` → pasar props al section

Usar las claves en `XXHero` (countdown) y `XXRegistrationForm` (cierre).

### 4. Migración SQL

- [ ] Crear `more-landing/supabase/migrations/NNN_webinar_xxx.sql` (siguiente número disponible)
- [ ] Informar al usuario: ejecutar en **Supabase → SQL Editor → Run**

Plantilla:

```sql
-- Webinar "{Título}" — /webinar-xxx
-- Fecha: YYYY-MM-DD

INSERT INTO landing_projects (name, status, answers, tech_config, is_active, route) VALUES (
  'Webinar: {Título}', 'generated',
  '{"type": "webinar", "topic": "{topic-kebab}"}',
  '{"framework": "react", "built_in": true}', true, '/webinar-xxx')
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('{xx}_event_date', 'YYYY-MM-DDTHH:MM:SS-05:00'),
  ('{xx}_registration_closes_at', 'YYYY-MM-DDTHH:MM:SS-05:00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

> Si la ruta ya existía con `is_active = false`, el `ON CONFLICT DO NOTHING` no la reactiva. Verificar con `SELECT * FROM landing_projects WHERE route = '/webinar-xxx'`.

### 5. Documentación y verificación

- [ ] Actualizar `Documentacion/manual_de_usuario.md` (sección 1.xx + índice)
- [ ] `npm run lint` y `npx tsc --noEmit` en `more-landing/`
- [ ] `npm run build`
- [ ] Commit: `feat(webinar-xxx): landing {título corto}`

### 6. Post-deploy (usuario)

- [ ] Ejecutar migración en Supabase
- [ ] Verificar `https://moremigracion.com/webinar-xxx` carga (no "Evento no disponible")
- [ ] Probar registro de prueba → lead en GHL con tag correcto
- [ ] Confirmar CTA WhatsApp abre el grupo

---

## Prompt de ejemplo para el usuario

Copiar y completar:

```
Crea un webinar siguiendo Documentacion/webinar-playbook.md (plantilla webinar-sep-26).

- Ruta: /webinar-xxx
- Fecha: [día] [mes] [año], 19:00 hora Colombia
- Título: [título del evento]
- Tag GHL: [Webinar-Xxx-2026] (o proponé uno)
- Link WhatsApp: [url o "pendiente"]

Copy:
[paste del contenido o brief]
```

---

## URLs de producción

Dominio: `https://moremigracion.com`

| Uso | URL |
|-----|-----|
| Landing | `https://moremigracion.com/webinar-xxx` |
| Meta Lead Ads (post-registro) | `https://moremigracion.com/webinar-xxx/registro?utm_source=facebook&utm_medium=paid&utm_campaign=webinar-xxx` |

---

## Qué NO hacer

- No crear tabla nueva ni edge function nueva (reutilizar `masterclass-register`)
- No usar redirect a `/gracias` — el éxito es in-place con `XXWhatsappJoinCard`
- No hardcodear fechas solo en el hero: deben existir en `site_settings` Y reflejarse en la migración
- No olvidar `MASTERCLASS_LANDING_PATHS` (Meta ViewContent / CompleteRegistration)
- No pedir al usuario que copie SQL manualmente sin crear el archivo de migración primero (regla `SQL-MIGRATIONS.mdc`)

---

## Activación de la landing

`useLandingStatus(route)` consulta `landing_projects`:

1. `deactivate_at` pasado → expired  
2. `activate_at` futuro → scheduled  
3. `is_active = false` → inactive  
4. Resto → active  

Sin fila en `landing_projects` o con `is_active = false`, la página muestra **"Evento no disponible"**.
