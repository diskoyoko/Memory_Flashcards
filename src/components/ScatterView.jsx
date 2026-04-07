import { useEffect, useRef, useState } from 'react'
import '../css/scatter.css'

function idToNum(id) {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

const CARD_W = 240
const CARD_H = 320
const GAP    = 40
const CELL_W = CARD_W + GAP  // 280px
const CELL_H = CARD_H + GAP  // 360px

// 5cm clear zone around title (~190px radius at 96dpi) + title text size
const CLEAR_RX = 360
const CLEAR_RY = 240

let _slots = null
function getSlots() {
  if (_slots) return _slots
  const raw = []
  const range = 12
  for (let row = -range; row <= range; row++) {
    for (let col = -range; col <= range; col++) {
      const x = col * CELL_W
      const y = row * CELL_H
      if ((x * x) / (CLEAR_RX * CLEAR_RX) + (y * y) / (CLEAR_RY * CLEAR_RY) < 1) continue
      raw.push({ x, y, dist: Math.sqrt(x * x + y * y) })
    }
  }
  raw.sort((a, b) => a.dist - b.dist)
  const RING = 8
  for (let i = 0; i < raw.length - RING; i += RING) {
    for (let j = i + RING - 1; j > i; j--) {
      const k = i + (((j - i) * 2654435761) >>> 0) % (j - i + 1)
      ;[raw[j], raw[k]] = [raw[k], raw[j]]
    }
  }
  _slots = raw
  return _slots
}

function scatterPos(id, index) {
  const n = idToNum(id)
  const slots = getSlots()
  const slot  = slots[index % slots.length]
  const noiseX = ((n * 7)  % GAP) - GAP / 2
  const noiseY = ((n * 13) % GAP) - GAP / 2
  const rot    = ((n % 20) - 10) * 0.7
  return { x: slot.x + noiseX, y: slot.y + noiseY, rot }
}

function cardDepth(id) {
  const n = idToNum(id)
  return 0.3 + (n % 8) * 0.1
}

export default function ScatterView({ memories, focused, onFocus, newCardId, dissolveId }) {
  const parallaxTarget  = useRef({ x: 0, y: 0 })
  const parallaxCurrent = useRef({ x: 0, y: 0 })
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panRef     = useRef({ x: 0, y: 0 })
  const canvasDrag = useRef(null)
  const canvasDist = useRef(0)

  const rafRef = useRef(null)

  useEffect(() => {
    function onMouseMove(e) {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`)
      parallaxTarget.current = {
        x: e.clientX / window.innerWidth  - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      }
      if (canvasDrag.current) {
        const dx = e.clientX - canvasDrag.current.mouseX
        const dy = e.clientY - canvasDrag.current.mouseY
        canvasDist.current = Math.hypot(dx, dy)
        panRef.current = {
          x: canvasDrag.current.panX + dx,
          y: canvasDrag.current.panY + dy,
        }
        setPan({ ...panRef.current })
      }
    }

    function onMouseUp() {
      canvasDrag.current = null
      document.body.style.cursor = ''
    }

    function onTouchMove(e) {
      if (!canvasDrag.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const dx = touch.clientX - canvasDrag.current.mouseX
      const dy = touch.clientY - canvasDrag.current.mouseY
      canvasDist.current = Math.hypot(dx, dy)
      panRef.current = { x: canvasDrag.current.panX + dx, y: canvasDrag.current.panY + dy }
      setPan({ ...panRef.current })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onMouseUp)

    function tick() {
      parallaxCurrent.current.x += (parallaxTarget.current.x - parallaxCurrent.current.x) * 0.06
      parallaxCurrent.current.y += (parallaxTarget.current.y - parallaxCurrent.current.y) * 0.06
      setParallax({ ...parallaxCurrent.current })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onMouseUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function startCanvasDrag(e) {
    if (e.button !== 0) return
    canvasDist.current = 0
    canvasDrag.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    }
    document.body.style.cursor = 'grabbing'
  }

  function handleCardClick(id) {
    if (canvasDist.current > 6) return
    if (!focused) onFocus(id)
  }

  if (memories.length === 0) {
    return (
      <div className="scatter-view">
        <div className="empty-state">
          <div className="empty-state-title">No memories yet</div>
          Press + to add your first memory.
        </div>
      </div>
    )
  }

  return (
    <div className="scatter-view" onMouseDown={startCanvasDrag} style={{ cursor: 'grab' }}>
      <div
        className="scatter-canvas"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <div className="canvas-hero">
          <h1 className="canvas-title">Fragments<br />of Memory</h1>
          <p className="canvas-subtitle">Revisit moments through how they were felt.</p>
          <p className="canvas-instructions">Select a card to explore, flip to reveal its details, use + to add a new memory.</p>
          <p className="canvas-drag-hint">drag to explore ↗</p>
        </div>

        {memories.map((m, i) => {
          const pos   = scatterPos(m.id, i)
          const depth = cardDepth(m.id)
          const plx   = parallax.x * depth * 28
          const ply   = parallax.y * depth * 20
          const isNew  = m.id === newCardId
          const isDiss = m.id === dissolveId

          return (
            <div
              key={m.id}
              className={`scatter-card-shell${isNew ? ' card-just-added' : isDiss ? ' card-dissolving' : ''}`}
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top:  `calc(50% + ${pos.y}px)`,
                transform: `translate(-50%, -50%) rotate(${pos.rot}deg) translate(${plx}px, ${ply}px)`,
                opacity: focused && m.id !== focused ? 0.35 : 1,
                transition: 'opacity 0.3s ease',
                zIndex: isNew ? 10 : 'auto',
                cursor: 'pointer',
              }}
              onClick={() => handleCardClick(m.id)}
            >
              <div className={`scatter-card-face color-${m.primaryEmotion?.toLowerCase() ?? 'sadness'}`}>
                {isNew && <span className="card-new-badge">just added</span>}
                <div className="scatter-card-badge">{m.primaryEmotion}</div>
                <div className="scatter-card-title">{m.title}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
