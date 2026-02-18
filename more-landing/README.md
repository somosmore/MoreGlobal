# MORE — Migración con Propósito

Landing page premium para **MORE**, consultora de inmigración especializada en visas **EB-2 NIW** (National Interest Waiver) para profesionales que buscan la Residencia Permanente en Estados Unidos.

## Vista General

Página web de alta conversión diseñada con estética minimalista y profesional. Incluye un quiz interactivo de elegibilidad, sección de precios con glassmorphism, carrusel de casos de éxito y FAQ con acordeones animados.

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** + **TypeScript** | Framework principal |
| **Vite 7** | Bundler y servidor de desarrollo |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Shadcn/UI** (Radix) | Componentes (Button, Card, Accordion, Progress) |
| **Lucide React** | Iconografía |
| **Framer Motion** | Animaciones de scroll reveal y transiciones |

## Estructura del Proyecto

```
more-landing/
├── public/                  # Assets estáticos (logos MORE)
├── src/
│   ├── components/
│   │   ├── sections/        # Secciones de la landing page
│   │   │   ├── Navbar.tsx       # Navegación con transparencia dinámica
│   │   │   ├── Hero.tsx         # Sección principal con CTAs
│   │   │   ├── PainPoints.tsx   # Tarjetas de problemas
│   │   │   ├── Quiz.tsx         # Quiz interactivo de elegibilidad
│   │   │   ├── Pricing.tsx      # Planes y precios
│   │   │   ├── Success.tsx      # Casos de éxito y perfil de Ivon
│   │   │   └── Footer.tsx       # FAQ, CTA final y pie de página
│   │   └── ui/              # Componentes base reutilizables
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── progress.tsx
│   ├── lib/
│   │   └── utils.ts         # Utilidad cn() para clases CSS
│   ├── App.tsx              # Composición de secciones
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Tema global y variables de color
├── index.html               # HTML base con fuente Inter
├── vite.config.ts           # Configuración Vite + Tailwind + alias @
├── tsconfig.app.json        # TypeScript con path aliases
└── package.json
```

## Paleta de Colores (Manual de Marca)

| Color | Hex | Uso |
|---|---|---|
| Navy oscuro | `#2A3A4A` | Textos principales, fondos oscuros |
| Navy claro | `#3A4D5E` | Gradientes, fondos secundarios |
| Naranja MORE | `#F37021` | Acento primario, CTAs, iconos |
| Naranja oscuro | `#D4611A` | Gradientes, hover states |
| Blanco | `#FFFFFF` | Fondos de sección |
| Gris suave | `#6B7280` | Textos secundarios |

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Sergio726/More-Webpage.git
cd More-Webpage/more-landing

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera el build de producción |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

## Secciones de la Landing Page

1. **Navbar** — Logo MORE con transparencia dinámica al hacer scroll
2. **Hero** — Headline principal, badge animado y doble CTA
3. **Pain Points** — 3 tarjetas con problemas comunes del proceso migratorio
4. **Quiz de Elegibilidad** — Formulario interactivo de 3 pasos con lógica condicional
5. **Precios** — Programa Unsung ($2,500 DIY) y Plan Plus ($8,000 Premium)
6. **Casos de Éxito** — Perfil de Ivon MORE + carrusel de testimonios
7. **FAQ** — 5 preguntas frecuentes con acordeones animados
8. **Footer** — Enlaces, contacto y CTA final hacia WhatsApp

## Despliegue

El build de producción se genera en la carpeta `dist/`:

```bash
npm run build
```

Compatible con cualquier hosting de archivos estáticos: **Vercel**, **Netlify**, **GitHub Pages**, **AWS S3**, etc.

## Licencia

Proyecto privado — MORE Immigration Consulting. Todos los derechos reservados.
