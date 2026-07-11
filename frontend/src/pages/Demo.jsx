import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/layout/Navbar'

function Demo() {
  const { dark, setDark, theme } = useTheme()
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => { setStep((prev) => (prev + 1) % 4); setFading(false) }, 250)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const content = [
    { icon: '📄', title: '1. Upload Your PDF', desc: 'Drag and drop any document.', extra: <div style={{ marginTop: 16, border: `2px dashed ${theme.borderStrong}`, borderRadius: 12, padding: 20, color: theme.accent, fontSize: 13, fontWeight: 600 }}>Drop your PDF here</div> },
    { icon: '⚡', title: '2. AI Reads & Understands', desc: 'Breaks down text and understands meaning.', extra: <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'center' }}>{[...Array(5)].map((_, i) => (<div key={i} style={{ width: 36, height: 6, borderRadius: 3, background: theme.accent, opacity: .3 + i * .15, animation: `pulse 1s ${i*.2}s infinite` }} />))}</div> },
    { icon: '💬', title: '3. Ask Your Question', desc: 'Type naturally. No special commands.', extra: <div style={{ marginTop: 16, background: theme.bg, borderRadius: 12, padding: '14px 18px', textAlign: 'left', color: theme.textSecondary, fontSize: 14, border: `1px solid ${theme.border}` }}>"What is the main finding?"</div> },
    { icon: '✅', title: '4. Get Answer With Citations', desc: 'Clear answer with exact page references.', extra: <div style={{ marginTop: 16, background: theme.bg, borderRadius: 12, padding: '14px 18px', textAlign: 'left', border: `1px solid ${theme.border}` }}><p style={{ color: theme.text, fontSize: 13, marginBottom: 6 }}>The main finding is a 28% improvement.</p><span style={{ fontSize: 10, color: theme.accentWarm, fontWeight: 600 }}>Page 6</span></div> },
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
            <Link to="/features" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Features</Link>
            <Link to="/demo" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.accent, fontSize: 12, textDecoration: 'none', fontWeight: 600, background: theme.surface2, borderRadius: 6, margin: '1px 8px' }}>Demo</Link>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 700, marginBottom: 4 }}>Demo - AskPaper AI</h1>
            <p style={{ color: theme.textSecondary, fontSize: 16, fontWeight: 600, marginBottom: 36 }}>Watch how AskPaper AI turns a PDF into answers.</p>
            <div style={{ background: theme.surface2, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 40, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ opacity: fading ? 0 : 1, transition: 'opacity .25s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{content[step].icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{content[step].title}</h3>
                <p style={{ color: theme.textSecondary, fontSize: 14 }}>{content[step].desc}</p>
                {content[step].extra}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {[0, 1, 2, 3].map((d) => (<div key={d} style={{ width: step === d ? 22 : 8, height: 8, borderRadius: 4, background: step === d ? theme.accent : theme.border, transition: 'all .3s' }} />))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  )
}

export default Demo