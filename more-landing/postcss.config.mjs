import tailwindcss from "@tailwindcss/postcss"
import presetEnv from "postcss-preset-env"

export default {
  plugins: [
    tailwindcss(),
    presetEnv({
      // Genera fallbacks para colores oklch() en Safari < 15.4 e iOS < 15.4
      // Esto convierte los colores de la paleta de Tailwind v4 a rgba() compatible
      features: {
        "oklab-function": true,
      },
      browsers: "safari >= 14, ios_saf >= 14, > 0.5%, last 2 versions, Firefox ESR, not dead",
    }),
  ],
}
