import { useEffect, useRef } from 'react'

// Passt das GildeConnect-Widget (offenes Shadow-DOM, keine ::part/CSS-Variablen von außen)
// an den Seitenstil an. Adoptierte Sheets überleben Re-Renders des Shadow-Inhalts.
const WIDGET_CSS = `
:host{font-family:'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif}
.surface{--accent:#c2ff3a;--accent-ink:#0a0a0b;--bg:transparent;--raised:#141416;--text:#f4f2ec;--muted:#8c8a82;--line:rgba(255,255,255,.18);--input:transparent}
.card{max-width:none;border:0;border-radius:0;box-shadow:none;overflow:visible}
.bar,.eyebrow{display:none}
.content{padding:0}
h2{font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.02em;font-size:clamp(28px,3vw,40px)}
.fields{gap:24px}
label{font-family:'Space Mono',monospace;font-size:11px;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
input,textarea{margin-top:8px;border:0;border-bottom:1px solid var(--line);border-radius:0;padding:11px 2px;font-size:16px;transition:border-color .3s}
input:focus,textarea:focus{outline:none;border-color:var(--accent)}
textarea{min-height:90px}
.actions button{width:auto}
button.primary{border-radius:4px;padding:16px 34px;font-weight:600;font-size:15px;letter-spacing:.02em;transition:transform .3s,box-shadow .3s}
button.primary:hover:not(:disabled){filter:none;transform:translateY(-3px);box-shadow:0 14px 38px rgba(194,255,58,.32)}
.hint{font-family:'Space Mono',monospace;font-size:11px}
.status{font-family:'Space Mono',monospace;color:var(--accent);background:transparent;border-color:var(--accent)}
`

export default function Booking() {
  const widget = useRef<HTMLElement>(null)

  useEffect(() => {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(WIDGET_CSS)
    const apply = () => {
      const root = widget.current?.shadowRoot
      if (!root) return false
      if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet]
      return true
    }
    if (apply()) return
    // Widget-Script lädt asynchron – warten bis das Shadow-DOM existiert.
    const timer = window.setInterval(() => apply() && window.clearInterval(timer), 100)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="booking" className="dr-booking">
      <div data-blob className="dr-booking-blob" />
      <div className="dr-booking-inner">
        <div className="dr-reveal dr-booking-text">
          <span className="dr-eyebrow">[ 06 — Kontakt ]</span>
          <h2 className="dr-booking-title">
            Lust auf
            <br />
            Lärm?
          </h2>
          <p className="dr-booking-p">
            Booking, Presse, Kooperation oder einfach nur Hallo — egal worum es geht: Schreib uns,
            wir melden uns mit voller Lautstärke zurück.
          </p>
          <a href="mailto:contact@drunkenrecords.de" className="dr-booking-mail">
            <span className="dr-booking-mail-dot" />
            contact@drunkenrecords.de
          </a>
        </div>

        <div className="dr-reveal dr-form">
          <gilde-contact
            ref={widget}
            project="p_6ab0675ac41b435ba1da3011f63dcbf0"
            inline=""
            language="de"
            theme="dark"
            accent="#c2ff3a"
            title="Schreib uns"
            show-description="false"
            show-homepage="false"
            show-footer="false"
            success-text="Prost! Nachricht ist raus — wir melden uns."
          ></gilde-contact>
        </div>
      </div>
    </section>
  )
}
