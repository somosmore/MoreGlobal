# Plan de Trabajo — Landing MORE

Plan estructurado para las mejoras pendientes en la landing page de MORE (EB-2 NIW).

---

## Objetivos

1. **SEO y keywords:** Integrar palabras clave del negocio de forma natural.
2. **UX/UI:** Mantener diseño profesional y consistente.
3. **Marketing:** Ampliar el alcance del mensaje a todos los perfiles objetivo.
4. **Contenido:** Actualizar descripciones para ser más abarcativas.

---

## Fases del Plan

### Fase 1: SEO y metadatos
| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 1.1 | Integrar keywords en meta description: visas, migración, residencia permanente, Green Card, plan de negocios | `index.html` | ⬜ Pendiente |
| 1.2 | Añadir meta keywords (opcional) | `index.html` | ⬜ Pendiente |

---

### Fase 2: Hero y trust indicators
| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 2.1 | Actualizar badge con "Migración con propósito" | `Hero.tsx` | ⬜ Pendiente |
| 2.2 | Añadir trust indicator: "Empresarios, profesionales e inversionistas" | `Hero.tsx` | ⬜ Pendiente |

---

### Fase 3: Sección "¿A quién ayudamos?"
| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 3.1 | Crear componente `WhoWeHelp.tsx` o ampliar sección existente | Nuevo / existente | ⬜ Pendiente |
| 3.2 | Incluir perfiles: Empresarios, Comerciantes, Profesionales, Inversionistas | - | ⬜ Pendiente |
| 3.3 | Mencionar visas para no inmigrante si aplica | - | ⬜ Pendiente |
| 3.4 | Integrar en `App.tsx` | `App.tsx` | ⬜ Pendiente |

---

### Fase 4: Pricing y contenido comercial
| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 4.1 | Plan Plus: cambiar "Agenda de Networking" por "Agenda exploratoria de networking en USA" | `Pricing.tsx` | ⬜ Pendiente |
| 4.2 | Plan Plus: aplicar descripción ampliada (estudiantes, empresarios, emprendedores, trabajadores independientes) | `Pricing.tsx` | ⬜ Pendiente |

---

### Fase 5: FAQ y Footer
| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 5.1 | Añadir FAQ: "¿A quiénes ayudan?" o "¿Qué tipos de visas manejan?" | `Footer.tsx` | ⬜ Pendiente |
| 5.2 | Respuesta incluyendo perfiles y keywords | `Footer.tsx` | ⬜ Pendiente |
| 5.3 | Footer: ampliar descripción con perfiles y términos clave | `Footer.tsx` | ⬜ Pendiente |

---

### Fase 5B: Integración Banco de Preguntas EB2 NIW (MORE)

**Fuente:** `BANCO DE PREGUNTAS EB2 NIW.docx` — contenido oficial MORE

**Categorías identificadas en el documento:**

| Categoría | Preguntas clave | Prioridad landing |
|-----------|-----------------|-------------------|
| Requisitos para aplicar | Requisitos EB2 NIW, criterios Matter of Dhanasar | Alta |
| Hoja de vida | Estructura CV, idioma (solo inglés) | Media |
| Documentos académicos | Qué enviar, apostilla (no), organización | Alta |
| Certificación laboral | Empresarios, empresas que ya no existen, organización | Alta |
| Documentos civiles | Unión libre/casarse, turista antes de NIW | Media |
| Equivalencia de títulos | Costos (USD 400 / USD 85), sin maestría, organización | Alta |
| Alcance visa | Cónyuge, hijos menores de 21 años | Alta |
| Traducciones | Qué traducir, disclaimer | Media |
| Expediente físico | Una/dos caras, organización digital | Baja |

**Tareas de integración:**

| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 5B.1 | Seleccionar 10–12 preguntas prioritarias del banco para FAQ landing | `Footer.tsx` | Foco en: requisitos, equivalencia costos, empresarios, documentos académicos, alcance familiar, sin maestría |
| 5B.2 | Reemplazar/ampliar FAQ actual con respuestas oficiales del banco | `Footer.tsx` | Corregir encoding (ó, á, etc.) y adaptar tono para web |
| 5B.3 | Añadir FAQ: equivalencia de títulos (costos USD 400 / USD 85) | `Footer.tsx` | Info de valor que no está hoy |
| 5B.4 | Añadir FAQ: "¿Soy empresario, qué evidencias uso?" | `Footer.tsx` | Del banco, conecta con keywords empresario |
| 5B.5 | Añadir FAQ: "¿Qué pasa si no tengo maestría?" | `Footer.tsx` | Respuesta: equivalencia título + experiencia laboral |
| 5B.6 | Añadir FAQ: "¿A quiénes puedo incluir? (cónyuge, hijos)" | `Footer.tsx` | Del banco, alcance familiar |
| 5B.7 | (Opcional) Crear sección FAQ por categorías con tabs/accordion | Nuevo componente | Si hay muchas preguntas: Requisitos, Documentos, Equivalencia, etc. |

**Preguntas sugeridas para landing (del banco):**

1. ¿Qué requisitos debo cumplir para aplicar a la visa EB2 NIW?
2. ¿Necesito una oferta de empleo? (ya existe)
3. ¿Qué pasa si no tengo maestría?
4. ¿Soy empresario, qué evidencias puedo usar para certificación laboral?
5. ¿A quiénes puedo incluir en mi proceso? (cónyuge, hijos)
6. ¿Cuánto cuesta la equivalencia de títulos?
7. ¿Los documentos deben estar apostillados?
8. ¿Puedo aplicar si vivo fuera de EE.UU.? (ya existe)
9. ¿Cuánto tiempo toma el proceso? (ya existe)
10. ¿Qué documentos académicos necesito?
11. ¿Si estoy en unión libre, debo casarme para incluir a mi pareja?

---

### Fase 3B: Casos de éxito con fotos

**Objetivo:** Ampliar la sección de testimonios a 5 casos con soporte para fotos reales, siguiendo el formato de tarjeta tipo mensaje (foto circular, nombre, país, cita).

**Formato de tarjeta (referencia):**
- Foto circular centrada arriba
- Nombre completo en negrita
- País de origen
- Cita entre comillas
- Badge de timeline (ej. "Aprobado en 120 días")

**Propuesta de 5 casos de éxito:**

| # | Nombre | País | Rol / Área | Quote (resumen) | Foto |
|---|--------|------|------------|-----------------|------|
| 1 | **Ricardo Ochoa** | Colombia | Profesional | "La confianza que brinda Ivon y su equipo, además de su experiencia en EB-2 NIW, fue lo que más me impactó. Afiancé que puedo aportar mucho al progreso de EE.UU." | Sí (disponible) |
| 2 | Carlos M. | — | Ingeniero de Software / STEM | MORE transformó mi perfil en una narrativa de impacto nacional. En 4 meses tenía mi aprobación. | Pendiente (usar icono hasta tener foto) |
| 3 | Dra. María L. | — | Médica Investigadora / Salud | El equipo me ayudó a construir un plan profesional que demostró mi impacto en salud pública. | Pendiente (usar icono hasta tener foto) |
| 4 | Roberto S. | — | Emprendedor Social | Sin oferta de empleo, pensé que era imposible. MORE demostró que mi trayectoria empresarial era suficiente. | Pendiente (usar icono hasta tener foto) |
| 5 | [Por definir] | — | Perfil adicional | Testimonial real de MORE | Pendiente (prioritario con foto) |

**Tareas de implementación:**

| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 3B.1 | Actualizar estructura `successCases` con campo `photo` opcional | `Success.tsx` | `{ name, country?, role, area, quote, timeline, photo?: string }` |
| 3B.2 | Refactorizar card de testimonio: foto circular si existe, sino icono por defecto | `Success.tsx` | Diseño tipo imagen adjunta: foto arriba, nombre, país, cita |
| 3B.3 | Integrar Ricardo Ochoa con cita real y ruta a foto | `Success.tsx` | Copiar foto a `public/testimonials/` o carpeta equivalente |
| 3B.4 | Crear carpeta `public/testimonials/` y documentar convención de nombres | Proyecto | Ej: `ricardo-ochoa.jpg`, `carlos-m.jpg` |
| 3B.5 | Dejar slot 5 preparado para nuevo caso con foto | `Success.tsx` | Placeholder o caso genérico hasta recibir contenido |

**Requerimientos para fotos:**
- Formato: JPG o PNG, mín. 200x200 px, preferible cuadrado
- Fondo: neutro o con desenfoque
- Consentimiento: verificar autorización de uso en web

**Referencia de diseño:** Imagen adjunta de Ricardo Ochoa (formato tarjeta tipo mensaje: foto circular, nombre, país, cita entre comillas).

---

### Fase 6: QA y deploy
| # | Tarea | Acción | Estado |
|---|-------|--------|--------|
| 6.1 | Verificar compilación sin errores | `npm run build` | ⬜ Pendiente |
| 6.2 | Revisión responsive móvil | Manual | ⬜ Pendiente |
| 6.3 | Deploy a Vercel | Push / redeploy | ⬜ Pendiente |

---

## Palabras clave objetivo

| Keyword | Uso principal |
|---------|---------------|
| Visas | Hero, meta, FAQ |
| Migración | Badge, meta, Footer |
| Residencia permanente | Hero, meta, Success, Footer |
| Green Card | Pricing, PainPoints, meta |
| Plan de negocios | Plan Plus, meta, FAQ |
| Visas para no inmigrante | FAQ, sección "¿A quién ayudamos?" |
| Empresario, Comerciante, Profesional, Inversionista | Hero, FAQ, Footer, nueva sección |
| Agenda exploratoria de networking en USA | Plan Plus (feature) |

---

## Orden sugerido de ejecución

1. **Fase 1** — SEO (impacto directo en búsqueda)
2. **Fase 4** — Pricing (contenido comercial más relevante)
3. **Fase 2** — Hero (primera impresión y trust)
4. **Fase 3B** — Casos de éxito con fotos (Ricardo Ochoa + estructura para 5 testimonios)
5. **Fase 5** — FAQ y Footer (contenido de apoyo)
6. **Fase 5B** — Integración Banco de Preguntas MORE (contenido oficial)
7. **Fase 3** — Nueva sección "¿A quién ayudamos?" (requiere más diseño)
8. **Fase 6** — QA y deploy final

---

## Banco de Preguntas MORE — Referencia

**Fuente:** `G:\Mi unidad\S&TLABS\CLIENTES\SOMOS MORE\BANCO DE PREGUNTAS EB2 NIW.docx`

El documento contiene respuestas oficiales de MORE organizadas por categorías. Al integrar en la web:

- **Corregir encoding:** El texto extraído tiene caracteres mal codificados (A3 → ó, Ac → é, etc.).
- **Adaptar longitud:** Algunas respuestas son largas; resumir o dividir para acordeones.
- **Mantener precisión:** No alterar información técnica (costos USD 400/85, requisitos NIW, etc.).

---

## Notas

- Mantener tono profesional en todo el contenido.
- Evitar keyword stuffing: integrar términos de forma natural.
- Priorizar legibilidad y UX frente a densidad de keywords.
- Revisar con el equipo de negocio antes de publicar cambios en mensajes comerciales.
