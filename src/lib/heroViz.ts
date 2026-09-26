import AudioMotionAnalyzer, { type ConstructorOptions } from 'audiomotion-analyzer'
import type { BandKey } from '../data/bands'

// Audio-Visualisierung für den Hero: breite Spektrum-Balken hinter dem ganzen Header (Master)
// und ein radialer Ring um jede Platte (Kanalsignal). Farbverlauf je Band.

const GRADIENTS: Record<BandKey, string[]> = {
  eyirish: ['#d4ff3a', '#2bd9a0', '#0f5c4a'],
  null5er: ['#ffc23d', '#ff5a3d', '#7a1f3d'],
  papibaras: ['#3de0ff', '#6a7bff', '#c93dff'],
}

const COMMON: ConstructorOptions = {
  connectSpeakers: false,
  overlay: true,
  showBgColor: false,
  showScaleX: false,
  showPeaks: false,
  alphaBars: true,
  frequencyScale: 'log',
  smoothing: 0.72,
  minDecibels: -85,
  maxDecibels: -22,
  start: false,
}

export interface Viz {
  setBand(band: BandKey): void
  setActive(on: boolean): void
}

function create(el: HTMLElement, options: ConstructorOptions): Viz {
  const a = new AudioMotionAnalyzer(el, { ...COMMON, ...options })
  for (const [band, stops] of Object.entries(GRADIENTS))
    a.registerGradient(band, { bgColor: 'transparent', colorStops: stops })
  let stopTimer = 0
  return {
    setBand: (band) => (a.gradient = band),
    setActive(on) {
      window.clearTimeout(stopTimer)
      el.classList.toggle('is-on', on)
      // Erst nach dem Ausblenden anhalten, damit die Balken sichtbar abklingen.
      if (on) !a.isOn && a.start()
      else stopTimer = window.setTimeout(() => a.stop(), 1200)
    },
  }
}

export const createBars = (source: AudioNode, el: HTMLElement) =>
  create(el, { source, mode: 3, barSpace: 0.3 })

export const createRing = (source: AudioNode, el: HTMLElement) =>
  create(el, { source, mode: 4, barSpace: 0.35, radial: true, radius: 0.7, spinSpeed: 2 })
