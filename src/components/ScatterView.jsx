// ScatterView.jsx — The default "scatter" layout
// Cards are spread across a large canvas in a loose grid with random rotation and offset.
// Features:
//   - Parallax: cards shift slightly as you move your mouse (depth effect)
//   - Drag-to-pan: click and drag the background to explore the canvas
//   - Click a card to focus it (opens the FocusedCard overlay in App.jsx)
//
// Cards are NOT flipped here — flipping happens in FocusedCard.

import { useEffect, useRef, useState } from 'react'
import '../css/scatter.css'

// Converts a card's string ID into a number so we can derive
// a consistent random-looking position and rotation for it
function idToNum(id) {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

function scatterPos(id, index, total) {
  const n = idToNum(id)
  const cols = Math.ceil(Math.sqrt(total + 1))
  const col = index % cols
  const row = Math.floor(index / cols)
  const cellW = 100 / cols
  const cellH = 100 / Math.ceil(total / cols)
  const noiseX = ((n * 7) % 30) - 15
  const noiseY = ((n * 13) % 30) - 15
  const rot = ((n % 20) - 10) * 0.7
  const left = cellW * col + cellW / 2 + noiseX
  const top  = cellH * row + cellH / 2 + noiseY
  return { left: `${left}%`, top: `${top}%`, rot }
}

function cardDepth(id) {
  const n = idToNum(id)
  return 0.3 + (n % 8) * 0.1
}

export default function ScatterView({ memories, focused, onFocus }) {
  const parallaxTarget  = useRef({ x: 0, y: 0 })
  const parallaxCurrent = useRef({ x: 0, y: 0 })
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panRef    = useRef({ x: 0, y: 0 })
  const dragStart = useRef(null) // { mouseX, mouseY, panX, panY } when drag begins
  const dragDist  = useRef(0)   // total distance moved during current drag

  const rafRef = useRef(null)

  useEffect(() => {
    function onMouseMove(e) {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`)

      parallaxTarget.current = {
        x: e.clientX / window.innerWidth  - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      }

      if (dragStart.current) {
        const dx = e.clientX - dragStart.current.mouseX
        const dy = e.clientY - dragStart.current.mouseY
        dragDist.current = Math.hypot(dx, dy)
        panRef.current = {
          x: dragStart.current.panX + dx,
          y: dragStart.current.panY + dy,
        }
        setPan({ ...panRef.current })
      }
    }

    function onMouseUp() {
      dragStart.current = null
      document.body.style.cursor = ''
    }

    // Touch support for panning on mobile
    function onTouchMove(e) {
      const touch = e.touches[0]
      if (dragStart.current) {
        e.preventDefault()
        const dx = touch.clientX - dragStart.current.mouseX
        const dy = touch.clientY - dragStart.current.mouseY
        dragDist.current = Math.hypot(dx, dy)
        panRef.current = {
          x: dragStart.current.panX + dx,
          y: dragStart.current.panY + dy,
        }
        setPan({ ...panRef.current })
      }
    }

    function onTouchEnd() {
      dragStart.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

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
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function startDrag(e) {
    // Don't start drag with right-click
    if (e.button !== 0) return
    dragDist.current = 0
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    }
    document.body.style.cursor = 'grabbing'
  }

  function handleCardClick(id) {
    // If the mouse moved more than 6px during the drag, treat it as a pan — not a card click
    if (dragDist.current > 6) return
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
    <div className="scatter-view" onMouseDown={startDrag} style={{ cursor: 'grab' }}>
      <div
        className="scatter-canvas"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {memories.map((m, i) => {
          const pos   = scatterPos(m.id, i, memories.length)
          const depth = cardDepth(m.id)
          const px = parallax.x * depth * 28
          const py = parallax.y * depth * 20
          const isFocused = focused === m.id

          return (
            <div
              key={m.id}
              className="scatter-card-shell"
              style={{
                left: pos.left,
                top: pos.top,
                transform: `translate(-50%, -50%) rotate(${pos.rot}deg) translate(${px}px, ${py}px)`,
                opacity: focused && !isFocused ? 0.35 : 1,
                transition: 'opacity 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => handleCardClick(m.id)}
            >
              <div className={`scatter-card-face color-${m.primaryEmotion?.toLowerCase() ?? 'sadness'}`}>
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
