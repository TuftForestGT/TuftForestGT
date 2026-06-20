'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

type Unit     = 'cm' | 'm' | 'pulg'
type InputDim = 'alto' | 'ancho'
interface Sel { x: number; y: number; w: number; h: number }
type Handle   = 'tl' | 'tr' | 'bl' | 'br' | 'mt' | 'mb' | 'ml' | 'mr' | 'move'
interface DragState { handle: Handle; startMx: number; startMy: number; startSel: Sel }

// Screen-space constants (pixels on screen, regardless of zoom)
const CORNER_SCREEN  = 10   // half-size of corner handle on screen
const EDGE_LONG_SCR  = 20   // half long-side of edge handle
const EDGE_SHORT_SCR = 8    // half short-side of edge handle
const HIT_CORNER_SCR = 14   // hit radius for corners
const HIT_EDGE_SCR   = 12   // hit radius for edges

function getHandle(sel: Sel, mx: number, my: number, zoom: number): Handle | null {
  // Convert screen hit distances to canvas space
  const hc = HIT_CORNER_SCR / zoom
  const he = HIT_EDGE_SCR   / zoom

  const corners: [Handle, number, number][] = [
    ['tl', sel.x, sel.y], ['tr', sel.x + sel.w, sel.y],
    ['bl', sel.x, sel.y + sel.h], ['br', sel.x + sel.w, sel.y + sel.h],
  ]
  for (const [h, cx, cy] of corners)
    if (Math.abs(mx - cx) <= hc && Math.abs(my - cy) <= hc) return h

  const midX = sel.x + sel.w / 2, midY = sel.y + sel.h / 2
  const edgeLong = EDGE_LONG_SCR / zoom
  if (Math.abs(mx - midX) <= edgeLong && Math.abs(my - sel.y)           <= he) return 'mt'
  if (Math.abs(mx - midX) <= edgeLong && Math.abs(my - (sel.y + sel.h)) <= he) return 'mb'
  if (Math.abs(mx - sel.x)           <= he && Math.abs(my - midY) <= edgeLong) return 'ml'
  if (Math.abs(mx - (sel.x + sel.w)) <= he && Math.abs(my - midY) <= edgeLong) return 'mr'
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

  // Overlay outside selection
  ctx.fillStyle = 'rgba(0,0,0,0.62)'
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(sel.x, sel.y, sel.w, sel.h)
  ctx.fill('evenodd')

  // Selection border
  ctx.strokeStyle = 'rgba(245,240,232,0.7)'; ctx.lineWidth = 1.5 / zoom
  ctx.strokeRect(sel.x, sel.y, sel.w, sel.h)
  ctx.strokeStyle = '#4a9a4a'; ctx.lineWidth = 1 / zoom
  ctx.setLineDash([4 / zoom, 4 / zoom])
  ctx.strokeRect(sel.x + 1 / zoom, sel.y + 1 / zoom, sel.w - 2 / zoom, sel.h - 2 / zoom)
  ctx.setLineDash([])

  // Scale handle sizes to canvas space so they stay constant on screen
  const cs = CORNER_SCREEN  / zoom   // corner half-size in canvas px
  const el = EDGE_LONG_SCR  / zoom   // edge long  half
  const es = EDGE_SHORT_SCR / zoom   // edge short half

  const block = (hx: number, hy: number, hw: number, hh: number) => {
    ctx.fillStyle = '#f5f0e8'
    ctx.fillRect(hx - hw, hy - hh, hw * 2, hh * 2)
    ctx.strokeStyle = '#4a9a4a'; ctx.lineWidth = 1.5 / zoom
    ctx.strokeRect(hx - hw, hy - hh, hw * 2, hh * 2)
  }

  // Corners
  block(sel.x,         sel.y,         cs, cs)
  block(sel.x + sel.w, sel.y,         cs, cs)
  block(sel.x,         sel.y + sel.h, cs, cs)
  block(sel.x + sel.w, sel.y + sel.h, cs, cs)

  // Edge midpoints
  const mx = sel.x + sel.w / 2, my = sel.y + sel.h / 2
  block(mx, sel.y,           el, es)
  block(mx, sel.y + sel.h,   el, es)
  block(sel.x,           my, es, el)
  block(sel.x + sel.w,   my, es, el)
}

function fmt(n: number) {
  if (isNaN(n)) return ''
  return Math.abs(n % 1) < 0.05 ? n.toFixed(0) : n.toFixed(1)
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.5, 2, 3]
const SLIDER_MAX  = { cm: 600, m: 6, pulg: 240 }
const SLIDER_STEP = { cm: 1, m: 0.01, pulg: 0.5 }

// ── palette ────────────────────────────────────────────────
const BG      = '#0f1210'   // near-black, barely green
const PANEL   = '#181c18'   // slightly lighter
const CARD    = '#1f231f'
const BORDER  = '#2a312a'
const ACCENT  = '#4a9a4a'   // forest-400 ish
const CREAM   = '#f5f0e8'
const MUTED   = '#4a5e49'
const SUBTLE  = '#2d382c'

export default function CalculadoraClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [sel, setSel]           = useState<Sel>({ x: 0, y: 0, w: 100, h: 100 })
  const [drag, setDrag]         = useState<DragState | null>(null)
  const [cursor, setCursor]     = useState('default')
  const [inputVal, setInputVal] = useState('')
  const [inputDim, setInputDim] = useState<InputDim>('alto')
  const [unit, setUnit]         = useState<Unit>('cm')
  const [zoomIdx, setZoomIdx]   = useState(2)

  const imgRef    = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const zoom  = ZOOM_LEVELS[zoomIdx]
  const ratio = sel.w / sel.h

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

  // Result
  const val = parseFloat(inputVal)
  const result: number | null = (!isNaN(val) && val > 0 && isFinite(ratio))
    ? (inputDim === 'alto' ? val * ratio : val / ratio) : null

  const altoNum  = inputDim === 'alto' ? val    : (result ?? NaN)
  const anchoNum = inputDim === 'ancho' ? val   : (result ?? NaN)
  const areaM2   = (!isNaN(altoNum) && !isNaN(anchoNum) && altoNum > 0 && anchoNum > 0)
    ? (() => { const f = unit === 'm' ? 1 : unit === 'cm' ? 0.01 : 0.0254; return altoNum * f * anchoNum * f })()
    : null

  const resultLabel = inputDim === 'alto' ? 'Ancho' : 'Alto'
  const MAX  = SLIDER_MAX[unit]
  const STEP = SLIDER_STEP[unit]

  // Sidebar shared style helpers
  const sideSection = { borderBottom: `1px solid ${BORDER}`, padding: '16px' }

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: BG, color: CREAM }}>

      {/* ── Top bar ──────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ background: PANEL, borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-baseline gap-3">
          <span className="font-display font-bold text-lg" style={{ color: CREAM }}>Calculadora</span>
          <span className="text-xs font-medium" style={{ color: ACCENT }}>TuftForest GT</span>
        </div>
        {/* Units */}
        <div className="flex items-center gap-1">
          {(['cm', 'm', 'pulg'] as Unit[]).map(u => (
            <button key={u} onClick={() => { setUnit(u); setInputVal('') }}
              className="px-3 py-1 rounded text-xs font-medium transition-all"
              style={unit === u
                ? { background: ACCENT, color: '#fff' }
                : { background: CARD, color: MUTED }}>
              {u}
            </button>
          ))}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: image panel ─────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!imageSrc ? (
            /* Upload */
            <label className="flex-1 flex flex-col items-center justify-center cursor-pointer transition-all group m-6 rounded-2xl"
              style={{ border: `2px dashed ${SUBTLE}` }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) loadFile(f) }}>
              <svg className="w-16 h-16 mb-4 transition-colors" style={{ color: SUBTLE }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-base font-medium mb-1" style={{ color: CREAM }}>Subí o arrastrá la imagen</p>
              <p className="text-xs" style={{ color: MUTED }}>JPG · PNG · WEBP · cualquier formato</p>
              <input type="file" className="hidden" accept="image/*"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
            </label>
          ) : (
            /* Image + canvas */
            <div ref={scrollRef} className="flex-1 overflow-auto flex items-start justify-center p-4"
              style={{ background: '#0a0d0a' }}>
              <div style={{ zoom, display: 'inline-block' }}>
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imgRef} src={imageSrc} alt="diseño" draggable={false}
                    className="block rounded"
                    style={{ maxHeight: '90vh', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
                    onLoad={handleImageLoad} />
                  <canvas ref={canvasRef} className="absolute inset-0 rounded"
                    style={{ cursor, width: '100%', height: '100%' }}
                    onPointerDown={onPointerDown} onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp} onPointerLeave={onPointerUp} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: sidebar ────────────────────── */}
        <aside className="flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ width: 260, background: PANEL, borderLeft: `1px solid ${BORDER}` }}>

          {/* Rotate + Zoom */}
          <div style={sideSection}>
            <p className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: MUTED }}>
              Imagen
            </p>
            <div className="flex gap-2 mb-3">
              {([[-90, '↺'], [90, '↻']] as [90|-90, string][]).map(([deg, icon]) => (
                <button key={deg} onClick={() => rotate(deg)} disabled={!imageSrc}
                  className="flex-1 py-2 rounded-lg text-base font-bold transition-all disabled:opacity-20"
                  style={{ background: CARD, color: CREAM }}>
                  {icon}
                </button>
              ))}
            </div>
            {/* Zoom */}
            <div className="flex items-center gap-2">
              <button onClick={() => setZoomIdx(i => Math.max(i - 1, 0))} disabled={zoomIdx === 0}
                className="w-8 h-8 rounded font-bold text-base flex items-center justify-center disabled:opacity-20"
                style={{ background: CARD, color: CREAM }}>
                −
              </button>
              <div className="flex-1 flex gap-0.5">
                {ZOOM_LEVELS.map((z, i) => (
                  <button key={z} onClick={() => setZoomIdx(i)}
                    className="flex-1 h-1.5 rounded-full transition-all"
                    style={{ background: i === zoomIdx ? ACCENT : SUBTLE }} />
                ))}
              </div>
              <button onClick={() => setZoomIdx(i => Math.min(i + 1, ZOOM_LEVELS.length - 1))} disabled={zoomIdx === ZOOM_LEVELS.length - 1}
                className="w-8 h-8 rounded font-bold text-base flex items-center justify-center disabled:opacity-20"
                style={{ background: CARD, color: CREAM }}>
                +
              </button>
            </div>
            <p className="text-center text-xs mt-1.5" style={{ color: MUTED }}>{zoom}× · Ctrl+scroll</p>

            {imageSrc && (
              <button onClick={() => { setImageSrc(null); setInputVal('') }}
                className="w-full mt-3 py-1.5 rounded text-xs transition-all"
                style={{ background: CARD, color: MUTED }}>
                Cambiar imagen
              </button>
            )}
          </div>

          {/* Dimension input */}
          <div style={sideSection}>
            <p className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: MUTED }}>
              Dimensión
            </p>

            {/* Alto / Ancho toggle */}
            <div className="flex rounded-lg overflow-hidden mb-3" style={{ background: CARD }}>
              {(['alto', 'ancho'] as InputDim[]).map(d => (
                <button key={d} onClick={() => { setInputDim(d); setInputVal('') }}
                  className="flex-1 py-2 text-sm font-medium transition-all capitalize"
                  style={inputDim === d
                    ? { background: ACCENT, color: '#fff' }
                    : { color: MUTED }}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            {/* Number input */}
            <div className="flex items-center gap-2 mb-3">
              <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
                placeholder="ej. 150" min={0}
                className="flex-1 rounded-lg px-3 py-2.5 text-base font-semibold outline-none"
                style={{ background: CARD, color: CREAM, border: `1px solid ${BORDER}` }}
                onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                onBlur={e => (e.currentTarget.style.borderColor = BORDER)} />
              <span className="text-sm font-medium w-8 text-center" style={{ color: ACCENT }}>{unit}</span>
            </div>

            {/* Slider */}
            <input type="range" min={0} max={MAX} step={STEP}
              value={isNaN(val) || val < 0 ? 0 : Math.min(val, MAX)}
              onChange={e => setInputVal(e.target.value)}
              className="w-full cursor-pointer"
              style={{ accentColor: ACCENT }} />
          </div>

          {/* Result */}
          <div style={{ padding: '16px' }} className="flex-1">
            <p className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: MUTED }}>
              Resultado
            </p>

            {result !== null ? (
              <>
                {/* Main result */}
                <div className="rounded-xl p-4 mb-3 text-center"
                  style={{ background: CARD, border: `1px solid ${ACCENT}22` }}>
                  <p className="text-xs mb-1" style={{ color: MUTED }}>{resultLabel}</p>
                  <p className="text-5xl font-display font-bold leading-none" style={{ color: CREAM }}>
                    {fmt(result)}
                  </p>
                  <p className="text-sm mt-1" style={{ color: ACCENT }}>{unit}</p>
                </div>

                {/* Summary */}
                <div className="rounded-lg p-3 space-y-2" style={{ background: CARD }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: MUTED }}>Alto</span>
                    <span style={{ color: CREAM }}>{fmt(altoNum)} {unit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: MUTED }}>Ancho</span>
                    <span style={{ color: CREAM }}>{fmt(anchoNum)} {unit}</span>
                  </div>
                  {areaM2 !== null && (
                    <div className="flex justify-between text-xs pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                      <span style={{ color: MUTED }}>Área</span>
                      <span style={{ color: ACCENT, fontWeight: 600 }}>{areaM2.toFixed(2)} m²</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span style={{ color: SUBTLE }}>Ratio</span>
                    <span style={{ color: SUBTLE }}>{ratio.toFixed(3)} : 1</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl p-4 text-center" style={{ background: CARD }}>
                <p className="text-xs" style={{ color: SUBTLE }}>
                  {!imageSrc
                    ? 'Subí una imagen primero'
                    : 'Ingresá una dimensión para calcular'}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
