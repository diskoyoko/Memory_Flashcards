import '../css/category.css'
import Card from './Card'
import { CATEGORIES } from '../data/seed'

export default function CategoryView({ memories, focused, flipped, onFocus, onFlip, onEdit, onDelete }) {
  return (
    <div className="category-view">
      {CATEGORIES.map(cat => {
        const cards = memories.filter(m => m.category === cat)
        if (cards.length === 0) return null
        return (
          <div key={cat} className="category-group">
            <div className="category-heading">{cat}</div>
            <div className="category-cards">
              {cards.map(m => {
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
          </div>
        )
      })}
    </div>
  )
}
