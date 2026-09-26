import AudioMotionAnalyzer from 'audiomotion-analyzer'
import type { BandKey } from '../data/bands'

// Audio-Visualisierung für den Hero: breite Spektrum-Balken hinter dem ganzen Header
// plus ein radialer Ring um die Platte. Farbverlauf je Band.

const GRADIENTS: Record<BandKey, string[]> = {
  eyirish: ['#d4ff3a', '#2bd9a0', '#0f5c4a'],
  null5er: ['#ffc23d', '#ff5a3d', '#7a1f3d'],
  papibaras: ['#3de0ff', '#6a7bff', '#c93dff'],
}

const COMMON = {
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
} as const

export interface HeroViz {
  setBand(band: BandKey): void
  setActive(on: boolean): void
}

export function createHeroViz(source: AudioNode, bars: HTMLElement, ring: HTMLElement): HeroViz {
  const all = [
    new AudioMotionAnalyzer(bars, { ...COMMON, source, mode: 3, barSpace: 0.3 }),
    new AudioMotionAnalyzer(ring, {
      ...COMMON,
      source,
      mode: 4,
      barSpace: 0.35,
      radial: true,
      radius: 0.7,
      spinSpeed: 2,
    }),
  ]
  for (const [band, stops] of Object.entries(GRADIENTS))
    for (const a of all) a.registerGradient(band, { bgColor: 'transparent', colorStops: stops })

  let stopTimer = 0
  return {
    setBand: (band) => all.forEach((a) => (a.gradient = band)),
    setActive(on) {
      window.clearTimeout(stopTimer)
      bars.classList.toggle('is-on', on)
      ring.classList.toggle('is-on', on)
      // Erst nach dem Ausblenden anhalten, damit die Balken sichtbar abklingen.
      if (on) all.forEach((a) => !a.isOn && a.start())
      else stopTimer = window.setTimeout(() => all.forEach((a) => a.stop()), 1200)
    },
  }
}
