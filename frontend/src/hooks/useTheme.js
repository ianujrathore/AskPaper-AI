import { useState, useEffect, useMemo } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('askpaper-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    localStorage.setItem('askpaper-theme', dark ? 'dark' : 'light')
    document.body.className = dark ? 'dark' : 'light'
  }, [dark])

  const theme = useMemo(() => ({
    bg: dark ? '#08080c' : '#faf9f5',
    surface: dark ? '#121216' : '#fff',
    surface2: dark ? '#1a1a20' : '#f4f2ec',
    surface3: dark ? '#24242c' : '#eae7df',
    border: dark ? 'rgba(255,255,255,.07)' : 'rgba(20,18,14,.08)',
    borderStrong: dark ? 'rgba(255,255,255,.13)' : 'rgba(20,18,14,.16)',
    text: dark ? '#f2f2f4' : '#1b1a16',
    textSecondary: dark ? '#a1a1a8' : '#58554e',
    textTertiary: dark ? '#6b6b74' : '#8e8a82',
    accent: dark ? '#7b6cf6' : '#8b6914',
    accentWarm: dark ? '#f0a84c' : '#c4a050',
    accentGradient: dark ? 'linear-gradient(135deg,#7b6cf6,#f0a84c)' : 'linear-gradient(135deg,#8b6914,#c4a050)',
    glassBg: dark ? 'rgba(18,18,22,.72)' : 'rgba(255,255,255,.78)',
  }), [dark])

  return { dark, setDark, theme }
}