# Fragments of Memory

## 1. Project Overview

Fragments of Memory is a single-page web application that allows users to capture and revisit personal memories through an interactive flashcard system.

The project is built around the idea that memories are not stored as linear records, but as fragmented moments recalled through emotional triggers. Memory cards are scattered across a pannable canvas, allowing users to explore them non-linearly — similar to how memories surface in the mind.

Each card is paired with a primary emotion drawn from Robert Plutchik's Wheel of Emotions, so users associate not only what happened but how it felt. Clicking a card brings it into focus, and flipping it reveals the full memory content and nuanced sub-emotions beneath the surface.

---

## 2. Problem Statement

Memories are inherently fragile and fragmented. Over time they fade, lose clarity, or become disconnected from the emotional context that gave them meaning. Existing digital tools tend to store memories as static records — notes, photos — but rarely capture the feeling behind the moment.

This project addresses that gap by linking memories to emotional categories drawn from the Plutchik model. By recording how a moment felt, users can revisit past experiences in a more reflective way — using emotion as the trigger for recollection, not just the other way around.

---

## 3. User Journey Overview

### Entry — Encountering Memory Fragments
Users arrive at a scattered canvas of memory cards. Cards are arranged in a loose, slightly rotated layout that shifts subtly as the cursor moves, giving the space a sense of depth and atmosphere. The arrangement reflects the fragmented, non-linear nature of memory.

### Exploration — Panning the Canvas
The canvas is fully pannable — click and drag to move through the space. Cards at different depths shift at slightly different speeds through a parallax effect, reinforcing the sense of a physical space to explore.

### Interaction — Focusing and Revealing
Clicking a card brings it to the centre of the screen. The front shows the memory title and its primary emotion as a colour gradient. Clicking again flips the card to reveal the full memory, sub-emotions, and edit/delete actions.

### Reflection — Reconnecting Through Emotion
The back of each card surfaces the emotional nuance of the memory — both the primary emotion and the more specific sub-emotions felt at the time. This encourages users to re-engage with how a moment felt, not just what happened.

### Contribution — Capturing New Memories
The + button opens a form to add a new card. Users write a title and memory, then select a primary emotion from Plutchik's eight categories and any relevant sub-emotions. The card colour is automatically assigned from the emotion — no manual colour picking needed.

### Organisation — Filtering by Emotion
Switching to the Emotions view groups cards by primary emotion with a filter chip bar at the top. Tapping a chip shows only cards tagged with that emotion. Tapping All returns to the full set.

---

## 4. Technical Stack

### Frontend
- **React 18** — component-based UI, all views and interactions built as React components
- **Vite** — development server and build tool
- **HTML** — single `index.html` entry point that mounts the React app

### Styling
- **Plain CSS** with CSS custom properties (design tokens for colours, typography, spacing)
- Separate stylesheet per component for maintainability
- CSS `transform-style: preserve-3d` and `backface-visibility: hidden` for the 3D card flip

### Data / Storage
- **localStorage** — browser-based persistence; all memory cards are saved locally and restored on reload
- Schema versioning prevents stale data from older app versions corrupting the current state
- Seed data in `data/seed.js` provides an initial set of 30 real personal memory cards

### Routing
- No router — true single-page application
- All view switching (scatter ↔ emotions) and modal states managed via React state in `App.jsx`

### Deployment
- Development: `npm run dev` → localhost
- Production build: `npm run build` — deployable to Vercel, Netlify, or any static host

---

## 5. Features

- Single-page application — no page reloads
- Create, Read, Update, Delete (CRUD) memory cards
- Pannable scatter canvas — click and drag to explore
- Cursor parallax — cards shift at different depths as the cursor moves
- Click to focus a card, click again to flip and reveal the memory
- Emotion-based colour system — card colour automatically derived from the primary emotion (Plutchik's Wheel)
- Eight primary emotions with sub-emotion chips
- Filter view — browse cards by emotion with a chip bar
- Modal form for adding and editing cards
- Persistent storage via localStorage with schema versioning
- Keyboard accessible — Escape dismisses focused cards
- Empty state — prompt appears when no memories exist yet

---

## 6. Folder Structure

```
project-root/
│
├── index.html               # Single HTML entry point
├── package.json             # Dependencies and scripts
│
└── src/
    ├── App.jsx              # Root component — manages all application state
    ├── main.jsx             # Entry point — mounts the app into index.html
    │
    ├── components/          # React UI components
    │   ├── CardForm.jsx     # Add / edit modal form
    │   ├── FilterView.jsx   # Emotion filter view with chip bar + card grid
    │   ├── FocusedCard.jsx  # Fixed overlay for the focused + flipped card
    │   └── ScatterView.jsx  # Pannable scatter canvas with parallax
    │
    ├── css/                 # Stylesheets — one per component plus global tokens
    │   ├── global.css       # Design tokens, resets, typography
    │   ├── filter.css
    │   ├── focused.css
    │   ├── form.css
    │   ├── scatter.css
    │   └── toggle.css
    │
    ├── hooks/               # Custom React hooks
    │   └── useMemories.js   # CRUD operations and localStorage persistence
    │
    └── data/                # Static data
        └── seed.js          # Seed cards, Plutchik emotion map, colour helper
```

---

## 7. Challenges and Solutions

**Stable scatter positions** — Cards needed to appear at consistent positions across re-renders without jumping when state changed. Solved by deriving each card's position deterministically from its ID using a character-code hash, so the layout is stable even as cards are added or deleted.

**CSS containing block bug** — `will-change: transform` on the scatter canvas creates a new CSS containing block, which broke `position: fixed` on any focused card rendered inside it. Solved architecturally by extracting `FocusedCard` as a separate component rendered at the App level, completely outside the scatter DOM tree.

**Drag vs click disambiguation** — The canvas needed to distinguish a pan gesture from a card click. Solved using a `dragDist` ref that tracks total cursor movement during a mousedown session; movements under 6px are treated as clicks, anything larger as a pan.

**Smooth parallax** — Implemented as a `requestAnimationFrame` lerp loop using refs for target/current values, keeping re-renders minimal while achieving a fluid, spring-like depth effect.

**Emotion colour system** — Rather than storing a colour on each card (which would go stale if the mapping changed), colour is derived at render time via `emotionToColor()` from `seed.js`. The card data stores only the emotion name.

---

## 8. Future Improvements

- Image or audio attachment to memory cards
- Timeline-based memory view
- Search across memory content
- Expanded emotional tagging with intensity levels
- Backend and database integration for multi-device sync
- Shareable memory cards
