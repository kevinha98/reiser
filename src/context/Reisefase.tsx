import { useEffect, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { beregnReisefase } from '../lib/reisefase'
import { ReisefaseContext } from './reisefase-context'

const SIM_KEY = 'min-ferie-simdato'

function lesInitSim(): string | null {
  try {
    const url = new URLSearchParams(window.location.search)
    const q = url.get('dato')
    if (q) {
      localStorage.setItem(SIM_KEY, q)
      return q
    }
    return localStorage.getItem(SIM_KEY)
  } catch {
    return null
  }
}

export function ReisefaseProvider({ children }: { children: ReactNode }) {
  const [simDato, setSim] = useState<string | null>(lesInitSim)
  const [, tikk] = useReducer((x: number) => x + 1, 0)

  // I ekte modus tikker klokka hvert sekund (nedtelling); i simuleringsmodus er tiden frossen.
  useEffect(() => {
    if (simDato) return
    const id = setInterval(tikk, 1000)
    return () => clearInterval(id)
  }, [simDato])

  function settSimDato(dato: string | null) {
    try {
      if (dato) localStorage.setItem(SIM_KEY, dato)
      else localStorage.removeItem(SIM_KEY)
    } catch {
      // localStorage utilgjengelig — behold kun i minne
    }
    setSim(dato)
  }

  const nå = simDato ? new Date(`${simDato}T09:00:00`) : new Date()
  const fase = beregnReisefase(nå)

  return (
    <ReisefaseContext.Provider value={{ ...fase, simDato, settSimDato }}>
      {children}
    </ReisefaseContext.Provider>
  )
}

