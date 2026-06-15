import { useState, useEffect, useRef } from 'react'
import { APP_NAME } from '../lib/constants'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [documents, setDocuments] = useState([])
  const [activeDoc, setActiveDoc] = useState(null)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const [animatingMsg, setAnimatingMsg] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const fileRef = useRef(null)
  const chatEndRef = useRef(null)
  const sidebarRef = useRef(null)

  const token = localStorage.getItem('token')
  const activeDocument = documents.find(d => d.id === activeDoc)
  const filteredDocs = documents.filter(d => d.filename.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!token || !userData) {
      window.location.href = '/'
      return
    }
    setUser(JSON.parse(userData))
    loadDocuments()
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (menuOpen && !e.target.closest('.doc-menu') && !e.target.closest('.menu-btn')) {
        setMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, animatingMsg])

  const loadDocuments = async () => {
    try {
      const axios = (await import('../lib/api')).default
      const res = await axios.get('/documents')
      setDocuments(res.data.documents || [])
    } catch (err) {
      console.log('Could not load documents')
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadMsg('Uploading...')
    try {
      const axios = (await import('../lib/api')).default
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadMsg('Uploaded!')
      await loadDocuments()
      setActiveDoc(res.data.document_id)
      setChat([])
      setSidebarOpen(false)
    } catch (err) {
      setUploadMsg('Upload failed')
    }
    setTimeout(() => setUploadMsg(''), 2000)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (docId) => {
    try {
      const axios = (await import('../lib/api')).default
      await axios.delete(`/documents/${docId}`)
      if (activeDoc === docId) {
        setActiveDoc(null)
        setChat([])
      }
      await loadDocuments()
    } catch (err) {
      console.log('Delete error:', err)
    }
    setMenuOpen(null)
  }

  const handleOpenPDF = async (docId) => {
    try {
      const axios = (await import('../lib/api')).default
      const res = await axios.get(`/documents/${docId}/file`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      window.open(url, '_blank')
    } catch (err) {
      console.log('Open PDF error:', err)
    }
    setMenuOpen(null)
  }

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim() || !activeDoc) return

    const userMsg = { role: 'user', content: question, id: Date.now() }
    setChat((prev) => [...prev, userMsg])
    setQuestion('')
    setLoading(true)
    setAnimatingMsg(null)

    try {
      const axios = (await import('../lib/api')).default
      const res = await axios.post('/ask', {
        document_id: activeDoc,
        question: userMsg.content,
      })
      const aiMsg = {
        role: 'assistant',
        content: res.data.answer,
        sources: res.data.sources || [],
        id: Date.now() + 1,
      }
      setAnimatingMsg(aiMsg.id)
      setTimeout(() => {
        setChat((prev) => [...prev, aiMsg])
        setAnimatingMsg(null)
      }, 100)
    } catch (err) {
      setChat((prev) => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong.',
        sources: [],
        id: Date.now() + 1,
      }])
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", height: '100vh', background: '#FBF7F4', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* NAVBAR */}
      <div style={{
        height: '48px', minHeight: '48px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E0DB',
        display: 'flex', alignItems: 'center',
        padding: '0 12px', gap: '8px', zIndex: 200, position: 'relative',
        flexShrink: 0,
      }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none', border: 'none', fontSize: '22px',
            cursor: 'pointer', color: '#1E1E24', padding: '4px 6px',
            borderRadius: '6px', lineHeight: 1,
          }}>
          {sidebarOpen ? '✕' : '☰'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#C8842A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}>?</div>
          <span style={{ fontFamily: "'Lora', serif", fontSize: '14px', fontWeight: 700, color: '#1E1E24' }}>{APP_NAME}</span>
        </div>

        <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#F5F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px', color: '#C8842A' }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* OVERLAY for mobile */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', top: '48px', left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 90,
            }} className="sidebar-overlay" />
        )}

        {/* SIDEBAR */}
        <div style={{
          position: 'fixed', top: '48px', left: 0, bottom: 0,
          width: '280px', maxWidth: '85vw',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E0DB',
          display: 'flex', flexDirection: 'column',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 100,
        }} ref={sidebarRef}>
          
          {/* Search */}
          <div style={{ padding: '10px 12px' }}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '6px',
                border: '1px solid #E5E0DB', fontSize: '12px', outline: 'none',
                backgroundColor: '#FBF7F4', color: '#1E1E24',
              }} />
          </div>

          {/* Upload Button */}
          <div style={{ padding: '8px 12px' }}>
            <button onClick={() => fileRef.current?.click()} style={{
              width: '100%', padding: '8px', borderRadius: '6px',
              backgroundColor: '#C8842A', color: '#fff', border: 'none',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}>
              Upload PDF
            </button>
            <input type="file" accept=".pdf" ref={fileRef} onChange={handleUpload} style={{ display: 'none' }} />
            {uploadMsg && <p style={{ fontSize: '10px', color: '#7A7470', marginTop: '4px', textAlign: 'center' }}>{uploadMsg}</p>}
          </div>

          {/* Document List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '2px 8px' }}>
            {filteredDocs.map((doc) => (
              <div key={doc.id} style={{ position: 'relative' }}>
                <div
                  onClick={() => { setActiveDoc(doc.id); setChat([]); setSidebarOpen(false) }}
                  style={{
                    padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', marginBottom: '1px',
                    backgroundColor: activeDoc === doc.id ? '#F5F0EB' : 'transparent',
                    transition: 'all 0.1s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: '#1E1E24', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{doc.filename}</p>
                  </div>
                  <button className="menu-btn"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setMenuOpen(menuOpen === doc.id ? null : doc.id) }}
                    style={{
                      background: 'none', border: 'none', fontSize: '16px',
                      cursor: 'pointer', color: '#B5B0AA', padding: '2px 4px',
                      borderRadius: '4px', fontWeight: 700, lineHeight: 1,
                    }}>
                    ···
                  </button>
                </div>

                {menuOpen === doc.id && (
                  <div className="doc-menu" style={{
                    position: 'absolute', right: '8px', top: '32px',
                    backgroundColor: '#FFFFFF', borderRadius: '8px',
                    border: '1px solid #E5E0DB', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    zIndex: 300, overflow: 'hidden', minWidth: '110px',
                  }}>
                    <button onClick={(e) => { e.stopPropagation(); handleOpenPDF(doc.id) }}
                      style={{ display: 'block', width: '100%', padding: '8px 14px', border: 'none', background: 'none', fontSize: '12px', color: '#1E1E24', cursor: 'pointer', textAlign: 'left' }}>
                      Open PDF
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id) }}
                      style={{ display: 'block', width: '100%', padding: '8px 14px', border: 'none', background: 'none', fontSize: '12px', color: '#DC2626', cursor: 'pointer', textAlign: 'left' }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredDocs.length === 0 && (
              <p style={{ fontSize: '12px', color: '#B5B0AA', textAlign: 'center', padding: '20px 0' }}>
                {searchQuery ? 'No matching documents' : 'No documents yet'}
              </p>
            )}
          </div>

          {/* Logout */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #E5E0DB' }}>
            <button onClick={handleLogout}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: 'none', fontSize: '12px', color: '#DC2626', cursor: 'pointer', textAlign: 'center', fontWeight: 500 }}>
              Logout
            </button>
          </div>
        </div>

        {/* CHAT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#FBF7F4', minWidth: 0, marginLeft: sidebarOpen ? '280px' : '0px', transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '650px' }}>
              {!activeDoc ? (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: '100%', padding: '20px',
                }}>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E0DB',
                    padding: '40px 32px',
                    textAlign: 'center',
                    maxWidth: '420px',
                    width: '100%',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '14px' }}>📄</div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: '22px', fontWeight: 600, color: '#1E1E24', marginBottom: '8px' }}>
                      Select a Document
                    </h2>
                    <p style={{ color: '#6B6560', fontSize: '14px', marginBottom: '22px', lineHeight: 1.5 }}>
                      Upload a PDF or choose from the sidebar to start.
                    </p>
                    <button onClick={() => fileRef.current?.click()}
                      style={{
                        backgroundColor: '#C8842A', color: '#fff', border: 'none',
                        padding: '10px 48px', borderRadius: '10px',
                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                        width: '100%', maxWidth: '300px',
                      }}>
                      Upload PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '8px' }}>
                  {chat.length === 0 && (
                    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
                      <p style={{ color: '#4A4540', fontSize: '15px', fontWeight: 500 }}>
                        Ask anything about{' '}
                        <span style={{ color: '#C8842A', fontWeight: 600 }}>{activeDocument?.filename}</span>
                      </p>
                      <p style={{ color: '#7A7470', fontSize: '13px', marginTop: '4px' }}>Type your question below</p>
                    </div>
                  )}
                  {chat.map((msg, i) => (
                    <div key={msg.id || i}
                      style={{
                        display: 'flex', gap: '10px',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        animation: msg.role === 'assistant' && animatingMsg === msg.id ? 'msgIn 0.2s ease forwards' : 'none',
                      }}>
                      {msg.role === 'assistant' && (
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                          backgroundColor: '#C8842A', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, marginTop: '2px',
                        }}>?</div>
                      )}
                      <div style={{ maxWidth: '88%' }}>
                        <div style={{
                          padding: '12px 16px', borderRadius: '14px',
                          fontSize: '14px', lineHeight: 1.6,
                          backgroundColor: msg.role === 'user' ? '#F5F0EB' : '#FFFFFF',
                          border: msg.role === 'assistant' ? '1px solid #E5E0DB' : 'none',
                          color: '#1A1A1A', fontWeight: 400,
                        }}>
                          {msg.content}
                        </div>
                        {msg.sources?.length > 0 && (
                          <div style={{ marginTop: '6px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FBF7F4', border: '1px solid #E5E0DB' }}>
                            <p style={{ fontSize: '9px', fontWeight: 700, color: '#C8842A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Sources</p>
                            {msg.sources.map((src, j) => (
                              <p key={j} style={{ fontSize: '11px', color: '#6B6560', lineHeight: 1.4, marginBottom: j < msg.sources.length - 1 ? '3px' : 0 }}>{src}</p>
                            ))}
                          </div>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                          backgroundColor: '#F5F0EB', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: 700, fontSize: '11px', color: '#C8842A', marginTop: '2px',
                        }}>
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#C8842A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>?</div>
                      <div style={{ padding: '12px 16px', borderRadius: '14px', backgroundColor: '#FFFFFF', border: '1px solid #E5E0DB', display: 'flex', gap: '5px', alignItems: 'center' }}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C8842A', animation: `dotBounce 0.5s ${i * 0.12}s infinite alternate` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* CHAT INPUT */}
          {activeDoc && (
            <div style={{ padding: '12px 16px 16px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <form onSubmit={handleAsk} style={{ width: '100%', maxWidth: '650px', position: 'relative' }}>
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything..."
                  style={{
                    width: '100%', padding: '13px 44px 13px 16px', borderRadius: '14px',
                    fontSize: '14px', outline: 'none', backgroundColor: '#FFFFFF',
                    border: '1.5px solid #D5CFC8', color: '#1A1A1A', fontWeight: 400,
                    boxShadow: '0 1px 8px rgba(0,0,0,0.02)', transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#C8842A'}
                  onBlur={(e) => e.target.style.borderColor = '#D5CFC8'}
                />
                <button type="submit" disabled={loading || !question.trim()}
                  style={{
                    position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                    backgroundColor: question.trim() ? '#C8842A' : '#CFBFA8', color: '#fff',
                    border: 'none', borderRadius: '10px', width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: question.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease', fontSize: '14px', fontWeight: 700,
                  }}>
                  ↑
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotBounce { from { transform: translateY(0); opacity: 0.4; } to { transform: translateY(-5px); opacity: 1; } }
        @media (min-width: 769px) {
          .sidebar-overlay { display: none; }
        }
      `}</style>
    </div>
  )
}

export default Dashboard