// Audio-Engine des Hero-Plattenspielers. Ein AudioWorklet liest den dekodierten Track mit
// frei wählbarer Geschwindigkeit ('rate', auch negativ) – das ergibt Scratchen, Anlaufen und
// Pitch beim Abbremsen wie bei echtem Vinyl. rate 1 = normale Wiedergabe, 0 = Stillstand.

const WORKLET = `
class Deck extends AudioWorkletProcessor {
  static get parameterDescriptors() { return [{ name: 'rate', defaultValue: 0 }] }
  constructor() {
    super()
    this.L = null; this.R = null; this.pos = 0; this.gen = 0; this.tick = 0
    this.port.onmessage = (e) => {
      const d = e.data
      if (d.L) { this.L = d.L; this.R = d.R; this.gen = d.gen }
      if (d.seek !== undefined) this.pos = d.seek * sampleRate
    }
  }
  process(_, outputs, params) {
    const oL = outputs[0][0], oR = outputs[0][1], r = params.rate, L = this.L, R = this.R
    if (!L) return true
    const n = L.length
    for (let i = 0; i < oL.length; i++) {
      const p = this.pos
      if (p >= 0 && p < n - 1) {
        const i0 = p | 0, f = p - i0
        oL[i] = L[i0] + (L[i0 + 1] - L[i0]) * f
        oR[i] = R[i0] + (R[i0 + 1] - R[i0]) * f
      } else { oL[i] = 0; oR[i] = 0 }
      this.pos = Math.max(0, p + (r.length > 1 ? r[i] : r[0]))
    }
    if (++this.tick % 8 === 0) this.port.postMessage({ gen: this.gen, pos: this.pos / sampleRate, ended: this.pos >= n - 1 })
    return true
  }
}
registerProcessor('dr-deck', Deck)
`

export class Deck {
  private ctx?: AudioContext
  private node?: AudioWorkletNode
  private ready?: Promise<void>
  private gen = 0
  onPosition: (sec: number, ended: boolean) => void = () => {}

  /** Erster Aufruf muss aus einer Nutzer-Geste kommen (Autoplay-Policy). */
  unlock(): Promise<void> {
    if (!this.ready) {
      const ctx = (this.ctx = new AudioContext())
      const url = URL.createObjectURL(new Blob([WORKLET], { type: 'text/javascript' }))
      this.ready = ctx.audioWorklet.addModule(url).then(() => {
        const node = (this.node = new AudioWorkletNode(ctx, 'dr-deck', { outputChannelCount: [2] }))
        node.port.onmessage = (e) => e.data.gen === this.gen && this.onPosition(e.data.pos, e.data.ended)
        node.connect(ctx.destination)
      })
    }
    void this.ctx!.resume()
    return this.ready
  }

  /** Lädt einen Track und springt auf `offset` Sekunden. false, wenn inzwischen ein anderer angefordert wurde. */
  async load(url: string, offset: number): Promise<boolean> {
    const gen = ++this.gen
    await this.unlock()
    const buf = await this.ctx!.decodeAudioData(await (await fetch(url)).arrayBuffer())
    if (gen !== this.gen) return false
    const L = buf.getChannelData(0).slice()
    const R = buf.getChannelData(buf.numberOfChannels > 1 ? 1 : 0).slice()
    this.node!.port.postMessage({ L, R, gen, seek: offset }, [L.buffer, R.buffer])
    return true
  }

  /** Ausgang für Analyzer; erst nach `unlock()` gesetzt. */
  get output(): AudioNode | undefined {
    return this.node
  }

  seek(sec: number) {
    this.node?.port.postMessage({ seek: sec })
  }

  setRate(rate: number) {
    if (this.node) this.node.parameters.get('rate')!.setTargetAtTime(rate, this.ctx!.currentTime, 0.01)
  }

  close() {
    void this.ctx?.close()
  }
}
