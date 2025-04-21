"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function AnimatedButton({ children, onClick, className = "" }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      className={`relative px-6 py-2.5 rounded-full font-medium text-white overflow-hidden group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
        animate={{
          background: isHovered
            ? "linear-gradient(to right, #9333ea, #ec4899, #9333ea)"
            : "linear-gradient(to right, #9333ea, #ec4899)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Moving border animation */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{
            backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
            repeatType: "reverse",
          }}
        />

        {/* Animated light effect */}
        <motion.div
          className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
          animate={{
            x: isHovered ? ["0%", "200%"] : "0%",
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
            ease: "linear",
          }}
        />
      </div>

      {/* Button text */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
