import { Link, useLocation } from 'react-router-dom'
import { APP_NAME } from '../../lib/constants'

function Navbar({ darkMode, setDarkMode, theme, onMenuClick }) {
  return (
    <div style={{
      height: '44px', minHeight: '44px',
      backgroundColor: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: '8px', flexShrink: 0,
      transition: 'all 0.3s ease',
    }}>
      {onMenuClick && (
        <button onClick={onMenuClick}
          style={{
            background: 'none', border: 'none', fontSize: '20px',
            cursor: 'pointer', color: theme.text, padding: '4px 6px',
            borderRadius: '6px',
          }}>
          ☰
        </button>
      )}

      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: theme.text }}>
        <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}>?</div>
        <span style={{ fontFamily: "'Lora', serif", fontSize: '14px', fontWeight: 700 }}>{APP_NAME}</span>
      </Link>

      <div style={{ marginLeft: 'auto' }}>
        <button onClick={() => setDarkMode(!darkMode)}
          style={{
            background: theme.sidebarHover, border: `1px solid ${theme.border}`,
            borderRadius: '8px', padding: '5px 10px', cursor: 'pointer',
            fontSize: '14px', color: theme.text, transition: 'all 0.2s ease',
            width: '38px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          {darkMode ? '☀' : '🌙'}
        </button>
      </div>
    </div>
  )
}

export default Navbar