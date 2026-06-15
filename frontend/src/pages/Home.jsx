import { useState, useEffect } from 'react'
import { APP_NAME } from '../lib/constants'

function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [fadeClass, setFadeClass] = useState('demo-fade-in')

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass('demo-fade-out')
      setTimeout(() => {
        setDemoStep((prev) => (prev + 1) % 4)
        setFadeClass('demo-fade-in')
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const axios = (await import('../lib/api')).default
      if (isLogin) {
        const res = await axios.post('/login', { email, password })
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        window.location.href = '/dashboard'
      } else {
        await axios.post('/register', { name, email, password })
        const res = await axios.post('/login', { email, password })
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    }
    setLoading(false)
  }

  const features = [
    { icon: '🔍', title: 'Ask Anything', desc: 'Type naturally like talking to a person. AI finds the exact answer from your document.' },
    { icon: '📍', title: 'Source You Trust', desc: 'Every answer links to the exact page and paragraph. No made-up facts, ever.' },
    { icon: '⚡', title: 'Seconds, Not Minutes', desc: 'Upload, ask, get answer. All within seconds. No loading bars forever.' },
    { icon: '🔒', title: 'Your Data Is Yours', desc: 'Encrypted storage. Never used to train AI. Privacy is the default, not an option.' },
  ]

  const steps = [
    { step: '1', title: 'Upload your PDF', desc: 'Drag any document. Paper, contract, report — it all works.' },
    { step: '2', title: 'AI reads it', desc: 'System breaks down text and understands meaning, not just keywords.' },
    { step: '3', title: 'Ask your question', desc: 'Plain English. No special commands. Just ask what you want to know.' },
    { step: '4', title: 'Get proof', desc: 'Clear answer with exact source. Verify everything yourself.' },
  ]

  const demoContent = [
    {
      icon: '📄', title: '1. Upload Your PDF',
      desc: 'Drag and drop any document. Research paper, contract, or report.',
      content: <div style={{ marginTop: '20px', border: '2px dashed #E5E0DB', borderRadius: '12px', padding: '24px', color: '#C8842A', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>Drop your PDF here</div>
    },
    {
      icon: '⚡', title: '2. AI Reads & Understands',
      desc: 'System breaks document into pieces and understands each part.',
      content: <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', height: '48px' }}>{[...Array(5)].map((_, i) => (<div key={i} style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: '#C8842A', opacity: 0.3 + i * 0.15, animation: `demoPulse 1s ${i * 0.2}s infinite` }} />))}</div>
    },
    {
      icon: '💬', title: '3. Ask Your Question',
      desc: 'Type naturally. No special commands needed.',
      content: <div style={{ marginTop: '20px', backgroundColor: '#FBF7F4', borderRadius: '12px', padding: '16px 20px', textAlign: 'left', color: '#1E1E24', fontSize: '14px', border: '1px solid #E5E0DB' }}>"What is the main finding of this research?"</div>
    },
    {
      icon: '✅', title: '4. Get Answer With Proof',
      desc: 'Clear answer with exact source reference. Verify it yourself.',
      content: (
        <div style={{ marginTop: '20px', backgroundColor: '#FBF7F4', borderRadius: '12px', padding: '16px 20px', textAlign: 'left', border: '1px solid #E5E0DB' }}>
          <p style={{ color: '#1E1E24', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>The main finding is that transformer architecture outperforms RNNs by 28% in translation tasks.</p>
          <p style={{ color: '#C8842A', fontSize: '11px', fontWeight: 600 }}>Source: Page 6, Paragraph 2</p>
        </div>
      )
    },
  ]

  const audiences = [
    { title: 'For Students', desc: 'Read research papers 10x faster. Find key findings without scanning 40 pages. Understand complex papers in minutes.' },
    { title: 'For Researchers', desc: 'Compare multiple papers. Extract methodologies. Spot patterns across documents instantly.' },
    { title: 'For Professionals', desc: 'Review contracts and reports. Find specific clauses. Never miss critical details again.' },
  ]

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", minHeight: '100vh', background: '#FBF7F4', display: 'flex', flexDirection: 'column' }}>
      
      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(251,247,244,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E0DB', padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#C8842A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 700 }}>?</div>
            <span style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 700, color: '#1E1E24' }}>{APP_NAME}</span>
          </a>
          <div className="desktop-nav" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#features" style={{ color: '#6B6560', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Features</a>
            <a href="#how" style={{ color: '#6B6560', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>How It Works</a>
            <a href="#demo" style={{ color: '#6B6560', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Demo</a>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#1E1E24' }}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#FBF7F4', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <a href="#features" onClick={() => setMenuOpen(false)} style={{ fontSize: '20px', color: '#1E1E24', textDecoration: 'none', fontWeight: 500 }}>Features</a>
          <a href="#how" onClick={() => setMenuOpen(false)} style={{ fontSize: '20px', color: '#1E1E24', textDecoration: 'none', fontWeight: 500 }}>How It Works</a>
          <a href="#demo" onClick={() => setMenuOpen(false)} style={{ fontSize: '20px', color: '#1E1E24', textDecoration: 'none', fontWeight: 500 }}>Demo</a>
        </div>
      )}

      {/* HERO */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1000px', width: '100%', display: 'flex', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 2px 40px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)', overflow: 'hidden', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', padding: '64px 48px', background: '#F5F0EB', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#C8842A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 700 }}>?</div>
              <span style={{ fontFamily: "'Lora', serif", fontSize: '22px', fontWeight: 700, color: '#1E1E24' }}>{APP_NAME}</span>
            </div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: '36px', fontWeight: 600, lineHeight: 1.25, color: '#1E1E24', marginBottom: '14px' }}>Your documents,<br /><span style={{ color: '#C8842A', fontStyle: 'italic' }}>finally understandable.</span></h1>
            <p style={{ color: '#6B6560', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>Upload any PDF and ask questions like talking to a person. Clear answers with exact sources — no tech skills needed.</p>
            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#8C8580', flexWrap: 'wrap' }}>
              <span>✓ Source citations included</span>
              <span>✓ Private & secure</span>
              <span>✓ Free to start</span>
            </div>
          </div>
          <div style={{ flex: '1 1 400px', padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: '22px', fontWeight: 600, color: '#1E1E24', marginBottom: '4px' }}>{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p style={{ color: '#8C8580', fontSize: '13px', marginBottom: '24px' }}>{isLogin ? 'Sign in to continue' : 'Free forever. No credit card.'}</p>
            {error && <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!isLogin && <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required style={{ border: '1px solid #E5E0DB', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', background: '#FBF7F4', color: '#1E1E24' }} />}
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ border: '1px solid #E5E0DB', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', background: '#FBF7F4', color: '#1E1E24' }} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ border: '1px solid #E5E0DB', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', background: '#FBF7F4', color: '#1E1E24' }} />
              <button type="submit" disabled={loading} style={{ backgroundColor: '#C8842A', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '4px' }}>{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}</button>
            </form>
            <p style={{ color: '#8C8580', fontSize: '12px', textAlign: 'center', marginTop: '18px' }}>{isLogin ? "Don't have an account?" : 'Already have an account?'} <span onClick={() => { setIsLogin(!isLogin); setError('') }} style={{ color: '#C8842A', fontWeight: 600, cursor: 'pointer' }}>{isLogin ? 'Register' : 'Sign In'}</span></p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 600, color: '#1E1E24', marginBottom: '10px' }}>How It Works</h2>
          <p style={{ color: '#8C8580', fontSize: '15px', marginBottom: '48px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>Four simple steps. No technical skills required.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ backgroundColor: '#FBF7F4', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E5E0DB' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#C8842A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, margin: '0 auto 18px' }}>{s.step}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1E1E24', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: '#8C8580', fontSize: '13px', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANIMATED DEMO — Fixed height, smooth fade transition */}
      <section id="demo" style={{ padding: '80px 24px', background: '#F5F0EB', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40%', right: '-20%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,132,42,0.06) 0%, transparent 70%)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,132,42,0.05) 0%, transparent 70%)', opacity: 0.5 }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 600, color: '#1E1E24', marginBottom: '10px' }}>See It In Action</h2>
          <p style={{ color: '#8C8580', fontSize: '15px', marginBottom: '40px' }}>Watch how AskPaper turns a PDF into answers in seconds.</p>
          
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E0DB',
            padding: '40px', maxWidth: '600px', margin: '0 auto',
            height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <div className={fadeClass} style={{
              textAlign: 'center', width: '100%',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{demoContent[demoStep].icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1E1E24', marginBottom: '8px' }}>{demoContent[demoStep].title}</h3>
              <p style={{ color: '#8C8580', fontSize: '14px', marginBottom: '4px' }}>{demoContent[demoStep].desc}</p>
              {demoContent[demoStep].content}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
            {[0, 1, 2, 3].map((d) => (<div key={d} style={{ width: demoStep === d ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: demoStep === d ? '#C8842A' : '#E5E0DB', transition: 'all 0.3s ease' }} />))}
          </div>
        </div>
      </section>

      {/* WHY PEOPLE LOVE IT — 4 cards in one row */}
      <section id="features" style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 600, color: '#1E1E24', textAlign: 'center', marginBottom: '10px' }}>Why People Love AskPaper</h2>
          <p style={{ color: '#8C8580', fontSize: '15px', textAlign: 'center', marginBottom: '48px' }}>Simple, honest reasons.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ flex: '1 1 0', minWidth: '0', backgroundColor: '#FBF7F4', borderRadius: '16px', padding: '32px 24px', border: '1px solid #E5E0DB' }}>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1E1E24', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#8C8580', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THIS IS FOR */}
      <section style={{ padding: '80px 24px', background: '#F5F0EB', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\"><rect fill=\"%23F5F0EB\" width=\"400\" height=\"300\"/><path d=\"M0 200 Q100 100 200 200 T400 200\" stroke=\"%23C8842A\" stroke-width=\"1\" fill=\"none\" opacity=\"0.08\"/><path d=\"M0 220 Q100 120 200 220 T400 220\" stroke=\"%23C8842A\" stroke-width=\"1\" fill=\"none\" opacity=\"0.05\"/></svg>')",
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4,
        }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 600, color: '#1E1E24', marginBottom: '8px' }}>This Is For</h2>
          <p style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 600, color: '#1E1E24', marginBottom: '48px' }}>
            Anyone who reads documents. Seriously.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {audiences.map((b, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '36px 28px', border: '1px solid #E5E0DB' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#C8842A', marginBottom: '10px' }}>{b.title}</h3>
                <p style={{ color: '#8C8580', fontSize: '14px', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: '#FFFFFF' }}>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 600, color: '#1E1E24', marginBottom: '12px' }}>Ready to understand your documents?</h2>
        <p style={{ color: '#8C8580', fontSize: '15px', marginBottom: '28px' }}>Free to start. No credit card. Takes less than a minute.</p>
        <a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ backgroundColor: '#C8842A', color: '#fff', padding: '14px 36px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Start Free Now</a>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E0DB', padding: '32px 24px', background: '#FBF7F4' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#C8842A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', fontWeight: 700 }}>?</div>
            <span style={{ fontFamily: "'Lora', serif", fontSize: '16px', fontWeight: 600, color: '#1E1E24' }}>{APP_NAME}</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#features" style={{ color: '#8C8580', fontSize: '13px', textDecoration: 'none' }}>Features</a>
            <a href="#how" style={{ color: '#8C8580', fontSize: '13px', textDecoration: 'none' }}>How It Works</a>
            <a href="#demo" style={{ color: '#8C8580', fontSize: '13px', textDecoration: 'none' }}>Demo</a>
          </div>
          <p style={{ color: '#B5B0AA', fontSize: '12px' }}>2026 {APP_NAME}. Answers with proof, not promises.</p>
        </div>
      </footer>

      <style>{`
        .demo-fade-in { opacity: 1; transform: translateY(0); }
        .demo-fade-out { opacity: 0; transform: translateY(8px); }
        @keyframes demoPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default Home