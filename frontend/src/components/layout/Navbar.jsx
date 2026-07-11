import { Link } from 'react-router-dom'
import { APP_NAME } from '../../lib/constants'

function Navbar({ dark, setDark, theme, onMenuClick }) {
  return (
    <div style={{
      height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', background: theme.glassBg, backdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${theme.border}`, flexShrink: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {onMenuClick && (
          <button onClick={onMenuClick} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: theme.text, padding: '4px 8px', borderRadius: 6 }}>☰</button>
        )}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, color: '#fff' }}>A</div>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-.01em' }}>{APP_NAME}</span>
        </Link>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setDark(!dark)} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, fontSize: 16 }}>{dark ? '☀️' : '🌙'}</button>
      </div>
    </div>
  )
}

export default Navbar