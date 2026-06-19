import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Manifest from './components/Manifest'
import Bands from './components/Bands'
import Releases from './components/Releases'
import Videos from './components/Videos'
import Story from './components/Story'
import Join from './components/Join'
import AudiolaPromo from './components/AudiolaPromo'
import Booking from './components/Booking'
import Footer from './components/Footer'
import { useDrunkenFx } from './hooks/useDrunkenFx'

export default function App() {
  useDrunkenFx()

  return (
    <div className="dr-root">
      <div className="dr-grain" />
      <div className="dr-glow" />
      <div className="dr-progress" />

      <Nav />
      <Hero />
      <Marquee />
      <Manifest />
      <Bands />
      <Releases />
      <Videos />
      <Story />
      <Join />
      <AudiolaPromo />
      <Booking />
      <Footer />
    </div>
  )
}
