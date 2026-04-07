// App.jsx — Root component
// This is the brain of the app. It manages all shared state (which card is focused,
// which view is active, whether a form modal is open) and passes the right data
// down to each child component.

import { useState, useEffect } from 'react'
import './css/global.css'
import './css/toggle.css'
import { useMemories } from './hooks/useMemories'
import ScatterView from './components/ScatterView'
import FilterView from './components/FilterView'
import FocusedCard from './components/FocusedCard'
import CardForm from './components/CardForm'

export default function App() {
  // useMemories handles reading/writing cards to localStorage
  const { memories, addMemory, updateMemory, deleteMemory } = useMemories()

  // ID of the focused card, or null
  const [focused, setFocused] = useState(null)
  // Whether the focused card is flipped to show back
  const [flipped, setFlipped] = useState(false)
  // Layout mode
  const [view, setView] = useState('scatter')
  // Emotion filter (filter view only)
  const [activeEmotion, setActiveEmotion] = useState(null)
  // Modal: null | 'add' | { edit: card }
  const [modal, setModal] = useState(null)

  // Dismiss focused card on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function focus(id) { setFocused(id); setFlipped(false) }
  function dismiss()  { setFocused(null); setFlipped(false) }
  function flip()     { setFlipped(f => !f) }

  function openAdd()       { dismiss(); setModal('add') }
  function openEdit(card)  { dismiss(); setModal({ edit: card }) }

  function handleSave(data) {
    if (modal === 'add') addMemory(data)
    else if (modal?.edit) updateMemory(modal.edit.id, data)
    setModal(null)
  }

  function handleDelete(id) {
    deleteMemory(id)
    dismiss()
  }

  const focusedMemory = focused ? memories.find(m => m.id === focused) : null

  const filterProps = {
    memories, focused, flipped,
    onFocus: focus, onFlip: flip,
    onEdit: openEdit, onDelete: handleDelete,
    activeEmotion, setActiveEmotion,
  }

  return (
    <>
      <header className="app-header" role="banner">
        <span className="app-wordmark">fragments of memory</span>
        <nav className="view-toggle" aria-label="View mode">
          <button
            className={`toggle-btn${view === 'scatter' ? ' active' : ''}`}
            onClick={() => { setView('scatter'); dismiss() }}
          >
            scatter
          </button>
          <button
            className={`toggle-btn${view === 'filter' ? ' active' : ''}`}
            onClick={() => { setView('filter'); dismiss() }}
          >
            emotions
          </button>
        </nav>
      </header>

      <main role="main">
        {view === 'scatter'
          ? <ScatterView memories={memories} focused={focused} onFocus={focus} />
          : <FilterView {...filterProps} />
        }
      </main>

      {/* Focused card overlay — appears on top of everything, no position conflict */}
      {focusedMemory && (
        <FocusedCard
          memory={focusedMemory}
          flipped={flipped}
          onFlip={flip}
          onEdit={openEdit}
          onDelete={handleDelete}
          onDismiss={dismiss}
        />
      )}

      <button className="fab" onClick={openAdd} aria-label="Add new memory" title="Add new memory">+</button>

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
