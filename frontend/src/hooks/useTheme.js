import { useState, useEffect } from 'react'

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('askpaper-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    localStorage.setItem('askpaper-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const theme = {
    bg: darkMode ? '#0C0E14' : '#FBF7F4',
    surface: darkMode ? '#161820' : '#FFFFFF',
    border: darkMode ? 'rgba(255,255,255,0.06)' : '#E5E0DB',
    text: darkMode ? '#FFFFFF' : '#1E1E24',
    textSecondary: darkMode ? 'rgba(255,255,255,0.55)' : '#6B6560',
    textMuted: darkMode ? 'rgba(255,255,255,0.3)' : '#B5B0AA',
    accent: '#4F8CF7',
    accentHover: '#6BA3FF',
    accentLight: darkMode ? 'rgba(79,140,247,0.1)' : 'rgba(79,140,247,0.06)',
    inputBg: darkMode ? '#1A1D26' : '#FFFFFF',
    inputBorder: darkMode ? 'rgba(255,255,255,0.1)' : '#D5CFC8',
    inputFocus: '#4F8CF7',
    userBubble: darkMode ? '#1E2130' : '#F5F0EB',
    aiBubble: darkMode ? '#161820' : '#FFFFFF',
    cardBg: darkMode ? '#161820' : '#FFFFFF',
    sidebarBg: darkMode ? '#12151C' : '#FFFFFF',
    sidebarHover: darkMode ? '#1A1D26' : '#F5F0EB',
  }

  return { darkMode, setDarkMode, theme }
}