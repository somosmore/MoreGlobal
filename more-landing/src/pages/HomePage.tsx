import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import PainPoints from "@/components/sections/PainPoints";
import WhoWeHelp from "@/components/sections/WhoWeHelp";
import Quiz from "@/components/sections/Quiz";
import Pricing from "@/components/sections/Pricing";
import Success from "@/components/sections/Success";
import VipSession from "@/components/sections/VipSession";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Quiz />
      <PainPoints />
      <WhoWeHelp />
      <Success />
      <VipSession />
      <Pricing />
      <Footer />
    </div>
  );
}
