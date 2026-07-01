import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GymInfo {
  navn: string
  adresse: string
  distanse: string
  tid: string
  pris: string
  jogge: "ja" | "mulig" | "nei"
  joggeTid?: string
  notat: string
  bookingUrl?: string
  klasser: string[]
  program?: string
}

interface Destinasjon {
  id: string
  by: string
  hotell: string
  farge: string
  gyms: GymInfo[]
  stadioner: { navn: string; program: string; billett: string; avstand: string }[]
  tips: string
}

const DESTINASJONER: Destinasjon[] = [
  {
    id: "bkk",
    by: "Bangkok",
    hotell: "Hope Land Hotel Sukhumvit 8",
    farge: "#f59e0b",
    tips: "Ikke jogg i gatene - for varmt og kaotisk. Jobb i Benjakitti Park (1,5 km fra hotellet) om morgenen, ta Grab til gym.",
    gyms: [
      {
        navn: "FITFAC",
        adresse: "Sukhumvit soi 20-23, Bangkok",
        distanse: "~1,5 km",
        tid: "5-10 min",
        pris: "Fra ~500 THB / klasse",
        jogge: "nei",
        notat: "1-til-1 klasse tilgjengelig. Inkl. gratis Muay Thai-shorts.",
        bookingUrl: "https://www.getyourguide.com/bangkok-l169/bangkok-learn-1-1-muay-thai-free-muaythai-shorts-pickup-t438453/",
        klasser: ["1-til-1", "Nybegynner"],
      },
      {
        navn: "Tocayah Fight Club",
        adresse: "Sentral Bangkok",
        distanse: "~3-5 km",
        tid: "10-20 min",
        pris: "Fra ~600 THB / klasse",
        jogge: "nei",
        notat: "Gruppetrening i profesjonelt kampgym.",
        bookingUrl: "https://www.getyourguide.com/bangkok-l169/bangkok-muay-thai-training-experience-in-professional-gym-t959570/",
        klasser: ["Gruppe", "Nybegynner", "Mellomniva"],
      },
    ],
    stadioner: [
      { navn: "Rajadamnern Stadium", program: "Man-son", billett: "Fra 1 500 THB", avstand: "~7 km / 25-30 min" },
      { navn: "Lumpinee Boxing Stadium", program: "Fre & lor", billett: "Fra 1 000 THB", avstand: "~13 km / 35-45 min" },
      { navn: "MBK Center (gratis)", program: "1. og siste ons i mnd", billett: "GRATIS", avstand: "~3 km / 15 min (BTS)" },
    ],
  },
  {
    id: "samui",
    by: "Koh Samui",
    hotell: "Lamai Coconut Beach Resort",
    farge: "#38bdf8",
    tips: "Best case! Punch It Gym er i samme Lamai-omrade som hotellet. Jobb dit langs strandveien tidlig morgen.",
    gyms: [
      {
        navn: "Punch It Gym",
        adresse: "Maret, Lamai Beach, Koh Samui",
        distanse: "~1,5-2,5 km",
        tid: "~10-15 min (taxi) / ~12 min (jog)",
        pris: "700 THB gruppe / 1 800 THB privat",
        jogge: "ja",
        joggeTid: "~12 min langs flat strandvei",
        notat: "Flatt underlag langs kystveien (Route 4169). Flat rute - perfekt morgenjog kl. 06:00-07:30 for 08:30-klassen.",
        bookingUrl: "https://www.klook.com/activity/127117-koh-samui-muay-thai-boxing-introduction-class-for-beginners/",
        klasser: ["Gruppe 90 min", "Privat 1t", "Nybegynner OK"],
        program: "Man-fre + son kl. 08:30 og 18:00 (lor stengt)",
      },
    ],
    stadioner: [
      { navn: "Phetchbuncha Stadium", program: "Alle dager unntatt tor", billett: "1 500-2 500 THB", avstand: "~10 km / 20 min (taxi)" },
      { navn: "Samui International Stadium", program: "Alle dager unntatt tor", billett: "1 500-3 000 THB", avstand: "~10 km / 20 min (taxi)" },
    ],
  },
  {
    id: "phuket",
    by: "Phuket",
    hotell: "Chanalai Flora Resort, Kata Beach",
    farge: "#34d399",
    tips: "Tiger Muay Thai er nermest. Jogging dit er mulig men krever at du takler Kata Hill (60m stigning). Jogg dit som warm-up, ta Grab hjem.",
    gyms: [
      {
        navn: "Tiger Muay Thai",
        adresse: "7/35 Moo 5, Soi Ta-iad, Ao Chalong, Phuket",
        distanse: "~5 km",
        tid: "~10-12 min (Grab)",
        pris: "Fra ~600 THB / klasse",
        jogge: "mulig",
        joggeTid: "~35-40 min - inkl. Kata Hill (60m stigning)",
        notat: "Et av Phukets storste turistgym. Apent man-lor. Grab hjem anbefales etter trening.",
        bookingUrl: "https://tigermuaythai.com/",
        klasser: ["Gruppe", "Nybegynner", "MMA", "1-til-1"],
        program: "Man-fre 06:00-19:00, lor 07:00-18:00",
      },
      {
        navn: "RC Rachai Muay Thai",
        adresse: "Patong-omradet, Phuket",
        distanse: "~9 km",
        tid: "~18-22 min (Grab)",
        pris: "Fra ~600 THB / klasse",
        jogge: "nei",
        notat: "For langt til a jogge. Grab anbefales.",
        bookingUrl: "https://www.getyourguide.com/patong-l93618/patong-muay-thai-boxing-class-at-rachai-muay-thai-gym-t1090639/",
        klasser: ["Gruppe", "Nybegynner"],
      },
    ],
    stadioner: [
      { navn: "Bangla Boxing Stadium", program: "Hver kveld", billett: "1 300-2 200 THB", avstand: "~9 km / 18-22 min (Grab)" },
      { navn: "Patong Boxing Stadium", program: "Man-lor", billett: "1 300-2 000 THB", avstand: "~9 km / 18-22 min (Grab)" },
      { navn: "Rawai Boxing Stadium", program: "Fredag", billett: "Varierer", avstand: "~8 km / 15 min (Grab)" },
      { navn: "Sinbi Boxing Stadium", program: "Ons & lor", billett: "Varierer", avstand: "~8 km / 15 min (Grab)" },
    ],
  },
]

function JoggeIkon({ status }: { status: "ja" | "mulig" | "nei" }) {
  if (status === "ja") return <span title="Kan jogge dit">👟</span>
  if (status === "mulig") return <span title="Mulig a jogge dit">⚠️</span>
  return <span title="Ikke anbefalt a jogge">🚗</span>
}

export function MuayThai() {
  const [aktivDest, setAktivDest] = useState<string>("samui")
  const dest = DESTINASJONER.find((d) => d.id === aktivDest)!

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p
            className="text-slate-600 text-xs uppercase tracking-[0.2em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Aktiviteter
          </p>
          <h2
            className="text-white text-3xl"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            Muay Thai
          </h2>
          <p
            className="text-slate-500 text-sm mt-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Gyms og kamparenaer nær hotellene — med reisedistanse og joggbarhet
          </p>
        </motion.div>

        {/* Dest tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {DESTINASJONER.map((d) => (
            <button
              key={d.id}
              onClick={() => setAktivDest(d.id)}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: aktivDest === d.id ? d.farge + "22" : "rgba(255,255,255,0.04)",
                border: `1px solid ${aktivDest === d.id ? d.farge + "55" : "rgba(255,255,255,0.07)"}`,
                color: aktivDest === d.id ? d.farge : "rgba(100,116,139,0.9)",
                fontWeight: aktivDest === d.id ? 600 : 400,
              }}
            >
              {d.by}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={aktivDest}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {/* Hotel + tips banner */}
            <div
              className="glass rounded-2xl px-5 py-4 mb-4"
              style={{ borderColor: dest.farge + "20" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: dest.farge }} />
                <div>
                  <p
                    className="text-slate-400 text-xs mb-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Hotell: <span className="text-white">{dest.hotell}</span>
                  </p>
                  <p
                    className="text-slate-500 text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    💡 {dest.tips}
                  </p>
                </div>
              </div>
            </div>

            {/* Gyms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {dest.gyms.map((gym) => (
                <div
                  key={gym.navn}
                  className="glass rounded-2xl p-5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-base">{gym.navn}</h3>
                      <p className="text-slate-600 text-[11px] mt-0.5">{gym.adresse}</p>
                    </div>
                    <div className="text-lg ml-2 flex-shrink-0">
                      <JoggeIkon status={gym.jogge} />
                    </div>
                  </div>

                  {/* Distance + time grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div
                      className="rounded-xl p-2.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <p className="text-slate-600 text-[9px] uppercase tracking-wider mb-0.5">Distanse</p>
                      <p className="text-white text-xs font-medium">{gym.distanse}</p>
                    </div>
                    <div
                      className="rounded-xl p-2.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <p className="text-slate-600 text-[9px] uppercase tracking-wider mb-0.5">Reisetid</p>
                      <p className="text-white text-xs font-medium">{gym.tid}</p>
                    </div>
                  </div>

                  {/* Jogge row */}
                  {gym.joggeTid && (
                    <div
                      className="rounded-xl px-3 py-2 mb-3"
                      style={{
                        background: gym.jogge === "ja" ? "rgba(52,211,153,0.06)" : "rgba(245,158,11,0.06)",
                        border: `1px solid ${gym.jogge === "ja" ? "rgba(52,211,153,0.15)" : "rgba(245,158,11,0.15)"}`,
                      }}
                    >
                      <p className="text-[10px]" style={{ color: gym.jogge === "ja" ? "#34d399" : "#f59e0b" }}>
                        🏃 {gym.joggeTid}
                      </p>
                    </div>
                  )}

                  {/* Pris */}
                  <p className="text-slate-400 text-xs mb-1">💰 {gym.pris}</p>

                  {/* Klasser */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {gym.klasser.map((k) => (
                      <span
                        key={k}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: dest.farge + "15",
                          color: dest.farge,
                          border: `1px solid ${dest.farge}30`,
                        }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>

                  {gym.program && (
                    <p className="text-slate-600 text-[10px] mb-3">📅 {gym.program}</p>
                  )}

                  <p className="text-slate-500 text-[11px] mb-3">{gym.notat}</p>

                  {gym.bookingUrl && (
                    <a
                      href={gym.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: dest.farge + "18",
                        color: dest.farge,
                        border: `1px solid ${dest.farge}35`,
                      }}
                    >
                      Book her →
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Stadiums */}
            <div className="glass rounded-2xl p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <p
                className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                🥊 Se kamp — Arenaer
              </p>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {dest.stadioner.map((s, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{s.navn}</p>
                        <p className="text-slate-600 text-[10px] mt-0.5">{s.program}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-slate-400 text-[11px]">{s.billett}</p>
                        <p className="text-slate-700 text-[10px]">{s.avstand}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-slate-700 text-[10px] mt-4 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                Kampstart typisk 20:00–21:00. Book billetter via GetYourGuide eller Klook pa forhand.
              </p>
            </div>

            {/* Jogge-legend */}
            <div className="mt-3 flex gap-4 flex-wrap px-1">
              <span className="text-slate-700 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                👟 Kan jogge dit
              </span>
              <span className="text-slate-700 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                ⚠️ Mulig, men krevende
              </span>
              <span className="text-slate-700 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                🚗 Ta Grab
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
