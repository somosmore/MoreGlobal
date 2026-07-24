# Workflow GHL — Taller Profesional Global (ex Red Flags)

Configuración de emails automáticos cuando un contacto recibe el tag **`taller-profesional-global-2026`** (disparado al registrarse en `/taller-niw`).

**Título comercial:** Cómo convertirte en el profesional que todo país desea

**Legacy (no borrar):** tags `taller-julio-2026`, `taller-redflags-2026`, `taller-junio-2026`, `meta-julio13`. Los workflows históricos de Red Flags pueden seguir existiendo; los **nuevos** registros deben usar el tag nuevo.

## URL para Facebook Ads (Lead Ads)

Tras el formulario nativo de Meta, redirigir al lead a la página de confirmación (solo WhatsApp, sin formulario):

```
https://moremigracion.com/taller-niw/registro?utm_source=facebook&utm_medium=paid&utm_campaign=taller-profesional-global
```

El registro del contacto lo captura Meta/GHL; esta URL solo pide unirse al grupo de WhatsApp.

La landing completa `/taller-niw` sigue disponible para tráfico orgánico con formulario propio.

## Datos del evento

| Campo | Valor |
|-------|-------|
| Título | Cómo convertirte en el profesional que todo país desea |
| Fecha | Jueves **30 de julio de 2026** |
| Hora | **7:00 PM** (Colombia / Perú / Ecuador) |
| Tag GHL (nuevo) | `taller-profesional-global-2026` (`Taller-profesional-global-2026`) |
| Source Supabase | `taller-profesional-global-2026` (legacy aceptado: `taller-redflags-2026`) |
| Pipeline GHL | Mismo pipeline de taller (renombrar en GHL a “Profesional Global” si se desea) |
| Stage inicial | `Nuevo Registro` |
| Zoom (inscripción) | https://us02web.zoom.us/meeting/register/z1tEaTnxTEKctLPQ1rEEtg |
| WhatsApp grupo | https://chat.whatsapp.com/D1e1d993Wb54sHK8B7sx7k |

## Pipeline (IDs producción)

| Campo | Valor |
|-------|-------|
| Pipeline ID | `zZnUEAmqh1zWMnZDZEQP` |
| Stage "Nuevo Registro" | `239e4545-2d00-4ad6-80b7-6a12c77d42f0` |
| Tag nuevo | `Taller-profesional-global-2026` |
| Secret Supabase | `GHL_TALLER_TAG=Taller-profesional-global-2026` |

## Plantillas en GHL

Subir/actualizar desde el repo con:

```bash
cd more-landing
node scripts/sync-ghl-taller-emails.mjs
```

| Plantilla GHL (nombre legacy) | Archivo local | Cuándo |
|-------------------------------|---------------|--------|
| `TALLER-REDFLAGS-Bienvenida` | `public/emails/bienvenida-taller-redflags.html` | Al registrarse |
| `TALLER-REDFLAGS-Recordatorio-24hs` | `public/emails/previo-taller-redflags.html` | **29 jul 2026, 7:00 PM** |
| `TALLER-REDFLAGS-Hoy-Manana` | `public/emails/recordatorio-taller-redflags-manana.html` | **30 jul 2026, 9:00 AM** |
| `TALLER-REDFLAGS-Hoy-1h` | `public/emails/recordatorio-taller-redflags-1h.html` | **30 jul 2026, 6:00 PM** |
| `TALLER-REDFLAGS-EnVivo` | `public/emails/recordatorio-taller-redflags.html` | **30 jul 2026, 7:00 PM** |

También visibles en **Admin → Recursos → Emails → Taller Profesional Global**.

## Workflows en GHL

> Panel CRM: **https://crm.moremigracion.com**  
> La API de GHL **no permite crear/editar workflows** (solo listar e inscribir contactos).

**Acción requerida:** clonar o ajustar workflows para el trigger **Tag added → `taller-profesional-global-2026`**. No borrar los workflows que escuchan `taller-julio-2026`.

| Workflow histórico (referencia) | ID | Notas |
|----------|-----|--------|
| `taller-julio-2026 — Bienvenida` | `9fa2be1f-391a-463e-a894-af8393c17375` | Legacy Red Flags |
| `taller-julio-2026 — Recordatorio` | `78e75337-6fd3-4cbf-876f-cfa62c371ca6` | Legacy Red Flags |

Enlaces útiles:
- Lista de workflows: https://crm.moremigracion.com/v2/location/YF36RPtJ1lRQBqM7Qxgc/automation/workflows
- Plantillas email: https://crm.moremigracion.com/v2/location/YF36RPtJ1lRQBqM7Qxgc/marketing/emails/all

Generar enlaces desde terminal: `node scripts/ghl-taller-workflow-links.mjs`

### Workflow nuevo — Bienvenida (Profesional Global)

1. **Trigger:** Contact Tag → Tag added → `taller-profesional-global-2026`
2. **Action:** Send Email → plantilla `TALLER-REDFLAGS-Bienvenida` (contenido ya rebranded)
3. **Settings:** Allow re-entry → **OFF**
4. **Publish**

### Workflow nuevo — Recordatorios (Profesional Global)

1. **Trigger:** Contact Tag → Tag added → `taller-profesional-global-2026`
2. **Wait** → **29 jul 2026, 7:00 PM** — `America/Bogota`
3. **Send Email** → `TALLER-REDFLAGS-Recordatorio-24hs`
4. **Wait** → **30 jul 2026, 9:00 AM** — `America/Bogota`
5. **Send Email** → `TALLER-REDFLAGS-Hoy-Manana`
6. **Wait** → **30 jul 2026, 6:00 PM** — `America/Bogota`
7. **Send Email** → `TALLER-REDFLAGS-Hoy-1h`
8. **Wait** → **30 jul 2026, 7:00 PM** — `America/Bogota`
9. **Send Email** → `TALLER-REDFLAGS-EnVivo`
10. **Settings:** Allow re-entry → **OFF**
11. **Publish**

### Opcional (recomendado)

- Tras el evento: mover oportunidad a "Asistio en Vivo" o "No Asistio" según asistencia.
- Goal/Exit en recordatorio tras el último email.

## Scripts de verificación

```bash
cd more-landing

# 1. Sincronizar plantillas HTML → GHL
node scripts/sync-ghl-taller-emails.mjs

# 2. Verificar plantillas + estado de workflows
node scripts/verify-ghl-taller-workflow.mjs

# 3. Inscribir contacto de prueba en workflows (tras publicarlos)
node scripts/enroll-ghl-taller-workflow.mjs <contactId>
```

## Verificación end-to-end

1. Crear tag `taller-profesional-global-2026` en GHL.
2. Actualizar secret `GHL_TALLER_TAG` y redeploy `masterclass-register`.
3. Publicar workflows con el tag **nuevo**.
4. Registro en `/taller-niw` con email real de prueba.
5. En GHL: contacto con tag `taller-profesional-global-2026` + oportunidad en pipeline taller.
6. Email de bienvenida en &lt; 5 min.

## Notas Zoom

El link de Zoom es de **inscripción** (webinar registration). Tras inscribirse, Zoom envía su propio email con el enlace personal. Las plantillas MORE refuerzan ese paso y el grupo de WhatsApp.

---

*Última actualización: 2026-07-24 — rebrand Profesional Global*
