import { createContext, useContext } from 'react'
import type { Reisefase } from '../lib/reisefase'

export interface ReisefaseVerdi extends Reisefase {
  simDato: string | null
  settSimDato: (dato: string | null) => void
}

export const ReisefaseContext = createContext<ReisefaseVerdi | null>(null)

export function useReisefase(): ReisefaseVerdi {
  const c = useContext(ReisefaseContext)
  if (!c) throw new Error('useReisefase må brukes innenfor en ReisefaseProvider')
  return c
}
