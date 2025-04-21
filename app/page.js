import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import PricingSection from "@/components/pricing-section"
import BackgroundAnimation from "@/components/background-animation"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection key="hero" />
          <FeaturesSection key="features" />
          <PricingSection key="pricing" />
        </main>
      </div>
    </div>
  )
}
