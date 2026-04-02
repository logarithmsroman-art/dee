"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.8,
  direction = "up",
  className
}: { 
  children: ReactNode, 
  delay?: number,
  duration?: number,
  direction?: "up" | "down" | "left" | "right" | "none",
  className?: string
}) {
  const directionOffset = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 }
  }

  const initialOffset = directionOffset[direction]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Custom easing for premium feel
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollReveal({ 
  children, 
  delay = 0,
  className
}: { 
  children: ReactNode, 
  delay?: number,
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      {children}
    </motion.div>
  )
}
