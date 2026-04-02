"use client"

import { motion } from "framer-motion"
import React from "react"

export function LetterReveal({ 
  text, 
  className = "",
  delay = 0 
}: { 
  text: string, 
  className?: string,
  delay?: number
}) {
  const letters = Array.from(text)

  const container = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i + delay },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      } as const,
    },
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(4px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      } as const,
    },
  }

  return (
    <motion.h1
      className={`heading-prestige ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  )
}
