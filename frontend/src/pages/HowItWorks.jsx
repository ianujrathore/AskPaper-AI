import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/layout/Navbar'

function HowItWorks() {
  const { dark, setDark, theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const steps = [
    { step: '1', title: 'Upload Your PDF', desc: 'Drag and drop any document. Research paper, contract, or report — instant processing.' },
    { step: '2', title: 'AI Reads & Understands', desc: 'Our system breaks down text and understands meaning, not just keywords.' },
    { step: '3', title: 'Ask Your Question', desc: 'Type naturally in plain English. No special commands needed.' },
    { step: '4', title: 'Get Answer With Page Citations', desc: 'Clear answers with exact page references. Verify everything yourself.' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', height: '100dvh', background: theme.bg, color: theme.text, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar dark={dark} setDark={setDark} theme={theme} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', top: 48, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.4)', zIndex: 90 }} />}
        <div style={{ position: 'fixed', top: 48, left: 0, bottom: 0, width: 260, maxWidth: '80vw', background: theme.surface, borderRight: `1px solid ${theme.border}`, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .2s ease', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
          <div style={{ flex: 1, marginTop: 4, paddingTop: 8 }}>
            <Link to="/" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Home</Link>
            <Link to="/how-it-works" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.accent, fontSize: 12, textDecoration: 'none', fontWeight: 600, background: theme.surface2, borderRadius: 6, margin: '1px 8px' }}>How It Works</Link>
            <Link to="/features" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Features</Link>
            <Link to="/demo" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Demo</Link>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '60px 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 600, marginBottom: 8 }}>How It Works</h1>
          <p style={{ color: theme.textSecondary, fontSize: 16, marginBottom: 48, fontWeight: 600 }}>Four simple steps. No technical skills required.</p>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ flex: '1 1 0', minWidth: 200, background: theme.surface2, borderRadius: 16, padding: '32px 24px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: theme.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 16px' }}>{s.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks