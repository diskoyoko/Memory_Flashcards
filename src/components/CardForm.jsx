import { useState } from 'react'
import '../css/form.css'
import { CATEGORIES, COLORS } from '../data/seed'

const COLOR_KEYS = Object.keys(COLORS)

export default function CardForm({ initial, onSave, onClose }) {
  const [title, setTitle]       = useState(initial?.title ?? '')
  const [color, setColor]       = useState(initial?.color ?? 'mauve')
  const [content, setContent]   = useState(initial?.content ?? '')
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0])
  const [tags, setTags]         = useState(initial?.tags ?? [])
  const [tagInput, setTagInput] = useState('')

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  function removeTag(t) {
    setTags(prev => prev.filter(x => x !== t))
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); addTag() }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSave({ title: title.trim(), color, content: content.trim(), category, tags })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-title">{initial ? 'Edit memory' : 'New memory'}</div>

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

        <div className="form-field">
          <label className="form-label">Color</label>
          <div className="color-picker">
            {COLOR_KEYS.map(key => (
              <button
                key={key}
                type="button"
                className={`color-swatch ${key}${color === key ? ' selected' : ''}`}
                onClick={() => setColor(key)}
                title={key}
              />
            ))}
          </div>
        </div>

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

        <div className="form-field">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Tags</label>
          <div className="tags-input-row">
            <input
              className="form-input"
              placeholder="Add a tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <button type="button" className="tags-add-btn" onClick={addTag}>+</button>
          </div>
          {tags.length > 0 && (
            <div className="tags-list">
              {tags.map(t => (
                <span key={t} className="tag-chip">
                  #{t}
                  <button type="button" className="tag-chip-remove" onClick={() => removeTag(t)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </div>
  )
}
