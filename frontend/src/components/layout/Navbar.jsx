import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '../../lib/constants'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: scrolled ? '12px 0' : '20px 0',
        backgroundColor: scrolled ? 'rgba(6,7,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: '#7C5CFF' }}
          >
            ?
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all"
            style={{ backgroundColor: '#7C5CFF' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#8D71FF')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#7C5CFF')}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar