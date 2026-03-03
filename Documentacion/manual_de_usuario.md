# Manual de Usuario — MORE Immigration Consulting

> Última actualización: 2026-03-03 (Pricing: risk reversal, costo de no actuar, fix typos)

---

## Índice

1. [Sitio público](#1-sitio-público)
   - 1.1 [Navbar](#11-navbar)
   - 1.2 [Hero](#12-hero)
   - 1.3 [Quiz de calificación](#13-quiz-de-calificación)
   - 1.4 [Sección: A quién ayudamos](#14-sección-a-quién-ayudamos)
   - 1.5 [Sección: Puntos de dolor](#15-sección-puntos-de-dolor)
   - 1.6 [Sección: Testimonios](#16-sección-testimonios)
   - 1.7 [Sección: Precios](#17-sección-precios)
   - 1.8 [Footer](#18-footer)
   - 1.9 [Página de éxito](#19-página-de-éxito)
   - 1.10 [Blueprint EB2-NIW (descargable)](#110-blueprint-eb2-niw-descargable)
2. [Panel de Administración (CRM)](#2-panel-de-administración-crm)
   - 2.1 [Login de administrador](#21-login-de-administrador)
   - 2.2 [Dashboard](#22-dashboard)
   - 2.3 [Módulo de Leads](#23-módulo-de-leads)
   - 2.4 [Módulo de Testimonios](#24-módulo-de-testimonios)
   - 2.5 [Módulo de Configuración](#25-módulo-de-configuración)

---

## 1. Sitio público

El sitio público está construido en React + Vite y se accede desde la ruta raíz `/`. Es una landing page de una sola página con scroll continuo.

### 1.1 Navbar

- Barra de navegación fija en la parte superior.
- Contiene el logo de MORE y links de ancla hacia las secciones principales.
- Se adapta a móvil con menú hamburguesa.

### 1.2 Hero

- Sección principal de captura de atención.
- Incluye headline principal (H1), subtítulo (H2) y CTA primario que lleva al quiz.
- Diseñado bajo principios CRO: gap entre estado doloroso y estado deseado del visitante.

### 1.3 Quiz de calificación

**Ruta:** La misma página `/`, sección `#quiz`

El quiz es un formulario multi-paso interactivo que califica al visitante. Flujo de pasos:

| Paso | Pregunta | Tipo |
|------|----------|------|
| 1 | Nivel académico | Selección única |
| 2 | Área de impacto | Selección única |
| 3 | Logros | Selección múltiple |
| 4 | Nombre, email, WhatsApp | Formulario de contacto |

**Lógica de calificación:**

Al completar el quiz, el sistema evalúa el perfil y asigna uno de dos resultados:

- **Alto Impacto:** Perfil con maestría/doctorado y logros destacados.
- **Unsung:** Perfil con alto potencial pero sin credenciales formales de nivel superior.

Ambos resultados redirigen a la página de éxito (`/success`) con un mensaje personalizado.

**Almacenamiento:** Cada lead completado se guarda en la tabla `leads` de Supabase con todos los campos del quiz.

### 1.4 Sección: A quién ayudamos

- Presenta los perfiles de profesionales que atiende MORE.
- Segmentado por áreas de impacto (STEM, Salud, Impacto Social, Negocios).

### 1.5 Sección: Puntos de dolor

- Lista los problemas comunes que enfrentan los profesionales en su proceso migratorio.
- Diseño de contraste para generar identificación con el visitante.

### 1.6 Sección: Testimonios

- Muestra testimonios dinámicos cargados desde la tabla `testimonials` de Supabase.
- Soporta dos formatos:
  - **Texto + foto:** Nombre, país, rol, cita, timeline y foto de la persona.
  - **Video:** Embed de video (YouTube, Vimeo o Google Drive).
- Los testimonios están organizados por categorías de programa.

### 1.7 Sección: Precios

- Presenta los dos planes disponibles: **Unsung Professional Program (UPP)** y **Plan Plus**.
- Encabezado seguido de una línea de "costo de no actuar" en itálica que recuerda al usuario el costo de la inacción.
- Cada plan incluye un **badge de risk reversal** (icono de escudo verde) con el mensaje: *"Sesión exploratoria sin compromiso. Te decimos desde el inicio si calificas."*
- CTAs en primera persona: "Sí, quiero comenzar mi programa" y "Sí, quiero obtener mi Expediente".
- Ambos CTAs abren WhatsApp directamente con mensaje pre-cargado.

### 1.8 Footer

- Links de navegación secundarios.
- Información de contacto y redes sociales.
- Aviso legal / política de privacidad.

### 1.9 Página de éxito

**Ruta:** `/success` (redirección automática al completar el quiz)

- Muestra un mensaje personalizado según el resultado del quiz (Alto Impacto o Unsung).
- Confirma que el equipo se pondrá en contacto.
- Incluye CTA secundario hacia WhatsApp o email.

### 1.10 Blueprint EB2-NIW (descargable)

**Ruta:** `/blueprint`

**Acceso:** Se abre al hacer clic en el botón **"Conocer mi camino sin patrocinador"** del Hero.

La página Blueprint es un recurso de contenido educativo de alto valor (lead magnet) presentado como una presentación de 11 diapositivas. Su objetivo es educar al visitante sobre la Visa EB2-NIW y posicionar a MORE como autoridad antes de la conversión.

#### Funcionalidades

| Elemento | Descripción |
|----------|-------------|
| Botón "Descargar como PDF" | Barra superior con botón naranja. Abre el diálogo de impresión del navegador, desde donde el usuario puede guardar como PDF. |
| Botón "Volver al sitio" | Enlace en la barra superior para regresar a la página principal (`/`). |
| 11 diapositivas en formato 1280×720px | Diseño oscuro con paleta de marca MORE (naranja, slate). |

#### Estructura de las diapositivas

| Slide | Título | Contenido |
|-------|--------|-----------|
| 1 | El Sueño Americano Evolucionó | Portada + subtítulo de posicionamiento |
| 2 | El Mito Que Te Mantiene Estancado | Dato: solo el 2% tiene postgrado en EE.UU. |
| 3 | El Vehículo: Visa EB2-NIW | Sin patrocinador, sin oferta laboral, Green Card directa |
| 4 | Por Qué la EB2-NIW es Superior | 3 beneficios: independencia, estatus, familia |
| 5 | Los 3 Pilares de Aprobación | Slide de sección introductoria |
| 5b | La Arquitectura de tu Proyecto | Declaración Profesional, Propuesta de Esfuerzo, Plan de Alto Impacto |
| 6 | La Diferencia entre Rechazo y Aprobación | Comparativa: CV amateur vs Proyecto de Interés |
| 7 | El Paso Cero: Checklist de Esfuerzo | 5 preguntas de autoevaluación |
| 8 | Tu Plantilla de Ejecución Inmediata | Template de Propuesta de Esfuerzo para completar |
| 9 | El Costo Real del "Do It Yourself" | Riesgo: +$15,000 perdidos y +2 años de retraso |
| 10 | El Método MORE: Aceleración Estratégica | Policy Experts, Economic Analysts, Legal Strategists |
| 11 | CTA Final | Llamada a asesoría VIP + social proof (98% aprobación, +200 casos) |

#### Comportamiento de impresión / PDF

- Al imprimir (`Ctrl+P` o botón "Descargar como PDF"), cada diapositiva ocupa una página individual en orientación horizontal (1280×720px).
- La barra superior (topbar y botones de navegación) se oculta automáticamente en la impresión.
- Compatible con los navegadores Chrome, Edge y Firefox para "Guardar como PDF".

---

## 2. Panel de Administración (CRM)

Accesible en `/admin`. Requiere autenticación con email y contraseña de Supabase Auth. Solo usuarios con una cuenta activa en el proyecto Supabase pueden acceder.

El panel tiene un layout compartido con:
- **Sidebar lateral** colapsable con navegación entre módulos.
- **Topbar** con breadcrumbs automáticos y datos del usuario logueado.
- El estado colapsado del sidebar persiste en `localStorage`.

### 2.1 Login de administrador

**Ruta:** `/admin/login`

- Formulario de email y contraseña.
- Utiliza Supabase Auth (`signInWithPassword`).
- Al autenticarse correctamente, redirige al Dashboard.
- Si el usuario no tiene Supabase configurado (sin variables de entorno), muestra un aviso.

**Variables de entorno requeridas en `.env`:**
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
```

### 2.2 Dashboard

**Ruta:** `/admin/dashboard`

Vista general de actividad. Contiene:

#### KPI Cards (6 métricas)
| Métrica | Descripción |
|---------|-------------|
| Total leads | Total de leads registrados |
| Alto Impacto | Leads calificados como Alto Impacto |
| Unsung | Leads calificados como Unsung |
| Recibidos hoy | Leads que ingresaron en el día actual |
| Calificados | Leads con estado "Calificado" en el pipeline |
| Testimonios | Total de testimonios en la base de datos |

#### Bloque: Requieren seguimiento hoy
- Aparece solo cuando hay leads con fecha de seguimiento vencida o del día actual.
- Muestra nombre, email, estado del pipeline y accesos directos a WhatsApp y email.
- Si hay más de 5, muestra un resumen con link a la vista completa de Leads.

#### Leads recientes
- Lista de los 8 leads más recientes con nombre, email, resultado, estado y acciones rápidas (WhatsApp, email).

#### Pipeline de leads
- Gráfico de barras horizontal mostrando la distribución de leads por cada estado del pipeline.

#### Tasa de calificación
- Porcentaje de leads que llegaron al estado "Calificado" sobre el total.
- Barra de progreso visual.

#### Acciones rápidas
- Links directos a los módulos de Leads y Testimonios.

### 2.3 Módulo de Leads

**Ruta:** `/admin/leads`

Gestión completa del pipeline de leads provenientes del quiz.

#### KPI Cards
Igual que el Dashboard pero scoped a la vista actual.

#### Tabla de leads
Columnas: Fecha, Nombre, Contacto, Perfil académico, Resultado, Estado, Acciones.

- **Ordenamiento:** Clic en encabezado de columna ordena ascendente/descendente (fecha, nombre, resultado, estado).
- **Búsqueda:** Filtra por nombre, email o WhatsApp en tiempo real.
- **Filtros:** Por tipo de resultado (Alto Impacto / Unsung) y por estado del pipeline.
- **Export CSV:** Descarga la lista filtrada como archivo CSV.
- **Badge de seguimiento:** Icono de campana en la columna de acciones cuando un lead tiene un recordatorio vencido (rojo), para hoy (amarillo), o próximo (azul).

#### Panel lateral de detalle (slide-over)

Al hacer clic en cualquier fila de la tabla se abre un panel lateral deslizante con información completa del lead.

**Secciones del panel:**

**1. Estado del pipeline**
Botones pill para cambiar el estado del lead:
- `Nuevo` — Lead recién registrado
- `Contactado` — Se realizó el primer contacto
- `En consulta` — Lead en proceso de consulta activa
- `Calificado` — Lead listo para avanzar al siguiente paso comercial
- `Cerrado` — Proceso completado
- `Perdido` — Lead descartado

**2. Contacto**
- Email con botón de copia al portapapeles.
- WhatsApp con link directo a conversación pre-cargada en WhatsApp Web.

**3. Perfil del quiz**
- Resultado asignado (Alto Impacto / Unsung).
- Nivel académico.
- Área de impacto.

**4. Logros**
- Lista de logros seleccionados por el lead durante el quiz (premios, publicaciones, liderazgo, patentes, conferencias).

**5. Fecha de registro**
- Fecha y hora exacta de cuando el lead completó el quiz.

**6. Próximo seguimiento**
- Permite asignar una fecha de recordatorio para retomar contacto con el lead.
- Si hay una fecha guardada, muestra un badge indicando si el seguimiento está:
  - **Vencido** (rojo): La fecha pasó sin haberse atendido.
  - **Hoy** (amarillo): El seguimiento es el día actual.
  - **Próximo** (azul): La fecha es en los próximos 3 días.
- Se puede borrar la fecha de seguimiento con el botón de X en el badge.
- Al guardar, la fecha aparece en el badge de la tabla y en el Dashboard.

**7. Notas**
- Campo de texto para registrar observaciones de cada interacción con el lead.
- Soporte de `Ctrl+Enter` para enviar rápidamente.
- Las notas se guardan en la tabla `lead_notes` de Supabase asociadas al lead.
- Se muestran en orden cronológico inverso (más reciente primero) con autor y tiempo relativo.
- Cada nota tiene un botón de eliminar (visible al pasar el cursor).

**Acciones del footer del panel:**
- Botón WhatsApp (si el lead tiene número).
- Botón Email.
- Botón eliminar lead (con confirmación).

### 2.4 Módulo de Testimonios

**Ruta:** `/admin/testimonials`

CRUD completo para los testimonios que se muestran en el sitio público. Incluye tarjetas con vista detallada y reordenamiento por arrastrar y soltar.

#### Filtro por categoría
Permite ver solo los testimonios de una categoría específica:
- Aprobados In House
- Aprobados para preparadora Mónica Martínez
- Aprobados para abogada Marcela Rodríguez
- En espera de aprobación

#### Tarjetas de testimonios (vista detallada)
Cada testimonio se muestra como una tarjeta expandida con:
- **Foto de perfil** (si existe URL) o avatar con inicial del nombre
- **Nombre** completo y **badge de categoría** con color diferenciado
- **Etiqueta de estado** (ej. "APROBADO INHOUSE") en verde si está configurada
- **Chips de metadata:** país, rol, área, programa y timeline con íconos
- **Fragmento de la cita** (primeras 2 líneas) para testimonios de texto
- **Enlace al video** con ícono de apertura para testimonios de video
- **Badge de orden numérico** en la esquina superior derecha
- **Botones de editar y eliminar**
- **Handle de arrastre** (ícono de grip) en el borde izquierdo

#### Reordenamiento por arrastrar y soltar (Drag & Drop)
- Arrastra cualquier tarjeta por el **handle izquierdo** (ícono de grip vertical) para cambiar su posición.
- El nuevo orden se guarda automáticamente en Supabase (actualiza el campo `sort_order` de cada testimonio afectado).
- Mientras se guarda aparece un indicador "Guardando orden…" en la barra de herramientas.
- El reordenamiento opera sobre la vista filtrada actual (si hay filtro activo, solo reordena dentro de esa categoría).

#### Formulario de creación/edición

**Tipo de medio:**

- **Texto + foto:** Requiere nombre, cita del testimonio y opcionalmente: país, rol, área, programa, timeline, etiqueta de estado, URL de foto, categoría y orden.
- **Video:** Solo requiere URL del video (YouTube, Vimeo o Google Drive), categoría y orden.

Los testimonios con tipo `video` se muestran en la sección de videos del sitio público. Los de `texto + foto` en la grilla de testimonios escritos.

**Campo `sort_order`:** Número entero que controla el orden de aparición dentro de cada categoría. Menor número = aparece primero.

### 2.5 Módulo de Configuración

**Ruta:** `/admin/settings`

Página para gestionar parámetros globales del sitio web que se aplican en el frontend público. Actualmente contiene la configuración del calendario de asesorías.

#### URL del Calendario de Asesorías

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `calendar_url` | URL (texto) | URL del calendario de Google (Appointment Scheduling) u otro proveedor (Calendly, etc.) que se abre al hacer clic en el botón "Agenda tu Asesoría VIP" en la página Blueprint (`/blueprint`) |

**Cómo configurar:**

1. Ir a `/admin/settings` (enlace "Configuración" en el sidebar del panel admin).
2. Pegar la URL de tu página de citas de Google Calendar o Calendly en el campo "URL del calendario".
3. Usar el enlace "Probar enlace" para verificar que abre correctamente.
4. Hacer clic en "Guardar cambios".

A partir de ese momento, el botón CTA del Blueprint abrirá el calendario configurado en una pestaña nueva. Si no hay URL configurada, el botón redirige a la página de inicio.

---

## Tablas de base de datos (Supabase)

### `leads`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `nombre` | text | Nombre completo |
| `email` | text | Correo electrónico |
| `whatsapp` | text | Número de WhatsApp (opcional) |
| `academic_level` | text | Nivel académico (maestria, doctorado, grado5, otros) |
| `impact_area` | text | Área de impacto (salud, stem, social, negocios) |
| `achievements` | text[] | Logros seleccionados en el quiz |
| `result_type` | text | Resultado del quiz (alto_impacto, unsung) |
| `status` | text | Estado en el pipeline (nuevo, contactado, en_consulta, calificado, cerrado, perdido) |
| `followup_at` | timestamptz | Fecha de próximo seguimiento (opcional) |
| `created_at` | timestamptz | Fecha de registro |

### `lead_notes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `lead_id` | uuid | FK → leads.id (CASCADE DELETE) |
| `content` | text | Contenido de la nota |
| `author` | text | Email del usuario que creó la nota |
| `created_at` | timestamptz | Fecha de creación |

### `site_settings`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `key` | text (PK) | Identificador único de la configuración |
| `value` | text | Valor de la configuración |
| `updated_at` | timestamptz | Última actualización (automático) |

**Claves registradas:**

| key | Descripción |
|-----|-------------|
| `calendar_url` | URL del calendario de asesorías (Google Calendar, Calendly, etc.) |
| `whatsapp_number` | Número de WhatsApp de contacto |
| `contact_email` | Email de contacto |

**RLS:** Lectura pública (anon). Escritura solo para usuarios `authenticated`.

---

### `testimonials`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `name` | text | Nombre de la persona |
| `country` | text | País (opcional) |
| `role` | text | Rol / profesión (opcional) |
| `area` | text | Área (opcional) |
| `program` | text | Programa (opcional) |
| `quote` | text | Cita del testimonio |
| `timeline` | text | Tiempo del proceso (opcional) |
| `status_label` | text | Etiqueta de estado (opcional) |
| `media_type` | text | Tipo de medio (text_photo, video) |
| `photo_url` | text | URL de foto (opcional) |
| `video_url` | text | URL de video (opcional) |
| `category` | text | Categoría del testimonio |
| `sort_order` | int | Orden de aparición |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización (automático) |
