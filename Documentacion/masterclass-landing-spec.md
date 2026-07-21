# Spec: Landing Masterclass EB2-NIW — Paso Cero

> Instrucciones completas para Claude Code. Leer TODO antes de escribir una sola linea de codigo.
> Este archivo describe una nueva pagina dentro del proyecto React existente (more-landing/).

---

## Contexto

MORE ya tiene una web React (Vite + Tailwind 4 + Shadcn + Framer Motion + Supabase + i18n).
Necesitamos agregar una **landing page para una Masterclass gratuita de 3 dias** como una nueva ruta dentro de la app existente.

Al registrarse, el formulario debe:
1. Guardar el lead en Supabase (tabla `leads` existente)
2. Enviar los datos a GoHighLevel (GHL) via API para crear el contacto + oportunidad + tag
3. Redirigir al usuario al grupo de WhatsApp

El workflow de emails de recordatorio ya esta configurado en GHL — se dispara automaticamente cuando el contacto recibe el tag `webinar-eb2niw-2026`.

---

## Datos del evento

| Campo | Valor |
|---|---|
| Nombre | Masterclass: Paso Cero EB2-NIW |
| Descripcion | Masterclass gratuita de 3 dias para profesionales que quieren migrar a EE.UU. con visa EB2-NIW |
| Speaker | Ivon More — Fundadora de MORE, Migracion con Proposito |
| Fechas | 25, 26 y 27 de mayo 2026 |
| Hora | 7:00 PM hora Colombia (UTC-5) |
| Formato | Online, en vivo, gratis |
| Duracion | ~45 min por sesion |
| WhatsApp Group | `https://chat.whatsapp.com/ESfl34rL4HFEbNmvj4EKnX` |

---

## Ruta y archivo

| Item | Valor |
|---|---|
| Ruta publica | `/masterclass` |
| Pagina | `src/pages/MasterclassPage.tsx` |
| Componentes | `src/components/sections/masterclass/` (crear carpeta) |

Agregar la ruta al router en `App.tsx`:
```tsx
<Route path="/masterclass" element={<MasterclassPage />} />
```

---

## Paleta de colores (usar variables CSS existentes + estas)

| Color | Hex | Uso |
|---|---|---|
| Naranja MORE | `#F37021` | CTAs, acentos, badges |
| Naranja hover | `#D4611A` | Hover en botones |
| Azul USA | `#0033A0` | Hero background, headings |
| Azul deep | `#001A52` | Gradiente hero |
| Blanco | `#FFFFFF` | Fondos |
| Fondo claro | `#F8F9FC` | Body background |
| Texto principal | `#1A2340` | Parrafos |
| Texto secundario | `#6B7A9A` | Subtitulos, disclaimers |
| Verde success | `#10B981` | Confirmacion, WhatsApp |

Tipografia: usar las mismas del proyecto (Inter para cuerpo, Montserrat para headings si esta disponible, sino usar la fuente de headings existente).

---

## Estructura de la pagina

Disenar mobile-first, scroll vertical, sin navbar del sitio principal (landing independiente con su propio header simple).

### Seccion 1 — Hero
- Fondo: gradiente azul `#0033A0` → `#001A52`
- Logo MORE en blanco (usar el que ya esta en `public/`)
- Badge: "MASTERCLASS GRATUITA" (fondo naranja semi-transparente)
- H1: `El Paso Cero para migrar a EE.UU. con visa EB2-NIW`  
  - "Paso Cero" en color naranja `#F37021`
- Subtitulo: "Descubre la ruta que usan los profesionales latinoamericanos para obtener la residencia permanente sin necesidad de empleador. 3 dias de contenido en vivo."
- Detalles del evento con iconos (calendario, reloj, ubicacion, precio, speaker):
  - 25, 26 y 27 de mayo 2026
  - 7:00 PM (hora Colombia)
  - Online y en vivo
  - 100% gratis
  - Con Ivon More
- Animacion: fade-in con Framer Motion al cargar

### Seccion 2 — Que vas a aprender (Benefits)
- Card blanca con sombra suave, superpuesta sobre el hero (margin-top negativo)
- Titulo: "En esta masterclass vas a aprender:"
- Grid 2 columnas (1 en mobile):
  1. Que es la visa EB2-NIW y por que es la mejor opcion para profesionales
  2. Los requisitos reales (no los mitos de internet)
  3. El paso a paso desde cero hasta la aprobacion
  4. Errores comunes que retrasan o arruinan tu caso
  5. Como empezar HOY sin necesidad de un empleador en EE.UU.
  6. Sesion de preguntas en vivo con Ivon More
- Cada item con icono check naranja a la izquierda
- Animacion: stagger reveal al hacer scroll

### Seccion 3 — Formulario de registro
- Card blanca centrada, max-width 500px
- Titulo: "Reserva tu lugar ahora"
- Subtitulo: "Los cupos son limitados. Registrate en 30 segundos."
- Campos:
  1. **Nombre completo** — input text, required, placeholder "Ej: Maria Garcia"
  2. **Email** — input email, required, placeholder "tu@email.com"
  3. **WhatsApp** — select de codigo de pais + input tel
     - Codigos: +57 CO, +52 MX, +1 US, +51 PE, +56 CL, +54 AR, +593 EC, +58 VE, +506 CR, +507 PA, +502 GT, +503 SV, +504 HN, +505 NI, +591 BO, +595 PY, +598 UY, +809 DO, +34 ES
  4. **Pais de residencia** — select con los mismos paises del codigo telefono + "Otro"
- Campos ocultos para UTM: utm_source, utm_medium, utm_campaign, utm_content, utm_term (capturar de query params al cargar)
- Boton submit: "QUIERO MI LUGAR GRATIS" — fondo naranja, texto blanco, font-weight bold
- Validacion client-side con mensajes de error debajo de cada campo
- Al enviar: boton se deshabilita, texto cambia a "REGISTRANDO..."
- Footer del form: icono escudo + "Tu informacion esta segura. No compartimos tus datos con terceros."

### Seccion 4 — Estado de exito (reemplaza el formulario)
- Ocultar el form card, mostrar success card
- Icono check verde grande
- H2: "Tu lugar esta reservado"
- Texto: "Revisa tu email y tu WhatsApp. Te acabamos de enviar los detalles del evento."
- Nota: "Registro exitoso! Redirigiendo al grupo de WhatsApp en X segundos..."
  - Countdown de 4 segundos, luego redirect automatico a `https://chat.whatsapp.com/ESfl34rL4HFEbNmvj4EKnX`
- Boton fallback: "Unirme al grupo de WhatsApp" (verde WhatsApp `#25D366`)
  - Con icono de WhatsApp inline

### Seccion 5 — Speaker
- Card blanca simple
- Nombre: "Ivon More"
- Rol: "Fundadora de MORE — Migracion con Proposito" (color naranja)
- Bio: "Experta en procesos migratorios EB2-NIW. Ha ayudado a cientos de profesionales latinoamericanos a construir su camino legal hacia Estados Unidos."

### Seccion 6 — Footer
- Texto: "MORE — Migracion con Proposito"
- Copyright 2026

---

## Logica del formulario (webhook a GHL)

### Flujo completo

```
Usuario llena formulario
    |
    v
Validacion client-side
    |
    v
POST a Supabase Edge Function o API route
    |
    v
Edge Function hace 2 cosas en paralelo:
  1. INSERT en tabla leads de Supabase
  2. POST a GHL API:
     a. Upsert contact (nombre, email, phone, pais, tag)
     b. Create opportunity en pipeline Masterclass
    |
    v
Response OK al frontend
    |
    v
Mostrar success card + redirect a WhatsApp group
```

### Opcion A: Supabase Edge Function (recomendada)

Crear `supabase/functions/masterclass-register/index.ts`:

```typescript
// Edge Function que:
// 1. Recibe los datos del form
// 2. Inserta en tabla leads de Supabase
// 3. Llama a GHL API para crear contacto + opportunity + tag
// 4. Retorna success

// GHL API endpoints:
// - Upsert contact: POST https://services.leadconnectorhq.com/contacts/upsert
// - Create opportunity: POST https://services.leadconnectorhq.com/opportunities/

// Headers para GHL:
// Authorization: Bearer ${GHL_API_KEY}
// Version: 2021-07-28
// Content-Type: application/json
```

**Variables de entorno (secrets de Supabase):**
```
GHL_API_KEY          — Token de Private Integration de GHL
GHL_LOCATION_ID      — YF36RPtJ1lRQBqM7Qxgc
GHL_PIPELINE_ID      — 7ZPmVRAHDoASbk9XEoVD  (pipeline "Masterclass EB2-NIW — Paso Cero")
GHL_STAGE_ID         — (ID de la etapa "Nuevo Registro" — obtener con GET /opportunities/pipelines)
GHL_TAG              — Webinar-EB2NIW-2026
```

**Body para upsert contact en GHL:**
```json
{
  "locationId": "YF36RPtJ1lRQBqM7Qxgc",
  "firstName": "...",
  "lastName": "...",
  "email": "...",
  "phone": "+57...",
  "source": "Masterclass EB2-NIW",
  "tags": ["Webinar-EB2NIW-2026"],
  "customFields": [
    { "id": "contact.pas_de_origen", "field_value": "Colombia" }
  ]
}
```

**Body para crear opportunity en GHL:**
```json
{
  "pipelineId": "7ZPmVRAHDoASbk9XEoVD",
  "pipelineStageId": "STAGE_ID_AQUI",
  "locationId": "YF36RPtJ1lRQBqM7Qxgc",
  "contactId": "ID_DEL_CONTACTO_CREADO",
  "name": "Nombre Apellido — Masterclass EB2-NIW",
  "status": "open",
  "monetaryValue": 0
}
```

### Opcion B: Webhook Node.js standalone

Si no se quiere usar Edge Functions, hay un webhook listo en:
`/funnels/eb2niw-masterclass/webhook.js`

En ese caso, desplegar el webhook por separado y apuntar el formulario a la URL publica del webhook.

---

## Insert en Supabase (tabla leads)

Usar la tabla `leads` existente. Mapear los campos del form asi:

```typescript
const { data, error } = await supabase.from('leads').insert({
  name: formData.nombre,
  email: formData.email,
  phone: formData.phone,
  country: formData.pais,
  source: 'masterclass-eb2niw-2026',
  utm_source: formData.utm_source || null,
  utm_medium: formData.utm_medium || null,
  utm_campaign: formData.utm_campaign || null,
  status: 'new'
});
```

> Nota: verificar que la tabla `leads` tenga las columnas necesarias. Si no tiene `country`, `utm_source`, etc., crear una migracion para agregarlas.

---

## Integracion con el Admin Panel

Los leads registrados desde la masterclass deben ser visibles en `/admin/leads` con:
- Source: "masterclass-eb2niw-2026"
- Permitir filtrar por source en la tabla de leads

No es necesario crear un modulo admin nuevo — la tabla de leads existente debe mostrarlos.

---

## SEO y Open Graph

```html
<title>Masterclass Gratis: Paso Cero EB2-NIW — MORE</title>
<meta name="description" content="Masterclass gratuita de 3 dias con Ivon More. Descubre el primer paso para migrar a EE.UU. con la visa EB2-NIW para profesionales. 25, 26 y 27 de mayo 2026." />
<meta property="og:title" content="Masterclass Gratis: Paso Cero EB2-NIW" />
<meta property="og:description" content="3 dias que pueden cambiar tu futuro. Aprende el primer paso para migrar a EE.UU. como profesional. 25-27 mayo 2026, 7 PM Colombia." />
<meta property="og:type" content="website" />
```

Usar React Helmet o el equivalente disponible en el proyecto para inyectar las meta tags.

---

## Animaciones (Framer Motion)

- Hero: fade-in + slide-up al cargar (duration 0.6s)
- Benefits: stagger children reveal al entrar en viewport (delay 0.1s entre items)
- Form card: fade-in al entrar en viewport
- Success card: scale-up con spring al aparecer
- Speaker card: fade-in

Usar `useInView` o `whileInView` de Framer Motion.

---

## Responsive

- Mobile-first
- Benefits grid: 1 columna en mobile, 2 columnas en tablet+
- Form: max-width 500px centrado
- Hero details: wrap en mobile
- Telefono: select de codigo 100px en mobile, 120px en desktop

---

## Checklist de implementacion

- [x] Crear `src/pages/MasterclassPage.tsx`
- [x] Crear componentes en `src/components/sections/masterclass/`
- [x] Agregar ruta `/masterclass` en `App.tsx`
- [x] Implementar formulario con validacion
- [x] Captura de UTM params al cargar la pagina
- [x] Crear Supabase Edge Function `masterclass-register` (o reutilizar webhook.js)
- [x] Conectar formulario → Edge Function → GHL API
- [x] Insert en tabla leads de Supabase
- [x] Redirect a grupo WhatsApp post-registro (countdown 3s)
- [x] Meta tags SEO / Open Graph
- [x] Animaciones con Framer Motion
- [ ] Testear responsive (mobile, tablet, desktop)
- [ ] Verificar que leads aparecen en `/admin/leads`
- [ ] Verificar que el contacto se crea en GHL con el tag correcto
- [ ] Verificar que el workflow de GHL se dispara (email de bienvenida)

### Pendientes de cierre

- [ ] Aplicar las migraciones de producción requeridas para `masterclass_leads` y
  `landing_projects`.
- [ ] Desplegar y probar la Edge Function en el proyecto Supabase de producción.
- [ ] Ejecutar el registro completo en producción: Supabase, GHL, tag, oportunidad,
  emails y redirección a WhatsApp.
- [ ] Ejecutar QA responsive y de accesibilidad en móvil, tablet y desktop.

---

## Archivos de referencia en este repo

| Archivo | Que tiene |
|---|---|
| `funnels/eb2niw-masterclass/landing.html` | Landing HTML standalone (referencia de diseño y copy) |
| `funnels/eb2niw-masterclass/webhook.js` | Webhook Node.js con logica GHL completa |
| `workflows/templates/calendario-ivon-recordatorios.json` | Template de workflow con textos de email/WhatsApp |
| `docs/changelog.md` | Historial de cambios del proyecto |
| `CLAUDE.md` | Instrucciones generales y branding |

---

## Notas importantes

1. **No hardcodear API keys** — todo va en variables de entorno (`.env` para dev, secrets de Supabase para prod)
2. **El tag debe ser exactamente** `Webinar-EB2NIW-2026` (GHL lo normaliza a lowercase internamente)
3. **El workflow ya esta publicado en GHL** — solo necesita que el contacto reciba el tag para dispararse
4. **CORS** — si el webhook esta en un dominio diferente, asegurar que los headers CORS permitan el origen de la landing
5. **No crear un nuevo sistema de auth** — la landing es publica, el admin panel ya tiene auth con Supabase
6. **Reutilizar componentes existentes** — Button, Card, Input de Shadcn/UI ya estan instalados
7. **El WhatsApp group link puede cambiar** — usar una constante o variable de entorno para facilitar el cambio
