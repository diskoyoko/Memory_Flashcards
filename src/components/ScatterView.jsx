import '../css/scatter.css'
import Card from './Card'

// Stable position from id — same card always goes to same spot
function idToNum(id) {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

function scatterPos(id, index, total) {
  const n = idToNum(id)
  // spread across the viewport with some padding
  const cols = Math.ceil(Math.sqrt(total + 1))
  const col = index % cols
  const row = Math.floor(index / cols)
  const cellW = 100 / cols
  const cellH = 100 / Math.ceil(total / cols)
  // base position + small noise within cell
  const noiseX = ((n * 7) % 30) - 15
  const noiseY = ((n * 13) % 30) - 15
  const rot = ((n % 20) - 10) * 0.6 // -6 to +6 deg
  const left = cellW * col + cellW / 2 + noiseX
  const top = cellH * row + cellH / 2 + noiseY
  return { left: `${left}%`, top: `${top}%`, transform: `translate(-50%, -50%) rotate(${rot}deg)` }
}

export default function ScatterView({ memories, focused, flipped, onFocus, onFlip, onEdit, onDelete }) {
  // Show a prompt when no memories exist yet
  if (memories.length === 0) {
    return (
      <div className="scatter-view" aria-label="Memory board">
        <div className="empty-state">
          <div className="empty-state-title">No memories yet</div>
          Press + to add your first memory.
        </div>
      </div>
    )
  }

  return (
    <div className="scatter-view" aria-label="Memory board">
      {memories.map((m, i) => {
        const pos = scatterPos(m.id, i, memories.length)
        const isFocused = focused === m.id
        return (
          <div
            key={m.id}
            style={isFocused ? {} : { position: 'absolute', left: pos.left, top: pos.top, transform: pos.transform }}
          >
            <Card
              memory={m}
              focused={isFocused}
              flipped={isFocused && flipped}
              onFocus={() => onFocus(m.id)}
              onFlip={onFlip}
              onEdit={() => onEdit(m)}
              onDelete={() => onDelete(m.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
