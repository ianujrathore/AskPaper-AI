import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/layout/Navbar'
import api from '../lib/api'

function Demo() {
  const { darkMode, setDarkMode, theme } = useTheme()
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setStep((prev) => (prev + 1) % 4)
        setFading(false)
      }, 250)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      window.location.href = '/'
    } catch (err) { alert('Upload failed.') }
  }

  const demoContent = [
    { icon: '📄', title: '1. Upload Your PDF', desc: 'Drag and drop any document. Instant processing.', content: <div style={{ marginTop: '16px', border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '20px', color: theme.accent, fontSize: '13px', fontWeight: 600 }}>Drop your PDF here</div> },
    { icon: '⚡', title: '2. AI Reads & Understands', desc: 'System breaks down text and understands meaning.', content: <div style={{ marginTop: '16px', display: 'flex', gap: '6px', justifyContent: 'center' }}>{[...Array(5)].map((_, i) => (<div key={i} style={{ width: '36px', height: '6px', borderRadius: '3px', backgroundColor: theme.accent, opacity: 0.3 + i * 0.15, animation: `pulse 1s ${i * 0.2}s infinite` }} />))}</div> },
    { icon: '💬', title: '3. Ask Your Question', desc: 'Type naturally. No special commands needed.', content: <div style={{ marginTop: '16px', backgroundColor: theme.bg, borderRadius: '12px', padding: '14px 18px', textAlign: 'left', color: theme.textSecondary, fontSize: '14px', border: `1px solid ${theme.border}` }}>"What is the main finding?"</div> },
    { icon: '✅', title: '4. Get Answer With Citations', desc: 'Clear answer with exact page references.', content: <div style={{ marginTop: '16px', backgroundColor: theme.bg, borderRadius: '12px', padding: '14px 18px', textAlign: 'left', border: `1px solid ${theme.border}` }}><p style={{ color: theme.text, fontSize: '13px', marginBottom: '6px' }}>The main finding is a 28% improvement in accuracy.</p><span style={{ fontSize: '10px', color: theme.accent, fontWeight: 600 }}>Page 6</span></div> },
  ]

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", minHeight: '100vh', background: theme.bg, color: theme.text, transition: 'all 0.3s ease' }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', top: '44px', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 90 }} />}

      <div style={{
        position: 'fixed', top: '44px', left: 0, bottom: 0, width: '260px', maxWidth: '80vw',
        backgroundColor: theme.sidebarBg, borderRight: `1px solid ${theme.border}`,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s ease', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '8px 0',
      }}>
        <button onClick={() => { fileRef.current?.click() }}
          style={{ margin: '6px 12px', padding: '9px', borderRadius: '8px', backgroundColor: theme.accent, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          + New Upload
        </button>
        <input type="file" accept=".pdf" ref={fileRef} onChange={handleUpload} style={{ display: 'none' }} />
        <div style={{ flex: 1, marginTop: '4px' }}>
          <Link to="/how-it-works" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>How It Works</Link>
          <Link to="/features" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>Features</Link>
          <Link to="/demo" style={{ display: 'block', padding: '7px 14px', color: theme.accent, fontSize: '12px', textDecoration: 'none', fontWeight: 600, backgroundColor: theme.accentLight, borderRadius: '6px', margin: '1px 8px' }}>Demo</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 44px)', padding: '20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 700, marginBottom: '4px', color: theme.text }}>Demo - AskPaper AI</h1>
          <p style={{ color: theme.text, fontSize: '16px', fontWeight: 600, marginBottom: '36px' }}>Watch how AskPaper AI turns a PDF into answers in seconds.</p>
          
          <div style={{
            backgroundColor: theme.cardBg, borderRadius: '20px',
            border: `1px solid ${theme.border}`, padding: '40px',
            width: '100%', height: '340px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <div style={{
              opacity: fading ? 0 : 1,
              transition: 'opacity 0.25s ease',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{ fontSize: '44px', marginBottom: '14px' }}>{demoContent[step].icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px', color: theme.text }}>{demoContent[step].title}</h3>
              <p style={{ color: theme.textSecondary, fontSize: '14px' }}>{demoContent[step].desc}</p>
              {demoContent[step].content}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
            {[0, 1, 2, 3].map((d) => (<div key={d} style={{ width: step === d ? '22px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: step === d ? theme.accent : theme.border, transition: 'all 0.3s ease' }} />))}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
    </div>
  )
}

export default Demo