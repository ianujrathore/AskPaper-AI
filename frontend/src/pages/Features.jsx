import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/layout/Navbar'

function Features() {
  const { dark, setDark, theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const features = [
    { icon: '🔍', title: 'Ask Anything', desc: 'Type naturally. AI finds the exact answer from your document with precision.' },
    { icon: '📍', title: 'Page Citations', desc: 'Every answer includes exact page references. No made-up facts.' },
    { icon: '⚡', title: 'Seconds, Not Minutes', desc: 'Upload, ask, get answer. All within seconds.' },
    { icon: '🔒', title: 'Your Data Is Yours', desc: 'Encrypted storage. Never used to train AI.' },
    { icon: '📊', title: 'Multiple Documents', desc: 'Compare findings across documents.' },
    { icon: '🎯', title: 'Semantic Search', desc: 'Finds relevant content by meaning, not just keywords.' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', height: '100dvh', background: theme.bg, color: theme.text, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar dark={dark} setDark={setDark} theme={theme} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', top: 48, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.4)', zIndex: 90 }} />}
        <div style={{ position: 'fixed', top: 48, left: 0, bottom: 0, width: 260, maxWidth: '80vw', background: theme.surface, borderRight: `1px solid ${theme.border}`, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .2s ease', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
          <div style={{ flex: 1, marginTop: 4, paddingTop: 8 }}>
            <Link to="/" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Home</Link>
            <Link to="/how-it-works" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>How It Works</Link>
            <Link to="/features" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.accent, fontSize: 12, textDecoration: 'none', fontWeight: 600, background: theme.surface2, borderRadius: 6, margin: '1px 8px' }}>Features</Link>
            <Link to="/demo" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Demo</Link>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px 60px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Features</h1>
          <p style={{ color: theme.textSecondary, fontSize: 15, fontWeight: 600, marginBottom: 48 }}>Built for researchers, students, and professionals.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: theme.surface2, borderRadius: 16, padding: '32px 24px', border: `1px solid ${theme.border}`, textAlign: 'left' }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features