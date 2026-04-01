import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Tailwind v4 ahora se procesa via PostCSS (postcss.config.mjs)
// junto con postcss-preset-env que convierte oklch() a rgba()
// para compatibilidad con Safari/iOS < 15.4 (iPads más antiguos)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        vip: path.resolve(__dirname, 'vip.html'),
      },
    },
  },
})
