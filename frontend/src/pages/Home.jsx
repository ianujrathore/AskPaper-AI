import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '../lib/constants'
import api from '../lib/api'
import { useTheme } from '../hooks/useTheme'

function Home() {
  const { dark, setDark, theme } = useTheme()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [docId, setDocId] = useState(null)
  const [docInfo, setDocInfo] = useState(null)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fileRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat])

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setFile(selectedFile)
    setUploading(true)
    setChat([])
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setDocId(res.data.document_id)
      setDocInfo(res.data)
      setSidebarOpen(false)
    } catch (err) { alert('Upload failed.') }
    setUploading(false)
  }

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim() || !docId) return
    const userMsg = { role: 'user', content: question, id: Date.now() }
    setChat((prev) => [...prev, userMsg])
    setQuestion('')
    setLoading(true)
    try {
      const res = await api.post('/ask', { document_id: docId, question: userMsg.content })
      setChat((prev) => [...prev, { role: 'assistant', content: res.data.answer, sources: res.data.sources || [], id: Date.now() + 1 }])
    } catch (err) {
      setChat((prev) => [...prev, { role: 'assistant', content: 'Sorry.', sources: [], id: Date.now() + 1 }])
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', height: '100dvh', background: theme.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background .5s, color .5s' }}>
      
      {/* NAVBAR */}
      <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: theme.glassBg, backdropFilter: 'blur(24px)', borderBottom: `1px solid ${theme.border}`, flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: theme.text, padding: '4px 8px', borderRadius: 6 }}>☰</button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, color: '#fff' }}>A</div>
            <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-.01em' }}>{APP_NAME}</span>
          </Link>
          {docInfo && (
            <span style={{ fontSize: 11, color: theme.accentWarm, background: dark ? 'rgba(240,168,76,.1)' : 'rgba(139,105,20,.08)', border: `1px solid ${dark ? 'rgba(240,168,76,.2)' : 'rgba(139,105,20,.18)'}`, padding: '3px 10px', borderRadius: 20, fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docInfo.filename}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setDark(!dark)} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, fontSize: 16 }}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* SIDEBAR */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', top: 48, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.4)', zIndex: 90 }} />}
        <div style={{ position: 'fixed', top: 48, left: 0, bottom: 0, width: 260, maxWidth: '80vw', background: theme.surface, borderRight: `1px solid ${theme.border}`, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .2s ease', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
          <button onClick={() => { fileRef.current?.click() }} style={{ margin: '6px 12px', padding: 9, borderRadius: 8, background: theme.accentGradient, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ New Upload</button>
          <input type="file" accept=".pdf" ref={fileRef} onChange={handleUpload} style={{ display: 'none' }} />
          {docId && <button onClick={() => { setDocId(null); setDocInfo(null); setChat([]); setSidebarOpen(false) }} style={{ margin: '4px 12px', padding: 8, borderRadius: 8, background: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, fontSize: 12, cursor: 'pointer' }}>Back to Home</button>}
          <div style={{ flex: 1, marginTop: 4 }}>
            <Link to="/how-it-works" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>How It Works</Link>
            <Link to="/features" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Features</Link>
            <Link to="/demo" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: 12, textDecoration: 'none', fontWeight: 500, borderRadius: 6, margin: '1px 8px' }}>Demo</Link>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: !docId ? 'center' : 'flex-start', overflowY: 'auto', padding: !docId ? '24px 24px 0' : 0 }}>
          {!docId ? (
            <div style={{ maxWidth: 640, width: '100%', textAlign: 'center', marginTop: 8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, background: theme.surface2, border: `1px solid ${theme.border}`, fontSize: '.75rem', fontWeight: 600, letterSpacing: '.01em', color: theme.textSecondary, marginBottom: 20 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: theme.accentWarm }}><path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z"></path></svg>
                AI-Powered Document Intelligence
              </div>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 'clamp(1.8rem,4.5vw,2.8rem)', lineHeight: 1.2, letterSpacing: '-.01em', marginBottom: 10, color: theme.text }}>
                Ask your document<br /><span style={{ color: theme.accent }}>anything.</span>
              </h1>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: 440, margin: '0 auto 32px', color: theme.textSecondary }}>
                Upload a PDF and get precise answers - every claim linked back to the exact page.
              </p>
              <div onClick={() => fileRef.current?.click()} style={{ borderRadius: 18, padding: '44px 28px', cursor: 'pointer', border: `1.5px dashed ${theme.borderStrong}`, background: theme.surface2, transition: 'all .25s' }}>
                <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.accentGradient, color: '#fff', boxShadow: dark ? '0 6px 20px rgba(0,0,0,.4)' : '0 4px 14px rgba(20,18,14,.08)' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 18a4.6 4.4 0 0 1 0-9 5 4.5 0 0 1 9.8-1.5A4 4 0 0 1 18 18H7z"></path><polyline points="12 12 12 21"></polyline><polyline points="9 15 12 12 15 15"></polyline></svg>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 3, color: theme.text }}>Drop your PDF here</h3>
                <p style={{ fontSize: '.78rem', marginBottom: 20, color: theme.textTertiary }}>or click to browse · up to 50MB</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 9, fontSize: '.8rem', fontWeight: 600, background: theme.accentGradient, color: '#fff', border: 'none' }}>{uploading ? 'Uploading...' : 'Choose a PDF'}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                {['Key findings', 'Methodology', 'Limitations'].map((s) => (
                  <span key={s} style={{ padding: '8px 14px', borderRadius: 100, fontSize: '.78rem', fontWeight: 500, cursor: 'pointer', background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.textSecondary }}>{s}</span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  {chat.length === 0 && (
                    <div style={{ textAlign: 'center', paddingTop: 40 }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
                      <p style={{ color: theme.textSecondary, fontSize: 14 }}>Ask about <span style={{ color: theme.accent, fontWeight: 600 }}>{docInfo?.filename}</span></p>
                    </div>
                  )}
                  {chat.map((msg, i) => (
                    <div key={msg.id || i} style={{ display: 'flex', gap: 10, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeIn .3s ease' }}>
                      {msg.role === 'assistant' && <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>✨</div>}
                      <div style={{ maxWidth: '82%' }}>
                        <div style={{ padding: '9px 14px', borderRadius: 14, fontSize: '.95rem', lineHeight: 1.65, background: msg.role === 'user' ? theme.accent : theme.surface, color: msg.role === 'user' ? '#fff' : theme.text, border: msg.role === 'assistant' ? `1px solid ${theme.border}` : 'none' }}>
                          {msg.content}
                        </div>
                        {msg.sources?.length > 0 && (
                          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {msg.sources.map((src, j) => (
                              <span key={j} style={{ fontSize: 10, padding: '3px 8px', borderRadius: '4px 8px 5px 8px', background: dark ? 'rgba(240,168,76,.12)' : 'rgba(139,105,20,.1)', border: `1px solid ${dark ? 'rgba(240,168,76,.3)' : 'rgba(139,105,20,.22)'}`, color: theme.accentWarm, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{src}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {msg.role === 'user' && <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: theme.surface3, color: theme.textSecondary, border: `1px solid ${theme.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>}
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: theme.accentGradient }} />
                      <div style={{ display: 'flex', gap: 4, padding: '6px 0' }}>
                        {[...Array(3)].map((_, i) => (<div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: theme.textTertiary, animation: `pulse 1.2s ${i*.15}s infinite ease-in-out` }} />))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
              <div style={{ padding: '10px 20px 16px', flexShrink: 0 }}>
                <form onSubmit={handleAsk} style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 7, padding: '7px 7px 7px 16px', borderRadius: 14, background: theme.surface2, border: `1px solid ${theme.border}`, boxShadow: dark ? '0 6px 20px rgba(0,0,0,.4)' : '0 3px 14px rgba(20,18,14,.05)' }}>
                  <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question about this document…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '.95rem', lineHeight: 1.5, padding: '8px 0', color: theme.text }} />
                  <button type="submit" disabled={loading || !question.trim()} style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: question.trim() ? theme.accentGradient : theme.surface3, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: question.trim() ? 1 : .35 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25"><line x1="12" y1="19" x2="12" y2="6"></line><polyline points="6 12 12 6 18 12"></polyline></svg>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

export default Home