import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Channel, EqBand, Engine } from '../lib/deck'

// Zwei-Kanal-Mischpult zwischen den Decks: EQ (Hi/Mid/Low bis Kill), Filter, Kanal-Fader mit
// VU-Meter, Crossfader, Master-FX Echo (halten) und Airhorn. Doppelklick setzt Regler zurück.

interface KnobProps {
  label: string
  onChange: (v: number) => void
}

/** Drehregler -1…1, Mitte = neutral. Ziehen hoch/runter, Pfeiltasten, Doppelklick = Mitte. */
function Knob({ label, onChange }: KnobProps) {
  const [v, setV] = useState(0)
  const drag = useRef<{ y: number; v: number } | null>(null)
  const set = (x: number) => {
    const c = Math.max(-1, Math.min(1, Math.abs(x) < 0.04 ? 0 : x))
    setV(c)
    onChange(c)
  }
  const onDown = (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { y: e.clientY, v }
  }
  const onMove = (e: PointerEvent) => {
    if (drag.current) set(drag.current.v + (drag.current.y - e.clientY) / 90)
  }
  const onKey = (e: KeyboardEvent) => {
    const d = { ArrowUp: 0.1, ArrowRight: 0.1, ArrowDown: -0.1, ArrowLeft: -0.1 }[e.key]
    if (d) (e.preventDefault(), set(v + d))
  }
  return (
    <div className="dr-knob-wrap">
      <div
        className="dr-knob"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={Math.round(v * 100) / 100}
        style={{ '--knob': `${v * 135}deg` } as React.CSSProperties}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onDoubleClick={() => set(0)}
        onKeyDown={onKey}
      />
      <span>{label}</span>
    </div>
  )
}

function Strip({ channel, name, meter }: { channel: Channel; name: string; meter: (el: HTMLElement | null) => void }) {
  const eq = (band: EqBand) => (v: number) => channel.setEq(band, v)
  return (
    <div className="dr-mixer-strip">
      <span className="dr-mixer-ch">{name}</span>
      <Knob label="Hi" onChange={eq('high')} />
      <Knob label="Mid" onChange={eq('mid')} />
      <Knob label="Low" onChange={eq('low')} />
      <Knob label="Filter" onChange={(v) => channel.setFilter(v)} />
      <div className="dr-mixer-faderbox">
        <div className="dr-mixer-vu">
          <div ref={meter} className="dr-mixer-vu-fill" />
        </div>
        <div className="dr-deck-fader dr-mixer-vfader">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            aria-label={`Lautstärke ${name}`}
            onInput={(e) => channel.setVolume(+e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  )
}

interface Props {
  engine: Engine
  active: boolean
  onClose: () => void
}

export default function DjMixer({ engine, active, onClose }: Props) {
  const meters = useRef<(HTMLElement | null)[]>([])

  // VU-Meter nur bei offenem Mischpult zeichnen.
  useEffect(() => {
    if (!active) return
    let raf = 0
    const tick = () => {
      engine.channels.forEach((c, i) => {
        const el = meters.current[i]
        if (el) el.style.transform = `scaleY(${c.level()})`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, engine])

  const echo = (on: boolean) => {
    void engine.unlock().then(() => engine.echo(on))
  }

  return (
    <div className="dr-mixer">
      <button className="dr-dj-toggle" onClick={onClose}>
        ✕ Mischpult schließen
      </button>
      <div className="dr-mixer-strips">
        {engine.channels.map((c, i) => (
          <Strip key={i} channel={c} name={i ? 'B' : 'A'} meter={(el) => (meters.current[i] = el)} />
        ))}
      </div>
      <label className="dr-deck-fader dr-mixer-xfader">
        <span>A ◂ Crossfader ▸ B</span>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          defaultValue={0}
          onInput={(e) => engine.setCrossfader(+e.currentTarget.value)}
          onDoubleClick={(e) => {
            e.currentTarget.value = '0'
            engine.setCrossfader(0)
          }}
        />
      </label>
      <div className="dr-deck-pads dr-mixer-fx">
        <button
          className="dr-deck-pad"
          onPointerDown={() => echo(true)}
          onPointerUp={() => echo(false)}
          onPointerLeave={() => echo(false)}
          onPointerCancel={() => echo(false)}
          onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && echo(true)}
          onKeyUp={() => echo(false)}
        >
          Echo
        </button>
        <button className="dr-deck-pad" onClick={() => void engine.unlock().then(() => engine.horn())}>
          Horn
        </button>
      </div>
    </div>
  )
}
