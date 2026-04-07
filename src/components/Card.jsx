import '../css/card.css'
import { emotionToColor } from '../data/seed'

// Card.jsx — A single flashcard tile used in the Filter (emotions) view.
// Just renders the front face. Clicking opens FocusedCard via onFocus.
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
