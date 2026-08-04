export type LandKode = 'no' | 'dk' | 'nl' | 'th'

export const LAND_NAVN: Record<LandKode, string> = {
  no: 'Norge',
  dk: 'Danmark',
  nl: 'Nederland',
  th: 'Thailand',
}

const IATA_LAND: Record<string, LandKode> = {
  BGO: 'no',
  CPH: 'dk',
  AMS: 'nl',
  BKK: 'th',
  USM: 'th',
  HKT: 'th',
}

export function landForIata(iata: string): LandKode | undefined {
  return IATA_LAND[iata]
}
