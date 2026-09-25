export default function Booking() {
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
