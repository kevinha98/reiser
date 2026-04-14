// ─── Radical Gateway — Chat API ───────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatOptions {
  messages: ChatMessage[]
  onChunk?: (chunk: string) => void
  signal?: AbortSignal
}

// Relative URL — proxied via Netlify Function in prod, Vite proxy in dev.
// The actual API key is injected server-side; it never touches the browser bundle.
const GATEWAY_URL = '/api/chat'
const MODEL = 'eu-sonnet-4-6'

const SYSTEM_PROMPT = `Du er en personlig reiseassistent for en luksusferie til Thailand i august–september 2026.

Reiseplanen:
- 11. aug: Avreise fra København (CPH) med Business Class-fly til Bangkok
- 12.–15. aug: Bangkok — Hope Land Hotel Sukhumvit 8 (3 netter)
- 15.–22. aug: Koh Samui — Lamai Coconut Beach Resort (7 netter)
- 22.–29. aug: Phuket — Chanalai Flora Resort, Kata Beach (7 netter)
- 29. aug – 1. sep: Bangkok igjen — Mandarin Hotel Centre Point (3 netter)
- 1. sep: Hjemreise til CPH

Du kan hjelpe med absolutt alt som kan tenkes å være nyttig for denne reisen og alt for øvrig: restaurantanbefalinger, aktiviteter, lokale tips, transport, packing, visumkrav, helseråd, valuta, kultur, språk, mat, shopping, snorkling, templer, solfaktorer, nightlife, luksuserfaringer, og alt annet man kan finne på.

Svar på det språket brukeren bruker (norsk eller engelsk). Du er varm, kunnskapsrik og entusiastisk som en erfaren luksuriøs reisekonsulent. Svar fritt og utdypende — ikke hold deg tilbake. Du kan og bør svare på spørsmål utenfor reisen også.`

export async function sendChatMessage(options: ChatOptions): Promise<string> {
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...options.messages.filter((m) => m.role !== 'system'),
      ],
    }),
    signal: options.signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`API_ERROR: ${response.status} — ${errorText}`)
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>
    error?: { message: string }
  }

  if (data.error) {
    throw new Error(`API_ERROR: ${data.error.message}`)
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('API_ERROR: Empty response from model')
  }

  return content
}
