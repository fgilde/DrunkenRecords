import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  suffix?: string
  duration?: number
  className?: string
}

// Count-Up-Animation, die startet, sobald das Element sichtbar wird, und
// sauber neu animiert, falls sich der Zielwert ändert (z. B. Fallback -> Live).
export default function CountUp({ value, suffix = '', duration = 1700, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)
  const displayRef = useRef(0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const from = displayRef.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      displayRef.current = value
      setDisplay(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const cur = Math.round(from + (value - from) * eased)
      displayRef.current = cur
      setDisplay(cur)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <div ref={ref} className={className}>
      {display}
      {suffix}
    </div>
  )
}
