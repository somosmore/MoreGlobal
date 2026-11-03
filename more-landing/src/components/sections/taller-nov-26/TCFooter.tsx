export default function TCFooter() {
  return (
    <footer className="bg-navy-deep border-t border-white/10 px-4 py-8 text-center">
      <p className="text-sm text-white/70">MORE — Migración con Propósito</p>
      <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-white/50">
        La información de este taller es de carácter educativo y no constituye asesoría legal
        ni garantía de resultados migratorios.
      </p>
      <p className="mt-3 text-xs text-white/40">
        © {new Date().getFullYear()} MORE. Todos los derechos reservados.
      </p>
    </footer>
  )
}
