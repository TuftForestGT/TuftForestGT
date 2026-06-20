'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

type Unit     = 'cm' | 'm' | 'pulg'
type InputDim = 'alto' | 'ancho'
type Tab      = 'medidas' | 'costos'
type Forma    = 'cuadrada' | 'rectangular' | 'redonda' | 'diseno'
interface Sel { x: number; y: number; w: number; h: number }
type Handle   = 'tl' | 'tr' | 'bl' | 'br' | 'mt' | 'mb' | 'ml' | 'mr' | 'move'
interface DragState { handle: Handle; startMx: number; startMy: number; startSel: Sel }

const CORNER_SCREEN = 10
const EDGE_LONG_SCR = 20
const HIT_CORNER_SCR = 14
const HIT_EDGE_SCR   = 12

function getHandle(sel: Sel, mx: number, my: number, zoom: number): Handle | null {
  const hc = HIT_CORNER_SCR / zoom
  const he = HIT_EDGE_SCR   / zoom
  const corners: [Handle, number, number][] = [
    ['tl', sel.x, sel.y], ['tr', sel.x + sel.w, sel.y],
    ['bl', sel.x, sel.y + sel.h], ['br', sel.x + sel.w, sel.y + sel.h],
  ]
  for (const [h, cx, cy] of corners)
    if (Math.abs(mx - cx) <= hc && Math.abs(my - cy) <= hc) return h
  const midX = sel.x + sel.w / 2, midY = sel.y + sel.h / 2
  const el = EDGE_LONG_SCR / zoom
  if (Math.abs(mx - midX) <= el && Math.abs(my - sel.y)           <= he) return 'mt'
  if (Math.abs(mx - midX) <= el && Math.abs(my - (sel.y + sel.h)) <= he) return 'mb'
  if (Math.abs(mx - sel.x)           <= he && Math.abs(my - midY) <= el) return 'ml'
  if (Math.abs(mx - (sel.x + sel.w)) <= he && Math.abs(my - midY) <= el) return 'mr'
  if (mx > sel.x + hc && mx < sel.x + sel.w - hc && my > sel.y + hc && my < sel.y + sel.h - hc) return 'move'
  return null
}

function getCursor(h: Handle | null) {
  if (h === 'tl' || h === 'br') return 'nwse-resize'
  if (h === 'tr' || h === 'bl') return 'nesw-resize'
  if (h === 'mt' || h === 'mb') return 'ns-resize'
  if (h === 'ml' || h === 'mr') return 'ew-resize'
  if (h === 'move') return 'move'
  return 'default'
}

function draw(canvas: HTMLCanvasElement, sel: Sel, zoom: number) {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width, H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = 'rgba(0,0,0,0.62)'
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(sel.x, sel.y, sel.w, sel.h)
  ctx.fill('evenodd')
  ctx.strokeStyle = 'rgba(245,240,232,0.7)'; ctx.lineWidth = 1.5 / zoom
  ctx.strokeRect(sel.x, sel.y, sel.w, sel.h)
  ctx.strokeStyle = '#4a9a4a'; ctx.lineWidth = 1 / zoom
  ctx.setLineDash([4 / zoom, 4 / zoom])
  ctx.strokeRect(sel.x + 1 / zoom, sel.y + 1 / zoom, sel.w - 2 / zoom, sel.h - 2 / zoom)
  ctx.setLineDash([])
  const cs = CORNER_SCREEN  / zoom
  const el = EDGE_LONG_SCR  / zoom
  const es = 8 / zoom
  const block = (hx: number, hy: number, hw: number, hh: number) => {
    ctx.fillStyle = '#f5f0e8'
    ctx.fillRect(hx - hw, hy - hh, hw * 2, hh * 2)
    ctx.strokeStyle = '#4a9a4a'; ctx.lineWidth = 1.5 / zoom
    ctx.strokeRect(hx - hw, hy - hh, hw * 2, hh * 2)
  }
  block(sel.x, sel.y, cs, cs); block(sel.x + sel.w, sel.y, cs, cs)
  block(sel.x, sel.y + sel.h, cs, cs); block(sel.x + sel.w, sel.y + sel.h, cs, cs)
  const mx = sel.x + sel.w / 2, my = sel.y + sel.h / 2
  block(mx, sel.y, el, es); block(mx, sel.y + sel.h, el, es)
  block(sel.x, my, es, el); block(sel.x + sel.w, my, es, el)
}

function fmt(n: number, dec = 1) {
  if (isNaN(n) || !isFinite(n)) return '—'
  return n % 1 < 0.05 && n % 1 > -0.05 ? n.toFixed(0) : n.toFixed(dec)
}
function fmtQ(n: number) {
  if (isNaN(n) || !isFinite(n) || n === 0) return '—'
  return `Q ${n.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}


// Tabla exacta del planificador de tapetebae (lookup por área del bounding box en cm²)
const CLOTH_TABLE = [
  { max: 1600,  m2: 0.25 }, { max: 4900,  m2: 0.64 }, { max: 8100,  m2: 1    },
  { max: 12100, m2: 1.44 }, { max: 16900, m2: 1.96 }, { max: 22500, m2: 2.56 },
  { max: 28900, m2: 3.24 }, { max: 36100, m2: 4    }, { max: 44100, m2: 4.84 },
  { max: 52900, m2: 5.76 }, { max: 62500, m2: 6.76 }, { max: 72900, m2: 7.84 },
  { max: 84100, m2: 9    }, { max: 90000, m2: 10.24 },
]
function getClothM2(areaCm2: number): number {
  if (areaCm2 <= 0) return 0
  for (const row of CLOTH_TABLE) if (areaCm2 <= row.max) return row.m2
  return parseFloat((areaCm2 / 90000 * 10.24).toFixed(2))
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.5, 2, 3]
const SLIDER_MAX  = { cm: 600, m: 6, pulg: 240 }
const SLIDER_STEP = { cm: 1, m: 0.01, pulg: 0.5 }

const BG     = '#09100a'
const PANEL  = '#0f1710'
const CARD   = '#162018'
const CARD2  = '#1c2a1e'
const BORDER = '#243328'
const ACCENT = '#55c257'
const ACCENTD= '#2a6b2c'
const CREAM  = '#f0ebe0'
const MUTED  = '#5a7a5c'
const SUBTLE = '#2a3c2c'
const GOLD   = '#d4a853'

const LS_KEY = 'tuftforest-precios'

interface Precios {
  lana: string; tela: string; anti: string; pega: string; ganancia: string
}

function PriceInput({ label, prefix, suffix, value, onChange }: {
  label: string; prefix?: string; suffix: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="group">
      <label className="text-xs block mb-1.5 font-medium" style={{ color: MUTED }}>{label}</label>
      <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
        style={{ background: CARD2, border: `1px solid ${BORDER}` }}
        onFocusCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = ACCENT)}
        onBlurCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = BORDER)}>
        {prefix && <span className="text-xs font-bold" style={{ color: ACCENT }}>{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          placeholder="0.00" min={0}
          className="flex-1 bg-transparent text-sm font-semibold outline-none min-w-0"
          style={{ color: CREAM }} />
        <span className="text-xs whitespace-nowrap font-medium" style={{ color: MUTED }}>{suffix}</span>
      </div>
    </div>
  )
}

export default function CalculadoraClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [sel, setSel]           = useState<Sel>({ x: 0, y: 0, w: 100, h: 100 })
  const [drag, setDrag]         = useState<DragState | null>(null)
  const [cursor, setCursor]     = useState('default')
  const [inputVal, setInputVal] = useState('')
  const [inputDim, setInputDim] = useState<InputDim>('alto')
  const [unit, setUnit]         = useState<Unit>('cm')
  const [zoomIdx, setZoomIdx]   = useState(2)
  const [activeTab, setActiveTab] = useState<Tab>('medidas')
  const [forma, setForma]         = useState<Forma>('rectangular')
  const [diametro, setDiametro]   = useState('')
  const [costoAlto,  setCostoAlto]  = useState('')
  const [costoAncho, setCostoAncho] = useState('')

  // Cost inputs (defaults usados si localStorage no tiene nada)
  const [precioLana, setPrecioLana] = useState('27')
  const [precioTela, setPrecioTela] = useState('27')
  const [precioAnti, setPrecioAnti] = useState('38')
  const [precioPega, setPrecioPega] = useState('350')
  const [ganancia,   setGanancia]   = useState('30')

  const imgRef    = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const zoom  = ZOOM_LEVELS[zoomIdx]
  const ratio = sel.w / sel.h

  // Load/save prices from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const d: Precios = JSON.parse(raw)
        if (d.lana)     setPrecioLana(d.lana)
        if (d.tela)     setPrecioTela(d.tela)
        if (d.anti)     setPrecioAnti(d.anti)
        if (d.pega)     setPrecioPega(d.pega)
        if (d.ganancia) setGanancia(d.ganancia)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        lana: precioLana, tela: precioTela, anti: precioAnti, pega: precioPega, ganancia
      }))
    } catch { /* ignore */ }
  }, [precioLana, precioTela, precioAnti, precioPega, ganancia])

  // Canvas
  useEffect(() => {
    const c = canvasRef.current; if (c && imageSrc) draw(c, sel, zoom)
  }, [sel, imageSrc, zoom])

  const handleImageLoad = useCallback(() => {
    const img = imgRef.current, c = canvasRef.current; if (!img || !c) return
    c.width = img.offsetWidth; c.height = img.offsetHeight
    const s: Sel = { x: 0, y: 0, w: img.offsetWidth, h: img.offsetHeight }
    setSel(s); draw(c, s, zoom)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadFile = useCallback((file: File) => {
    setImageSrc(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file) })
    setInputVal(''); setZoomIdx(2)
  }, [])

  const rotate = useCallback((deg: 90 | -90) => {
    const img = imgRef.current; if (!img) return
    const oc = document.createElement('canvas'), ctx = oc.getContext('2d')!
    oc.width = img.naturalHeight; oc.height = img.naturalWidth
    ctx.translate(oc.width / 2, oc.height / 2)
    ctx.rotate((deg * Math.PI) / 180)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    oc.toBlob(blob => {
      if (!blob) return
      setImageSrc(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob) })
      setInputVal('')
    }, 'image/jpeg', 0.95)
  }, [])

  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return; e.preventDefault()
      setZoomIdx(i => e.deltaY < 0 ? Math.min(i + 1, ZOOM_LEVELS.length - 1) : Math.max(i - 1, 0))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [imageSrc])

  const getPos = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) }
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const pos = getPos(e), h = getHandle(sel, pos.x, pos.y, zoom); if (!h) return
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDrag({ handle: h, startMx: pos.x, startMy: pos.y, startSel: { ...sel } })
  }, [sel, getPos, zoom])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const pos = getPos(e)
    if (!drag) { setCursor(getCursor(getHandle(sel, pos.x, pos.y, zoom))); return }
    const dx = pos.x - drag.startMx, dy = pos.y - drag.startMy
    const s = drag.startSel, c = canvasRef.current!
    const W = c.width, H = c.height, MIN = 20 / zoom
    let ns: Sel
    if (drag.handle === 'move') {
      ns = { ...s, x: Math.max(0, Math.min(s.x + dx, W - s.w)), y: Math.max(0, Math.min(s.y + dy, H - s.h)) }
    } else {
      let x1 = s.x, y1 = s.y, x2 = s.x + s.w, y2 = s.y + s.h
      const h = drag.handle
      if (h === 'tl') { x1 += dx; y1 += dy } if (h === 'tr') { x2 += dx; y1 += dy }
      if (h === 'bl') { x1 += dx; y2 += dy } if (h === 'br') { x2 += dx; y2 += dy }
      if (h === 'mt') y1 += dy; if (h === 'mb') y2 += dy
      if (h === 'ml') x1 += dx; if (h === 'mr') x2 += dx
      x1 = Math.max(0, x1); y1 = Math.max(0, y1); x2 = Math.min(W, x2); y2 = Math.min(H, y2)
      if (x2 - x1 < MIN) { if ('tl bl ml'.includes(h)) x1 = x2 - MIN; else x2 = x1 + MIN }
      if (y2 - y1 < MIN) { if ('tl tr mt'.includes(h)) y1 = y2 - MIN; else y2 = y1 + MIN }
      ns = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
    }
    setSel(ns)
  }, [drag, sel, getPos, zoom])

  const onPointerUp = useCallback(() => setDrag(null), [])

  // ── Dimension result ──────────────────────────────────────────
  const val = parseFloat(inputVal)
  const result: number | null = (!isNaN(val) && val > 0 && isFinite(ratio))
    ? (inputDim === 'alto' ? val * ratio : val / ratio) : null
  const altoNum  = inputDim === 'alto' ? val : (result ?? NaN)
  const anchoNum = inputDim === 'ancho' ? val : (result ?? NaN)

  // ── Cost calculations ─────────────────────────────────────────
  const toCm = (v: number) => unit === 'cm' ? v : unit === 'm' ? v * 100 : v * 2.54
  const costoAltoNum  = parseFloat(costoAlto)  || 0
  const costoAnchoNum = parseFloat(costoAncho) || 0
  const diamC  = toCm(parseFloat(diametro) || 0)
  const altoC  = toCm(costoAltoNum)
  const anchoC = toCm(costoAnchoNum)

  // Área del diseño (display): círculo para redonda, ancho×alto para el resto
  const areaCm2 = forma === 'redonda'
    ? (diamC > 0 ? Math.PI * Math.pow(diamC / 2, 2) : 0)
    : (altoC > 0 && anchoC > 0 ? altoC * anchoC : 0)
  const areaM2 = areaCm2 / 10000

  // Bounding box para tela / lana: siempre w × h (igual que planificador)
  const bboxW   = forma === 'redonda' ? diamC : anchoC
  const bboxH   = forma === 'redonda' ? diamC : altoC
  const bboxCm2 = bboxW > 0 && bboxH > 0 ? bboxW * bboxH : 0

  const telaM2  = getClothM2(bboxCm2)
  const antiM2  = telaM2
  const ovillos = bboxCm2 > 0 ? Math.ceil(bboxCm2 / 500) : 0

  // Prices
  const pL = parseFloat(precioLana) || 0
  const pT = parseFloat(precioTela) || 0
  const pA = parseFloat(precioAnti) || 0
  const pP = parseFloat(precioPega) || 0
  const pG = parseFloat(ganancia)   || 0

  // Costs
  const costoLana   = ovillos * pL
  const costoTela   = telaM2  * pT
  const costoAnti   = antiM2  * pA
  const costoPega   = pP * 0.35 * telaM2
  const costoTotal  = costoLana + costoTela + costoAnti + costoPega
  const gananciaQ   = costoTotal * (pG / 100)
  const precioFinal = costoTotal + gananciaQ

  const hasDims = forma === 'redonda' ? diamC > 0 : altoC > 0 && anchoC > 0
  const hasCosts = pL > 0 || pT > 0 || pA > 0 || pP > 0

  const MAX  = SLIDER_MAX[unit]
  const STEP = SLIDER_STEP[unit]

  const sec = { borderBottom: `1px solid ${BORDER}`, padding: '18px' }
  const secLabel = (txt: string) => (
    <p className="text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2"
      style={{ color: MUTED }}>
      <span className="inline-block w-1 h-3 rounded-full" style={{ background: ACCENT }} />
      {txt}
    </p>
  )

  const SHAPES: [Forma, string, string][] = [
    ['cuadrada',    '■', 'Cuadrada'],
    ['rectangular', '▬', 'Rectangular'],
    ['redonda',     '●', 'Redonda'],
    ['diseno',      '✦', 'Forma libre'],
  ]

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: BG, color: CREAM }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 flex-shrink-0"
        style={{ background: PANEL, borderBottom: `1px solid ${BORDER}`, height: 52 }}>
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: MUTED }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </a>
          <div style={{ width: 1, height: 18, background: BORDER }} />
          <span className="font-display font-bold tracking-tight" style={{ color: CREAM, fontSize: 15 }}>
            Calculadora
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: ACCENTD, color: ACCENT }}>
            TuftForest GT
          </span>
        </div>
        <div className="flex items-center p-0.5 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {(['cm', 'm', 'pulg'] as Unit[]).map(u => (
            <button key={u} onClick={() => { setUnit(u); setInputVal('') }}
              className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
              style={unit === u
                ? { background: ACCENT, color: '#fff' }
                : { color: MUTED }}>
              {u}
            </button>
          ))}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: image canvas ───────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#060a07' }}>
          {!imageSrc ? (
            <label className="flex-1 flex flex-col items-center justify-center cursor-pointer m-5 rounded-2xl transition-all"
              style={{ border: `1.5px dashed ${BORDER}` }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) loadFile(f) }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <svg className="w-9 h-9" style={{ color: ACCENTD }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: CREAM }}>Subí el diseño del cliente</p>
              <p className="text-xs mb-4" style={{ color: MUTED }}>Arrastrá o hacé clic · JPG · PNG · WEBP</p>
              <span className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: ACCENTD, color: ACCENT, border: `1px solid ${ACCENT}33` }}>
                Seleccionar archivo
              </span>
              <input type="file" className="hidden" accept="image/*"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
            </label>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-auto flex items-start justify-center p-4">
              <div style={{ zoom, display: 'inline-block' }}>
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imgRef} src={imageSrc} alt="diseño" draggable={false}
                    className="block rounded-lg"
                    style={{ maxHeight: '90vh', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
                    onLoad={handleImageLoad} />
                  <canvas ref={canvasRef} className="absolute inset-0 rounded-lg"
                    style={{ cursor, width: '100%', height: '100%' }}
                    onPointerDown={onPointerDown} onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp} onPointerLeave={onPointerUp} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: sidebar ───────────────────────────────── */}
        <aside className="flex-shrink-0 flex flex-col overflow-hidden"
          style={{ width: 292, background: PANEL, borderLeft: `1px solid ${BORDER}` }}>

          {/* Tabs */}
          <div className="flex flex-shrink-0 gap-1 p-2"
            style={{ background: PANEL, borderBottom: `1px solid ${BORDER}` }}>
            {([['medidas', '⟺', 'Medidas'], ['costos', 'Q', 'Costos']] as [Tab, string, string][]).map(([t, icon, label]) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={activeTab === t
                  ? { background: CARD2, color: CREAM, boxShadow: `inset 0 0 0 1px ${BORDER}` }
                  : { color: MUTED }}>
                <span style={{ fontSize: 11, fontWeight: 900, opacity: 0.8 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* ── TAB: MEDIDAS ─────────────────────────────── */}
          {activeTab === 'medidas' && (
            <div className="flex-1 overflow-y-auto flex flex-col">

              {/* Imagen controls */}
              <div style={sec}>
                {secLabel('Imagen')}
                <div className="flex gap-2 mb-3">
                  {([[-90, '↺ Rotar izq.'], [90, '↻ Rotar der.']] as [90 | -90, string][]).map(([deg, label]) => (
                    <button key={deg} onClick={() => rotate(deg)} disabled={!imageSrc}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-25"
                      style={{ background: CARD2, color: CREAM, border: `1px solid ${BORDER}` }}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => setZoomIdx(i => Math.max(i - 1, 0))} disabled={zoomIdx === 0}
                    className="w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center disabled:opacity-25 transition-all"
                    style={{ background: CARD2, color: CREAM, border: `1px solid ${BORDER}` }}>−
                  </button>
                  <div className="flex-1 flex gap-1">
                    {ZOOM_LEVELS.map((z, i) => (
                      <button key={z} onClick={() => setZoomIdx(i)}
                        className="flex-1 h-1.5 rounded-full transition-all"
                        style={{ background: i === zoomIdx ? ACCENT : SUBTLE }} />
                    ))}
                  </div>
                  <button onClick={() => setZoomIdx(i => Math.min(i + 1, ZOOM_LEVELS.length - 1))} disabled={zoomIdx === ZOOM_LEVELS.length - 1}
                    className="w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center disabled:opacity-25 transition-all"
                    style={{ background: CARD2, color: CREAM, border: `1px solid ${BORDER}` }}>+
                  </button>
                </div>
                <p className="text-center text-xs" style={{ color: SUBTLE }}>{zoom}× — Ctrl+scroll</p>
                {imageSrc && (
                  <button onClick={() => { setImageSrc(null); setInputVal('') }}
                    className="w-full mt-3 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: CARD2, color: MUTED, border: `1px solid ${BORDER}` }}>
                    Cambiar imagen
                  </button>
                )}
              </div>

              {/* Dimensión */}
              <div style={sec}>
                {secLabel('Conozco el…')}
                <div className="flex p-1 rounded-xl mb-4" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                  {(['alto', 'ancho'] as InputDim[]).map(d => (
                    <button key={d} onClick={() => { setInputDim(d); setInputVal('') }}
                      className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                      style={inputDim === d ? { background: ACCENT, color: '#fff' } : { color: MUTED }}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3 rounded-xl px-3 py-1"
                  style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                  onFocusCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = ACCENT)}
                  onBlurCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = BORDER)}>
                  <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
                    placeholder="ej. 150" min={0}
                    className="flex-1 bg-transparent py-2 text-xl font-display font-bold outline-none"
                    style={{ color: CREAM }} />
                  <span className="text-sm font-bold" style={{ color: ACCENT }}>{unit}</span>
                </div>
                <input type="range" min={0} max={MAX} step={STEP}
                  value={isNaN(val) || val < 0 ? 0 : Math.min(val, MAX)}
                  onChange={e => setInputVal(e.target.value)}
                  className="w-full cursor-pointer"
                  style={{ accentColor: ACCENT }} />
              </div>

              {/* Resultado */}
              <div style={{ padding: '18px' }} className="flex-1">
                {secLabel('Resultado')}
                {result !== null ? (
                  <>
                    <div className="rounded-2xl p-5 mb-3 text-center relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${CARD2} 0%, #1a2e1c 100%)`, border: `1px solid ${ACCENT}33` }}>
                      <div className="absolute inset-0 opacity-5"
                        style={{ background: `radial-gradient(circle at 50% 0%, ${ACCENT}, transparent 70%)` }} />
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: MUTED }}>
                        {inputDim === 'alto' ? 'Ancho calculado' : 'Alto calculado'}
                      </p>
                      <p className="font-display font-bold leading-none mb-1" style={{ color: CREAM, fontSize: 52 }}>
                        {fmt(result, 1)}
                      </p>
                      <p className="text-sm font-bold" style={{ color: ACCENT }}>{unit}</p>
                    </div>
                    <div className="rounded-xl p-3 space-y-2.5 mb-3" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                      <Row label="Alto"  val={`${fmt(altoNum)} ${unit}`} />
                      <Row label="Ancho" val={`${fmt(anchoNum)} ${unit}`} />
                      <div className="pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                        <Row label="Ratio imagen" val={`${ratio.toFixed(3)} : 1`} muted />
                      </div>
                    </div>
                    <button onClick={() => {
                        if (!isNaN(altoNum) && altoNum > 0)   setCostoAlto(fmt(altoNum, 2))
                        if (!isNaN(anchoNum) && anchoNum > 0) setCostoAncho(fmt(anchoNum, 2))
                        setActiveTab('costos')
                      }}
                      className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                      style={{ background: ACCENT, color: '#fff' }}>
                      Calcular costo →
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl p-6 text-center" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                    <p className="text-xs font-medium" style={{ color: SUBTLE }}>
                      {!imageSrc ? '↑ Subí una imagen del diseño' : 'Ingresá una dimensión arriba'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: COSTOS ──────────────────────────────── */}
          {activeTab === 'costos' && (
            <div className="flex-1 overflow-y-auto flex flex-col">

              {/* Forma */}
              <div style={sec}>
                {secLabel('Forma del diseño')}
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {SHAPES.map(([f, icon, label]) => (
                    <button key={f}
                      onClick={() => { setForma(f); setDiametro(''); setCostoAlto(''); setCostoAncho('') }}
                      className="py-3 px-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1"
                      style={forma === f
                        ? { background: ACCENT, color: '#fff', boxShadow: `0 4px 20px ${ACCENT}40` }
                        : { background: CARD2, color: MUTED, border: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>

                {forma === 'redonda' ? (
                  <div className="space-y-2">
                    <DimInput label="Diámetro" value={diametro} onChange={setDiametro} unit={unit} />
                    {diamC > 0 && (
                      <p className="text-xs" style={{ color: MUTED }}>Área ≈ {areaM2.toFixed(4)} m²</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <DimInput label="Ancho" value={costoAncho} onChange={setCostoAncho} unit={unit} />
                    <DimInput label="Alto"  value={costoAlto}  onChange={setCostoAlto}  unit={unit} />
                    {altoC > 0 && anchoC > 0 && (
                      <p className="text-xs" style={{ color: MUTED }}>Área = {areaM2.toFixed(4)} m²</p>
                    )}
                    <button onClick={() => setActiveTab('medidas')}
                      className="text-xs mt-1 underline decoration-dotted"
                      style={{ color: SUBTLE }}>
                      Usar ratio de la imagen →
                    </button>
                  </div>
                )}
              </div>

              {/* Precios */}
              <div style={sec}>
                {secLabel('Precios de insumos')}
                <p className="text-xs mb-3" style={{ color: SUBTLE }}>Se guardan automáticamente</p>
                <div className="space-y-2.5">
                  <PriceInput label="Ovillo de lana 100g" prefix="Q" suffix="/ovillo"
                    value={precioLana} onChange={setPrecioLana} />
                  <PriceInput label="Tela de monje" prefix="Q" suffix="/m²"
                    value={precioTela} onChange={setPrecioTela} />
                  <PriceInput label="Antideslizante" prefix="Q" suffix="/m²"
                    value={precioAnti} onChange={setPrecioAnti} />
                  <PriceInput label="Pegamento (balde)" prefix="Q" suffix="/balde"
                    value={precioPega} onChange={setPrecioPega} />
                </div>
              </div>

              {/* Ganancia */}
              <div style={sec}>
                {secLabel('Margen de ganancia')}
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={200} step={5} value={ganancia || 0}
                    onChange={e => setGanancia(e.target.value)}
                    className="flex-1 cursor-pointer" style={{ accentColor: ACCENT }} />
                  <div className="flex items-center rounded-xl px-3 py-2"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, minWidth: 64 }}>
                    <input type="number" value={ganancia} onChange={e => setGanancia(e.target.value)}
                      min={0} max={500} className="w-9 bg-transparent text-sm font-bold outline-none text-right"
                      style={{ color: CREAM }} />
                    <span className="text-xs ml-0.5 font-bold" style={{ color: ACCENT }}>%</span>
                  </div>
                </div>
              </div>

              {/* Materiales */}
              {hasDims && (
                <div style={sec}>
                  {secLabel('Materiales')}
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                    {[
                      { icon: '🧶', label: 'Lana (ovillos 100g)', qty: `${ovillos} ovillos`, costo: costoLana, show: pL > 0, color: '#c084fc' },
                      { icon: '🪢', label: 'Tela de monje',       qty: `${telaM2.toFixed(2)} m²`, costo: costoTela, show: pT > 0, color: '#60a5fa' },
                      { icon: '⬛', label: 'Antideslizante',      qty: `${antiM2.toFixed(2)} m²`, costo: costoAnti, show: pA > 0, color: '#94a3b8' },
                      { icon: '🪣', label: 'Pegamento',           qty: `${(telaM2 * 0.35).toFixed(3)} kg est.`, costo: costoPega, show: pP > 0, color: '#fb923c' },
                    ].map((m, idx, arr) => (
                      <div key={m.label} className="flex items-center gap-3 px-3 py-3"
                        style={{ borderBottom: idx < arr.length - 1 ? `1px solid ${BORDER}` : 'none', background: CARD }}>
                        <div className="w-1 self-stretch rounded-full" style={{ background: m.color, opacity: 0.6 }} />
                        <span className="text-base leading-none">{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate font-medium" style={{ color: MUTED }}>{m.label}</p>
                          <p className="text-sm font-bold" style={{ color: CREAM }}>{m.qty}</p>
                        </div>
                        {m.show && (
                          <span className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded-lg"
                            style={{ background: ACCENTD, color: ACCENT }}>
                            {fmtQ(m.costo)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumen */}
              {hasDims && hasCosts && (
                <div className="p-4 flex-1">
                  {secLabel('Precio de venta')}
                  <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                    <div className="p-4 space-y-2.5" style={{ background: CARD }}>
                      <Row label="Materiales" val={fmtQ(costoTotal)} />
                      <Row label={`Ganancia ${ganancia}%`} val={fmtQ(gananciaQ)} accent />
                    </div>
                    <div className="px-5 py-5 text-center relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, #1a3d1c 0%, #0f2210 100%)` }}>
                      <div className="absolute inset-0"
                        style={{ background: `radial-gradient(ellipse at 50% 0%, ${ACCENT}22, transparent 70%)` }} />
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 relative" style={{ color: ACCENT }}>
                        Precio mínimo sugerido
                      </p>
                      <p className="font-display font-bold leading-none relative" style={{ color: GOLD, fontSize: 38 }}>
                        {fmtQ(precioFinal)}
                      </p>
                      {costoTotal > 0 && (
                        <p className="text-xs mt-2 relative" style={{ color: MUTED }}>
                          ≈ USD {(precioFinal / 7.78).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {hasDims && !hasCosts && (
                <div className="m-4 rounded-xl p-4 text-center" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                  <p className="text-sm" style={{ color: SUBTLE }}>↑ Ingresá los precios de los insumos</p>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function Row({ label, val, accent, muted }: { label: string; val: string; accent?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span style={{ color: MUTED }}>{label}</span>
      <span style={{ color: accent ? ACCENT : muted ? SUBTLE : CREAM, fontWeight: accent ? 700 : 500 }}>{val}</span>
    </div>
  )
}

function DimInput({ label, value, onChange, unit }: {
  label: string; value: string; onChange: (v: string) => void; unit: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
      style={{ background: CARD2, border: `1px solid ${BORDER}` }}
      onFocusCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = ACCENT)}
      onBlurCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = BORDER)}>
      <label className="text-xs font-semibold w-14 flex-shrink-0" style={{ color: MUTED }}>{label}</label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder="0" min={0}
        className="flex-1 bg-transparent text-sm font-bold outline-none"
        style={{ color: CREAM }} />
      <span className="text-xs font-bold" style={{ color: ACCENT }}>{unit}</span>
    </div>
  )
}
