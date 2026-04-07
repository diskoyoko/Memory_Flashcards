import '../css/focused.css'
import { emotionToColor } from '../data/seed'

/**
 * A fixed-position overlay that renders the focused card centered on screen.
 * Separate from ScatterView so there's no position-type transition conflict.
 */
export default function FocusedCard({ memory, flipped, onFlip, onEdit, onDelete, onDismiss }) {
  if (!memory) return null

  const color = emotionToColor(memory.primaryEmotion)

  function handleEdit(e) {
    e.stopPropagation()
    onEdit(memory)
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm('Delete this memory?')) onDelete(memory.id)
  }

  return (
    <>
      {/* Dimmed backdrop — click to dismiss */}
      <div className="focused-backdrop" onClick={onDismiss} />

      {/* The card itself — always fixed center, animates in via CSS */}
      <div className={`focused-card-container${flipped ? ' flipped' : ''}`} onClick={onFlip}>
        {/* FRONT */}
        <div className={`focused-face focused-front color-${color}`}>
          <div className="focused-badge">{memory.primaryEmotion}</div>
          <div className="focused-title">{memory.title}</div>
          <div className="focused-hint">tap to reveal</div>
        </div>

        {/* BACK */}
        <div className="focused-face focused-back" onClick={e => e.stopPropagation()}>
          <div className="focused-sub-emotions">
            {(memory.subEmotions ?? []).map(e => (
              <span key={e} className="focused-sub-chip">{e}</span>
            ))}
          </div>
          <div className="focused-content">{memory.content}</div>
          <div className="focused-actions">
            <button className="card-action-btn edit" onClick={handleEdit}>Edit</button>
            <button className="card-action-btn delete" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </>
  )
}
