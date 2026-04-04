# Manual de Usuario — MORE Immigration Consulting

> Última actualización: 2026-04-04 (página pública `/privacidad` — Política de Privacidad)

---

## Índice

1. [Sitio público](#1-sitio-público)
   - 1.1 [Navbar y selector de idioma](#11-navbar)
   - 1.2 [Hero](#12-hero)
   - 1.3 [Quiz de calificación](#13-quiz-de-calificación)
   - 1.4 [Sección: A quién ayudamos](#14-sección-a-quién-ayudamos)
   - 1.5 [Sección: Puntos de dolor](#15-sección-puntos-de-dolor)
   - 1.6 [Sección: Testimonios](#16-sección-testimonios)
   - 1.7 [Sección: Asesoría VIP](#17-sección-asesoría-vip)
   - 1.8 [Sección: Precios](#18-sección-precios)
   - 1.9 [Footer](#19-footer)
   - 1.10 [Página de éxito](#110-página-de-éxito)
   - 1.11 [Blueprint EB2-NIW (descargable)](#111-blueprint-eb2-niw-descargable)
   - 1.12 [Política de privacidad](#112-política-de-privacidad)
2. [Panel de Administración (CRM)](#2-panel-de-administración-crm)
   - 2.1 [Login de administrador](#21-login-de-administrador)
   - 2.2 [Dashboard](#22-dashboard)
   - 2.3 [Módulo de Leads](#23-módulo-de-leads)
   - 2.4 [Módulo de Testimonios](#24-módulo-de-testimonios)
   - 2.5 [Módulo de Configuración](#25-módulo-de-configuración)
   - 2.6 [Sistema de Roles](#26-sistema-de-roles)
   - 2.7 [Módulo de Clientes](#27-módulo-de-clientes)
   - 2.8 [Módulo de Proyectos de Landing (Wizard + Gemini)](#28-módulo-de-proyectos-de-landing-wizard--gemini)
   - 2.9 [Módulo de Recursos (Biblioteca)](#29-módulo-de-recursos-biblioteca)

---

## 1. Sitio público

El sitio público está construido en React + Vite y se accede desde la ruta raíz `/`. Es una landing page de una sola página con scroll continuo.

### 1.1 Navbar

- Barra de navegación fija en la parte superior.
- Contiene el logo de MORE y links de ancla hacia las secciones principales.
- Se adapta a móvil con menú hamburguesa.
- **Selector de idioma ES | EN:** aparece a la derecha del menú en desktop y dentro del drawer en móvil. El idioma activo se resalta en naranja (`#F37021`). El idioma elegido se guarda en `localStorage` bajo la clave `more_lang` y persiste entre sesiones. Al primer acceso, el sistema detecta automáticamente el idioma del navegador del usuario.

### 1.1.1 Sistema de internacionalización (i18n)

El sitio público soporta **Español** e **Inglés** de forma dinámica, sin recarga de página.

**Tecnología:** `react-i18next` + `i18next` + `i18next-browser-languagedetector`.

**Archivos de traducción:**
- `src/locales/es/translation.json` — textos en español (idioma original)
- `src/locales/en/translation.json` — textos en inglés

**Comportamiento de detección de idioma:**
1. Si el usuario ya eligió un idioma anteriormente, se usa ese (guardado en `localStorage`).
2. Si es la primera visita, se detecta el idioma del navegador.
3. Si el navegador no es inglés, el idioma por defecto es español.

**Secciones traducidas:** Navbar, Hero, PainPoints, WhoWeHelp, Quiz (preguntas, opciones y respuestas), VipSession, Pricing (planes y mensajes de WhatsApp), Footer (FAQ completo), BlueprintPage, PrivacyPolicyPage (`/privacidad`).

**Panel de administración `/admin`:** no está traducido, permanece siempre en español.

### 1.2 Hero

- Sección principal de captura de atención.
- Incluye headline principal (H1), subtítulo (H2) y CTA primario que lleva al quiz.
- Diseñado bajo principios CRO: gap entre estado doloroso y estado deseado del visitante.

### 1.3 Diagnóstico de ruta migratoria (quiz)

**Ruta:** La misma página `/`, sección `#quiz`

El antiguo “quiz de calificación” se reemplazó por un **diagnóstico migratorio estructurado** cuyo objetivo es:

- Filtrar por **elegibilidad real**.
- Identificar el **tipo de visa más probable** (EB1 / EB2-NIW / O1 / E2 / L1 / otras).
- Medir el **nivel de preparación** del perfil y del expediente.
- Asignar un **segmento de preparación** y una **ruta de acción recomendada**.

#### Flujo de bloques y preguntas

El diagnóstico se organiza en 6 bloques (7 pantallas de preguntas) antes de mostrar el resultado:

1. **Bloque 1 — Perfil básico (filtro inicial)**
   - País de residencia actual.
   - Nacionalidad.
   - Situación actual frente a EE.UU.:
     - En EE.UU. con estatus.
     - En EE.UU. sin estatus.
     - Fuera de EE.UU.
   - Objetivo principal al migrar (crecer profesionalmente, crear/expandir negocio, residencia permanente, trabajo temporal, explorar oportunidades).

2. **Bloque 2 — Acceso a visas según nacionalidad**
   - El sistema cruza automáticamente la nacionalidad del usuario con una tabla de países con tratado E1/E2 y determina si las visas de tratado (E2/E1) son una ruta potencial o no.
   - El usuario ve un mensaje explicativo (no tiene que conocer el tratado de antemano).

3. **Bloque 3 — Perfil profesional (EB2 / EB1 / O1)**
   - Nivel educativo (Técnico/Tecnólogo, Profesional, Maestría, Doctorado).
   - Más de 5 años de experiencia en el campo (sí/no).
   - Logros relevantes (multi selección):
     - Publicaciones.
     - Premios o reconocimientos.
     - Liderazgo en proyectos relevantes.
     - Impacto social o comunitario.
     - Apariciones en medios.
     - Ninguno.
   - Sectores de impacto:
     - Salud, Energía, Tecnología, Educación, Medio ambiente, Desarrollo económico u Otro.

4. **Bloque 4 — Negocios e inversión (E2 / L1)**
   - ¿Tiene o ha tenido negocio? (en operación / no activo / nunca).
   - Capacidad/disposición de inversión en EE.UU. (más de USD 100K / menos de USD 100K / no).
   - Posibilidad de expandir la empresa actual a EE.UU. (sí / no / no sabe).

5. **Bloque 5 — Perfil extraordinario (O1 / EB1)**
   - Grado de reconocimiento como experto en su campo (alto / medio / no).
   - Si ha trabajado con empresas importantes, gobiernos, organizaciones internacionales o ninguno.

6. **Bloque 6 — Claridad y preparación**
   - Estado del proyecto o plan en EE.UU. (estructurado / idea / sin proyecto).
   - Nivel de organización de evidencias (sí / parcialmente / no).
   - Horizonte de tiempo para aplicar (0–3, 3–6, 6–12 meses, o “solo explorando”).

Al finalizar los bloques, el sistema calcula un **diagnóstico de ruta migratoria** y luego solicita los datos de contacto (Nombre, Email, WhatsApp) para registrar el lead.

#### Lógica de clasificación

A partir de las respuestas, el diagnóstico calcula:

- **Buckets de visa (`visa_buckets`):** familias de visas que el perfil podría explorar:
  - `eb1`, `eb2`, `o1`, `e2`, `l1`, `otra`.
- **Segmento de preparación (`eligibility_segment`):**
  - `listo` — Listo para aplicar (proyecto definido, evidencias organizadas, horizonte claro).
  - `necesita_estructura` — Tiene potencial pero requiere estructurar proyecto/narrativa/evidencias.
  - `no_califica_aun` — Aún muy exploratorio; primero debe fortalecer su perfil.
- **Ruta recomendada (`recommended_route`):**
  - `unsung_program` — Programa Unsung Professional.
  - `mentoria_more` — Mentoría / Academia MORE.
  - `abogado` — Caso que requiere evaluación legal directa (referido a abogado).
  - `contenido` — Conducir al usuario a contenido educativo y recursos.
- **Resultado histórico (`result_type`):**
  - Mantiene la etiqueta `alto_impacto` / `unsung` para compatibilidad con el CRM, derivada ahora de los buckets de visa (si hay EB1/EB2/O1 se considera Alto Impacto).

La pantalla de resultado muestra:

- Un titular con la “ruta migratoria más probable”.
- El segmento de preparación (badge).
- Los buckets de visa identificados.
- Un texto explicativo sobre la ruta recomendada (Unsung, Mentoría, Abogado, Contenido).
- CTA para dejar datos y ser contactado por el equipo.

**Almacenamiento:** Cada lead completado se guarda en la tabla `leads` de Supabase con:

- Respuestas de perfil básico, profesional, negocios, perfil extraordinario y preparación.
- Buckets de visa, segmento de preparación, ruta recomendada y resultado histórico.

### 1.4 Sección: A quién ayudamos

- Presenta los perfiles de profesionales que atiende MORE.
- Segmentado por áreas de impacto (STEM, Salud, Impacto Social, Negocios).

### 1.5 Sección: Puntos de dolor

- Lista los problemas comunes que enfrentan los profesionales en su proceso migratorio.
- Diseño de contraste para generar identificación con el visitante.

### 1.6 Sección: Testimonios

**Anchor:** `#exito` (en el menú aparece como “Éxito” / “Success” según el idioma del sitio).

- Muestra testimonios dinámicos cargados desde la tabla `testimonials` de Supabase.
- Soporta dos formatos:
  - **Texto + foto:** Nombre, país, rol, cita, timeline y foto de la persona.
  - **Video:** Muestra una **foto de portada** (thumbnail) con un botón de play. Al hacer click, se carga el embed del video (YouTube, Vimeo o Google Drive) con autoplay. Si no hay portada, se muestra un fondo oscuro con el botón de play.
- Los testimonios están organizados por categorías de programa.

**Internacionalización (ES/EN):** El marco de la sección (bloque de liderazgo de Ivon, carrusel de texto, títulos, estados “Cargando…” / vacío, bloque de video, CTA y texto puente hacia precios) y las **etiquetas de categoría** de las tarjetas siguen el idioma seleccionado en el Navbar (`success.*` en `src/locales/es|en/translation.json`). Los campos que vienen del CRM (nombre, cita, país, rol, `status_label`, `timeline`, etc.) se muestran tal como están guardados en la base de datos; si se desea contenido bilingüe en esos campos, habría que modelarlo en el admin o en la BD.

### 1.7 Sección: Asesoría VIP

**Anchor:** `#asesoria-vip`

**Ubicación en el funnel:** Entre Testimonios (`#exito`) y Precios (`#programas`).

Esta sección es un **tripwire offer** que llena el eslabón faltante de la Value Ladder:

```
Quiz (gratis) → Asesoría VIP ($97) → UPP ($2,500) → Plan Plus ($8,000)
```

Su objetivo es monetizar el interés de los visitantes que no están listos para comprometerse con los planes principales, y filtrar leads calificados mediante un primer pago simbólico.

#### Contenido visible

| Elemento | Descripción |
|----------|-------------|
| Eyebrow | "Primer paso · Cupos limitados por semana" |
| Headline | "¿Tu perfil sirve para la Green Card? Descúbrelo antes de gastar un solo dólar." (texto dividido en dos líneas en desktop) |
| Subheadline | "En 60 minutos de estrategia migratoria con Ivon, analizamos tu perfil profesional y empresarial con total honestidad. Te llevas una hoja de ruta clara para los próximos 90 días — sin rodeos, sin costos altos, con estrategia real." |
| Entregables (5 bullets) | Elegibilidad real, obstáculos del perfil, hoja de ruta 90 días, recomendación de programa y **PDF personalizado con la ruta migratoria documentada al finalizar la sesión** |
| Precio | $97 USD · Sesión 1 a 1 · 60 minutos con Ivon |
| Garantía | Texto mostrado en el bloque verde: "🛡 Si en los primeros 15 minutos vemos que no podemos ayudarte, te devolvemos el dinero. Sin preguntas. Tu inversión está protegida." |
| CTA | Botón naranja con ícono de calendario: "Sí, quiero mi estrategia migratoria con Ivon — $97 USD" → abre el link de Calendly configurado en `calendar_url` |

#### Comportamiento del CTA

- El botón utiliza el campo `calendar_url` almacenado en la tabla `site_settings` de Supabase.
- **Configuración:** Admin → Configuración → pegar el link de Calendly de la Asesoría VIP.
- Si `calendar_url` está vacío, el botón aparece deshabilitado con el texto "Próximamente disponible".
- El link se abre en una nueva pestaña (`target="_blank"`).

#### Landing dedicada de Asesoría VIP

- Además de la sección dentro de la landing principal, existe una **landing-page independiente** para la Asesoría VIP, pensada para usarse en un subdominio (por ejemplo `vip.somosmore.com`).
- Esta landing se construye como una entrada separada de Vite:
  - Archivo de entrada: `more-landing/vite.config.ts` con el entry `vip` apuntando a `vip.html`.
  - HTML base: `more-landing/vip.html` (monta la app en `#root` con el script `/src/vip/main.tsx`).
  - Página React: `more-landing/src/vip/pages/VipLanding.tsx` que compone diferentes secciones específicas de la oferta VIP.

#### Estructura y contenido actual de la landing VIP (`/vip.html`)

La landing VIP está pensada como una **página de decisión High-Ticket** para personas que ya entienden el contexto EB2-NIW y quieren una evaluación estratégica antes de comprometerse con programas de mayor ticket. Toda la página está optimizada para llevar al usuario a aplicar a la Asesoría VIP.

Secciones principales:

| Sección | Descripción |
|--------|-------------|
| Hero VIP (`VipHero`) | Bloque principal con fondo claro y gradientes suaves, en una columna centrada. Sin eyebrow superior duplicado: entra directo al H1. **Tarjeta de oferta** (badges, H2, chips, bloque **“Lo que recibís — Asesoría VIP $97”**). **Panel naranja $97** clicable (= **“Aplicar ahora”** / `calendar_url`) con **una sola** barra de brillo animada. CTA debajo. Filtro “90 días”. Pie: bloque grande **“Actividad en vivo”** con **N** en tipografía muy destacada + “personas están viendo esta sesión ahora” + línea de apoyo sobre cupos (N aleatorio 87–500 por carga; revisar política de marcas). Dos métricas. Foto de Ivon en `VipAboutIvon`. |
| Método MORE VIP — 5 pilares (`VipSessionIncluded`) | Sección que reemplaza la antigua lista de “qué incluye” por los **5 Pilares Estratégicos**: Blindaje Documental, Estrategia de Autoridad, Optimización de Tiempos, Soporte de Élite y Simulación de Escenarios. Cada pilar se muestra como card con ícono premium, título y descripción breve, con `hover` sutil y diseño mobile-first. |
| Aprobaciones recientes / Social Proof (`VipSocialProofSection`) | Bloque oscuro de prueba social con métricas agregadas tipo: tasa de aprobación aproximada, cantidad de perfiles evaluados y tiempo promedio de decisión (90 días). No usa nombres individuales sino indicadores numéricos que refuerzan autoridad y probabilidad de éxito de perfiles bien calificados. |
| Valor y costo de no decidir (`VipValueSection`) | Sección comparativa que contrasta el costo de avanzar sin diagnóstico (gastos innecesarios, decisiones malas, incertidumbre) vs. el escenario de pasar primero por la asesoría (decisión binaria, ruta a 90 días, claridad sobre costo de inacción y PDF para discutir con familia/socios). Se usa tipografía serif para los titulares y una paleta premium centrada en blanco, navy y acentos naranja/dorado. |
| Sobre Ivon y metodología MORE (`VipAboutIvon`) | Sección **de dos columnas**: foto **a pantalla completa** en una banda (en móvil va arriba) con degradado navy y bloque inferior (nombre, rol, cita). Columna de texto: encabezado, historia breve, **tres tarjetas** (“Tu historia real”, “Riesgos y tiempos”, “La decisión de hoy”), **cuatro** puntos de credibilidad con check naranja y caja **“Cómo trabajamos en MORE”** siempre visible (sin acordeón). En móvil la cita se repite al final en recuadro naranja suave. |
| Encaje de la oferta (`VipFitSection`) | Sección de “para quién es / no es” que filtra a los visitantes. Lista condiciones claras de buen encaje (profesionales y empresarios con trayectoria, foco en decisiones estratégicas) y de mal encaje (búsqueda de soluciones mágicas, cero compromiso, expectativa de promesas fáciles). Se refuerza el tono de “aplicación” más que de “compra genérica”. |
| Inversión y garantía (`VipPricingSection`) | Muestra el precio único de USD 97 para la sesión 1 a 1 de 60 minutos con Ivon, CTA de identidad **“Quiero mi evaluación de perfil”** y un bloque de garantía fuerte con diseño alineado a la paleta premium (sin verdes): si en los primeros 15 minutos no se ve encaje real, se devuelve el dinero sin preguntas. |
| Preguntas frecuentes + CTA final (`VipFaq`) | Aclara dudas típicas (formato de la sesión, qué pasa si no califican, qué es EB2-NIW, cuándo pueden agendar) y cierra con un CTA secundario, también de identidad, **“Quiero mi evaluación de perfil”** apuntando al mismo calendario configurado en `calendar_url`. |

**Acceso recomendado:**

- Desde el navegador, la ruta técnica actual es `/vip.html` en el mismo host donde se sirve la app.
- Desde el panel de administración, se registra en la **Biblioteca de Recursos** como un recurso de tipo `landing` con formato `html` (ver sección 2.9).

---

### 1.8 Sección: Precios

- Presenta los dos planes disponibles: **Unsung Professional Program (UPP)** y **Plan Plus**.
- Encabezado seguido de una línea de "costo de no actuar" en itálica que recuerda al usuario el costo de la inacción.
- Cada plan incluye un **badge de risk reversal** (icono de escudo verde) con el mensaje: *"Sesión exploratoria sin compromiso. Te decimos desde el inicio si calificas."*
- CTAs en primera persona: "Sí, quiero comenzar mi programa" y "Sí, quiero obtener mi Expediente".
- Ambos CTAs abren WhatsApp directamente con mensaje pre-cargado.

### 1.9 Footer

- Bloque superior opcional: **Preguntas frecuentes** genéricas del sitio (EB-2 NIW, requisitos, etc.), con acordeón.
- Bloque CTA oscuro con botón a WhatsApp.
- Links de navegación secundarios, información de contacto y redes sociales.
- En la franja inferior del pie, el enlace **Política de Privacidad** apunta a la ruta interna **`/privacidad`** (componente `PrivacyPolicyPage`), no a un ancla vacía. El enlace **Términos & Condiciones** puede seguir sin página dedicada según configuración actual.

**Ruta `/asesoria-vip` (página dedicada `VipSessionPage`):** el `Footer` se renderiza con **`hideLandingFaq`**, de modo que **no aparece** el acordeón de FAQ genérico de la landing principal. Las preguntas propias de la oferta VIP siguen en la sección **`VipFaq`** dentro de la misma página.

### 1.10 Página de éxito

**Ruta:** `/success` (redirección automática al completar el quiz)

- Muestra un mensaje personalizado según el resultado del quiz (Alto Impacto o Unsung).
- Confirma que el equipo se pondrá en contacto.
- Incluye CTA secundario hacia WhatsApp o email.

### 1.11 Blueprint EB2-NIW (descargable)

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

### 1.12 Política de privacidad

**Ruta:** `/privacidad`

- Página legal informativa (sin objetivo de venta): texto de política de privacidad en español o inglés según el idioma activo de `react-i18next`.
- **Contenido:** definido en `src/locales/es/translation.json` y `src/locales/en/translation.json` bajo la clave `privacyPolicy` (título, fecha de última actualización, siete secciones con listas donde aplica).
- **Layout:** `Navbar`, cuerpo principal con artículo centrado (`max-w-3xl`) y `Footer` con **`hideLandingFaq`** (misma lógica que `/asesoria-vip` para no mostrar el acordeón FAQ del footer).
- **Correo de contacto legal / derechos:** los enlaces `mailto` usan el valor **`contact_email`** de la tabla `site_settings` (hook `useSiteSettings`), con respaldo por defecto `info@justmore.net` si el valor viene vacío.
- **Título del documento (`document.title`):** se establece al cargar la página y se restaura al salir (patrón alineado con `BlueprintPage`).

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

Columnas principales:

- Fecha.
- Nombre.
- Contacto (email + WhatsApp).
- Perfil (nivel académico, área de impacto + país de residencia / nacionalidad).
- Resultado (Alto Impacto / Unsung + segmento y ruta recomendada).
- Estado del pipeline.
- Acciones.

Comportamiento:

- **Ordenamiento:** Clic en encabezado de columna ordena ascendente/descendente (fecha, nombre, resultado, estado).
- **Búsqueda:** Filtra por nombre, email o WhatsApp en tiempo real.
- **Filtros:** Por tipo de resultado (Alto Impacto / Unsung), estado del pipeline, segmento de preparación y ruta recomendada.
- **Export CSV:** Descarga la lista filtrada como CSV incluyendo:
  - Datos básicos (fecha, nombre, email, WhatsApp, país, nacionalidad).
  - Nivel académico, área de impacto, logros.
  - Segmento (`eligibility_segment`), ruta recomendada (`recommended_route`), buckets de visa (`visa_buckets`).
  - Resultado (`result_type`) y estado del pipeline.
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

**3. Perfil del diagnóstico (quiz)**
- Resultado histórico (Alto Impacto / Unsung).
- Segmento de preparación (Listo / Necesita estructuración / No califica aún).
- Ruta recomendada (Unsung, Mentoría, Abogado, Contenido).
- Nivel académico.
- Área de impacto.
- País de residencia y nacionalidad.

**4. Buckets de visa**
- Chips con las familias de visas detectadas para ese perfil:
  - EB1, EB2/NIW, O1, E2, L1, otras.

**5. Logros**

**6. Logros**
- Lista de logros seleccionados por el lead durante el quiz (premios, publicaciones, liderazgo, patentes, conferencias).

**7. Fecha de registro**
- Fecha y hora exacta de cuando el lead completó el quiz.

**8. Próximo seguimiento**
- Permite asignar una fecha de recordatorio para retomar contacto con el lead.
- Si hay una fecha guardada, muestra un badge indicando si el seguimiento está:
  - **Vencido** (rojo): La fecha pasó sin haberse atendido.
  - **Hoy** (amarillo): El seguimiento es el día actual.
  - **Próximo** (azul): La fecha es en los próximos 3 días.
- Se puede borrar la fecha de seguimiento con el botón de X en el badge.
- Al guardar, la fecha aparece en el badge de la tabla y en el Dashboard.

**9. Notas**
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
- **Video:** Requiere URL del video (YouTube, Vimeo o Google Drive), categoría y orden. Opcionalmente se puede cargar una **foto de portada** mediante la zona de upload.

**Foto de portada del video:**  
La zona de upload permite arrastrar una imagen o hacer click para abrir el explorador de archivos. Formatos aceptados: JPG, PNG, WebP, GIF (máx. 5 MB). La imagen se sube automáticamente a Supabase Storage (bucket `video-thumbnails`) y la URL pública queda guardada en el campo `video_thumbnail_url`. Al pasar el cursor sobre la portada cargada aparecen los botones **Cambiar** y **Quitar**.

Los testimonios con tipo `video` se muestran en la sección de videos del sitio público. Los de `texto + foto` en la grilla de testimonios escritos.

**Campo `sort_order`:** Número entero que controla el orden de aparición dentro de cada categoría. Menor número = aparece primero.

### 2.5 Módulo de Configuración

**Ruta:** `/admin/settings`

Página para gestionar parámetros globales del sitio web que se aplican en el frontend público. Contiene dos secciones: calendario de asesorías y redes sociales.

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

#### Redes Sociales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `instagram_url` | URL (texto) | URL completa del perfil de Instagram (ej: `https://instagram.com/somos.more`) |
| `linkedin_url` | URL (texto) | URL completa de la página de LinkedIn |
| `facebook_url` | URL (texto) | URL completa de la página de Facebook |

**Cómo configurar:**

1. Ir a `/admin/settings`.
2. En la tarjeta "Redes Sociales", pegar la URL completa de cada red.
3. Dejar en blanco cualquier campo para que esa red social **no aparezca** en el footer del sitio.
4. Usar el ícono de enlace externo al lado de cada campo para verificar que la URL sea correcta.
5. Hacer clic en "Guardar redes sociales".

Los íconos de Instagram, LinkedIn y Facebook aparecerán en la sección de contacto del footer únicamente si tienen URL configurada.

---

## Tablas de base de datos (Supabase)

### `leads`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `nombre` | text | Nombre completo |
| `email` | text | Correo electrónico |
| `whatsapp` | text | Número de WhatsApp (opcional) |
| `country_residence` | text | País donde vive actualmente el lead |
| `nationality` | text | Nacionalidad declarada |
| `in_us_status` | text | Situación actual frente a EE.UU. (`en_usa_status`, `en_usa_sin_status`, `fuera_usa`) |
| `migration_goal` | text | Objetivo principal al migrar (crecer_profesionalmente, crear_o_expandir_negocio, etc.) |
| `academic_level` | text | Nivel académico (maestria, doctorado, grado5, otros) |
| `impact_area` | text | Área de impacto (salud, stem, social, negocios, etc.) |
| `achievements` | text[] | Logros seleccionados en el diagnóstico |
| `result_type` | text | Resultado histórico (alto_impacto, unsung) usado para KPIs |
| `treaty_visa_eligible` | boolean | Indica si, por nacionalidad, podría aplicar a visas E2/E1 de tratado |
| `business_experience` | text | Experiencia en negocios (tiene_activo, tuvo, no) |
| `investment_capacity` | text | Capacidad de inversión (mas_100k, menos_100k, no) |
| `company_can_expand` | text | Si la empresa actual puede expandirse a EE.UU. (si, no, no_se) |
| `extraordinary_profile` | text | Nivel de perfil extraordinario declarado (alto, medio, no) |
| `high_level_connections` | text[] | Conexiones de alto nivel (empresas, gobiernos, organizaciones, ninguno) |
| `project_clarity` | text | Claridad de proyecto (estructurado, idea, no) |
| `evidence_readiness` | text | Estado de evidencias (si, parcialmente, no) |
| `timeframe` | text | Horizonte de tiempo para aplicar (0_3, 3_6, 6_12, explorando) |
| `eligibility_segment` | text | Segmento de preparación (listo, necesita_estructura, no_califica_aun) |
| `recommended_route` | text | Ruta recomendada (unsung_program, mentoria_more, abogado, contenido) |
| `visa_buckets` | text[] | Buckets de visa detectados (eb1, eb2, o1, e2, l1, otra) |
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
| `instagram_url` | URL del perfil de Instagram (aparece en el footer si está configurada) |
| `linkedin_url` | URL de la página de LinkedIn (aparece en el footer si está configurada) |
| `facebook_url` | URL de la página de Facebook (aparece en el footer si está configurada) |
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
| `video_thumbnail_url` | text | URL de la foto de portada del video en Supabase Storage (opcional) |
| `category` | text | Categoría del testimonio |
| `sort_order` | int | Orden de aparición |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización (automático) |

---

## 2.6 Sistema de Roles

El panel de administración soporta dos niveles de usuario:

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `standard` | Usuario estándar — conoce el negocio | Todos los módulos excepto el Bloque Técnico del wizard |
| `root` | Administrador raíz | Acceso completo, incluyendo configuración técnica de proyectos |

**Cómo asignar el rol `root` a un usuario:**
1. Ir a Supabase Dashboard → Table Editor → tabla `profiles`
2. Buscar el registro por `user_id` del usuario
3. Cambiar el campo `role` de `standard` a `root`

El rol se muestra con un ícono de escudo junto al nombre del usuario en la sidebar del panel admin.

---

## 2.7 Módulo de Clientes

**Ruta:** `/admin/clients`

Gestión de contactos/clientes que se vinculan a proyectos de landing.

### Funcionalidades
- Listar todos los clientes con búsqueda por nombre, empresa o email
- Crear nuevo cliente con formulario inline
- Editar datos de un cliente existente (también inline)
- Eliminar cliente (los proyectos vinculados quedan sin cliente asignado)

### Campos del cliente

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | text | Nombre completo (obligatorio) |
| `email` | text | Email de contacto (opcional) |
| `phone` | text | Teléfono o WhatsApp (opcional) |
| `company` | text | Empresa o marca (opcional) |
| `notes` | text | Notas internas (opcional) |

### Tabla de base de datos: `clients`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `name` | text | Nombre del cliente |
| `email` | text | Email (opcional) |
| `phone` | text | Teléfono (opcional) |
| `company` | text | Empresa (opcional) |
| `notes` | text | Notas internas (opcional) |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

## 2.8 Módulo de Proyectos de Landing (Wizard + Gemini)

**Ruta:** `/admin/projects`

Sistema para crear proyectos de landing page mediante una entrevista guiada de 14 preguntas en 5 partes. Al finalizar, Gemini genera el contenido estructurado y un prompt de código listo para usar en Cursor/ChatGPT.

### Flujo completo

1. Ir a `/admin/projects` → botón **"Nuevo proyecto"**
2. Completar las 5 partes de la entrevista (+ bloque técnico si eres root)
3. Presionar **"Generar landing con Gemini"**
4. Ver el resultado en la página de proyecto: contenido JSON + prompt de código
5. Copiar el prompt y pegarlo en Cursor para generar el código

### Las 5 partes del wizard

| Parte | Preguntas | Contenido |
|-------|-----------|-----------|
| Paso 0 | — | Vincular o crear cliente |
| Parte 1 | 1-4 | Identidad: nombre, one-liner, industria, colores |
| Parte 2 | 5-7 | Problema y solución: dolor, final feliz, diferenciador |
| Parte 3 | 8-9 | Cliente ideal: perfil principal, segmentos |
| Parte 4 | 10-12 | Oferta: servicios, acción deseada, métricas |
| Parte 5 | 13-14 | Confianza: testimonios, garantía |
| Bloque técnico | — | Stack, DB, dominio, tracking (solo root) |

### Funcionalidades del wizard

- **Autosave:** guarda automáticamente cada 1.5 segundos tras cualquier cambio
- **Navegación libre:** podés ir a cualquier parte ya completada
- **Omitir preguntas:** botón "No tengo esta info" en campos opcionales — el campo queda en `null` y Gemini lo completa
- **Bloque técnico bloqueado:** visible para usuarios `standard` pero no editable

### Página de resultado (`/admin/projects/:id`)

Tiene dos pestañas:
- **Contenido generado:** muestra el JSON de Gemini organizado por sección (Hero, Pain Points, Pricing, Testimonios, FAQ, etc.)
- **Prompt de código:** texto listo para copiar o descargar como `.md`

Acciones disponibles:
- **Regenerar:** vuelve a llamar a Gemini con las mismas respuestas
- **Editar respuestas:** vuelve al wizard para modificar
- **Copiar / Descargar:** el prompt de código

### Variable de entorno requerida

Para que Gemini funcione, se debe agregar al archivo `.env`:
```
VITE_GEMINI_API_KEY=tu_api_key_de_google_ai_studio
```

Obtener la key en: https://aistudio.google.com/app/apikey

### Tabla de base de datos: `landing_projects`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `client_id` | uuid | FK a `clients.id` (opcional) |
| `created_by` | uuid | FK a `auth.users.id` |
| `name` | text | Nombre del proyecto |
| `status` | text | `draft` / `complete` / `generated` |
| `answers` | jsonb | Respuestas de las 5 partes del wizard |
| `tech_config` | jsonb | Configuración técnica (solo root) |
| `generated_json` | jsonb | Contenido generado por Gemini |
| `generated_prompt` | text | Prompt de código generado por Gemini |
| `live_url` | text | URL del sitio desplegado (opcional, para preview live) |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

### Tabla de base de datos: `profiles`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user_id` | uuid | FK a `auth.users.id` (PK) |
| `role` | text | `standard` o `root` |
| `created_at` | timestamptz | Fecha de creación |

---

## 2.9 Módulo de Recursos (Biblioteca)

Ruta: `/admin/resources`

Biblioteca centralizada donde se almacenan y consultan todos los activos estratégicos de la operación: manual de marca, documentos de estrategia, playbooks y landings generadas por producto digital.

### Funcionalidades principales

- **Tabs de filtro**: Todos / Marca / Estrategia / Playbooks / Landings
- **Contador de recursos**: Muestra el total en la pestaña activa
- **Agregar recurso**: Modal para crear nuevos recursos con título, descripción, tipo, formato y URL
- **Vista previa embebida**: Modal a pantalla completa con `<iframe>` para PDF y HTML; enlace externo para links
- **Landings con mock browser**: Las landings generadas muestran una tarjeta con ventana de navegador simulada con el copy del hero (`h1`, `h2`, CTA)
- **Landings con URL live**: Si el campo `live_url` está cargado en el proyecto, aparece un chip `LIVE` y se puede ver el sitio en un modal iframe

### Tipos de recursos (`type`)

| Valor | Descripción |
|-------|-------------|
| `brand` | Recursos de identidad visual (manual de marca, paleta, tipografías) |
| `strategy` | Documentos estratégicos (blueprint, planes de negocio) |
| `playbook` | Guías de proceso y operación |

### Formatos de recursos (`format`)

| Valor | Comportamiento en "Ver" |
|-------|------------------------|
| `pdf` | Abre modal con iframe del PDF |
| `html` | Abre modal con iframe de la ruta interna |
| `link` | Abre en nueva pestaña del navegador |

### Recursos iniciales (seed)

| Recurso | Tipo | Formato | URL |
|---------|------|---------|-----|
| Manual de Marca MORE | brand | pdf | `/resources/manual-de-marca.pdf` |
| Blueprint EB2-NIW 2026 | strategy | html | `/blueprint` |

### Tabla de base de datos: `resources`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `title` | text | Nombre del recurso |
| `description` | text | Descripción breve (opcional) |
| `type` | text | `brand` / `strategy` / `playbook` |
| `format` | text | `pdf` / `html` / `link` |
| `url` | text | URL del recurso (relativa o absoluta) |
| `is_pinned` | boolean | Si aparece destacado con ícono de pin |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |
