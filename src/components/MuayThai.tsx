import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dumbbell, MapPin, Clock, PersonStanding, ChevronRight } from "lucide-react"

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
  tips: string
  gyms: GymInfo[]
}

const DESTINASJONER: Destinasjon[] = [
  {
    id: "samui",
    by: "Koh Samui",
    hotell: "Lamai Coconut Beach Resort",
    farge: "#38bdf8",
    tips: "Punch It Gym er i samme Lamai-omradet som hotellet. Flat rute langs strandveien — mulig morgenjog.",
    gyms: [
      {
        navn: "Punch It Gym",
        adresse: "Maret, Lamai Beach, Koh Samui",
        distanse: "1,5–2,5 km",
        tid: "10–15 min (taxi) / 12 min (jog)",
        pris: "700 THB gruppe — 1 800 THB privat",
        jogge: "ja",
        joggeTid: "12 min langs flat strandvei",
        notat: "Flatt underlag langs kystveien. Perfekt morgenjog 06:00–07:30 for 08:30-klassen.",
        bookingUrl: "https://www.klook.com/activity/127117-koh-samui-muay-thai-boxing-introduction-class-for-beginners/",
        klasser: ["Gruppe 90 min", "Privat 1t", "Nybegynner"],
        program: "Man–fre + son kl. 08:30 og 18:00. Lordag stengt.",
      },
    ],
  },
  {
    id: "phuket",
    by: "Phuket",
    hotell: "Chanalai Flora Resort, Kata Beach",
    farge: "#34d399",
    tips: "Tiger Muay Thai er naermest. Jogging dit er mulig men krever Kata Hill (60 m stigning). Jobb dit som warm-up, ta Grab hjem.",
    gyms: [
      {
        navn: "Tiger Muay Thai",
        adresse: "7/35 Moo 5, Soi Ta-iad, Ao Chalong, Phuket",
        distanse: "5 km",
        tid: "10–12 min (Grab)",
        pris: "Fra 600 THB / klasse",
        jogge: "mulig",
        joggeTid: "35–40 min inkl. Kata Hill (60 m stigning)",
        notat: "Et av Phukets storste turistgym. Apent man–lor. Grab hjem anbefales etter trening.",
        bookingUrl: "https://tigermuaythai.com/",
        klasser: ["Gruppe", "Nybegynner", "MMA", "1-til-1"],
        program: "Man–fre 06:00–19:00. Lordag 07:00–18:00.",
      },
      {
        navn: "RC Rachai Muay Thai",
        adresse: "Patong, Phuket",
        distanse: "9 km",
        tid: "18–22 min (Grab)",
        pris: "Fra 600 THB / klasse",
        jogge: "nei",
        notat: "For langt til a jogge. Grab anbefales.",
        bookingUrl: "https://www.getyourguide.com/patong-l93618/patong-muay-thai-boxing-class-at-rachai-muay-thai-gym-t1090639/",
        klasser: ["Gruppe", "Nybegynner"],
      },
    ],
  },
]

const JOGGE_LABEL: Record<string, string> = {
  ja: "Kan jogge dit",
  mulig: "Mulig, men krevende",
  nei: "Ta Grab",
}

const JOGGE_COLOR: Record<string, string> = {
  ja: "#34d399",
  mulig: "#f59e0b",
  nei: "rgba(100,116,139,0.6)",
}

export function MuayThai() {
  const [aktivDest, setAktivDest] = useState<string>("samui")
  const dest = DESTINASJONER.find((d) => d.id === aktivDest)!

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading — left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <Dumbbell size={15} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <p
              className="text-slate-600 text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Aktiviteter
            </p>
          </div>
          <h2
            className="text-white text-3xl mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            Muay Thai
          </h2>
          <p
            className="text-slate-500 text-sm max-w-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Gyms naer hotellene med reisedistanse og joggbarhet.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="flex gap-2 mb-6"
        >
          {DESTINASJONER.map((d) => (
            <button
              key={d.id}
              onClick={() => setAktivDest(d.id)}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: aktivDest === d.id ? d.farge + "20" : "rgba(255,255,255,0.04)",
                border: `1px solid ${aktivDest === d.id ? d.farge + "50" : "rgba(255,255,255,0.07)"}`,
                color: aktivDest === d.id ? d.farge : "rgba(100,116,139,0.85)",
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* Context strip */}
            <div
              className="rounded-xl px-4 py-3 mb-4 flex items-start gap-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${dest.farge}18`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                style={{ background: dest.farge }}
              />
              <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="text-slate-600 text-[11px]">Hotell: </span>
                <span className="text-slate-400 text-[11px]">{dest.hotell}</span>
                <p className="text-slate-600 text-[11px] mt-0.5">{dest.tips}</p>
              </div>
            </div>

            {/* Gym cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dest.gyms.map((gym) => (
                <div
                  key={gym.navn}
                  className="rounded-2xl p-5 flex flex-col"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    backdropFilter: "blur(12px)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight">{gym.navn}</h3>
                      <p className="text-slate-600 text-[11px] mt-0.5">{gym.adresse}</p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full ml-3 flex-shrink-0"
                      style={{
                        background: JOGGE_COLOR[gym.jogge] + "15",
                        color: JOGGE_COLOR[gym.jogge],
                        border: `1px solid ${JOGGE_COLOR[gym.jogge]}30`,
                      }}
                    >
                      {JOGGE_LABEL[gym.jogge]}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div
                      className="rounded-lg p-2.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <p className="text-slate-600 text-[9px] uppercase tracking-wider mb-0.5">Distanse</p>
                      <p className="text-white text-xs font-medium tabular-nums">{gym.distanse}</p>
                    </div>
                    <div
                      className="rounded-lg p-2.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <p className="text-slate-600 text-[9px] uppercase tracking-wider mb-0.5">Reisetid</p>
                      <p className="text-white text-xs font-medium">{gym.tid}</p>
                    </div>
                  </div>

                  {/* Jogging note */}
                  {gym.joggeTid && (
                    <div
                      className="rounded-lg px-3 py-2 mb-3 flex items-center gap-2"
                      style={{
                        background: JOGGE_COLOR[gym.jogge] + "08",
                        border: `1px solid ${JOGGE_COLOR[gym.jogge]}20`,
                      }}
                    >
                      <PersonStanding size={11} style={{ color: JOGGE_COLOR[gym.jogge], flexShrink: 0 }} strokeWidth={1.5} />
                      <p className="text-[10px]" style={{ color: JOGGE_COLOR[gym.jogge] }}>{gym.joggeTid}</p>
                    </div>
                  )}

                  {/* Price + schedule */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={11} className="text-slate-700 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-slate-500 text-[11px]">{gym.pris}</span>
                    </div>
                    {gym.program && (
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-slate-700 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-slate-600 text-[10px]">{gym.program}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {gym.klasser.map((k) => (
                      <span
                        key={k}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: dest.farge + "12",
                          color: dest.farge,
                          border: `1px solid ${dest.farge}28`,
                        }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed mb-3 flex-1">{gym.notat}</p>

                  {gym.bookingUrl && (
                    <a
                      href={gym.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] transition-opacity hover:opacity-80 mt-auto"
                      style={{ color: dest.farge, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Book
                      <ChevronRight size={11} strokeWidth={2} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
