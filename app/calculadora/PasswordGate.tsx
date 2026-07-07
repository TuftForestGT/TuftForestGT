'use client'

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'

const AUTH_KEY = 'tuftforest-calc-auth'
const PASSWORD = process.env.NEXT_PUBLIC_CALCULATOR_PASSWORD || ''

const BG     = '#09100a'
const CARD   = '#162018'
const CARD2  = '#1c2a1e'
const BORDER = '#243328'
const ACCENT = '#55c257'
const CREAM  = '#f0ebe0'
const MUTED  = '#5a7a5c'

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [checked, setChecked]   = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput]       = useState('')
  const [error, setError]       = useState(false)

  useEffect(() => {
    try {
      if (!PASSWORD || localStorage.getItem(AUTH_KEY) === PASSWORD) setUnlocked(true)
    } catch { /* ignore */ }
    setChecked(true)
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (input === PASSWORD) {
      try { localStorage.setItem(AUTH_KEY, PASSWORD) } catch { /* ignore */ }
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (!checked) return null
  if (unlocked) return <>{children}</>

  return (
    <div className="flex items-center justify-center px-5" style={{ height: '100dvh', background: BG }}>
      <form onSubmit={submit} className="w-full max-w-xs rounded-2xl p-6"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <p className="text-sm font-bold mb-1" style={{ color: CREAM }}>Calculadora protegida</p>
        <p className="text-xs mb-4" style={{ color: MUTED }}>Ingresá la contraseña para continuar</p>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          placeholder="Contraseña"
          className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold outline-none mb-2"
          style={{ background: CARD2, border: `1px solid ${error ? '#e05555' : BORDER}`, color: CREAM }}
        />
        {error && <p className="text-xs mb-2" style={{ color: '#e05555' }}>Contraseña incorrecta</p>}
        <button type="submit"
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: ACCENT, color: '#fff' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
