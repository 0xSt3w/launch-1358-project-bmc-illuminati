import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/motion'

const GLYPHS = '01アイウエオカキクケコサシスセソ∆ΣΩΞΨ0123456789ABCDEF'

/**
 * Falling green code plus a few floating particles on one canvas.
 * Purely decorative: `aria-hidden`, `pointer-events: none` via `.bg-layer`,
 * paused when the tab is hidden and fully disabled under reduced motion.
 */
export function MatrixRain({ intensity = 0.4, dense = false }: { intensity?: number; dense?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let columns: number[] = []
    let particles: { x: number; y: number; r: number; vx: number; vy: number; c: string }[] = []
    const fontSize = dense ? 16 : 18
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.ceil(w / fontSize)
      columns = Array.from({ length: count }, () => Math.random() * -50)
      const pCount = Math.max(12, Math.floor(w / 60))
      particles = Array.from({ length: pCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.1 - Math.random() * 0.25,
        c: ['#00FF88', '#9B4DFF', '#00D4FF', '#D4AF37'][Math.floor(Math.random() * 4)],
      }))
    }

    let last = 0
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (t - last < 60) return
      last = t
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.fillStyle = 'rgba(5, 7, 11, 0.14)'
      ctx.fillRect(0, 0, w, h)
      ctx.font = `${fontSize}px ui-monospace, Menlo, monospace`
      for (let i = 0; i < columns.length; i++) {
        if (Math.random() > intensity) continue
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        const x = i * fontSize
        const y = columns[i] * fontSize
        ctx.fillStyle = Math.random() > 0.92 ? '#CFFFE8' : '#00FF88'
        ctx.globalAlpha = 0.55
        ctx.fillText(glyph, x, y)
        ctx.globalAlpha = 1
        if (y > h && Math.random() > 0.975) columns[i] = 0
        columns[i] += 1
      }
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -5) {
          p.y = h + 5
          p.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.fillStyle = p.c
        ctx.globalAlpha = 0.7
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(frame)
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced, intensity, dense])

  if (reduced) return null
  return <canvas ref={ref} aria-hidden="true" />
}
