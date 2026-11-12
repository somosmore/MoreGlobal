import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { ChatMessage } from "./salaMessages"

/**
 * Burbujas de chat que aparecen de a una mientras corre el reloj, con mensajes
 * reales de públicos anteriores de MORE. Capa decorativa (`aria-hidden`).
 */

const MAX_VISIBLE = 4
const FIRST_DELAY_MS = 600
const MIN_DELAY_MS = 2200
const EXTRA_DELAY_MS = 1600
const LIFETIME_MS = 6400

type Bubble = ChatMessage & { id: number }

const initials = (name: string) => {
  const parts = name.replace(/·/g, " ").trim().split(/\s+/).filter(Boolean)
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
}

export function ChatBubbles({ messages }: { messages: ChatMessage[] }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const nextId = useRef(0)
  const lastIndex = useRef(-1)

  useEffect(() => {
    if (messages.length === 0) return
    const timers = new Set<ReturnType<typeof setTimeout>>()

    const pick = () => {
      if (messages.length === 1) return messages[0]
      let index = lastIndex.current
      while (index === lastIndex.current) index = Math.floor(Math.random() * messages.length)
      lastIndex.current = index
      return messages[index]
    }

    const spawn = () => {
      const id = nextId.current++
      setBubbles((current) => [...current, { ...pick(), id }].slice(-MAX_VISIBLE))
      timers.add(setTimeout(() => setBubbles((current) => current.filter((b) => b.id !== id)), LIFETIME_MS))
      timers.add(setTimeout(spawn, MIN_DELAY_MS + Math.random() * EXTRA_DELAY_MS))
    }

    timers.add(setTimeout(spawn, FIRST_DELAY_MS))
    return () => {
      for (const timer of timers) clearTimeout(timer)
    }
  }, [messages])

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-4 left-4 z-20 hidden w-[min(22rem,28vw)] flex-col gap-2 sm:flex">
      <AnimatePresence initial={false}>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            layout
            initial={{ opacity: 0, x: -24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-sm"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange text-[11px] font-bold text-white">
              {initials(bubble.name)}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold text-white">{bubble.name}</span>
              <span className="text-xs leading-snug text-white/65">{bubble.text}</span>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
