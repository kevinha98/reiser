import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { sendChatMessage, type ChatMessage } from '../api/chatApi'

interface DisplayMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const apiKeyMissing = !import.meta.env.VITE_RADICAL_API_KEY

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, scrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: DisplayMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    const history: ChatMessage[] = [
      ...messages.filter((m) => !m.error).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: text },
    ]

    try {
      const reply = await sendChatMessage({ messages: history, signal: controller.signal })
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: reply },
      ])
    } catch (err) {
      if ((err as Error).name === 'AbortError') return

      const errMsg =
        (err as Error).message === 'API_KEY_MISSING'
          ? 'API-nøkkel mangler. Legg til VITE_RADICAL_API_KEY i .env.local.'
          : `Feil: ${(err as Error).message}`

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: errMsg, error: true },
      ])
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function clearChat() {
    abortRef.current?.abort()
    setMessages([])
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Lukk chatbot' : 'Åpne reiseassistent'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.9) 0%, rgba(217,119,6,0.9) 100%)',
          boxShadow: '0 0 32px rgba(245,158,11,0.25), 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={22} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] flex flex-col rounded-2xl overflow-hidden"
            style={{
              maxHeight: 'min(580px, calc(100dvh - 140px))',
              background: 'rgba(10, 13, 20, 0.96)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
            role="dialog"
            aria-label="Reiseassistent"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}
                >
                  <MessageCircle size={15} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none mb-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Reiseassistent
                  </p>
                  <p className="text-slate-600 text-xs">Thailand 2026 · Claude Sonnet</p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  aria-label="Tøm chat"
                  className="text-slate-600 hover:text-slate-400 transition-colors p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}
                  >
                    <MessageCircle size={22} className="text-amber-400/60" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Hva lurer du på?
                  </p>
                  {apiKeyMissing ? (
                    <p className="text-amber-600/80 text-xs mt-2 flex items-center gap-1.5">
                      <AlertCircle size={11} />
                      API-nøkkel mangler i .env.local
                    </p>
                  ) : (
                    <p className="text-slate-600 text-xs">
                      Restauranter, aktiviteter, pakketips...
                    </p>
                  )}
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-sm'
                        : msg.error
                        ? 'text-amber-400/80 rounded-bl-sm'
                        : 'text-slate-200 rounded-bl-sm'
                    }`}
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'rgba(245,158,11,0.18)'
                          : msg.error
                          ? 'rgba(245,158,11,0.06)'
                          : 'rgba(255,255,255,0.05)',
                      border:
                        msg.role === 'user'
                          ? '1px solid rgba(245,158,11,0.20)'
                          : msg.error
                          ? '1px solid rgba(245,158,11,0.12)'
                          : '1px solid rgba(255,255,255,0.06)',
                      fontFamily: "'DM Sans', sans-serif",
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.error && <AlertCircle size={12} className="inline mr-1.5 mb-0.5" />}
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Loader2 size={15} className="text-amber-400/60 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Still et spørsmål…"
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 resize-none outline-none leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    maxHeight: '120px',
                    minHeight: '22px',
                  }}
                  aria-label="Skriv melding"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  aria-label="Send melding"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: input.trim() && !loading ? 'rgba(245,158,11,0.85)' : 'rgba(245,158,11,0.15)',
                  }}
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
              <p className="text-slate-700 text-[10px] text-center mt-2">
                Enter for å sende · Shift+Enter for ny linje
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
