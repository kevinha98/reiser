import { REISEDATOER, DESTINASJONER } from '../data'
import type { Destinasjon } from '../data'

export type Fase = 'før' | 'under' | 'etter'

export interface Reisefase {
  fase: Fase
  nå: Date
  dagNr: number            // 1 = avreisedag (11. aug). <=0 før avreise
  totalDager: number       // avreise → siste dag i Thailand, inklusive
  dagerTil: number         // hele dager igjen til avreise (0 når reisen har startet)
  gjeldende?: Destinasjon   // destinasjonen man er på akkurat nå
  neste?: Destinasjon       // neste destinasjon som ikke har startet ennå
  gjeldendeIndex: number    // indeks i DESTINASJONER, -1 hvis ingen
}

const MS_PER_DAG = 86_400_000

function tilMidnatt(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Beregner hvor i reisen man er ut fra en gitt "nå"-dato. */
export function beregnReisefase(nå: Date): Reisefase {
  const avreise = tilMidnatt(new Date(REISEDATOER.avreiseDato))
  const sisteDag = tilMidnatt(new Date(REISEDATOER.hjemkomstDato)) // 1. sep — siste dag i Thailand
  const iDag = tilMidnatt(nå)

  const totalDager = Math.round((sisteDag.getTime() - avreise.getTime()) / MS_PER_DAG) + 1
  const dagerTil = Math.max(0, Math.round((avreise.getTime() - iDag.getTime()) / MS_PER_DAG))
  const dagNr = Math.round((iDag.getTime() - avreise.getTime()) / MS_PER_DAG) + 1

  let fase: Fase
  if (iDag.getTime() < avreise.getTime()) fase = 'før'
  else if (iDag.getTime() > sisteDag.getTime()) fase = 'etter'
  else fase = 'under'

  let gjeldendeIndex = -1
  DESTINASJONER.forEach((d, i) => {
    const fra = tilMidnatt(new Date(d.datoFra)).getTime()
    const til = tilMidnatt(new Date(d.datoTil)).getTime()
    if (iDag.getTime() >= fra && iDag.getTime() < til) gjeldendeIndex = i
  })

  const gjeldende = gjeldendeIndex >= 0 ? DESTINASJONER[gjeldendeIndex] : undefined
  const neste = DESTINASJONER.find(
    (d) => tilMidnatt(new Date(d.datoFra)).getTime() > iDag.getTime(),
  )

  return { fase, nå, dagNr, totalDager, dagerTil, gjeldende, neste, gjeldendeIndex }
}

/** Formaterer en ISO-dato (YYYY-MM-DD) som f.eks. "18. aug". */
export function kortDato(iso: string): string {
  const mnd = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']
  const d = new Date(iso)
  return `${d.getDate()}. ${mnd[d.getMonth()]}`
}
