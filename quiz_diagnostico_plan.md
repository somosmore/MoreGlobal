## Plan de implementación del diagnóstico migratorio

### 1. Alcance

- Rediseñar el quiz actual como **diagnóstico de ruta migratoria ideal hacia Estados Unidos** con 6 bloques (17 preguntas).
- Implementar lógica de clasificación: elegibilidad real, tipo(s) de visa probables, nivel de preparación, segmento y ruta recomendada.
- Persistir todo en la tabla `leads` de Supabase y exponerlo en el CRM (`/admin/leads`).

Archivos clave a tocar:
- `more-landing/src/components/sections/Quiz.tsx`
- `more-landing/src/lib/quizLogic.ts`
- `more-landing/src/lib/supabase.ts`
- `more-landing/src/pages/AdminLeads.tsx`
- `more-landing/supabase/migrations/015_leads_diagnostico_migratorio.sql`
- `Documentacion/manual_de_usuario.md`
- `more-landing/src/locales/es/translation.json` y `more-landing/src/locales/en/translation.json`

---

### 2. Modelo de datos del diagnóstico

1. **Extender tabla `leads` (Supabase)**  
   - Usar la migración `015_leads_diagnostico_migratorio.sql` para añadir:
     - `country_residence`, `nationality`, `in_us_status`, `migration_goal`
     - `treaty_visa_eligible`
     - `business_experience`, `investment_capacity`, `company_can_expand`
     - `extraordinary_profile`, `high_level_connections[]`
     - `project_clarity`, `evidence_readiness`, `timeframe`
     - `eligibility_segment`, `recommended_route`
     - `visa_buckets[]`

2. **Actualizar tipos en `supabase.ts`**  
   - Ampliar `Lead` y `LeadInsert` con todos estos campos, respetando tipos (`string | null`, `boolean | null`, `string[]`, etc.).

3. **Definir modelo de respuestas del quiz**  
   - En `quizLogic.ts` (ya creado), usar `QuizAnswers` como fuente de verdad del estado del quiz en frontend:
     - Campos para cada pregunta: país, nacionalidad, estatus en EE.UU., objetivo, educación, años de experiencia, logros, sector, negocio, inversión, expansión, perfil extraordinario, conexiones, claridad, evidencias, horizonte de tiempo.

---

### 3. Lógica de clasificación (quizLogic.ts)

1. **Tratado comercial / visado E2-E1**  
   - `hasTreatyCountry(nationality: string | null): boolean`  
     - Tabla interna de países con tratado E2/E1 (Colombia, México, etc.).
     - Resultado → `treaty_visa_eligible` en BD.

2. **Buckets de visa (`visa_buckets`)**  
   - `computeVisaBuckets(answers: QuizAnswers): VisaBucket[]`  
     - Añadir `eb1` cuando haya combinación de:
       - Educación alta (`maestria`, `doctorado`, `grado5`), logros fuertes, sector de alto impacto.
     - Añadir `eb2` cuando haya educación alta + ≥5 años experiencia + sector relevante.
     - Añadir `o1` cuando existan logros fuertes / perfil extraordinario.
     - Añadir `e2` cuando haya negocio + disposición de inversión + tratado.
     - Añadir `l1` cuando empresa actual pueda expandirse a EE.UU. y exista negocio activo.
     - Añadir `otra` cuando no se detecte bucket claro pero exista intención migratoria.

3. **Segmento de preparación (`eligibility_segment`)**  
   - `classifyReadiness(answers: QuizAnswers): "listo" | "necesita_estructura" | "no_califica_aun"`  
     - `listo`: proyecto estructurado + evidencias organizadas + horizonte distinto a “solo explorando”.
     - `no_califica_aun`: sin proyecto, sin evidencias y solo explorando.
     - En cualquier otro caso → `necesita_estructura`.

4. **Ruta recomendada (`recommended_route`)**  
   - `recommendRoute(answers, visaBuckets, segment): "unsung_program" | "mentoria_more" | "abogado" | "contenido"`  
     - `unsung_program`: segment = `listo`, buckets fuertes (EB1/EB2/O1), horizonte corto (0–3 / 3–6).
     - `mentoria_more`: segment = `necesita_estructura` con buckets fuertes o de negocio (E2/L1).
     - `abogado`: segment = `listo`, sin buckets fuertes pero objetivo de residencia / negocio.
     - `contenido`: resto de casos (exploración / muy verde).

5. **Compatibilidad con `result_type`**  
   - Derivar `result_type` como:
     - `alto_impacto` si `visa_buckets` incluye `eb1` o `eb2` u `o1`.
     - `unsung` en caso contrario.

---

### 4. Rediseño del flujo del quiz (Quiz.tsx)

1. **Estado centralizado**
   - Reemplazar estado anterior por:
     - `const [quiz, setQuiz] = useState({ step: 1, answers: initialAnswers })`.
   - `initialAnswers` basado en `QuizAnswers` con `null`/`[]`.

2. **Agrupación de pasos en 7 pantallas**
   - **Step 1 – Bloque 1 (perfil básico A)**  
     - P1: País de residencia.  
     - P2: Nacionalidad.
   - **Step 2 – Bloque 1 (perfil básico B)**  
     - P3: Estás actualmente en EE.UU. (`en_usa_status`, `en_usa_sin_status`, `fuera_usa`).  
     - P4: Objetivo principal al migrar (5 opciones).
   - **Step 3 – Bloque 2 (tratado)**  
     - Mostrar mensaje dinámico según `hasTreatyCountry(nationality)`:
       - “Con tu nacionalidad, las visas E2/E1 sí/no están disponibles como ruta de negocio”.
   - **Step 4 – Bloque 3 (perfil profesional 1)**  
     - P6: Nivel educativo (Técnico, Profesional, Maestría, Doctorado).  
     - P7: +5 años de experiencia (Sí/No).
   - **Step 5 – Bloque 3 (perfil profesional 2)**  
     - P8: Logros (multi selección, incluye “Ninguno”).  
     - P9: Sector de impacto (Salud, Energía, Tecnología, Educación, Medio ambiente, Desarrollo económico, Otro).
   - **Step 6 – Bloque 4 + 5 (negocios + perfil extraordinario)**  
     - P10: Negocio actual/pasado.  
     - P11: Inversión potencial en EE.UU.  
     - P12: ¿Empresa actual podría expandirse a EE.UU.?  
     - P13: Reconocimiento como experto (3 niveles).  
     - P14: Trabajo con empresas/gobiernos/organizaciones (multi selección + ninguno).
   - **Step 7 – Bloque 6 (claridad y preparación)**  
     - P15: Proyecto/plan en EE.UU. (estructurado / idea / no).  
     - P16: Evidencias organizadas (sí / parcialmente / no).  
     - P17: Tiempo para aplicar (0–3, 3–6, 6–12, explorando).

3. **Navegación y validaciones**
   - Implementar `canProceed(step, answers)` para habilitar el botón “Continuar” en cada paso.
   - Mantener `AnimatePresence` + transiciones con `framer-motion` como en el quiz actual.

4. **Cálculo del diagnóstico y pantalla de resultado**
   - Al completar el Step 7 y hacer click en “Ver mi diagnóstico”:
     - Llamar a `computeVisaBuckets`, `classifyReadiness`, `recommendRoute`.
     - Guardar el resultado en estado `diagnosis` (`visaBuckets`, `segment`, `route`, `result_type`).  
     - Mostrar una tarjeta de diagnóstico con:
       - Título: “Tu ruta migratoria más probable”.  
       - Segmento: badge (Listo / Necesita estructuración / No califica aún).  
       - Buckets de visa como chips (EB1, EB2, O1, E2, L1, Otra).  
       - Ruta recomendada en lenguaje natural, alineada con:
         - Unsung Professional Program.
         - Mentoría / Academia MORE.
         - Referido a abogado.
         - Contenido educativo.
   - Desde esta pantalla, botón para pasar al formulario de datos (lead) y botón para reiniciar diagnóstico.

5. **Barra de progreso**
   - Ajustar `progressValue` para repartir 0–75% entre los 7 pasos.  
   - Resultado ≈ 85–90%.  
   - Lead enviado = 100%.

---

### 5. Integración con Supabase (LeadInsert)

1. **Construcción del objeto `LeadInsert` en `handleLeadSubmit`**
   - Mapear:
     - Datos de contacto: `nombre`, `email`, `whatsapp`.  
     - Campos antiguos: `academic_level`, `impact_area`, `achievements`, `result_type`.  
     - Campos nuevos:
       - `country_residence`, `nationality`, `in_us_status`, `migration_goal`.  
       - `treaty_visa_eligible`, `business_experience`, `investment_capacity`, `company_can_expand`.  
       - `extraordinary_profile`, `high_level_connections`.  
       - `project_clarity`, `evidence_readiness`, `timeframe`.  
       - `eligibility_segment`, `recommended_route`, `visa_buckets`.
   - Mantener manejo actual de errores, estados de envío y mensajes de éxito/duplicado.

2. **Compatibilidad**
   - Asegurar que los campos nuevos sean opcionales en TS y tengan default `NULL` / `'{}'` en BD.

---

### 6. Actualización del CRM (`AdminLeads.tsx`)

1. **Tabla principal de leads**
   - Añadir columna breve de “Ruta recomendada” (`recommended_route`) con chips de color.  
   - Mostrar nacionalidad y país de residencia en la columna de perfil o en una nueva fila debajo del nombre.

2. **Panel lateral de detalle**
   - Sección “Diagnóstico migratorio” con:
     - Segmento de preparación (`eligibility_segment`) como badge (verde / naranja / gris).  
     - Buckets de visa (`visa_buckets`) como chips.  
     - Bloque de negocios e inversión (P10–P12).  
     - Bloque de perfil extraordinario (P13–P14).  
     - Bloque de claridad y preparación (P15–P17).

3. **Filtros y exportación CSV**
   - Nuevos filtros por:
     - Segmento (`eligibility_segment`).  
     - Ruta recomendada (`recommended_route`).  
   - Incluir estos campos añadidos en la exportación CSV.

---

### 7. Copy & encaje en el funnel

1. **Hero (`Hero.tsx` + i18n)**
   - Ajustar `hero.cta1` para que invite a hacer el **diagnóstico de ruta migratoria**.  
   - Ajustar `quiz.title` y `quiz.subtitle` en i18n a:
     - “¿Cuál es tu ruta migratoria ideal hacia Estados Unidos?”  
     - + beneficios: filtrar elegibilidad, identificar visas probables, medir preparación.

2. **Sección de Éxito (`Success.tsx`)**
   - Ajustar textos y CTAs que apuntan a `#quiz` para que hablen explícitamente de “diagnóstico de ruta migratoria”.

---

### 8. Documentación y QA

1. **Manual de usuario (`Documentacion/manual_de_usuario.md`)**
   - Actualizar sección **1.3 Quiz de calificación** → “Diagnóstico de ruta migratoria”:  
     - Describir los 6 bloques y objetivo de cada uno.  
     - Explicar la lógica de segmentación y rutas recomendadas.  
   - Actualizar sección **2.3 Módulo de Leads**:  
     - Nuevos campos visibles en la tabla y panel.  
     - Nuevos filtros y exportación.  
   - Actualizar tabla `leads` con todos los campos agregados.

2. **Testing**
   - Probar 3 perfiles tipo:  
     - Perfil fuerte (EB2/EB1/O1 + listo).  
     - Perfil con potencial pero desordenado.  
     - Perfil muy exploratorio / sin claridad.  
   - Verificar:
     - Flujo del quiz sin bloqueos.  
     - Inserción correcta en `leads`.  
     - Visualización en `/admin/leads`.  
     - Copys coherentes en español e inglés.  
     - Build de producción sin errores.
