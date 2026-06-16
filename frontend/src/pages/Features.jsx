import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/layout/Navbar'
import api from '../lib/api'

function Features() {
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

  const features = [
    { icon: '🔍', title: 'Ask Anything', desc: 'Type naturally. AI finds the exact answer from your document with precision.' },
    { icon: '📍', title: 'Page Citations', desc: 'Every answer includes exact page references. No made-up facts, ever.' },
    { icon: '⚡', title: 'Seconds, Not Minutes', desc: 'Upload, ask, get answer. All within seconds with optimized retrieval.' },
    { icon: '🔒', title: 'Your Data Is Yours', desc: 'Encrypted storage. Never used to train AI. Privacy is the default.' },
    { icon: '📊', title: 'Multiple Documents', desc: 'Compare findings across documents. Upload as many as you need.' },
    { icon: '🎯', title: 'Semantic Search', desc: 'Finds relevant content by meaning, not just keyword matching.' },
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
          <Link to="/features" style={{ display: 'block', padding: '7px 14px', color: theme.accent, fontSize: '12px', textDecoration: 'none', fontWeight: 600, backgroundColor: theme.accentLight, borderRadius: '6px', margin: '1px 8px' }}>Features</Link>
          <Link to="/demo" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>Demo</Link>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '28px', fontWeight: 700, marginBottom: '4px', color: theme.text }}>Features</h1>
        <p style={{ color: theme.text, fontSize: '15px', fontWeight: 600, marginBottom: '48px' }}>Built for researchers, students, and professionals who need answers fast.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ backgroundColor: theme.cardBg, borderRadius: '16px', padding: '32px 24px', border: `1px solid ${theme.border}`, textAlign: 'left' }}>
              <div style={{ fontSize: '26px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '6px', color: theme.text }}>{f.title}</h3>
              <p style={{ color: theme.textSecondary, fontSize: '13px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features