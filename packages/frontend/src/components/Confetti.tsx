import { useEffect, useRef } from 'react'
import styles from '../styles/confetti.module.css'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  angle: number
  angleSpeed: number
  life: number
}

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Confetti colors
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6ab04c', '#e056fd', '#686de0']
    
    // Create particles
    const particles: Particle[] = []
    const particleCount = 150

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.2,
        life: 1,
      })
    }

    // Animation loop
    let animationId: number
    const gravity = 0.1
    const friction = 0.99
    const fadeSpeed = 0.02

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Update physics
        particle.vy += gravity
        particle.vx *= friction
        particle.vy *= friction
        particle.x += particle.vx
        particle.y += particle.vy
        particle.angle += particle.angleSpeed
        particle.life -= fadeSpeed

        // Remove dead particles
        if (particle.life <= 0 || particle.y > canvas.height) {
          particles.splice(index, 1)
          return
        }

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.angle)
        ctx.globalAlpha = particle.life
        ctx.fillStyle = particle.color
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        ctx.restore()
      })

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.confettiCanvas} />
}