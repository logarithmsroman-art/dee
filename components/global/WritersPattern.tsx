"use client"

import React from 'react'
import { motion } from 'framer-motion'

const icons = [
  // Fountain Pen SVG
  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" key="pen" />,
  // Open Book SVG
  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" key="book1" />,
  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" key="book2" />,
  // Quill SVG
  <path d="m3 21 1.9-1.9a11 11 0 0 0 .1-15.5c-4.3 4.3-4.3 11.3 0 15.6l-1.9 1.9z" key="quill1" />,
  <path d="M9.5 14.5c.3-1.6 1.4-3 2.9-3.7.4-.2.9-.3 1.4-.2.8.1 1.6.4 2.3.8 1 .5 2.1 1.1 3.2 1.4.3.1.6.2.9.2.4 0 .9-.2 1.3-.4 1.4-1.2 2-2.9 2-4.6v-.7C21 6 18.5 5 16 5c-3.1 0-6 1.5-8 3" key="quill2" />
]

export function WritersPattern() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-[0.03]">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-24 p-12">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-16 h-16 text-slate-900"
            animate={{
              y: [0, -20, 0],
              rotate: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          >
            {icons[i % icons.length]}
          </motion.svg>
        ))}
      </div>
    </div>
  )
}
