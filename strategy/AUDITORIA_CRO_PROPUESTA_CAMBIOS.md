# Auditoría CRO - Landing MORE (EB-2 NIW)

**Fecha:** Febrero 2026  
**Referencia:** MARKETING_OS.md, MOS Growth & CRO Framework  
**Objetivo:** Maximizar conversión, calificación de leads y progresión en el funnel.

---

## 1. EVALUACIÓN DEL FUNNEL Y ORDEN DE SECCIONES

| Sección actual | Etapa funnel | Problema | Impacto |
|----------------|--------------|----------|---------|
| Hero | Awareness/Consideración | OK | — |
| PainPoints | Consideración | OK | — |
| WhoWeHelp | Consideración | OK | — |
| **Quiz** | Calificación/Lead | **Demasiado abajo** | **Alto** |
| Pricing | Decisión | — | — |
| Success | Prueba social | **Debería ir antes de Pricing** | **Medio** |
| Footer (FAQ + CTA) | Objeción + Cierre | OK | — |

**Diagnóstico:** El Quiz es el motor de calificación; al estar después de 3 secciones largas, muchos usuarios salen antes. La prueba social (Success) debería reforzar la decisión de compra justo antes de ver precios.

**Propuesta de orden:** Hero → **Quiz** → PainPoints → WhoWeHelp → **Success** → Pricing → Footer.

---

## 2. RESUMEN DE FRICCIONES CRÍTICAS

| Fricción | Severidad | Acción requerida |
|----------|-----------|------------------|
| Quiz sin captura de lead | Crítica | Agregar captura de email/WhatsApp tras resultado |
| Mismatch Hero: "Blueprint" vs Quiz sin descarga | Alta | Definir oferta real o alinear copy |
| Orden Quiz/Success/Pricing | Media | Reordenar secciones en HomePage |
| CTAs genéricos ("Ver", "Siguiente") | Media | Reescribir con identidad en primera persona |
| Ausencia de risk reversal en Pricing | Alta | Incluir garantía visible |
| Ausencia de urgencia | Media | Agregar elementos de escasez o plazo |
| Costo de NO actuar ausente | Alta | Incluir en Hero y/o Pricing |

---

## 3. PROPUESTAS DE CAMBIO POR SECCIÓN

---

### 3.1 HERO – Cambios concretos

#### Problema detectado
- CTA principal dice "Descargar Blueprint 2026" pero enlaza al Quiz sin entregar descarga.
- CTA secundario "Ver Plan Plus" es pasivo.
- Falta contraste dolor/deseo (costo de no actuar).

#### Copy propuesto

| Elemento | Actual | Propuesto |
|----------|--------|-----------|
| CTA principal | Descargar Blueprint 2026 | **Evaluar si mi perfil califica** |
| CTA secundario | Ver Plan Plus | **Conocer mi camino sin patrocinador** |
| Línea de dolor (nueva) | — | **Cada año que esperas, miles de casos se aprueban. ¿El tuyo está listo?** |
| Subheadline (opcional) | Transformamos tu trayectoria… | Mantener o reforzar con: *"Sin oferta de empleo. Sin sponsor. Solo tu talento."* |

#### Código propuesto para Hero.tsx

```tsx
{/* CTAs - Líneas 58-76 */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.35 }}
  className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
>
  <Button size="lg" variant="gold" className="group" asChild>
    <a href="#quiz">
      Evaluar si mi perfil califica
      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </a>
  </Button>
  <Button size="lg" variant="secondary" className="group" asChild>
    <a href="#programas">
      <Play className="mr-2 h-4 w-4" />
      Conocer mi camino sin patrocinador
    </a>
  </Button>
</motion.div>

{/* Línea de dolor - NUEVO, insertar después de CTAs y antes de Trust indicators */}
<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.7, delay: 0.5 }}
  className="mt-6 text-sm text-gray-500 max-w-xl mx-auto italic"
>
  Cada año que esperas, miles de casos se aprueban. ¿El tuyo está listo?
</motion.p>
```

---

### 3.2 QUIZ – Cambios concretos

#### Problemas detectados
- Botones "Siguiente" y "Atrás" genéricos.
- Resultados sin CTA de identidad fuerte.
- Opción "Otros" en nivel académico puede generar falsos negativos (considerar copy alternativo).

#### Copy propuesto

| Elemento | Actual | Propuesto |
|----------|--------|-----------|
| Botón Siguiente (paso 1-2) | Siguiente | **Ver mi resultado** / **Continuar** |
| Botón Atrás | Atrás | **Atrás** (mantener, es estándar) |
| Opción "Otros" | Otros | **En proceso / Otra formación** (con subtítulo: "Te evaluamos en consulta") |
| CTA resultado Alto Impacto | Contactar por WhatsApp | **Sí, quiero agendar mi evaluación gratuita** |
| CTA resultado Unsung | Ver Programa Unsung | **Sí, quiero conocer el programa Unsung** |

#### Código propuesto para Quiz.tsx

**1. Opción "Otros" en academicOptions:**

```tsx
const academicOptions = [
  { id: "maestria", label: "Maestría", icon: GraduationCap },
  { id: "doctorado", label: "Doctorado / PhD", icon: GraduationCap },
  { id: "grado5", label: "Grado + 5 años experiencia", icon: Briefcase },
  { id: "otros", label: "En proceso / Otra formación", icon: BookOpen, sublabel: "Te evaluamos en consulta" },
];
```

**2. Botón Siguiente (líneas 303-310):**

```tsx
{quiz.step < totalSteps ? (
  <Button
    onClick={nextStep}
    disabled={!canProceed()}
    className="gap-2"
  >
    {quiz.step === 2 ? "Ver mi resultado" : "Continuar"}
    <ArrowRight className="w-4 h-4" />
  </Button>
) : (
  showResult && null
)}
```

**3. CTA resultado Alto Impacto (líneas 340-347):**

```tsx
<Button variant="gold" className="gap-2" asChild>
  <a
    href="https://wa.me/15483122105?text=Hola%20MORE,%20obtuve%20Perfil%20de%20Alto%20Impacto%20en%20el%20quiz.%20Quiero%20agendar%20mi%20evaluación%20gratuita."
    target="_blank"
    rel="noopener noreferrer"
  >
    <MessageCircle className="w-4 h-4" />
    Sí, quiero agendar mi evaluación gratuita
  </a>
</Button>
```

**4. CTA resultado Unsung (líneas 372-377):**

```tsx
<Button variant="gold" className="gap-2" asChild>
  <a href="#programas">
    <BookOpen className="w-4 h-4" />
    Sí, quiero conocer el programa Unsung
  </a>
</Button>
```

---

### 3.3 PRICING – Cambios concretos

#### Problemas detectados
- Typo "Calificacion" → "Calificación".
- Ausencia de risk reversal (garantía).
- Falta costo de no actuar.
- Rating "4.8" sin contexto de fuente.

#### Copy propuesto

| Elemento | Actual | Propuesto |
|----------|--------|-----------|
| ratingText UPP | Calificacion promedio de 150 profesionales | **Calificación promedio de 150 profesionales** (fix typo) |
| ratingText Plan Plus | Calificacion promedio de 175 profesionales | **Calificación promedio de 175 profesionales** (fix typo) |
| Risk reversal (nuevo) | — | **"Sesión exploratoria sin compromiso"** o **"Garantía de claridad: si no calificas, te lo decimos desde el inicio"** |
| Costo de no actuar (nuevo) | — | **"Cada año sin Green Card = años de incertidumbre y oportunidades perdidas."** |
| cta UPP | Si, quiero comenzar mi programa! | **Sí, quiero comenzar mi programa** (fix typo "Si" → "Sí") |
| cta Plan Plus | Si, quiero obtener mi Expediente! | **Sí, quiero obtener mi Expediente** (fix typo) |

#### Código propuesto para Pricing.tsx

**1. Agregar constantes para risk reversal y costo de no actuar (después de plans):**

```tsx
const RISK_REVERSAL = "Sesión exploratoria sin compromiso. Te decimos desde el inicio si calificas.";
const COST_OF_INACTION = "Cada año sin Green Card son años de incertidumbre y oportunidades perdidas.";
```

**2. Fix typos en plans (líneas 24, 46, 37, 66):**

```tsx
ratingText: "Calificación promedio de 150 profesionales",
// ...
ratingText: "Calificación promedio de 175 profesionales",
// ...
cta: "Sí, quiero comenzar mi programa",
// ...
cta: "Sí, quiero obtener mi Expediente",
```

**3. Agregar bloque de costo de no actuar antes del grid de planes (después del header, antes de Plans):**

```tsx
{/* Costo de no actuar - NUEVO */}
<motion.p
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="text-center text-gray-600 text-sm max-w-xl mx-auto mb-12 italic"
>
  {COST_OF_INACTION}
</motion.p>
```

**4. Agregar risk reversal badge en cada plan (dentro del card, después del Timeline y antes de Features):**

```tsx
{/* Risk Reversal - NUEVO, después de Timeline */}
<div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-green-50 border border-green-100">
  <Shield className="w-4 h-4 text-green-600 shrink-0" />
  <span className="text-xs text-green-800 font-medium">
    {RISK_REVERSAL}
  </span>
</div>
```

*Nota: Requiere importar `Shield` de lucide-react.*

---

## 4. CAMBIO DE ORDEN DE SECCIONES (HomePage.tsx)

#### Código propuesto

```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Quiz />        {/* Movido: antes estaba 5º, ahora 2º */}
      <PainPoints />
      <WhoWeHelp />
      <Success />     {/* Movido: antes estaba 6º, ahora 5º (antes de Pricing) */}
      <Pricing />
      <Footer />
    </div>
  );
}
```

---

## 5. CHECKLIST DE IMPLEMENTACIÓN

- [x] **Hero:** Cambiar CTAs + añadir línea de dolor
- [x] **Quiz:** Cambiar copy de botones y CTAs de resultado; opción "Otros"
- [x] **Quiz:** Captura de lead (nombre, email, WhatsApp) tras resultado
- [x] **Pricing:** Fix typos; añadir risk reversal; añadir costo de no actuar
- [x] **HomePage:** Reordenar secciones (Quiz arriba, Success antes de Pricing)
- [ ] **Futuro:** Definir si "Blueprint 2026" será PDF descargable y conectar con Quiz

---

## 6. REFERENCIAS

- `strategy/MARKETING_OS.md` – Framework de evaluación
- `.cursor/rules/MARKETING-OPERATING-SYSTEM-MOS-GROWTH-CRO-DEV-FRAMEWORK.mdc` – Directivas MOS
- Componentes: `more-landing/src/components/sections/Hero.tsx`, `Quiz.tsx`, `Pricing.tsx`
