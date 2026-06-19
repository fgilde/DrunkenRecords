function Group() {
  return (
    <span className="dr-marquee-group">
      <span>Eyirish</span>
      <span className="dr-marquee-star">✶</span>
      <span className="dr-marquee-stroke">0,5er</span>
      <span className="dr-marquee-star">✶</span>
      <span>Die PapiBaras</span>
      <span className="dr-marquee-star">✶</span>
      <span className="dr-marquee-stroke">Drunken Records</span>
      <span className="dr-marquee-star">✶</span>
    </span>
  )
}

export default function Marquee() {
  return (
    <div className="dr-marquee-wrap">
      <div className="dr-marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  )
}
