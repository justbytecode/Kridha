"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function BackgroundAnimation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Shopping-related icons
    const icons = [
      { char: "👕", size: 20 },
      { char: "👗", size: 20 },
      { char: "👟", size: 20 },
      { char: "👜", size: 20 },
      { char: "🧢", size: 20 },
      { char: "👓", size: 20 },
      { char: "🧣", size: 20 },
      { char: "🧦", size: 20 },
    ]

    // Particles
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.speed = 0.2 + Math.random() * 0.3
        const iconIndex = Math.floor(Math.random() * icons.length)
        this.icon = icons[iconIndex].char
        this.size = icons[iconIndex].size
        this.opacity = 0.1 + Math.random() * 0.2
        this.rotation = Math.random() * 360
        this.rotationSpeed = -0.5 + Math.random()
      }

      update() {
        this.y += this.speed
        this.rotation += this.rotationSpeed

        if (this.y > canvas.height) {
          this.y = -this.size
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.globalAlpha = this.opacity
        ctx.font = `${this.size}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.icon, 0, 0)
        ctx.restore()
      }
    }

    // Create particles
    const particleCount = Math.min(30, Math.floor(window.innerWidth / 50))
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      gradient.addColorStop(1, "rgba(20, 0, 40, 0.2)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-purple-950/20 opacity-90" />

      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,_50,_255,_0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(120,_50,_255,_0.05)_1px,_transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Animated circles */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-[500px] h-[500px] rounded-full border border-purple-500/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="w-[700px] h-[700px] rounded-full border border-pink-500/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      {/* Shopping icons animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
