// useMemories.js — Custom hook for all flashcard data
// This is where all cards are stored, loaded, and saved.
// It uses localStorage so your cards persist between browser sessions
// (no backend or database needed).
//
// How it works:
//   1. On first load, it checks localStorage for saved cards
//   2. If none exist (or the schema is outdated), it loads the seed cards
//   3. Any time cards change, it saves them back to localStorage automatically

import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { seedMemories } from '../data/seed'

const STORAGE_KEY = 'humain_memories'
const SCHEMA_VERSION = 'v3' // bump this whenever the data structure changes

export function useMemories() {
  const [memories, setMemories] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // If stored data uses old structure (has 'emotions' array instead of 'primaryEmotion'),
        // discard it and fall back to fresh seed data
        if (parsed.version !== SCHEMA_VERSION) {
          localStorage.removeItem(STORAGE_KEY)
          return seedMemories
        }
        return parsed.data
      }
    } catch {}
    return seedMemories
  })

  useEffect(() => {
    // Store alongside a version tag so we can detect stale schemas
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, data: memories }))
  }, [memories])

  function addMemory(data) {
    const id = nanoid()
    setMemories(prev => [{ ...data, id, createdAt: Date.now() }, ...prev])
    return id
  }

  function updateMemory(id, data) {
    setMemories(prev =>
      prev.map(m => (m.id === id ? { ...m, ...data } : m))
    )
  }

  function deleteMemory(id) {
    setMemories(prev => prev.filter(m => m.id !== id))
  }

  return { memories, addMemory, updateMemory, deleteMemory }
}
