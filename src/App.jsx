import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import ScrollExperience from './components/ScrollExperience'
import ContactPage from './components/ContactPage'
import ShopPage from './components/ShopPage'
import ProductPage from './components/ProductPage'
import BurgerMenu from './components/BurgerMenu'
import ScribbleOverlay from './components/ScribbleOverlay'

function App() {
  const location = useLocation()
  const [overlayKey, setOverlayKey] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true) // Show on initial load

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)

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

        {/* Contact Route */}
        <Route
          path="/contact"
          element={<ContactPage />}
        />

        {/* Shop Route */}
        <Route
          path="/shop"
          element={<ShopPage />}
        />

        {/* Product Route */}
        <Route
          path="/shop/:id"
          element={<ProductPage />}
        />
      </Routes>
    </div>
  )
}

export default App
