import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [file, setFile] = useState(null)
  const [uploadMsg, setUploadMsg] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [docId, setDocId] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!token || !userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [])

  const uploadFile = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setUploadMsg(`Uploaded: ${res.data.filename} (${res.data.num_pages} pages, ${res.data.chunks_created} chunks)`)
      setDocId(res.data.document_id)
      setAnswer('')
      setSources([])
    } catch (err) {
      setUploadMsg('Upload failed. Try again.')
    }
    setLoading(false)
  }

  const askQuestion = async () => {
    if (!docId || !question) return
    setLoading(true)
    try {
      const res = await api.post('/ask', 
        { document_id: docId, question },
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      setAnswer(res.data.answer)
      setSources(res.data.sources || [])
    } catch (err) {
      setAnswer('Failed to get answer.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#1A1A2E', borderBottom: '1px solid #16213E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E43F5A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>?</div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>AskPaper</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#CBD5E1', fontSize: '14px' }}>{user?.name}</span>
          <button onClick={() => { localStorage.clear(); navigate('/login') }}
            style={{ fontSize: '14px', fontWeight: '600', color: '#E43F5A', border: '1px solid #E43F5A', padding: '6px 16px', borderRadius: '8px', background: 'transparent', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px' }}>
        
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A2E', marginBottom: '4px' }}>Upload Document</h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>Upload a PDF to start asking questions</p>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])}
              style={{ flex: 1, fontSize: '14px', color: '#64748B' }} />
            <button onClick={uploadFile} disabled={loading}
              style={{ padding: '10px 32px', backgroundColor: loading ? '#FCA5A5' : '#E43F5A', color: 'white', fontWeight: 'bold', fontSize: '14px', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          
          {uploadMsg && (
            <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '14px', fontWeight: '500' }}>
              {uploadMsg}
            </div>
          )}
        </div>

        {docId && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A2E', marginBottom: '4px' }}>Ask a Question</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>Ask anything about your uploaded document</p>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                placeholder="e.g., What is the main finding of this paper?"
                style={{ flex: 1, padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC' }} />
              <button onClick={askQuestion} disabled={loading}
                style={{ padding: '12px 32px', backgroundColor: loading ? '#93C5FD' : '#0F3460', color: 'white', fontWeight: 'bold', fontSize: '14px', border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Thinking...' : 'Ask'}
              </button>
            </div>

            {answer && (
              <div style={{ borderRadius: '12px', padding: '24px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F3460', marginBottom: '12px' }}>Answer</p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1A1A2E', marginBottom: '16px' }}>{answer}</p>
                
                {sources.length > 0 && (
                  <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '8px' }}>Sources</p>
                    {sources.map((src, i) => (
                      <div key={i} style={{ fontSize: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#92400E', marginBottom: '8px' }}>
                        {src}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!docId && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A1A2E', marginBottom: '8px' }}>No document yet</h3>
            <p style={{ color: '#64748B' }}>Upload a PDF above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard