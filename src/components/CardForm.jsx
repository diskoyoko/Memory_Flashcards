// CardForm.jsx — Modal form for creating or editing a memory card
// Used for both "Add new memory" (+) and "Edit" actions.
// If `initial` is passed in, the form pre-fills with that card's data (edit mode).
// If `initial` is null, it starts blank (add mode).
//
// The form has:
//   - Title field
//   - Memory text area
//   - Primary emotion picker (coloured pill buttons)
//   - Sub-emotion picker (shown after a primary is selected)

import { useState } from 'react'
import '../css/form.css'
import { PRIMARY_EMOTIONS, SUB_EMOTIONS, emotionToColor } from '../data/seed'

export default function CardForm({ initial, onSave, onClose }) {
  const [title, setTitle]             = useState(initial?.title ?? '')
  const [content, setContent]         = useState(initial?.content ?? '')
  const [primaryEmotion, setPrimary]  = useState(initial?.primaryEmotion ?? '')
  const [subEmotions, setSubEmotions] = useState(initial?.subEmotions ?? [])

  function selectPrimary(name) {
    setPrimary(name)
    setSubEmotions([])
  }

  function toggleSub(sub) {
    setSubEmotions(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !primaryEmotion) return
    onSave({ title: title.trim(), content: content.trim(), primaryEmotion, subEmotions, tags: [] })
  }

  const availableSubs = primaryEmotion ? SUB_EMOTIONS[primaryEmotion] ?? [] : []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-title">{initial ? 'Edit memory' : 'New memory'}</div>

        {/* Title */}
        <div className="form-field">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="What do you call this memory?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Memory text */}
        <div className="form-field">
          <label className="form-label">Memory</label>
          <textarea
            className="form-textarea"
            placeholder="Write the memory..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>

        {/* Primary emotion — pill buttons */}
        <div className="form-field">
          <label className="form-label">Emotion</label>
          <div className="primary-emotion-pills">
            {PRIMARY_EMOTIONS.map(({ name, color }) => (
              <button
                key={name}
                type="button"
                className={`emotion-pill color-${color}${primaryEmotion === name ? ' selected' : ''}`}
                onClick={() => selectPrimary(name)}
                aria-pressed={primaryEmotion === name}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-emotions — shown after primary is picked */}
        {availableSubs.length > 0 && (
          <div className="form-field">
            <label className="form-label">Nuance</label>
            <div className="primary-emotion-pills">
              {availableSubs.map(sub => (
                <button
                  key={sub}
                  type="button"
                  className={`emotion-pill sub${subEmotions.includes(sub) ? ' selected-sub' : ''}`}
                  onClick={() => toggleSub(sub)}
                  aria-pressed={subEmotions.includes(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-save" disabled={!primaryEmotion}>Save</button>
        </div>
      </form>
    </div>
  )
}
