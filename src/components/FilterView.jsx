// FilterView.jsx — The "emotions" layout
// Shows all cards in a grid, with a filter bar at the top to narrow by emotion.
// Clicking an emotion chip filters the grid to only show cards of that type.
// Clicking a card focuses it in-place (uses the Card component directly,
// unlike ScatterView which delegates focus to FocusedCard).

import '../css/category.css'
import Card from './Card'
import { PRIMARY_EMOTIONS, emotionToColor } from '../data/seed'

export default function FilterView({
  memories, focused, flipped, onFocus, onFlip, onEdit, onDelete,
  activeEmotion, setActiveEmotion,
}) {
  // Only show primary emotions that have at least one card
  const usedEmotions = PRIMARY_EMOTIONS.filter(e =>
    memories.some(m => m.primaryEmotion === e.name)
  )

  const visible = activeEmotion
    ? memories.filter(m => m.primaryEmotion === activeEmotion)
    : memories

  return (
    <div className="category-view">

      {/* Primary emotion filter bar — coloured chips */}
      <div className="emotion-filter-bar" role="group" aria-label="Filter by emotion">
        <button
          className={`emotion-chip${!activeEmotion ? ' active' : ''}`}
          onClick={() => setActiveEmotion(null)}
        >
          All
        </button>
        {usedEmotions.map(({ name, color }) => (
          <button
            key={name}
            className={`emotion-chip color-chip-${color}${activeEmotion === name ? ' active' : ''}`}
            onClick={() => setActiveEmotion(activeEmotion === name ? null : name)}
            aria-pressed={activeEmotion === name}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Filtered card grid */}
      {visible.length === 0 ? (
        <div className="empty-state" style={{ position: 'relative', transform: 'none', marginTop: 80 }}>
          <div className="empty-state-title">No memories here</div>
          No cards tagged with "{activeEmotion}" yet.
        </div>
      ) : (
        <div className="category-cards">
          {visible.map(m => {
            const isFocused = focused === m.id
            return (
              <Card
                key={m.id}
                memory={m}
                focused={isFocused}
                flipped={isFocused && flipped}
                onFocus={() => onFocus(m.id)}
                onFlip={onFlip}
                onEdit={() => onEdit(m)}
                onDelete={() => onDelete(m.id)}
              />
            )
          })}
        </div>
      )}

    </div>
  )
}
