"use client"

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

  return (
    <h1 className={`heading-prestige ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block animate-char-reveal opacity-0"
          style={{ 
            animationDelay: `${(index * 0.05) + delay}s`
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </h1>
  )
}
