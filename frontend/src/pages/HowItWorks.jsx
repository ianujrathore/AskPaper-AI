import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/layout/Navbar'
import api from '../lib/api'

function HowItWorks() {
  const { darkMode, setDarkMode, theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fileRef = useRef(null)

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

  const steps = [
    { step: '1', title: 'Upload Your PDF', desc: 'Drag and drop any document. Research paper, contract, or report — instant processing.' },
    { step: '2', title: 'AI Reads & Understands', desc: 'Our system breaks down text and understands meaning, not just keywords.' },
    { step: '3', title: 'Ask Your Question', desc: 'Type naturally in plain English. No special commands or keywords needed.' },
    { step: '4', title: 'Get Answer With Page Citations', desc: 'Receive clear answers with exact page references. Verify everything yourself.' },
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
          <Link to="/how-it-works" style={{ display: 'block', padding: '7px 14px', color: theme.accent, fontSize: '12px', textDecoration: 'none', fontWeight: 600, backgroundColor: theme.accentLight, borderRadius: '6px', margin: '1px 8px' }}>How It Works</Link>
          <Link to="/features" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>Features</Link>
          <Link to="/demo" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>Demo</Link>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 700, marginBottom: '4px', color: theme.text }}>How It Works</h1>
        <p style={{ color: theme.text, fontSize: '16px', fontWeight: 600, marginBottom: '48px' }}>Four simple steps. No technical skills required.</p>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: '1 1 0', minWidth: '200px', backgroundColor: theme.cardBg, borderRadius: '16px', padding: '32px 24px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: theme.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, margin: '0 auto 16px' }}>{s.step}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: theme.text }}>{s.title}</h3>
              <p style={{ color: theme.textSecondary, fontSize: '13px', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorks