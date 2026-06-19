import { useEffect } from 'react'

// Portiert die imperativen Effekte aus dem ursprünglichen Design:
// Cursor-Glow, Blob-Parallax, Scroll-Progress-Bar, Nav-Hintergrund bei Scroll
// und die Scroll-Reveals (.dr-reveal -> .is-visible).
export function useDrunkenFx(): void {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.dr-root')
    if (!root) return

    const glow = document.querySelector<HTMLElement>('.dr-glow')
    const nav = document.querySelector<HTMLElement>('.dr-nav')
    const progress = document.querySelector<HTMLElement>('.dr-progress')
    const blobs = Array.from(root.querySelectorAll<HTMLElement>('[data-blob]'))
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('.dr-reveal'))

    // --- Scroll-Reveals ---
    const reveal = (el: Element) => el.classList.add('is-visible')
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target)
              io?.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      reveals.forEach((el) => io?.observe(el))
    } else {
      reveals.forEach(reveal)
    }
    const fallbackReveal = window.setTimeout(() => reveals.forEach(reveal), 3000)

    // --- Cursor-Glow + Blob-Parallax ---
    const onMove = (ev: MouseEvent) => {
      if (glow) {
        glow.style.left = `${ev.clientX}px`
        glow.style.top = `${ev.clientY}px`
      }
      const bx = ev.clientX / window.innerWidth - 0.5
      const by = ev.clientY / window.innerHeight - 0.5
      blobs.forEach((b, i) => {
        const f = (i + 1) * 16
        b.style.transform = `translate(${bx * f}px, ${by * f}px)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // --- Nav-Hintergrund + Scroll-Progress ---
    const onScroll = () => {
      const scrolled = window.scrollY > 40
      if (nav) {
        nav.style.background = scrolled ? 'rgba(10,10,11,.82)' : 'transparent'
        nav.style.setProperty('backdrop-filter', scrolled ? 'blur(14px)' : 'none')
        nav.style.setProperty('-webkit-backdrop-filter', scrolled ? 'blur(14px)' : 'none')
        nav.style.borderColor = scrolled ? 'rgba(255,255,255,.08)' : 'transparent'
      }
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight
        const p = h > 0 ? window.scrollY / h : 0
        progress.style.transform = `scaleX(${p})`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
      window.clearTimeout(fallbackReveal)
    }
  }, [])
}
