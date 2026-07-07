# Workflow GHL — Taller Red Flags (13 jul 2026)



Configuración de emails automáticos cuando un contacto recibe el tag **`taller-julio-2026`** (disparado al registrarse en `/taller-niw` o en `/taller-niw/registro`).



## URL para Facebook Ads (Lead Ads)



Tras el formulario nativo de Meta, redirigir al lead a la página de confirmación (solo WhatsApp, sin formulario):



```

https://moremigracion.com/taller-niw/registro?utm_source=facebook&utm_medium=paid&utm_campaign=taller-redflags-julio

```



El registro del contacto lo captura Meta/GHL; esta URL solo pide unirse al grupo de WhatsApp.



La landing completa `/taller-niw` sigue disponible para tráfico orgánico con formulario propio.



## Datos del evento



| Campo | Valor |

|-------|-------|

| Fecha | Lunes **13 de julio de 2026** |

| Hora | **7:00 PM** (Colombia / Perú / Ecuador) |

| Tag GHL | `taller-julio-2026` |

| Pipeline GHL | `Taller Red Flags — Julio 2026` |

| Stage inicial | `Nuevo Registro` |

| Zoom (inscripción) | https://us02web.zoom.us/meeting/register/z1tEaTnxTEKctLPQ1rEEtg |

| WhatsApp grupo | https://chat.whatsapp.com/HbCUqesJRA02HxVkyNNlFc |



## Pipeline (IDs producción)



| Campo | Valor |

|-------|-------|

| Pipeline ID | `zZnUEAmqh1zWMnZDZEQP` |

| Stage "Nuevo Registro" | `239e4545-2d00-4ad6-80b7-6a12c77d42f0` |

| Tag | `Taller-julio-2026` (GHL lo guarda como `taller-julio-2026`) |



## Plantillas en GHL



Subir/actualizar desde el repo con:



```bash

cd more-landing

node scripts/sync-ghl-taller-emails.mjs

```



| Plantilla GHL | Archivo local | Cuándo |

|---------------|---------------|--------|

| `TALLER-REDFLAGS-Bienvenida` | `public/emails/bienvenida-taller-redflags.html` | Al registrarse |

| `TALLER-REDFLAGS-Recordatorio-24hs` | `public/emails/previo-taller-redflags.html` | 12 jul 2026, 7:00 PM (Colombia) |

| `TALLER-REDFLAGS-Hoy-Manana` | `public/emails/recordatorio-taller-redflags-manana.html` | **13 jul 2026, 9:00 AM** (Colombia) |

| `TALLER-REDFLAGS-Hoy-1h` | `public/emails/recordatorio-taller-redflags-1h.html` | **13 jul 2026, 6:00 PM** (1 h antes) |

| `TALLER-REDFLAGS-EnVivo` | `public/emails/recordatorio-taller-redflags.html` | **13 jul 2026, 7:00 PM** (en vivo) |



También visibles en **Admin → Recursos → Emails → Taller Red Flags**.



## Workflows en GHL (2 workflows)

> Panel CRM: **https://crm.moremigracion.com**  
> La API de GHL **no permite crear/editar workflows** (solo listar e inscribir contactos).

| Workflow | ID | Estado | Enlace directo |
|----------|-----|--------|----------------|
| `taller-julio-2026 — Bienvenida` | `9fa2be1f-391a-463e-a894-af8393c17375` | ✅ **Publicado** | [Abrir en CRM](https://crm.moremigracion.com/v2/location/YF36RPtJ1lRQBqM7Qxgc/automation/workflows/9fa2be1f-391a-463e-a894-af8393c17375) |
| `taller-julio-2026 — Recordatorio` | `78e75337-6fd3-4cbf-876f-cfa62c371ca6` | ⏳ Draft — configurar y publicar | [Abrir en CRM](https://crm.moremigracion.com/v2/location/YF36RPtJ1lRQBqM7Qxgc/automation/workflows/78e75337-6fd3-4cbf-876f-cfa62c371ca6) |

Enlaces útiles:
- Lista de workflows: https://crm.moremigracion.com/v2/location/YF36RPtJ1lRQBqM7Qxgc/automation/workflows
- Plantillas email: https://crm.moremigracion.com/v2/location/YF36RPtJ1lRQBqM7Qxgc/marketing/emails/all

Generar enlaces desde terminal: `node scripts/ghl-taller-workflow-links.mjs`

### Workflow 1 — Bienvenida

1. **Trigger:** Contact Tag → Tag added → `taller-julio-2026`
2. **Action:** Send Email → plantilla `TALLER-REDFLAGS-Bienvenida`
3. **Settings:** Allow re-entry → **OFF**
4. **Publish**

### Workflow 2 — Recordatorio

1. **Trigger:** Contact Tag → Tag added → `taller-julio-2026`
2. **Wait** → **12 jul 2026, 7:00 PM** — `America/Bogota`
3. **Send Email** → `TALLER-REDFLAGS-Recordatorio-24hs`
4. **Wait** → **13 jul 2026, 9:00 AM** — `America/Bogota`
5. **Send Email** → `TALLER-REDFLAGS-Hoy-Manana`
6. **Wait** → **13 jul 2026, 6:00 PM** — `America/Bogota`
7. **Send Email** → `TALLER-REDFLAGS-Hoy-1h`
8. **Wait** → **13 jul 2026, 7:00 PM** — `America/Bogota`
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



Contacto de prueba actual (borrar al terminar): `ro9nPtkjArCFqioWG28J` — `test.cursor.nghbd1@more-test.invalid`



## Verificación end-to-end



1. Publicar ambos workflows en GHL.

2. Registro en `/taller-niw` con email real de prueba **o** enroll manual del contacto de prueba.

3. En GHL: contacto con tag `taller-julio-2026` + oportunidad en pipeline Taller.

4. Email de bienvenida en &lt; 5 min.

5. **Automation → Workflow history** del contacto muestra pasos ejecutados.



## Notas Zoom



El link de Zoom es de **inscripción** (webinar registration). Tras inscribirse, Zoom envía su propio email con el enlace personal. Las plantillas MORE refuerzan ese paso y el grupo de WhatsApp.



---

*Última actualización: 2026-07-06*


