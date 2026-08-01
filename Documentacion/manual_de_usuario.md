# Manual de Usuario — MORE Immigration Consulting

> Última actualización: 2026-08-01 (taller `/taller-niw`: Cambio de Estatus — 6 ago 2026)

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
   - 1.13 [Landing Masterclass (`/masterclass`)](#113-landing-masterclass-masterclass)
   - 1.14 [Landing UPP (`/upp`)](#114-landing-upp-upp)
   - 1.15 [Redirección WhatsApp Equipo (`/wppequipo`)](#115-redirección-whatsapp-equipo-wppequipo)
   - 1.16 [Landing Taller Cambio de Estatus (`/taller-niw`)](#116-landing-taller-cambio-de-estatus-taller-niw)
   - 1.17 [Thank You post-agenda (`/gracias`)](#117-thank-you-post-agenda-gracias)
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

**Sistema visual (marca editorial 2026):** Las secciones del Home (Hero, PainPoints, WhoWeHelp, Quiz, Success/testimonios, Pricing, VipSession y Footer) usan tipografía Playfair Display en titulares, fondos papel (`paper` / `paper-warm`), tarjetas de borde fino navy, iconos en círculos sólidos navy/naranja y el CTA unificado `CtaButton`. La lógica del quiz y los flujos de conversión no cambian; solo el aspecto.

### 1.1 Navbar

- Barra de navegación fija en la parte superior.
- Contiene el logo de MORE (enlace a la **ruta `/`**, no solo ancla al tope de la página actual) y enlaces hacia las secciones principales de la landing.
- En rutas distintas de `/` (por ejemplo `/asesoria-vip`, `/privacidad`), los ítems del menú y el botón de **Evaluar mi perfil** usan rutas con ancla respecto a la home (**`/#metodologia`**, **`/#quiz`**, etc.) para que siempre abran la sección correcta en la página principal.
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

**Secciones traducidas:** Navbar, Hero, PainPoints, WhoWeHelp, Quiz (preguntas, opciones y respuestas), VipSession (bloque en home), **página dedicada `/asesoria-vip`** (hero, pilares, prueba social, valor, Ivon, fit, precios, FAQ y CTAs; claves `vipPage` en locales), Pricing (planes y mensajes de WhatsApp), Footer (FAQ completo), BlueprintPage, PrivacyPolicyPage (`/privacidad`), **página Thank You `/gracias`** (`thankYouPage.json`).

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
| Hero VIP (`VipHero`) | Bloque principal con fondo claro y gradientes suaves, en una columna centrada. Sin eyebrow superior duplicado: entra directo al H1. **H1 (ES):** enfoque en **visa** y claridad (“Descubre cómo lograr tu visa en **EE.UU.** sin complicaciones”), sin prometer solo residencia permanente. **Subtítulo:** 60 minutos para claridad de ruta, visa acorde al perfil y avance con propósito en EE.UU. **CTA secundario (gratis):** debajo del subtítulo, botón/enlace hacia **`/#quiz`** (diagnóstico en línea sin costo), con badge “Gratis” y texto de apoyo (`freeEval*` en `vipPage.json`). **Tarjeta de oferta**: badges, **H2** (“Una sesión privada con nuestros estrategas especializados e **Ivón More**”, con el nombre resaltado en naranja), **tres párrafos** de copy (primero: una hora, proyección financiera, escenarios reales, informarte y formarte en migración con propósito y ruta clara hacia la visa; segundo y tercero: tiempo dedicado a planear el nivel internacional; sin webinars grabados ni intermediarios), chips, bloque **“Lo que recibes — Asesoría VIP $97”**. **Panel naranja $97** clicable (= **“Aplicar ahora”** / `calendar_url`) con **una sola** barra de brillo animada. CTA debajo. Filtro “90 días”. Pie: bloque grande **“Actividad en vivo”** con **N** en tipografía muy destacada + “personas están viendo esta sesión ahora” + línea de apoyo sobre cupos (N aleatorio 87–500 por carga; revisar política de marcas). Dos métricas. Foto de Ivon en `VipAboutIvon`. Mismo componente en `/vip.html` y en la ruta `/asesoria-vip` (`VipSessionPage`). Textos i18n en `locales/{es,en}/vipPage.json`. |
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
- Bloque CTA oscuro con botón a WhatsApp (`whatsapp_number` en settings).
- Links de navegación secundarios, información de contacto y redes sociales.
- **Contacto del pie:** email (`contact_email`) y teléfono visible (`contact_phone`) se leen desde `site_settings` y se editan en Admin → Configuración → Contacto. La dirección física sigue fija en el código.
- En la franja inferior del pie, el enlace **Política de Privacidad** apunta a la ruta interna **`/privacidad`** (componente `PrivacyPolicyPage`), no a un ancla vacía. El enlace **Términos & Condiciones** puede seguir sin página dedicada según configuración actual.

**Ruta `/asesoria-vip` (página dedicada `VipSessionPage`):** el `Footer` se renderiza con **`hideLandingFaq`**, de modo que **no aparece** el acordeón de FAQ genérico de la landing principal. Las preguntas propias de la oferta VIP siguen en la sección **`VipFaq`** dentro de la misma página. El **selector ES | EN del navbar** aplica a toda la página (incluido el título de la pestaña del navegador); las cadenas viven en `more-landing/src/locales/{es,en}/vipPage.json`, fusionadas en `i18n.ts`. El **navbar** en esta página enlaza a **`/#quiz`** y a **`/#metodologia`** (etc.) para no depender de anclas vacías en la URL actual. En **`HomePage`**, si la URL trae hash (ej. `/#quiz`), tras cargar se hace **scroll suave** a la sección con ese `id`.

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

- Página legal informativa (sin objetivo de venta): texto en español o inglés según `react-i18next`.
- **Identidad declarada:** responsable del tratamiento **Somos More** (marca MORE); el texto deja explícito que **no es un despacho de abogados** y que los contenidos y programas son **educativos e informativos**, sin asesoría legal.
- **Bloque destacado:** tras el párrafo introductorio se muestra un recuadro (`aside`) con el aviso de naturaleza educativa / no asesoría legal (`educationalNoticeTitle` y `educationalNoticeBody`).
- **Contenido:** clave `privacyPolicy` en `src/locales/es/translation.json` y `src/locales/en/translation.json` (intro, aviso, siete secciones, listas).
- **Domicilio social en el texto:** misma dirección que en el pie del sitio — 1250 W Sam Houston Pkwy S, Houston, Texas, United States, Piso 8, Oficina 800.
- **Correo para privacidad y derechos:** enlaces `mailto` fijos a **`soporte@justmore.net`** (constante `PRIVACY_CONTACT_EMAIL` en `PrivacyPolicyPage.tsx`; ya no depende de `site_settings`).
- **Layout:** `Navbar`, artículo centrado (`max-w-3xl`), `Footer` con **`hideLandingFaq`**.
- **`document.title`:** se establece al cargar y se restaura al salir (como `BlueprintPage`).

### 1.13 Landing Masterclass (`/masterclass`)

**Ruta:** `/masterclass`

Landing dedicada al evento (hero, beneficios, formulario de registro, FAQ, speaker, pie y CTA fijo). El registro envía los datos a la función Edge `masterclass-register` y guarda el lead en Supabase.

**Disponibilidad:** La página solo se renderiza si la fila correspondiente en `landing_projects` (route = `/masterclass`) tiene `is_active = true` y la fecha actual está dentro del rango `activate_at` / `deactivate_at`. Si no, muestra un fallback "Evento no disponible". Esta configuración se controla desde el admin en **Recursos → Landings**, sobre la tarjeta de la masterclass: switch para encender/apagar y botón "Programar" para fechas (ver detalle en sección 2.9).

**Meta Conversions API (servidor):** si en Supabase está configurado el secreto `META_ACCESS_TOKEN` y en `site_settings` hay `meta_pixel_id`, tras un registro exitoso la misma Edge Function puede enviar a Meta el evento estándar **`CompleteRegistration`** con email y teléfono hasheados (SHA-256), además de IP/UA y cookies `_fbp`/`_fbc` cuando el navegador las envía. El formulario genera un `capi_event_id` compartido con el píxel en navegador (cuando hay píxel directo o dato en `dataLayer` para GTM) para **deduplicar** navegador + servidor. La vista de landing puede disparar **`ViewContent`** por servidor mediante la Edge Function `meta-capi-masterclass-view` si el build incluye `VITE_META_CAPI_MASTERCLASS_VIEW_URL`.

#### Pantalla de agradecimiento tras registro exitoso

Tras enviar el formulario correctamente se muestra una tarjeta de confirmación que incluye:

| Elemento | Comportamiento |
|----------|----------------|
| Bloque “Entra al grupo exclusivo” | Cuenta regresiva de **4 segundos** con barra de progreso; al llegar a cero, el navegador abre el enlace del **grupo de WhatsApp en la misma pestaña** (salvo que el usuario haya pausado la acción). |
| “Sí, llevarme al grupo ahora” | Abre el grupo de WhatsApp de inmediato en la misma pestaña y cancela la cuenta regresiva. |
| “Prefiero quedarme aquí (agenda y QR)” | Cancela la redirección automática; el usuario permanece en la página para agendar o usar el QR. |
| Google Calendar / Apple·Outlook | Al usar cualquiera de estas opciones se **cancela** la redirección automática para que la pestaña del registro no cambie mientras el usuario agenda en otra ventana. |
| Código QR | Enlace al mismo grupo de WhatsApp; pensado para quien registró en **computadora** y entra al grupo desde el **celular**. |
| Botón verde de WhatsApp | Abre el grupo en **pestaña nueva** y cancela la redirección automática en la pestaña actual. |

### 1.14 Landing UPP (`/upp`)

**Ruta:** `/upp`

Landing dedicada al **Unsung Professional Program (UPP)**. El hero usa una portada fotográfica full-width ubicada en `public/upp/portada-upp.png`, con la persona posicionada visualmente a la izquierda y el bloque de texto reubicado hacia la derecha en desktop. En móvil, el contenido baja hacia la zona inferior con degradado oscuro para mantener legibilidad sin cubrir el rostro.

El hero conserva los elementos principales del programa: badge de autogestión, promesa de Green Card aprobada, estadísticas del programa, inversión única, CTAs de pago/WhatsApp y countdown cuando está configurado desde `site_settings`. El microcopy de inversión, cupos limitados, garantía del CTA y bloque intermedio de conversión se traduce desde `locales/{es,en}/uppPage.json`.

**Secuencia de secciones de la landing:** Hero → ¿Es para ti? → Problema → Solución → Beneficios → Módulos → Testimonios → Stack de valor → **Stack de bonos** → Inversión (precio único) → **Modalidades de pago** → Preguntas frecuentes → CTA flotante.

**Stack de bonos (próximas 24 h):** sección de urgencia que presenta cuatro bonos que se activan al pagar hoy:

1. **Revisión Estratégica de Expediente** — segunda mirada experta sobre el expediente EB-2 NIW antes de presentarlo a USCIS.
2. **Mentoría · IA aplicada al caso** — uso correcto de IA para potenciar narrativa y evidencia.
3. **Sesión VIP 1:1 con Ivon More** — encuentro estratégico para validar la propuesta de esfuerzo e interés nacional.
4. **Coaching grupal de acompañamiento** — espacios en vivo con el equipo MORE.

Cierra con el valor del stack (~~$1.500 USD~~ → **GRATIS**) condicionado al pago único, usando el precio configurado en `upp_price`.

**Modalidades de pago:** sección que ofrece dos formas de inscribirse, cada una desbloquea bonos distintos:

| Modalidad | Precio | Bonos incluidos | CTA |
|---|---|---|---|
| **Pago único** (recomendada) | `upp_price` (ej. $2.500 USD) | Programa completo + los 4 bonos del stack | Botón de pago → `upp_payment_link` |
| **Pago en 2 cuotas** | 2 × $1.250 USD (sin intereses) | Programa completo + Bono 1 (Revisión Estratégica) | Botón → WhatsApp del asesor |

Incluye una cita de cierre de Ivon More. Los textos son editables desde `locales/{es,en}/uppPage.json` bajo las claves `bonusStack` y `plans`.

### 1.15 Redirección WhatsApp Equipo (`/wppequipo`)

**Ruta pública:** `https://moremigracion.com/wppequipo` (equivalente a `/wppequipo` en el sitio)

Página de utilidad para campañas, QR impresos y enlaces cortos que distribuyen el contacto del **Equipo MORE** entre varios números de WhatsApp sin intervención del programador.

**Comportamiento para el visitante:**

- Al cargar, se elige **al azar** uno de los enlaces activos en la tabla `wpp_team_numbers` y se redirige automáticamente con `window.location.replace`.
- Mientras redirige, muestra la pantalla **“Conectando con el Equipo MORE”** y un botón de respaldo *“¿No abrió solo? Tocá acá para continuar”*.
- Si la página está **desactivada** en admin (`wppequipo_enabled = false`) o no hay números activos, redirige al **WhatsApp general** del sitio (`whatsapp_number` en configuración).
- Si tampoco hay WhatsApp general configurado, muestra un mensaje amable de indisponibilidad con enlace a la home.
- Incluye `<meta name="robots" content="noindex, nofollow">` (no indexable en buscadores).

**Gestión:** todo se configura desde `/admin/settings` → sección **WhatsApp Equipo** (ver [2.5](#25-módulo-de-configuración)).

### 1.16 Landing Taller Cambio de Estatus (`/taller-niw`)

**Ruta:** `/taller-niw`

Landing del taller gratuito **"Estrategias para cambio de estatus"** (Ivon More). Incluye hero con countdown, beneficios, testimonios, formulario de registro, FAQ, speaker, footer y CTA fijo. (Campañas anteriores: Profesional Global / Red Flags — tags y archivos legacy se conservan.)

| Dato | Valor |
|------|-------|
| Evento | Jueves **6 de agosto de 2026**, **7:00 PM** (Colombia) — `tn_event_date` |
| Registro cierra | **7 de agosto de 2026** — `tn_registration_closes_at` |
| Tag GHL (nuevo) | `Taller-cambio-estatus-2026` |
| Source Supabase (nuevo) | `taller-cambio-estatus-2026` |
| Event label | `Taller Cambio de Estatus` |
| Tags legacy (no borrar) | `Taller-profesional-global-2026`, `taller-julio-2026`, `taller-redflags-2026`, `taller-junio-2026`, `meta-julio13` |
| Zoom (inscripción) | https://us02web.zoom.us/meeting/register/Ib5EeFo2SHKeglm0iIjDbg |
| WhatsApp | [Grupo Cambio de Estatus](https://chat.whatsapp.com/FHVIOP5xYnz5XklHqJeXCN) |

**Registro:** igual que la masterclass, usa la Edge Function `masterclass-register` (Supabase + GHL). Campos: nombre, email, teléfono, país, profesión. La Edge Function también acepta sources legacy `taller-profesional-global-2026` y `taller-redflags-2026` para compatibilidad.

#### Pantalla tras registro exitoso

Tras enviar el formulario correctamente se muestra una tarjeta de confirmación con:

| Elemento | Comportamiento |
|----------|----------------|
| Título | `¡Listo, tu lugar está reservado!` con ícono de check verde |
| Mensaje | Tres líneas: un paso pendiente, invitación al grupo de WhatsApp y acceso al taller en vivo |
| Botón verde | Único CTA: abre el grupo de WhatsApp del taller en **pestaña nueva** |

Sin cuenta regresiva, sin agenda de calendario ni código QR.

**Emails automáticos (GHL):** al recibir el tag **`Taller-cambio-estatus-2026`** se deben disparar workflows con **6 correos**: bienvenida inmediata; recordatorio 24 h (5 ago 19:00); el día del evento a las 9:00 AM; 1 h antes (18:00); en vivo (19:00); y +30 min (19:30). Plantillas HTML en `public/emails/*taller*`. Guía: `Documentacion/taller-redflags-ghl-workflow.md`. Sync GHL: `node scripts/sync-ghl-taller-emails.mjs`.

**Admin:** plantillas visibles en **Recursos → Emails → Taller Cambio de Estatus** (preview y copiar HTML).

#### 1.16.1 Página post-registro Meta Lead Ads (`/taller-niw/registro`)

**Ruta:** `/taller-niw/registro`

Página de **confirmación** para quien ya se registró en el **formulario nativo de Meta** (Lead Ads). No incluye formulario propio: solo mensaje de éxito + botón verde al grupo de WhatsApp. Diseño mobile-first (`min-h-[100dvh]`, CTA grande).

| Aspecto | Detalle |
|---------|---------|
| Uso | URL de redirección tras completar el lead en Facebook/Instagram |
| Componente | `TNWhatsappJoinCard` (`variant="ads"`) |
| Contenido | Título, 3 líneas de copy con emojis, botón «Quiero unirme al grupo de WhatsApp» |
| Disponibilidad | Misma que `/taller-niw` (`useLandingStatus("/taller-niw")`) |
| Registro de leads | Lo hace Meta → integración GHL/Zapier (no pasa por `masterclass-register` de esta página) |
| Meta tags | Copy neutro (sin términos sensibles para revisión Meta) |

**URL para configurar en Meta como destino post-lead:**

```
https://moremigracion.com/taller-niw/registro?utm_source=facebook&utm_medium=paid&utm_campaign=taller-cambio-estatus
```

### 1.17 Thank You post-agenda (`/gracias`)

**Ruta:** `/gracias`

Página de **confirmación post-agendamiento** a la que debe redirigir el calendario (GHL, Calendly, Google Appointment Scheduling, etc.) cuando el usuario confirma la cita. Objetivo CRO: **show rate** (preparación + confirmación por WhatsApp), no volver a vender.

**Sistema visual:** marca editorial 2026 (`bg-paper`, `Backdrop`, Playfair + Inter, navy/orange). Header mínimo solo con logo (sin Navbar ni menú). Footer mínimo con logo, tagline y `contact_email` de settings.

| Bloque | Contenido |
|--------|-----------|
| Hero | Badge «Cita confirmada», H1 de evaluación estratégica reservada, subtítulo |
| Correo | Recordatorio de revisar el email de confirmación (fecha, hora, enlace, reprogramar) |
| Checklist | 4 pasos interactivos (checkboxes) alineados al email `confirmacion-agenda.html` |
| Sesión | Timeline en 3 pasos: diagnóstico → rutas posibles → próximos pasos |
| Prueba social | 1 testimonio con rol + resultado cuantificable |
| CTA primario | WhatsApp identity-driven («Sí, confirmo mi asistencia…») con `whatsapp_number` de settings |
| CTA secundario | Link discreto «Volver al inicio» |
| Contacto footer | `soporte@moremigracion.com` (fijo en la página) |

**i18n:** claves en `more-landing/src/locales/{es,en}/thankYouPage.json` (fusionadas en `i18n.ts`).

**Tracking:** al cargar la página (cuando settings ya están listos) se dispara `trackAppointmentBooked`:

| Canal | Evento |
|-------|--------|
| Meta (píxel directo) | `Schedule` con parámetros opacos (`appt_confirmed_a`) |
| GTM / dataLayer | `appointment_booked` |
| GA4 (sin GTM) | `schedule_appointment` |

Se registra **una sola vez por sesión de navegador** (`sessionStorage`) para no duplicar en Strict Mode ni al refrescar. Distinto de `schedule_cta_click`, que mide el **clic** del CTA que abre el calendario.

**Cómo configurar el redirect en el calendario:**

1. En GHL / Calendly / Google Appointment, abrir la configuración de la cita.
2. Poner como **Redirect URL** (o «thank you page») la URL pública:

```
https://moremigracion.com/gracias
```

3. Guardar y hacer una prueba de agendamiento para verificar que el usuario llega a `/gracias` y que el evento aparece en Meta Events Manager / GTM / GA4.

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

Página para gestionar parámetros globales del sitio web que se aplican en el frontend público. Incluye: **medición y píxeles**, **contacto** (WhatsApp, teléfono del footer, email), calendario de asesorías, asesoría VIP (enlace y precio), redes sociales y más.

#### Contacto (WhatsApp, teléfono y email)

**Ubicación:** `/admin/settings` → ancla **Contacto** (`#contacto`).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `whatsapp_number` | texto | Número con código de país (sin espacios) que alimenta **todos los botones** `wa.me` del sitio público. |
| `contact_phone` | texto | Teléfono **visible** en el footer (formato libre, ej. `+1 (548) 312-2105`). No alimenta los botones de WhatsApp. |
| `contact_email` | email | Email mostrado en el footer y otras superficies que lean settings. |

**Cómo configurar:**

1. Ir a `/admin/settings` → **Contacto**.
2. Completar los tres campos y pulsar **Guardar**.
3. El footer del sitio público refleja los cambios tras recargar (el provider hace refetch).

#### Medición y píxeles (Meta, GTM, GA4)

Permite definir qué herramientas de analítica y publicidad cargan en el **sitio público** (no en rutas `/admin/*`). Los valores se guardan en `site_settings` y el CRM muestra un resumen de parámetros activos y una tabla de **eventos que envía la web** (nombre del evento, cuándo ocurre y si va a Meta, dataLayer/GTM u otra vía).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `tracking_enabled` | texto (`true` / `false`) | Si es `false`, no se inyectan scripts ni se envían eventos de medición; los IDs guardados se conservan. |
| `google_tag_manager_id` | texto | ID del contenedor GTM (`GTM-...`). Si está configurado, el sitio **prioriza solo GTM** para cargar etiquetas; el marketer debe configurar Meta/GA4 dentro de GTM. No rellenar además el mismo píxel de Meta en el campo dedicado si ya lo disparas vía GTM, para evitar duplicados. |
| `meta_pixel_id` | texto (solo dígitos) | ID numérico del píxel de Meta. Se usa cuando **no** hay GTM o el píxel se gestiona directamente desde el código (sin duplicar el mismo ID también en GTM). |
| `ga4_measurement_id` | texto | ID de medición GA4 (`G-...`). Solo aplica si GA4 no se carga ya vía GTM. |

**Eventos enviados en el sitio público (resumen):**

- **PageView / virtual_page_view:** al cambiar de ruta en la SPA (vistas virtuales para embudo y atribución).
- **ViewContent / masterclass_landing_view:** al visitar `/masterclass` (parámetros hacia Meta con identificadores neutros). Si está desplegada la función `meta-capi-masterclass-view` y el frontend tiene `VITE_META_CAPI_MASTERCLASS_VIEW_URL`, también se envía **ViewContent por Conversions API** con el mismo `event_id` que el píxel o el campo `capi_event_id` en `dataLayer` (GTM).
- **Lead / lead_submitted:** tras guardar correctamente el lead del formulario del diagnóstico (quiz); parámetros hacia Meta neutros.
- **Registro masterclass:** el `dataLayer` emite `masterclass_registration` (útil si usáis GTM; puede incluir `capi_event_id` para alinear con CAPI). Con **píxel Meta directo** (sin GTM) se envía **`CompleteRegistration`** con parámetros neutros y `eventID` igual al `capi_event_id` del servidor. La Edge Function `masterclass-register` envía el mismo evento por **Conversions API** cuando existen `META_ACCESS_TOKEN` y `meta_pixel_id` (contacto hasheado en servidor). Si configuraste **GA4** sin GTM, se registra `sign_up`.
- **Schedule / schedule_cta_click:** al hacer clic en el CTA de Asesoría VIP que abre el calendario o enlace de pago externo.
- **Schedule / appointment_booked:** al cargar `/gracias` tras confirmar una cita en el calendario (conversión real de agendamiento; una vez por sesión de navegador). GA4: `schedule_appointment`.

En la misma pantalla hay textos de ayuda (qué es el píxel de Meta, GTM, GA4) y un aviso si GTM e ID de Meta están rellenos a la vez.

**Cómo configurar:** abrir `/admin/settings`, completar la tarjeta «Medición y píxeles», validar formatos (GTM-…, G-…, píxel solo números) y pulsar **Guardar medición**. Para pruebas en Meta: Administrador de eventos → Probar eventos.

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

**Redirect post-cita:** en el proveedor del calendario (GHL / Calendly / Google), configurar la URL de agradecimiento a `https://moremigracion.com/gracias` (ver sección 1.17).

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

#### WhatsApp Equipo (`/wppequipo`)

**Ubicación:** `/admin/settings` → ancla **WhatsApp Equipo** (o sección `#wppequipo`).

Permite autogestionar la página pública `https://moremigracion.com/wppequipo` sin editar código.

| Control | Descripción |
|---------|-------------|
| **Página activa** (switch) | Activa o desactiva la distribución por números del equipo. Si está desactivada, los visitantes caen al WhatsApp general (`whatsapp_number`). |
| **URL pública + Copiar** | Muestra `https://moremigracion.com/wppequipo` con botón para copiar al portapapeles. |
| **Código QR** | QR generado en el panel apuntando a la URL pública. Botón **Descargar QR (PNG)** para materiales impresos. |
| **Lista de números** | CRUD de enlaces: nombre/etiqueta, URL de WhatsApp, activar/desactivar cada uno, editar y eliminar. |
| **Importar lista** (botón) | Importación masiva con formateo automático: pegás un bloque de texto con índice + nombre + teléfono y el sistema arma las URLs `https://wa.me/<numero>` con el código de país correspondiente. |

**Cómo agregar un número (uno a uno):**

1. Ir a `/admin/settings` → **WhatsApp Equipo**.
2. Verificar que **Página activa** esté encendida.
3. Clic en **Agregar número**.
4. Completar **Nombre / etiqueta** (ej: Sandra, Hugo) y **Enlace de WhatsApp** (formatos válidos: `wa.me`, `wa.link`, `api.whatsapp.com`, `chat.whatsapp.com`).
5. Guardar. El número entra en la rotación aleatoria si está **Activo**.

**Cómo importar una lista masiva:**

1. Clic en **Importar lista**.
2. Pegar el texto con el formato libre. El parser entiende bloques tipo:
   ```
   36
   Andres Chancusig
   0989812877
   37
   Jose Forero
   954932639
   ```
   - Los números cortos sueltos (1–3 dígitos) se ignoran (índices de la lista).
   - Las líneas con letras se toman como **nombre/etiqueta**.
   - Las líneas con 7+ dígitos se toman como **teléfono**.
3. Seleccionar **País por defecto** (ej: Ecuador +593). Se usa solo para números sin prefijo internacional; los que ya traen código de país (ej: `50498549249` para Honduras) se respetan.
4. Clic en **Procesar y previsualizar**. Se muestra una tabla con cada entrada:
   - Nombre, teléfono original, URL final `https://wa.me/...`.
   - Las entradas inválidas se marcan en rojo (con el motivo: falta nombre o número inválido).
   - Cada fila es editable; se puede corregir el nombre/teléfono o quitar la fila.
5. Clic en **Importar X números**. Solo se guardan las válidas, en una sola operación masiva.

> Reglas de formateo:
> - Los ceros iniciales del teléfono nacional se eliminan al anteponer el código de país (ej: `0989812877` con país Ecuador → `https://wa.me/593989812877`).
> - Si el número ya viene con código de país conocido, no se modifica.
> - Cambiar el país por defecto después de procesar **vuelve a normalizar** los números que no traían prefijo internacional.

**Cómo compartir:**

- Copiar el enlace desde el campo URL o descargar el QR PNG para flyers, tarjetas o presentaciones.
- El enlace siempre es `https://moremigracion.com/wppequipo` (no cambia al agregar números).

| Campo en BD | Tipo | Descripción |
|-------------|------|-------------|
| `wppequipo_enabled` | texto (`true` / `false`) | En `site_settings`. Activa la página de reparto entre números del equipo. |

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
| `whatsapp_number` | Número de WhatsApp de contacto (botones wa.me del sitio) |
| `contact_phone` | Teléfono visible en el footer (texto de display) |
| `instagram_url` | URL del perfil de Instagram (aparece en el footer si está configurada) |
| `linkedin_url` | URL de la página de LinkedIn (aparece en el footer si está configurada) |
| `facebook_url` | URL de la página de Facebook (aparece en el footer si está configurada) |
| `youtube_url` | URL del canal de YouTube (footer si está configurada) |
| `vip_payment_link` | URL del enlace de pago de la asesoría VIP |
| `vip_price` | Texto del precio mostrado en la página VIP |
| `contact_email` | Email de contacto |
| `meta_pixel_id` | ID del píxel de Meta (solo dígitos); front público si no se usa GTM para el píxel |
| `google_tag_manager_id` | Contenedor GTM (`GTM-...`); si existe, el sitio carga solo GTM |
| `ga4_measurement_id` | Medición GA4 (`G-...`) si GA4 no va solo vía GTM |
| `tracking_enabled` | `true` / `false`: activa o pausa scripts y eventos de medición |
| `wppequipo_enabled` | `true` / `false`: activa la página `/wppequipo` con reparto aleatorio entre números del equipo |
| `upp_payment_link` | URL de pago del programa UPP |
| `upp_price` | Precio mostrado en landing UPP |
| `upp_countdown_date` | Fecha de cierre del countdown UPP (opcional) |

**RLS:** Lectura pública (anon). Escritura solo para usuarios `authenticated`.

### `wpp_team_numbers`

Números/enlaces de WhatsApp del equipo para la página `/wppequipo`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | Clave primaria |
| `label` | text | Nombre visible en admin (ej: Sandra, Equipo MORE 1) |
| `url` | text | Enlace completo de WhatsApp (`wa.me`, `wa.link`, etc.) |
| `is_active` | boolean | Si participa en la rotación aleatoria |
| `sort_order` | int | Orden de visualización en el panel admin |
| `created_at` | timestamptz | Fecha de alta |
| `updated_at` | timestamptz | Última modificación (automático) |

**RLS:** Lectura pública solo filas con `is_active = true` (página pública). Usuarios autenticados ven y editan todos los registros.

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

- **Tabs de filtro**: Todos / Marca / Estrategia / Playbooks / Landings / **Emails**
- **Contador de recursos**: Muestra el total en la pestaña activa
- **Agregar recurso**: Modal para crear nuevos recursos con título, descripción, tipo, formato y URL
- **Vista previa embebida**: Modal a pantalla completa con `<iframe>` para PDF y HTML; enlace externo para links
- **Landings con mock browser**: Las landings generadas muestran una tarjeta con ventana de navegador simulada con el copy del hero (`h1`, `h2`, CTA)
- **Landings con URL live**: Si el campo `live_url` está cargado en el proyecto, aparece un chip `LIVE` y se puede ver el sitio en un modal iframe
- **Control de disponibilidad de landings**: Cada tarjeta de landing tiene un switch para encender/apagar la página y un botón "Programar" para definir ventanas de activación/desactivación automáticas (ver detalle abajo)

### Control de disponibilidad de una landing pública

En la tab **Landings** (o **Todos**) cada landing muestra:

- **Switch** verde/gris para activar o apagar la página manualmente. Actualiza la columna `is_active` en `landing_projects`.
- **Badge de estado** al lado del switch con la disponibilidad real combinando switch + fechas:
  - 🟢 **Disponible**: la página se ve públicamente
  - ⚪ **Apagada**: el switch está en off
  - 🟠 **Programada**: hay `activate_at` futuro
  - 🔴 **Expirada**: la fecha de `deactivate_at` ya pasó
- **Botón "Programar"**: abre dos inputs `datetime-local`:
  - **Activar**: fecha/hora a partir de la cual la landing pasa a estar disponible (puede dejarse vacío)
  - **Desactivar**: fecha/hora en la que la landing deja de estar disponible (puede dejarse vacío)
- Las fechas se guardan **al salir del input** (`onBlur`) y muestran feedback inmediato ("Fecha guardada" / "No se pudo guardar"). Cada fecha tiene un botón ✕ para borrarla.

#### Lógica de runtime (cómo se evalúa la disponibilidad)

El componente público de la landing (por ejemplo `/masterclass`) usa el hook `useLandingStatus(route)` que consulta `landing_projects` por `route` y aplica este orden:

1. Si `deactivate_at` ya pasó → **expired** (muestra fallback "Evento no disponible")
2. Si `activate_at` aún no llega → **scheduled** (muestra fallback "El evento aún no ha comenzado")
3. Si `is_active = false` → **inactive** (muestra fallback "Este evento no está activo")
4. Si pasa todo lo anterior → **active** (la landing se renderiza normalmente)

#### Buenas prácticas

- Para que una landing esté disponible **ya**: dejá `activate_at` vacío y el switch encendido.
- Para que una landing **expire** sola: dejá el switch encendido y poné `deactivate_at` en la fecha/hora local de corte.
- Si no querés que use fechas, dejá ambas vacías. La disponibilidad la define solo el switch.

### Tab Emails

Muestra plantillas HTML para copiar a GoHighLevel, agrupadas por campaña:

| Grupo | Plantillas |
|-------|------------|
| Masterclass | Bienvenida, recordatorio 24 h, día del evento |
| **Taller Profesional Global** | Bienvenida, recordatorios (tag `taller-profesional-global-2026`) |
| Agenda Ivon / Sandra | Confirmación y recordatorios de sesiones |

Cada tarjeta permite **visualizar** el email en iframe y **copiar el HTML** al portapapeles.

### Tipos de recursos (`type`)

| Valor | Descripción |
|-------|-------------|
| `brand` | Recursos de identidad visual (manual de marca, paleta, tipografías) |
| `strategy` | Documentos estratégicos (blueprint, planes de negocio) |
| `playbook` | Guías de proceso y operación |
| `landing` | Páginas/landings (referencias o ya integradas en el sitio) |

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
