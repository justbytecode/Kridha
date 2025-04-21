"use client"

import { motion } from "framer-motion"

export default function LogoAnimation() {
  return (
    <motion.div className="relative w-10 h-10 flex items-center justify-center" whileHover={{ scale: 1.1 }}>
      {/* Outer ring */}
      <motion.div
        className="absolute w-10 h-10 border-2 border-purple-500 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
          borderColor: ["#8B5CF6", "#EC4899", "#8B5CF6"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute w-7 h-7 border border-pink-500 rounded-full opacity-80"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 0.2, 0.8],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 0.5,
        }}
      />

      {/* Inner circle */}
      <motion.div
        className="absolute w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"
        animate={{
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Virtual try-on elements */}
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {/* Glasses element */}
        <motion.div
          className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          animate={{
            opacity: [0.7, 1, 0.7],
            width: ["60%", "50%", "60%"],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />

        {/* Shirt element */}
        <motion.div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-md"
          animate={{
            opacity: [0.7, 1, 0.7],
            width: ["40%", "30%", "40%"],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
        />
      </motion.div>

      {/* Scanning effect */}
      <motion.div
        className="absolute inset-0 border-2 border-transparent rounded-full overflow-hidden"
        style={{ borderRadius: "50%" }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-500/30 to-transparent"
          animate={{ y: ["-100%", "200%", "-100%"] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
