import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import ScrollExperience from './components/ScrollExperience'
import ShopPage from './components/ShopPage'
import ContactPage from './components/ContactPage'
import BurgerMenu from './components/BurgerMenu'
import ScribbleOverlay from './components/ScribbleOverlay'

function App() {
  const location = useLocation()
  const [overlayKey, setOverlayKey] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true) // Show on initial load

  useEffect(() => {
    // Start new transition on route change
    setShowOverlay(true)
    setOverlayKey(prev => prev + 1)
  }, [location.pathname])

  return (
    <div className="app">
      {showOverlay && (
        <ScribbleOverlay
          key={overlayKey}
          color="#c1765b"
          onComplete={() => setShowOverlay(false)}
        />
      )}
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <ScrollExperience />
            </>
          }
        />

        {/* Shop Route */}
        <Route
          path="/shop"
          element={
            <>
              <header className="fixed top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-50 pointer-events-none">
                <div className="ml-2 mt-2">
                  <BurgerMenu />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-12 md:top-14 pointer-events-auto">
                  <Link to="/">
                    <h1
                      className="text-4xl text-white select-none cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      Nala's <span className="italic font-light">Baby</span>
                    </h1>
                  </Link>
                </div>
              </header>
              <ShopPage />
            </>
          }
        />

        {/* Contact Route */}
        <Route
          path="/contact"
          element={
            <>
              <header className="fixed top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-50 pointer-events-none">
                <div className="ml-2 mt-2">
                  <BurgerMenu />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-12 md:top-14 pointer-events-auto">
                  <Link to="/">
                    <h1
                      className="text-4xl text-[#333333] select-none cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      Nala's <span className="italic font-light">Baby</span>
                    </h1>
                  </Link>
                </div>
              </header>
              <ContactPage />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
