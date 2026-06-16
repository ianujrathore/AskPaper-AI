import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '../lib/constants'
import api from '../lib/api'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/layout/Navbar'

function Home() {
  const { darkMode, setDarkMode, theme } = useTheme()
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

  const newChat = () => { setDocId(null); setDocInfo(null); setChat([]); setFile(null); setSidebarOpen(false) }

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", height: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.3s ease' }}>
      
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
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
          {docId && (
            <button onClick={newChat}
              style={{ margin: '4px 12px', padding: '8px', borderRadius: '8px', backgroundColor: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
              ← Back to Home
            </button>
          )}
          <div style={{ flex: 1, marginTop: '4px' }}>
            <Link to="/how-it-works" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>How It Works</Link>
            <Link to="/features" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>Features</Link>
            <Link to="/demo" style={{ display: 'block', padding: '7px 14px', color: theme.textSecondary, fontSize: '12px', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', margin: '1px 8px' }}>Demo</Link>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
          {!docId ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }}>
              <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', border: `1px solid ${theme.border}`, padding: '36px 32px', textAlign: 'center', maxWidth: '380px', width: '100%', boxShadow: darkMode ? '0 2px 24px rgba(0,0,0,0.4)' : '0 1px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: theme.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>📄</div>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 600, color: theme.text, marginBottom: '6px' }}>Ask Your Document</h2>
                <p style={{ color: theme.textSecondary, fontSize: '13px', marginBottom: '22px' }}>Upload a PDF and ask anything. Get answers with page citations.</p>
                <button onClick={() => fileRef.current?.click()} style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 0', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                  {uploading ? 'Uploading...' : 'Choose a PDF'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '680px', padding: '20px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {chat.length === 0 && (
                  <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>💬</div>
                    <p style={{ color: theme.textSecondary, fontSize: '14px' }}>Ask about <span style={{ color: theme.accent, fontWeight: 600 }}>{docInfo?.filename}</span></p>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={msg.id || i} style={{ display: 'flex', gap: '10px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.role === 'assistant' && <div style={{ width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0, backgroundColor: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>?</div>}
                    <div style={{ maxWidth: '88%' }}>
                      <div style={{ padding: '12px 16px', borderRadius: '14px', fontSize: '14px', lineHeight: 1.65, backgroundColor: msg.role === 'user' ? theme.userBubble : theme.aiBubble, border: msg.role === 'assistant' ? `1px solid ${theme.border}` : 'none', color: theme.text }}>{msg.content}</div>
                      {msg.sources?.length > 0 && <div style={{ marginTop: '6px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>{msg.sources.map((src, j) => (<span key={j} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '5px', backgroundColor: theme.accentLight, color: theme.accent, fontWeight: 500 }}>{src}</span>))}</div>}
                    </div>
                    {msg.role === 'user' && <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, backgroundColor: theme.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: theme.accent, marginTop: '2px' }}>👤</div>}
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', backgroundColor: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>?</div>
                    <div style={{ padding: '12px 16px', borderRadius: '14px', backgroundColor: theme.aiBubble, border: `1px solid ${theme.border}`, display: 'flex', gap: '4px', alignItems: 'center' }}>{[...Array(3)].map((_, i) => (<div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: theme.accent, animation: `dot 0.5s ${i * 0.12}s infinite alternate` }} />))}</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '10px 16px 16px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '680px', position: 'relative' }}>
          <form onSubmit={handleAsk}>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
              placeholder={docId ? "Ask anything..." : "Upload a PDF to start..."}
              readOnly={!docId} onClick={() => { if (!docId) fileRef.current?.click() }}
              style={{ width: '100%', padding: '13px 90px 13px 18px', borderRadius: '14px', fontSize: '14px', outline: 'none', backgroundColor: theme.inputBg, border: `1.5px solid ${theme.inputBorder}`, color: theme.text, cursor: docId ? 'text' : 'pointer', transition: 'border-color 0.2s ease' }}
              onFocus={(e) => e.target.style.borderColor = theme.inputFocus} onBlur={(e) => e.target.style.borderColor = theme.inputBorder} />
            <div style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px' }}>
              <button type="button" onClick={() => fileRef.current?.click()} style={{ background: 'transparent', border: 'none', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '17px', color: theme.accent }}>📎</button>
              <button type="submit" disabled={loading || !question.trim()} style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '15px', fontWeight: 700, opacity: question.trim() ? 1 : 0.5 }}>↑</button>
            </div>
          </form>
          <input type="file" accept=".pdf" ref={fileRef} onChange={handleUpload} style={{ display: 'none' }} />
        </div>
      </div>

      <style>{`@keyframes dot { from { transform: translateY(0); opacity: 0.3; } to { transform: translateY(-4px); opacity: 1; } }`}</style>
    </div>
  )
}

export default Home