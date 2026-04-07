// Card.jsx — A single card tile used in the Filter (emotions) view.
//
// This component only renders the front face of the card (emotion badge + title).
// It is intentionally simple — flipping and full detail are handled by FocusedCard,
// which opens as a fixed overlay when the card is clicked.
//
// The card colour is derived at render time from the primary emotion using
// emotionToColor(), so no colour is ever stored on the card data itself.
//
// Props:
//   memory      — the memory card object
//   onFocus     — called when the card is clicked (opens FocusedCard in App)
//   isNew       — true if this was the most recently added card (shows badge + glow)
//   isDissolving — true if a newer card was just added (glow fades out)

import '../css/card.css'
import { emotionToColor } from '../data/seed'

export default function Card({ memory, onFocus, isNew, isDissolving }) {
  const color = emotionToColor(memory.primaryEmotion)

  return (
    <div
      className={`card-wrapper${isNew ? ' card-just-added' : isDissolving ? ' card-dissolving' : ''}`}
      onClick={onFocus}
      role="button"
      aria-label={`Memory card: ${memory.title}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onFocus()}
    >
      <div className={`card-face card-front color-${color}`}>
        {isNew && <span className="card-new-badge">just added</span>}
        <div className="card-category-badge">{memory.primaryEmotion}</div>
        <div className="card-title">{memory.title}</div>
      </div>
    </div>
  )
}
