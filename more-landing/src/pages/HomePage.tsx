import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "@/components/sections/Navbar"
import Hero from "@/components/sections/Hero"
import PainPoints from "@/components/sections/PainPoints"
import WhoWeHelp from "@/components/sections/WhoWeHelp"
import Quiz from "@/components/sections/Quiz"
import Pricing from "@/components/sections/Pricing"
import Success from "@/components/sections/Success"
import VipSession from "@/components/sections/VipSession"
import Footer from "@/components/sections/Footer"

export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== "/") return
    const raw = location.hash.replace(/^#/, "")
    if (!raw) return
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(raw)?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    return () => window.cancelAnimationFrame(frameId)
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PainPoints />
      <WhoWeHelp />
      <Quiz />
      <Success />
      <VipSession />
      <Pricing />
      <Footer />
    </div>
  );
}
