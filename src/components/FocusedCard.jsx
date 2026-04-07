// FocusedCard.jsx — Full-screen overlay for a focused/selected card
// When a card is clicked in ScatterView or FilterView, this component
// renders on top of everything else (fixed position, centered on screen).
//
// Why it's separate from the card components:
//   ScatterView uses absolute positioning for its cards. If we tried to
//   animate a card from scattered → centered inside that same container,
//   CSS transitions would conflict. Keeping the focused state here avoids that.
//
// Front: shows emotion + title + "tap to reveal" hint
// Back: shows memory content + sub-emotion chips + Edit/Delete buttons
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
