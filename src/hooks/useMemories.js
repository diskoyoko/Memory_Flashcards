import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { seedMemories } from '../data/seed'

const STORAGE_KEY = 'humain_memories'

export function useMemories() {
  const [memories, setMemories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {}
    return seedMemories
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories))
  }, [memories])

  function addMemory(data) {
    setMemories(prev => [
      { ...data, id: nanoid(), createdAt: Date.now() },
      ...prev,
    ])
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
