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
  private filter?: BiquadFilterNode
  private echoSend?: GainNode
  private master?: GainNode
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
        // Kette: Deck → Filter → Master (+ Echo-Send mit Feedback) → Lautsprecher
        const filter = (this.filter = new BiquadFilterNode(ctx, { type: 'allpass' }))
        const master = (this.master = new GainNode(ctx))
        const send = (this.echoSend = new GainNode(ctx, { gain: 0 }))
        const delay = new DelayNode(ctx, { delayTime: 0.375 })
        const feedback = new GainNode(ctx, { gain: 0.55 })
        node.connect(filter).connect(master).connect(ctx.destination)
        filter.connect(send).connect(delay).connect(feedback).connect(delay)
        delay.connect(master)
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
    return this.master
  }

  /** DJ-Filter: -1 = Lowpass zu, 0 = neutral, 1 = Highpass zu. */
  setFilter(v: number) {
    const f = this.filter
    if (!f) return
    if (Math.abs(v) < 0.03) {
      f.type = 'allpass'
      return
    }
    f.type = v < 0 ? 'lowpass' : 'highpass'
    f.frequency.value = v < 0 ? 20000 * 2 ** (v * 10) : 20 * 2 ** (v * 10)
    f.Q.value = 1 + Math.abs(v) * 6
  }

  /** Echo-Send auf/zu; der Nachhall läuft nach dem Loslassen über das Feedback aus. */
  echo(on: boolean) {
    this.echoSend?.gain.setTargetAtTime(on ? 0.8 : 0, this.ctx!.currentTime, 0.02)
  }

  /** Synthetisches Airhorn: gestapelte Sägezähne im klassischen „BAAP-BAP-BAP-BAAAP“-Rhythmus. */
  horn() {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const t0 = ctx.currentTime + 0.01
    const tone = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 2800, Q: 2 })
    const amp = new GainNode(ctx, { gain: 0 })
    tone.connect(amp).connect(this.master)
    const hits: [number, number][] = [[0, 0.16], [0.2, 0.1], [0.34, 0.1], [0.48, 0.55]]
    for (const [at, len] of hits) {
      amp.gain.setTargetAtTime(0.28, t0 + at, 0.008)
      amp.gain.setTargetAtTime(0, t0 + at + len, 0.02)
    }
    const end = t0 + 1.2
    for (const f of [466, 470, 700]) {
      const o = new OscillatorNode(ctx, { type: 'sawtooth', frequency: f })
      o.frequency.setValueAtTime(f, t0 + 0.7)
      o.frequency.linearRampToValueAtTime(f * 0.94, t0 + 1.05)
      o.connect(tone)
      o.start(t0)
      o.stop(end)
    }
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
