/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from 'react'
import THEMES from './themes'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const theme = 'match-day'

  useEffect(() => {
    const t = THEMES[theme]
    if (!t) return
    const root = document.documentElement
    Object.entries(t.colors).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
    root.setAttribute('data-theme', theme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
