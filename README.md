# Humain — Memory Cards

## 1. Project Overview

Memory Cards is a single-page web application that allows users to capture, store, and revisit personal memories through an interactive flashcard system.

Instead of traditional flashcards used for studying, this system reinterprets flashcards as memory containers. Each card represents a moment in time, paired with an emotional category that reflects how the memory was experienced.

The application presents memories as scattered fragments across the screen, allowing users to explore them non-linearly, similar to how memories are recalled in real life.

---

## 2. Problem Statement

Memories are inherently fragmented and unstable. Over time, they fade, distort, or become inaccessible. While some memories remain vivid, others are difficult to recall without a trigger.

This project addresses the problem of memory loss and emotional disconnection by allowing users to:
- capture memories in a structured way
- associate them with emotions
- revisit them through interaction

By tagging memories with emotional states, the system enables users to reconnect with past experiences not just through information, but through feeling.

---

## 3. Technical Stack

### Frontend
- **React 18** — component-based UI, all views and interactions built as React components
- **Vite** — development server and build tool
- **HTML** — single `index.html` entry point that mounts the React app

### Styling
- **Plain CSS** with CSS custom properties (design tokens for colours, typography, spacing)
- Separate stylesheet per component for maintainability
- CSS `transform-style: preserve-3d` for the card flip animation

### Data / Storage
- **localStorage** — browser-based persistence; all memory cards are saved locally and restored on page reload
- No backend or external database required — the app runs entirely in the browser
- Seed data provided in `data/seed.js` as the starting state for new users

### Routing
- No router — this is a true single-page application
- All view switching (scatter ↔ category) and modal states are managed through React component state in `App.jsx`

### Deployment
- Localhost for development via `npm run dev`
- Static production build via `npm run build` — deployable to Vercel, Netlify, or any static host

---

## 4. Features

- Single-page application (SPA) — no page reloads at any point
- Create, Read, Update, Delete (CRUD) memory cards
- Interactive card system — click to focus, click again to flip and reveal the memory
- Scatter view — free, randomised layout of memory cards across the screen
- Category view — cards grouped by emotional category (joy, sadness, nostalgia)
- Emotion-based categorisation with three emotional tags
- Tagging system for contextual details
- Modal form for adding and editing cards
- Edit and delete actions accessible from the back face of each card
- Persistent storage — memories survive page refresh via localStorage
- Keyboard accessible — Escape key dismisses focused cards
- Empty state — friendly prompt appears when no memories exist yet
- Mobile responsive — card sizing adapts on smaller screens

---

## 5. Folder Structure

```
project-root/
│
├── index.html              # Single HTML entry point
├── package.json            # Project dependencies and scripts
│
└── src/
    ├── App.jsx             # Root component — manages all application state
    ├── main.jsx            # Entry point — mounts the app into index.html
    │
    ├── components/         # React UI components
    │   ├── Card.jsx        # Individual memory card (front/back, flip logic)
    │   ├── CardForm.jsx    # Add and edit modal form
    │   ├── ScatterView.jsx # Free scattered layout
    │   └── CategoryView.jsx# Grouped layout by emotion
    │
    ├── css/                # Stylesheets — one per component plus global tokens
    │   ├── global.css      # Design tokens, resets, typography
    │   ├── card.css
    │   ├── category.css
    │   ├── form.css
    │   ├── scatter.css
    │   └── toggle.css
    │
    ├── hooks/              # Custom React hooks
    │   └── useMemories.js  # All CRUD operations and localStorage persistence
    │
    └── data/               # Static data
        └── seed.js         # Sample memory cards, colour palette, category list
```

---

## 6. Challenges and Solutions

One of the main challenges was translating an abstract concept — fragmented memory and emotion — into a functional and structured system. Balancing emotional expression with clear data structure required simplifying the model into a single main category (emotion) and flexible tags.

The scatter layout required cards to appear at consistent random-looking positions across re-renders without jumping as state changed. This was solved by deriving each card's position deterministically from its ID rather than using `Math.random()`, so the layout remains stable even as cards are added or deleted.

Implementing the card flip animation required careful use of CSS `transform-style: preserve-3d` and `backface-visibility: hidden` on each face, along with precise z-index layering so that the edit and delete buttons on the back face remained interactive after the flip.

Managing the focused, flipped, and modal states across the app without a state management library required careful design of the state shape in `App.jsx`, ensuring that focusing, flipping, editing, and dismissing a card never left the UI in a conflicting state.

---

## 7. Future Improvements

This project represents the first version of a larger concept.

Future iterations may include:
- Image attachment to memory cards
- Audio recording for memory capture
- Expanded emotional tagging system
- Search and filtering capabilities
- Timeline-based memory view
- Backend and database integration for multi-device sync
- Enhanced visual storytelling interactions
