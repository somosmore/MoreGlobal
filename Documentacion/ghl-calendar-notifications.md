# Notificaciones generales de calendario GHL

La matriz general está en `more-landing/public/calendar-notifications.json`. Es la fuente de contenido para los tres canales:

- Email HTML.
- SMS.
- WhatsApp.

Incluye ocho eventos: reserva no confirmada, confirmación, cancelación/no-show, reprogramación, recordatorio 24 h, recordatorio 1 h, recordatorio 15 min y seguimiento una hora después.

## Sincronización

Desde `more-landing/`:

```bash
node scripts/sync-ghl-calendar-notifications.mjs --dry-run
node scripts/sync-ghl-calendar-notifications.mjs --apply --all-calendars
node scripts/sync-ghl-calendar-notifications.mjs --verify --all-calendars
```

Para trabajar sobre un único calendario:

```bash
node scripts/sync-ghl-calendar-notifications.mjs --apply --calendar-id CALENDAR_ID
```

`--apply` sincroniza Email Builder y las notificaciones nativas de Calendar. El script lista todos los calendarios de la subcuenta, crea o actualiza la matriz de cada uno y no necesita IDs específicos de Ivon, Sandra u otros calendarios.

También reconoce nombres históricos de confirmación y recordatorios (`Confirmación Agenda`, `Recordatorio 24h` y `Recordatorio 1h`) y los actualiza con el contenido general cuando están presentes en Email Builder.

`--prune` elimina notificaciones duplicadas que coincidan con una clave administrada por esta matriz. Usarlo después de revisar la salida de `--dry-run`:

```bash
node scripts/sync-ghl-calendar-notifications.mjs --apply --all-calendars --prune
```

## Variables de entorno

El script usa el `.env` local y nunca debe ejecutarse con una API key dentro del frontend:

```dotenv
GHL_API_KEY=...
GHL_LOCATION_ID=...
GHL_EMAIL_FROM_NAME=MORE — Migración con Propósito
```

El token necesita acceso a calendarios/notificaciones y Email Builder. El script usa `Version: 2021-04-15` para Calendar Notifications y `Version: 2021-07-28` para Email Builder.

## Cómo funciona en GHL

La API de HighLevel permite consultar, crear, actualizar y eliminar notificaciones en `/calendars/:calendarId/notifications`. Cada petición de creación pertenece a un único calendario; el script repite la misma matriz para todos los calendarios encontrados.

Cada evento se crea para el receptor `contact` y los canales `email`, `sms` y `whatsapp`. Los recordatorios se configuran en 24 horas, 1 hora y 15 minutos antes; el seguimiento se configura una hora después.

En WhatsApp es necesario tener conectado un WhatsApp Business Account y aprobar las plantillas en GHL/Meta antes de activar el canal. Si GHL rechaza el payload por una plantilla aún no aprobada, el Email y SMS siguen siendo configurables de forma independiente.

## Merge fields usados

Las plantillas usan únicamente variables de contexto de cita:

```text
{{contact.first_name}}
{{appointment.title}}
{{appointment.only_start_date}}
{{appointment.only_start_time}}
{{appointment.only_end_time}}
{{appointment.timezone}}
{{appointment.meeting_location}}
{{appointment.add_to_calendar}}
{{appointment.reschedule_link}}
{{appointment.cancellation_link}}
{{user.calendar_link}}
```

Los enlaces de cancelación y reprogramación solo se resuelven cuando la notificación se dispara con contexto de cita y las políticas correspondientes están activadas en el calendario.

## Plantillas históricas

Las plantillas específicas de agenda que existían (`confirmacion-agenda*`, `recordatorio-agenda-24h*` y `recordatorio-agenda-1h*`) se conservan como referencia y compatibilidad. La matriz general y el script son la fuente de verdad para nuevas sincronizaciones; no se deben editar manualmente las copias históricas sin actualizar el JSON.

## Prueba de aceptación

Para cada calendario de la subcuenta:

1. Crear una cita no confirmada.
2. Confirmarla.
3. Reprogramarla.
4. Cancelarla.
5. Crear una cita de prueba para validar 24 h, 1 h y 15 min.
6. Marcar una prueba como no-show.
7. Verificar el follow-up posterior.
8. Confirmar recepción en Email, SMS y WhatsApp, respetando DND, consentimiento y zona horaria del calendario.
