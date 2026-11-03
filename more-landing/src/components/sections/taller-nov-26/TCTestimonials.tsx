import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { supabase, type Testimonial } from "@/lib/supabase"

type Item = Pick<Testimonial, "id" | "name" | "role" | "country" | "quote">

/**
 * Testimonios reales del módulo Admin → Testimonios (los 3 primeros de texto,
 * por orden). Si no hay ninguno, la sección no se muestra.
 */
export default function TCTestimonials() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    if (!supabase) return
    supabase
      .from("testimonials")
      .select("id, name, role, country, quote")
      .eq("media_type", "text_photo")
      .neq("quote", "")
      .order("sort_order", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setItems(data as Item[])
      })
  }, [])

  if (items.length === 0) return null

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            Testimonios
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Lo que dicen quienes ya trabajaron con MORE
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {items.map((t, index) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex flex-col border-t-2 border-orange bg-paper p-6"
            >
              <Quote className="h-5 w-5 text-orange-dark" aria-hidden />
              <blockquote className="mt-4 line-clamp-6 flex-1 text-sm leading-relaxed text-navy-deep">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-bold text-navy-deep">{t.name}</span>
                {(t.role || t.country) && (
                  <span className="text-ink-muted">
                    {" "}· {[t.role, t.country].filter(Boolean).join(" · ")}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
