import { Outlet } from 'react-router-dom'
import FlashMessages from '../components/FlashMessages'
import Footer from '../components/Footer'
import Header from '../components/Header'
import MegaNav from '../components/MegaNav'
import TopBar from '../components/TopBar'
import WhatsappFloat from '../components/WhatsappFloat'

export default function PublicLayout() {
  return (
    <>
      <svg className="grain" xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      <TopBar />
      <Header />
      <MegaNav />

      <FlashMessages />

      <Outlet />

      <Footer />
      <WhatsappFloat />
    </>
  )
}
