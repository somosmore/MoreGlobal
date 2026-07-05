# Workflow GHL — Taller Red Flags (13 jul 2026)

Configuración de emails automáticos cuando un contacto recibe el tag **`taller-junio-2026`** (disparado al registrarse en `/taller-niw`).

## Datos del evento

| Campo | Valor |
|-------|-------|
| Fecha | Lunes **13 de julio de 2026** |
| Hora | **7:00 PM** (Colombia / Perú / Ecuador) |
| Tag GHL | `taller-junio-2026` |
| Zoom (inscripción) | https://us02web.zoom.us/meeting/register/z1tEaTnxTEKctLPQ1rEEtg |
| WhatsApp grupo | https://chat.whatsapp.com/HbCUqesJRA02HxVkyNNlFc |

## Plantillas en GHL

Subir/actualizar desde el repo con:

```bash
cd more-landing
node scripts/sync-ghl-taller-emails.mjs
```

Nombres en GHL (deben coincidir):

| Plantilla GHL | Archivo local | Email |
|---------------|---------------|-------|
| `TALLER-REDFLAGS-Bienvenida` | `public/emails/bienvenida-taller-redflags.html` | Inmediato al registrarse |
| `TALLER-REDFLAGS-Recordatorio-24hs` | `public/emails/previo-taller-redflags.html` | **12 jul 2026, 7:00 PM** (Colombia) |
| `TALLER-REDFLAGS-EnVivo` | `public/emails/recordatorio-taller-redflags.html` | **13 jul 2026, 12:00 PM** (Colombia) |

También visibles en **Admin → Recursos → Emails → Taller Red Flags** (copiar HTML).

## Workflow en GHL (crear manualmente)

**Automation → Workflows → Create workflow**

### Trigger

- **Contact Tag** → Tag added → `taller-junio-2026`

### Acciones (en orden)

1. **Send Email** → Plantilla `TALLER-REDFLAGS-Bienvenida`  
   - Enviar de inmediato.

2. **Wait** → Until specific date/time  
   - **12 de julio de 2026, 7:00 PM** — timezone `America/Bogota`.

3. **Send Email** → Plantilla `TALLER-REDFLAGS-Recordatorio-24hs`

4. **Wait** → Until specific date/time  
   - **13 de julio de 2026, 12:00 PM** — timezone `America/Bogota`.

5. **Send Email** → Plantilla `TALLER-REDFLAGS-EnVivo`

### Opcional (recomendado)

- **Goal / Exit:** quitar tag o mover oportunidad tras el evento.
- **Allow re-entry:** desactivado (evita emails duplicados si alguien se registra 2 veces).
- **Filter:** solo contactos con tag `taller-junio-2026` (sin tag de masterclass activo si quieres segmentar).

## Verificación

1. Registro de prueba en `/taller-niw` con email de test.
2. En GHL: contacto con tag `taller-junio-2026`.
3. Recibir email de bienvenida en &lt; 5 min.
4. Revisar **Automation → Workflow history** del contacto de prueba.

## Notas Zoom

El link de Zoom es de **inscripción** (webinar registration). Tras inscribirse, Zoom envía su propio email con el enlace personal de acceso. Las plantillas MORE refuerzan ese paso y el grupo de WhatsApp.

---
*Última actualización: 2026-07-05*
