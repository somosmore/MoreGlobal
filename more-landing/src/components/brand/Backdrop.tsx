import { useId } from "react"
import { cn } from "@/lib/utils"

type BackdropProps = {
  /**
   * "hero": marco completo sobre papel. "section": solo la textura.
   * "footer": el mismo lenguaje de olas, invertido sobre navy para cerrar la página.
   */
  variant?: "hero" | "section" | "footer"
  className?: string
}

/**
 * Sistema gráfico MORE 2026: papel claro, olas navy/naranja, rutas punteadas
 * con avión y pines. Recreado en SVG para escalar sin peso de imagen.
 *
 * En secciones largas el viewBox se estiraría y deformaría el grano, así que
 * "section" usa un patrón a escala real en lugar del marco completo.
 *
 * Los ids de defs usan `useId` para que varias instancias en la misma página
 * (Hero + section + Footer) no colisionen.
 */
export const Backdrop = ({ variant = "hero", className }: BackdropProps) => {
  const uid = useId().replace(/:/g, "")

  if (variant === "footer") {
    const waveNavy = `footer-wave-navy-${uid}`
    const waveOrange = `footer-wave-orange-${uid}`

    return (
      <div
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        aria-hidden="true"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 420"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={waveNavy} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#4A6D96" />
              <stop offset="100%" stopColor="#2A3A4A" />
            </linearGradient>
            <linearGradient id={waveOrange} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0561A" />
              <stop offset="100%" stopColor="#FF9052" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="1440" height="420" fill="#1B2B44" />

          <path
            d="M0 0 C 140 30 250 96 340 180 C 396 232 430 300 448 420 L0 420 Z"
            fill={`url(#${waveNavy})`}
            opacity="0.35"
          />
          <path
            d="M0 0 C 96 24 176 78 240 146 C 288 198 316 268 330 420 L0 420 Z"
            fill="#16243D"
            opacity="0.55"
          />
          <path
            d="M1440 0 C 1310 34 1204 106 1130 196 C 1074 264 1044 336 1032 420 L1440 420 Z"
            fill={`url(#${waveOrange})`}
            opacity="0.22"
          />
          <path
            d="M1440 60 C 1350 90 1276 154 1220 232 C 1180 288 1160 350 1152 420 L1440 420 Z"
            fill="#D4611A"
            opacity="0.28"
          />

          <g fill="none" stroke="#8AA4C1" strokeWidth="1" opacity="0.18">
            <path d="M0 40 C 160 66 286 146 380 244 C 448 314 486 366 504 420" />
            <path d="M0 74 C 172 100 306 184 404 286 C 470 354 508 386 524 420" />
          </g>

          <path
            d="M300 120 C 520 40 780 190 1040 96 C 1140 60 1200 96 1280 70"
            fill="none"
            stroke="#F37021"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 10"
            opacity="0.5"
          />
          <g transform="translate(1268 46) rotate(-20) scale(1.4)" fill="#F37021" opacity="0.85">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </g>
        </svg>
      </div>
    )
  }

  if (variant === "section") {
    const dots = `vip-dots-flat-${uid}`
    const fade = `vip-section-fade-${uid}`
    const mask = `vip-section-mask-${uid}`

    return (
      <div
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        aria-hidden="true"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={dots} width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="#2A3A4A" />
            </pattern>
            <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
            </linearGradient>
            <mask id={mask}>
              <rect x="0" y="0" width="100%" height="100%" fill={`url(#${fade})`} />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${dots})`}
            mask={`url(#${mask})`}
          />
        </svg>
      </div>
    )
  }

  const paper = `vip-paper-${uid}`
  const waveNavy = `vip-wave-navy-${uid}`
  const waveNavySoft = `vip-wave-navy-soft-${uid}`
  const waveOrange = `vip-wave-orange-${uid}`
  const waveOrangeSoft = `vip-wave-orange-soft-${uid}`
  const dots = `vip-dots-${uid}`
  const dotsMask = `vip-dots-mask-${uid}`
  const dotsFade = `vip-dots-fade-${uid}`

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 810"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={paper} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F6F7F9" />
            <stop offset="100%" stopColor="#FDF8F4" />
          </linearGradient>

          <linearGradient id={waveNavy} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A6D96" />
            <stop offset="100%" stopColor="#1B2B44" />
          </linearGradient>
          <linearGradient id={waveNavySoft} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C3D2E2" />
            <stop offset="100%" stopColor="#8AA4C1" />
          </linearGradient>

          <linearGradient id={waveOrange} x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E0561A" />
            <stop offset="100%" stopColor="#FF9052" />
          </linearGradient>
          <linearGradient id={waveOrangeSoft} x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FFC9A6" />
            <stop offset="100%" stopColor="#FFE4D2" />
          </linearGradient>

          <pattern id={dots} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#2A3A4A" />
          </pattern>
          <radialGradient id={dotsMask} cx="0.5" cy="0.35" r="0.6">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <mask id={dotsFade}>
            <rect x="0" y="0" width="1440" height="560" fill={`url(#${dotsMask})`} />
          </mask>
        </defs>

        <rect x="0" y="0" width="1440" height="810" fill={`url(#${paper})`} />

        <g mask={`url(#${dotsFade})`} opacity="0.16">
          <rect x="0" y="0" width="1440" height="560" fill={`url(#${dots})`} />
        </g>

        <g>
          <path
            d="M0 470 C 130 452 236 528 330 612 C 404 678 452 748 476 810 L0 810 Z"
            fill={`url(#${waveNavySoft})`}
            opacity="0.5"
          />
          <path
            d="M0 566 C 108 552 206 618 288 692 C 344 742 380 778 396 810 L0 810 Z"
            fill={`url(#${waveNavy})`}
            opacity="0.9"
          />
          <path
            d="M0 664 C 84 656 158 704 220 762 C 246 786 264 800 274 810 L0 810 Z"
            fill="#16243D"
            opacity="0.85"
          />
          <g fill="none" stroke="#5C7EA6" strokeWidth="1" opacity="0.35">
            <path d="M0 430 C 140 410 254 492 352 580 C 430 650 480 730 504 810" />
            <path d="M0 404 C 148 382 268 470 370 562 C 452 636 504 722 528 810" />
            <path d="M0 378 C 156 354 282 448 388 544 C 474 622 528 714 552 810" />
            <path d="M0 352 C 164 326 296 426 406 526 C 496 608 552 706 576 810" />
          </g>
        </g>

        <g>
          <path
            d="M1440 396 C 1320 424 1226 512 1150 606 C 1090 680 1052 754 1036 810 L1440 810 Z"
            fill={`url(#${waveOrangeSoft})`}
            opacity="0.75"
          />
          <path
            d="M1440 512 C 1344 536 1268 610 1206 692 C 1170 740 1148 782 1138 810 L1440 810 Z"
            fill={`url(#${waveOrange})`}
            opacity="0.92"
          />
          <path
            d="M1440 640 C 1372 656 1318 704 1278 762 C 1262 786 1252 800 1246 810 L1440 810 Z"
            fill="#D4611A"
            opacity="0.9"
          />
          <g fill="none" stroke="#F79B67" strokeWidth="1" opacity="0.4">
            <path d="M1440 356 C 1310 386 1206 480 1124 582 C 1058 662 1018 748 1000 810" />
            <path d="M1440 330 C 1300 362 1190 462 1104 568 C 1034 652 992 742 974 810" />
            <path d="M1440 304 C 1290 338 1174 444 1084 554 C 1010 642 966 736 948 810" />
          </g>
        </g>

        <g>
          <path
            d="M40 96 C 150 40 246 122 360 92 C 452 68 508 128 596 108"
            fill="none"
            stroke="#2A3A4A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 10"
            opacity="0.45"
          />
          <path
            d="M1400 232 C 1330 168 1250 218 1196 158 C 1156 114 1120 74 1058 62"
            fill="none"
            stroke="#F37021"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 10"
            opacity="0.5"
          />
          <path
            d="M1352 268 C 1382 360 1330 452 1284 540 C 1258 592 1246 616 1244 640"
            fill="none"
            stroke="#F37021"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 10"
            opacity="0.4"
          />

          <g transform="translate(1330 176) rotate(-28) scale(1.5)" fill="#F37021" opacity="0.9">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </g>

          <g transform="translate(24 60) scale(1.4)" opacity="0.75">
            <path
              d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
              fill="#2A3A4A"
            />
            <circle cx="12" cy="10" r="3" fill="#FFFFFF" />
          </g>

          <g transform="translate(1228 632) scale(1.6)" opacity="0.9">
            <path
              d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
              fill="#F37021"
            />
            <circle cx="12" cy="10" r="3" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  )
}
