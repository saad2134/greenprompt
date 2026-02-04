'use client'

import { ThemeProvider } from '@/contexts/theme-provider'

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}