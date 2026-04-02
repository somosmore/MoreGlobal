# Plan de mejora — página Asesoría VIP (`/asesoria-vip`)

> Fecha: 2026-04-02  
> Objetivo: alinear copy, jerarquía visual, coherencia de componentes y reducir fricción cognitiva sin perder tono premium.

---

## 1. Diagnóstico rápido (estado actual)

### 1.1 Texto y claridad

| Área | Observación |
|------|-------------|
| **Tecnicismos** | “EB‑2 NIW”, “USCIS”, “RFE”, “Interés Nacional” son correctos para el público objetivo pero conviene **una línea en lenguaje simple** la primera vez (p. ej. “visa por méritos / sin patrocinador” junto a EB‑2 NIW). |
| **Redundancias** | “1 a 1”, “privada”, “solo vos” y “60 min” se repiten entre hero, tarjeta de precio y pricing. **Mantener una frase fuerte arriba** y abajo solo datos (precio + CTA). |
| **Claims sensibles** | “92% aprobaciones” y métricas agregadas + “N personas viendo” (número aleatorio) pueden generar **desconfianza legal/ética**. Recomendación: acotar claim con pie de metodología o sustituir por casos reales anonimizados; para “viendo”, valor fijo bandeado o texto menos literal (“Alta actividad en esta página”). |
| **Tono** | Mezcla voseo (“aplicás”, “venís”) con estructuras neutras. **Unificar** voseo (LATAM) o tutear según marca. |
| **H1** | “Máximo Estándar de Precisión” es abstracto; opción CRO: subencabezado que traduzca a beneficio (“decisión con datos, no con intuición”). |

### 1.2 Homogeneidad visual

| Elemento | Observación |
|----------|-------------|
| **Cards** | Hero (oferta grande), `VipSessionIncluded` (contenedor crema + grid), `VipSocialProof` (bloque navy), `VipValue` / `VipAbout` / `VipPricing` (blanco + ring): **radios y sombras distintos** (`rounded-2xl` vs `rounded-3xl`, sombras fuertes vs suaves). |
| **Eyebrows** | Algunos usan `text-orange`, otros `text-gray-400`, otros `uppercase` distinto. **Definir 2 niveles**: etiqueta de sección (navy/gris) vs acento (orange). |
| **Fotografía** | `ivon.png` en tarjeta compuesta en `VipAboutIvon` con badges y texto pequeño; jerarquía densa. Opción: **foto más limpia** (menos capas) o ratio fijo en todo el sitio. |
| **Texto sobre “foto”** | No hay texto superpuesto directo sobre la imagen; sí mucho texto alrededor en tamaños 11px–13px → en móvil puede sentirse **apiñado**. Subir tamaño mínimo a 14px donde sea cuerpo legible. |
| **CTAs** | `VipCtaButton` (estilo actual) vs panel naranja clicable en hero: coherente en destino; revisar **misma etiqueta** (“Aplicar ahora” vs microcopy de identidad en otras secciones). |
| **Página contenedora** | `VipSessionPage`: bloque único `bg-white` largo → **poco contraste** entre secciones; el plan editorial previo (alternar `#FAFAFA` / blanco / slate en “para quién”) quedó **sin aplicar** en esta rama; `VipFitSection` es lista simple blanca, no tabs oscuros. |

---

## 2. Plan de implementación por fases

### Fase A — Copy y honestidad (1–2 días)

1. **Glosario mínimo**: primer mención de EB‑2 NIW con explicación de una línea; “RFE” → “pedido extra de pruebas (RFE)”.
2. **Unificar voseo** en todo `/asesoria-vip`.
3. **Recortar repeticiones**: tabla “decir una vez” vs “repetir en pricing”.
4. **Revisión legal/compliance** de porcentajes, testimonios implícitos y mensaje de “actividad en vivo” (evitar claim verificable falso).

### Fase B — Sistema visual VIP (2–3 días)

1. **Tokens**: definir en un solo sitio (o comentario en CSS) `radius-card`, `shadow-card`, `padding-section` para hero, pilares, pricing y about.
2. **Alternancia de fondos** en `VipSessionPage` (blanco / `#FAFAFA`) + **corte oscuro** solo en bloque “para quién” si se recupera diseño con tabs.
3. **Tipografía**: confirmar matriz serif/sans en todas las `h2` VIP y `font-sans` en cuerpos ≥14px.

### Fase C — Componentes pendientes o degradados

1. **`VipFitSection`**: restaurar o rediseñar **tabs** (perfiles) + fondo `slate-950` si sigue la línea editorial.
2. **Pilares**: valorar vuelta a **layout bento** o unificar el grid actual con el mismo contenedor que hero (menos “otro mundo visual”).
3. **`VipScrollProgress`**: opcional; si se implementa, solo en esta ruta.

### Fase D — CRO y accesibilidad

1. Contraste AA en bloque naranja y en `VipFit` oscuro (si aplica).
2. **Orden de lectura** en móvil: precio → entregables → CTA → urgencia social.
3. Prueba Lighthouse / axe en `/asesoria-vip`.

---

## 3. Criterios de “hecho”

- [ ] Ningún término clave sin contexto en la primera aparición.
- [ ] Radios/sombras/espaciados alineados en ≥80% de las cards.
- [ ] Urgencia social alineada con política de marca (sin cifras engañosas).
- [ ] Una sola voz (voseo o tú) en toda la página.

---

## 4. Notas técnicas (ya aplicadas en esta iteración)

- Brillo en panel de precio: **una sola** barra animada (`vip-price-card-shine::after`).
- Eliminado eyebrow duplicado del hero (“Asesoría VIP 1 a 1 · …”).
- Bloque “personas viendo”: **mayor tamaño** y jerarquía para énfasis; revisar texto de soporte en Fase A si se ajusta el claim.
