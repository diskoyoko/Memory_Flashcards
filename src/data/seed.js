export const CATEGORIES = ['joy', 'sadness', 'nostalgia']

export const COLORS = {
  crimson:  { from: '#E8291C', to: '#6B0D0D' },
  mauve:    { from: '#C9A8E0', to: '#8DB4D4' },
  beige:    { from: '#D4C5A9', to: '#C87941' },
  orange:   { from: '#E8831C', to: '#C8231C' },
  forest:   { from: '#2E7D52', to: '#0D2B1A' },
  pink:     { from: '#D4A8C0', to: '#C4A890' },
}

export const seedMemories = [
  {
    id: 'seed-1',
    title: 'The yellow kitchen',
    color: 'beige',
    content: 'Sunday mornings. My grandmother making porridge. The smell of cloves and something sweet I never learned the name of.',
    category: 'nostalgia',
    tags: ['home', 'family'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'seed-2',
    title: 'First snow abroad',
    color: 'mauve',
    content: 'I had never seen snow before. I stood outside for twenty minutes just watching it fall. Nobody told me it would be that quiet.',
    category: 'joy',
    tags: ['travel', 'winter'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'seed-3',
    title: 'Last call',
    color: 'forest',
    content: 'The last phone call before the distance became permanent. I don\'t remember what we talked about. I remember the silence after.',
    category: 'sadness',
    tags: ['people', 'distance'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'seed-4',
    title: 'The long train',
    color: 'orange',
    content: 'Four hours on a train to nowhere important. Window seat, headphones in, completely free.',
    category: 'joy',
    tags: ['solitude', 'travel'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: 'seed-5',
    title: 'That blue room',
    color: 'pink',
    content: 'The bedroom I had at 14. Posters I\'m too embarrassed to name. The specific feeling of summer evenings through a thin curtain.',
    category: 'nostalgia',
    tags: ['childhood', 'summer'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
]
