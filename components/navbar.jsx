"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import AnimatedButton from "./animated-button"
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import LogoAnimation from "./logo-animation"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isWaitlistPage = pathname === "/waitlist"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <LogoAnimation />
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            kridha
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#pricing">Pricing</NavLink>
          <NavLink href="/#how-it-works">How It Works</NavLink>
        </div>

        <div className="hidden md:block">
          {!isWaitlistPage ? (
            <Link href="/waitlist">
              <AnimatedButton>Join the waitlist</AnimatedButton>
            </Link>
          ) : (
            <Link href="/">
              <AnimatedButton>Back to Home</AnimatedButton>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          {!isWaitlistPage ? (
            <Link href="/waitlist">
              <AnimatedButton className="!px-4 !py-1.5 text-sm">Join</AnimatedButton>
            </Link>
          ) : (
            <Link href="/">
              <AnimatedButton className="!px-4 !py-1.5 text-sm">Home</AnimatedButton>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
              <MobileNavLink href="/#features" onClick={() => setMobileMenuOpen(false)}>
                Features
              </MobileNavLink>
              <MobileNavLink href="/#pricing" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </MobileNavLink>
              <MobileNavLink href="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="relative text-gray-300 hover:text-white transition-colors duration-300 group">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      className="block py-2 text-gray-300 hover:text-white transition-colors duration-300 border-b border-gray-800"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
