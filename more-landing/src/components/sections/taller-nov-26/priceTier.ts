import { createContext, useContext } from "react"
import type { PriceTier } from "./tallerNov26Copy"

/**
 * Versión de precios de la landing del taller. La página la fija con
 * `<PriceTierContext.Provider value="comunidad">` (por defecto: público).
 * Los componentes combinan `usePriceTier()` con `getTicketPricing()`.
 */
export const PriceTierContext = createContext<PriceTier>("publico")

export const usePriceTier = (): PriceTier => useContext(PriceTierContext)
