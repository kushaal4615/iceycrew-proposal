import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
  // ?theme=dark|light forces a theme (screenshots, sharing a specific look)
  const [theme, setTheme] = useState<Theme>(() => {
    const q = new URLSearchParams(location.search).get('theme')
    if (q === 'light' || q === 'dark') return q
    try {
      const s = localStorage.getItem('proposal-theme')
      if (s === 'light' || s === 'dark') return s
    } catch {
      /* storage blocked */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const c = getComputedStyle(document.documentElement).getPropertyValue('--ground').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', c)
    try {
      localStorage.setItem('proposal-theme', theme)
    } catch {
      /* storage blocked */
    }
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
