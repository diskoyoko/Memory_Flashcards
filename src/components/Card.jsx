// Card.jsx — A single flashcard used in the Filter (emotions) view
// Has two sides: front shows the emotion + title, back shows the memory content.
// Click once to focus it, click again to flip it.
// Edit/Delete buttons only appear when the card is focused and flipped.

import '../css/card.css'
import { emotionToColor } from '../data/seed'

export default function Card({ memory, focused, flipped, onFocus, onFlip, onEdit, onDelete }) {
  // Color is derived from the primary emotion — never stored on the card
  const color = emotionToColor(memory.primaryEmotion)

  function handleClick(e) {
    e.stopPropagation()
    if (!focused) {
      onFocus()
    } else {
      onFlip()
    }
  }

  function handleEdit(e) {
    e.stopPropagation()
    onEdit()
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm('Delete this memory?')) onDelete()
  }

  return (
    <div
      className={`card-wrapper${focused ? ' focused' : ''}`}
      onClick={handleClick}
      role="button"
      aria-label={`Memory card: ${memory.title}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick(e)}
    >
      <div className={`card-inner${flipped ? ' flipped' : ''}`}>

        {/* FRONT — gradient colour from primary emotion */}
        <div className={`card-face card-front color-${color}`}>
          <div className="card-category-badge">{memory.primaryEmotion}</div>
          <div className="card-title">{memory.title}</div>
        </div>

        {/* BACK — memory text, sub-emotion chips, tags, actions */}
        <div className="card-face card-back">
          <div className="card-emotions">
            {(memory.subEmotions ?? []).map(e => (
              <span key={e} className="card-emotion-chip">{e}</span>
            ))}
          </div>
          <div className="card-back-content">{memory.content}</div>
          {(memory.tags ?? []).length > 0 && (
            <div className="card-tags">
              {memory.tags.map(tag => (
                <span key={tag} className="card-tag">#{tag}</span>
              ))}
            </div>
          )}
          {focused && (
            <div className="card-back-actions">
              <button className="card-action-btn edit" onClick={handleEdit}>Edit</button>
              <button className="card-action-btn delete" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
