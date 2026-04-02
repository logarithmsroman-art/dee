"use client"

import React, { useRef, useEffect } from "react"

export function InkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width: number
    let height: number
    let particles: Particle[] = []
    
    // Performance: Fewer particles on mobile
    const getParticleCount = () => (window.innerWidth < 768 ? 20 : 45)

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      angle: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 150 + 50
        this.speedX = (Math.random() - 0.5) * 0.15
        this.speedY = (Math.random() - 0.5) * 0.15
        this.opacity = Math.random() * 0.04
        this.angle = Math.random() * 360
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.angle += 0.005

        if (this.x > width + 100) this.x = -100
        if (this.x < -100) this.x = width + 100
        if (this.y > height + 100) this.y = -100
        if (this.y < -100) this.y = height + 100
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size)
        gradient.addColorStop(0, `rgba(26, 26, 29, ${this.opacity})`)
        gradient.addColorStop(1, "rgba(26, 26, 29, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1
      width = canvas.width = window.innerWidth * dpr
      height = canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      
      particles = []
      const count = getParticleCount()
      for (let i = 0; i < count; i++) {
        particles.push(new Particle())
      }
    }

    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.update()
        p.draw()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      init()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-none opacity-40"
    />
  )
}
