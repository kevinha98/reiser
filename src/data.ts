// ─── Thailand 2026 — Reisedata ───────────────────────────────────────────────

export interface Destinasjon {
  id: string
  navn: string
  periode: string
  datoFra: string
  datoTil: string
  netter: number
  hotell: string
  hotellLink?: string
  emoji: string
  farge: 'gold' | 'ocean' | 'jungle'
  beskrivelse: string
  bilder?: string[]
}

export interface Utgift {
  id: string
  kategori: 'transport' | 'overnatting'
  navn: string
  totalt: number | null
  perPerson: number | null
  betaltAv: string | null
  oppgjort: boolean
  merknad?: string
  netter?: number
  destinasjon?: string
}

export interface SjekklisteElement {
  id: string
  tekst: string
  kategori: string
  fullfort: boolean
}

// ─── Reisedatoer ──────────────────────────────────────────────────────────────

export const REISEDATOER = {
  avreiseDato: '2026-08-11',   // tirsdag
  hjemkomstDato: '2026-09-01', // tirsdag
  avreiseFly: 'CPH → BKK • 11. aug kl. 11:30 → 12. aug kl. 09:30',
  hjemkomstFly: 'BKK → CPH • 1. sep kl. 12:05 → 22:30',
  totaltNetter: 20,
}

// ─── Destinasjoner ────────────────────────────────────────────────────────────

export const DESTINASJONER: Destinasjon[] = [
  {
    id: 'bangkok-1',
    navn: 'Bangkok',
    periode: '12.–15. aug',
    datoFra: '2026-08-12',
    datoTil: '2026-08-15',
    netter: 3,
    hotell: 'Hope Land Hotel Sukhumvit 8',
    farge: 'gold',
    emoji: '🏙️',
    beskrivelse: 'Pulserende by, streetfood og tempelrunder',
  },
  {
    id: 'koh-samui',
    navn: 'Koh Samui',
    periode: '15.–22. aug',
    datoFra: '2026-08-15',
    datoTil: '2026-08-22',
    netter: 7,
    hotell: 'Lamai Coconut Beach Resort',
    farge: 'ocean',
    emoji: '🌴',
    beskrivelse: 'Tropisk øy med hvite strender og turkist hav',
  },
  {
    id: 'phuket',
    navn: 'Phuket',
    periode: '22.–29. aug',
    datoFra: '2026-08-22',
    datoTil: '2026-08-29',
    netter: 7,
    hotell: 'Chanalai Flora Resort, Kata Beach',
    farge: 'jungle',
    emoji: '🏖️',
    beskrivelse: 'Kata Beach, snorkling og solnedganger',
  },
  {
    id: 'bangkok-2',
    navn: 'Bangkok II',
    periode: '29. aug – 1. sep',
    datoFra: '2026-08-29',
    datoTil: '2026-09-01',
    netter: 3,
    hotell: 'Mandarin Hotel, Managed by Centre Point',
    farge: 'gold',
    emoji: '🌆',
    beskrivelse: 'Siste dager — shopping, mat og avslapping',
  },
]

// ─── Budsjett ─────────────────────────────────────────────────────────────────

export const UTGIFTER: Utgift[] = [
  {
    id: 'fly-bonus',
    kategori: 'transport',
    navn: 'Fly CPH ↔ BKK — Business Class',
    totalt: 4857.10,
    perPerson: 2428.55,
    betaltAv: null,
    oppgjort: false,
    merknad: '11. aug (avreise) / 1. sep (hjem)',
  },
  {
    id: 'fly-bkk',
    kategori: 'transport',
    navn: 'Fly HKT → BKK (intern)',
    totalt: 936.70,
    perPerson: 468.35,
    betaltAv: null,
    oppgjort: false,
    merknad: 'HKT → BKK 29. aug',
  },
  {
    id: 'hotell-bkk-1',
    kategori: 'overnatting',
    navn: 'Hotell Bangkok (1)',
    totalt: 1644.87,
    perPerson: 822.44,
    betaltAv: null,
    oppgjort: true,
    merknad: '12.–15. aug',
    netter: 3,
    destinasjon: 'Bangkok',
  },
  {
    id: 'hotell-samui',
    kategori: 'overnatting',
    navn: 'Hotell Koh Samui',
    totalt: 5510.89,
    perPerson: 2755.45,
    betaltAv: null,
    oppgjort: true,
    merknad: '15.–22. aug',
    netter: 7,
    destinasjon: 'Koh Samui',
  },
  {
    id: 'hotell-phuket',
    kategori: 'overnatting',
    navn: 'Hotell Phuket',
    totalt: 5703.18,
    perPerson: 2851.59,
    betaltAv: null,
    oppgjort: true,
    merknad: '22.–29. aug',
    netter: 7,
    destinasjon: 'Phuket',
  },
  {
    id: 'hotell-bkk-2',
    kategori: 'overnatting',
    navn: 'Hotell Bangkok (2)',
    totalt: 1979.55,
    perPerson: 989.78,
    betaltAv: null,
    oppgjort: true,
    merknad: '29. aug – 1. sep',
    netter: 3,
    destinasjon: 'Bangkok II',
  },
]

// ─── Standard sjekkliste ──────────────────────────────────────────────────────

export const STANDARD_SJEKKLISTE: Omit<SjekklisteElement, 'fullfort'>[] = [
  // Transport
  { id: 'fly-bestilt', tekst: 'Fly CPH ↔ BKK bestilt', kategori: 'Transport' },
  { id: 'fly-samui', tekst: 'Fly Koh Samui (15. aug)', kategori: 'Transport' },
  { id: 'fly-phuket', tekst: 'Fly Phuket (22. aug)', kategori: 'Transport' },
  { id: 'innreiseskjema', tekst: 'Innreiseskjema Thailand (Thailand Pass / e-arrival)', kategori: 'Transport' },

  // Overnatting
  { id: 'hotell-cph', tekst: 'Hotell CPH (om nødvendig)', kategori: 'Overnatting' },
  { id: 'bekreft-hotell', tekst: 'Bekrefte alle hotellbookinger', kategori: 'Overnatting' },
  { id: 'checkin-tider', tekst: 'Sjekk innsjekk-/utsjekk-tider', kategori: 'Overnatting' },

  // Dokumenter
  { id: 'pass-gyldig', tekst: 'Pass gyldig (min. 6 mnd etter hjemkomst)', kategori: 'Dokumenter' },
  { id: 'reiseforsikring', tekst: 'Reiseforsikring tegnet', kategori: 'Dokumenter' },
  { id: 'kopi-pass', tekst: 'Kopi av pass + forsikring lagret digitalt', kategori: 'Dokumenter' },
  { id: 'valuta', tekst: 'Bestille thai baht / sørge for tilgang til minibank', kategori: 'Dokumenter' },

  // Helse
  { id: 'vaksiner', tekst: 'Sjekke vaksinestatus (Hepatitt A/B, tyfus)', kategori: 'Helse' },
  { id: 'malaria', tekst: 'Evt. malariamedisin', kategori: 'Helse' },
  { id: 'reiseapotek', tekst: 'Reiseapotek pakket', kategori: 'Helse' },
  { id: 'solkrem', tekst: 'Solkrem SPF 50+', kategori: 'Helse' },

  // Pakking
  { id: 'klær', tekst: 'Pakke klær (lett, luftig)', kategori: 'Pakking' },
  { id: 'adapter', tekst: 'Strømadapter (type A/B/C)', kategori: 'Pakking' },
  { id: 'sim', tekst: 'Lokalt SIM-kort eller eSIM-plan', kategori: 'Pakking' },
  { id: 'powerbank', tekst: 'Powerbank ladet', kategori: 'Pakking' },
  { id: 'kamera', tekst: 'Kamera / GoPro + minnekort', kategori: 'Pakking' },
]
