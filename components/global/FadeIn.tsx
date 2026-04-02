"use client"

import { ReactNode, useEffect, useRef, useState } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number // Duration is now handled by CSS, but kept for interface compatibility
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up",
  className = ""
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  const animationClass = direction === "none" ? "animate-fade-in" : `animate-fade-in-${direction}`

  return (
    <div 
      className={`${className} ${isVisible ? animationClass : "opacity-0"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

export function ScrollReveal({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: ReactNode, 
  delay?: number,
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} reveal-hidden ${isVisible ? "reveal-visible" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
