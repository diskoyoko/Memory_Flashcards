import '../css/card.css'

export default function Card({ memory, focused, flipped, onFocus, onFlip, onEdit, onDelete }) {
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
    >
      <div className={`card-inner${flipped ? ' flipped' : ''}`}>
        {/* FRONT */}
        <div className={`card-face card-front color-${memory.color}`}>
          <div className="card-category-badge">{memory.category}</div>
          <div className="card-title">{memory.title}</div>
        </div>

        {/* BACK */}
        <div className="card-face card-back">
          <div className="card-back-category">{memory.category}</div>
          <div className="card-back-content">{memory.content}</div>
          {memory.tags.length > 0 && (
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
