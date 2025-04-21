import Navbar from "@/components/navbar"
import BackgroundAnimation from "@/components/background-animation"
import WaitlistForm from "@/components/WaitlistForm"
import LiveWaitlist from "@/components/LiveWaitlist"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WaitlistPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <Link href="/">
                <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
                  ← Back to Home
                </Button>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Join the kridha Waitlist
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Be among the first to experience our revolutionary Virtual Try-On platform for your Shopify store. Early
                access members receive special pricing and dedicated support.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <WaitlistForm />
              <LiveWaitlist />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
