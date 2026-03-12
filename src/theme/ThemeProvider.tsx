import React, { createContext, useContext, useMemo } from 'react'
import { theme, AppTheme } from './theme'

type ThemeContextValue = {
  theme: AppTheme
}

const ThemeContext = createContext<ThemeContextValue>({
  theme,
})

type Props = {
  readonly children: React.ReactNode
}

export function ThemeProvider({ children }: Props) {
  const value = useMemo(() => ({ theme }), [])
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  // Guard against running outside provider or multiple React instances
  if (!value?.theme) {
    return { theme }
  }
  return value
}