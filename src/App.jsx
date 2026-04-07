import { useState, useEffect } from 'react'
import './css/global.css'
import './css/toggle.css'
import { useMemories } from './hooks/useMemories'
import ScatterView from './components/ScatterView'
import CategoryView from './components/CategoryView'
import CardForm from './components/CardForm'

export default function App() {
  // All memory card data — persisted to localStorage via the hook
  const { memories, addMemory, updateMemory, deleteMemory } = useMemories()

  // Which card is currently centered on screen (by id), or null if none
  const [focused, setFocused] = useState(null)

  // Whether the focused card is showing its back face
  const [flipped, setFlipped] = useState(false)

  // Layout mode: 'scatter' (free placement) or 'category' (grouped by emotion)
  const [view, setView] = useState('scatter')

  // Modal state: null = closed, 'add' = new card form, { edit: card } = edit form
  const [modal, setModal] = useState(null)

  // Allow keyboard users to dismiss a focused card with Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Center a card on screen and reset its flip state
  function focus(id) {
    setFocused(id)
    setFlipped(false)
  }

  // Return the focused card to its original position
  function dismiss() {
    setFocused(null)
    setFlipped(false)
  }

  // Toggle between front and back of the focused card
  function flip() {
    setFlipped(f => !f)
  }

  function openAdd() {
    dismiss()
    setModal('add')
  }

  function openEdit(card) {
    setModal({ edit: card })
  }

  // Handle both create and update from the shared CardForm
  function handleSave(data) {
    if (modal === 'add') {
      addMemory(data)
    } else if (modal?.edit) {
      updateMemory(modal.edit.id, data)
    }
    setModal(null)
  }

  function handleDelete(id) {
    deleteMemory(id)
    dismiss()
  }

  // Props shared across both view components
  const sharedProps = {
    memories,
    focused,
    flipped,
    onFocus: focus,
    onFlip: flip,
    onEdit: openEdit,
    onDelete: handleDelete,
  }

  return (
    <>
      {/* Top navigation bar — wordmark + view toggle */}
      <header className="app-header" role="banner">
        <span className="app-wordmark" aria-label="Humain — Memory Cards">humain</span>
        <nav className="view-toggle" aria-label="View mode">
          <button
            className={`toggle-btn${view === 'scatter' ? ' active' : ''}`}
            aria-pressed={view === 'scatter'}
            onClick={() => { setView('scatter'); dismiss() }}
          >
            scatter
          </button>
          <button
            className={`toggle-btn${view === 'category' ? ' active' : ''}`}
            aria-pressed={view === 'category'}
            onClick={() => { setView('category'); dismiss() }}
          >
            category
          </button>
        </nav>
      </header>

      {/* Dimmed overlay behind a focused card — click to dismiss */}
      {focused && (
        <div
          className="overlay-dismiss"
          onClick={dismiss}
          aria-label="Close card"
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && dismiss()}
        />
      )}

      {/* Main view — switches between scatter and category layout */}
      <main role="main">
        {view === 'scatter'
          ? <ScatterView {...sharedProps} />
          : <CategoryView {...sharedProps} />
        }
      </main>

      {/* Floating action button to add a new memory */}
      <button
        className="fab"
        onClick={openAdd}
        aria-label="Add new memory"
        title="Add new memory"
      >
        +
      </button>

      {/* Add / Edit modal — rendered only when open */}
      {modal && (
        <CardForm
          initial={modal?.edit ?? null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
