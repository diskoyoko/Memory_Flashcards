# Fragments of Memory

## 1. Project Overview

Fragments of Memory is a single-page web application that allows users to capture and revisit personal memories through an interactive flashcard system.

The project is built around the idea that memories are not stored as linear records, but as fragmented moments recalled through emotional triggers. Memory cards are scattered across a pannable canvas, allowing users to explore them non-linearly — similar to how memories surface in the mind.

### Emotion Framework — Plutchik's Wheel of Emotions

The emotional system in this project is grounded in **Robert Plutchik's Wheel of Emotions** (1980), a psychoevolutionary theory that organises human emotions into eight primary categories arranged in a circular model: **Joy, Trust, Fear, Surprise, Sadness, Disgust, Anger, and Anticipation**.

Plutchik's model was chosen because it:
- Provides a structured yet nuanced vocabulary for emotional experience
- Organises emotions by intensity — each primary emotion has three levels (e.g. Serenity → Joy → Ecstasy)
- Reflects how emotions are not isolated but exist in relation to one another

In this app, each memory card is tagged with one primary emotion from Plutchik's eight categories. The card's colour gradient is automatically derived from that emotion — no manual colour selection needed. When a card is flipped open, the user can also select sub-emotions (the intensity variants from the wheel) to capture the more specific emotional texture of the memory. This allows users to record not just *what* happened, but *how* it felt — and to explore their archive through an emotional lens.

---

## 2. Problem Statement

Memories are inherently fragile and fragmented. Over time they fade, lose clarity, or become disconnected from the emotional context that gave them meaning. Existing digital tools tend to store memories as static records — notes, photos — but rarely capture the feeling behind the moment.

This project addresses that gap by linking memories to emotional categories drawn from the Plutchik model. By recording how a moment felt, users can revisit past experiences in a more reflective way — using emotion as the trigger for recollection, not just the other way around.

---

## 3. User Journey Overview

### Entry — Encountering Memory Fragments
Users arrive at a large canvas with a centred hero title. Cards are scattered around it in a loose, slightly rotated layout that shifts subtly as the cursor moves, giving the space a sense of depth and atmosphere. A clear zone around the title keeps the centre open, with cards filling the surrounding space.

### Exploration — Panning the Canvas
The canvas is fully pannable — click and drag the background to move through the space. Cards at different depths shift at slightly different speeds through a parallax effect, reinforcing the sense of a physical space to explore. As the title drifts out of view, more cards come into sight.

### Interaction — Focusing and Revealing
Clicking a card brings it to the centre of the screen as a focused overlay. The front shows the memory title and its primary emotion as a colour gradient. Clicking again flips the card to reveal the full memory, sub-emotions, and edit/delete actions.

### Reflection — Reconnecting Through Emotion
The back of each card surfaces the emotional nuance of the memory — both the primary emotion and the more specific sub-emotions felt at the time. This encourages users to re-engage with how a moment felt, not just what happened.

### Contribution — Capturing New Memories
The + button opens a form to add a new card. Users write a title and memory, then select a primary emotion from Plutchik's eight categories and any relevant sub-emotions. The card colour is automatically assigned — no manual colour picking needed. Newly added cards appear with a glowing highlight and a "just added" badge, which persists until the next card is created.

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
- Seed data in `data/seed.js` provides an initial set of 30 personal memory cards

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
- Hero title centred on canvas — pans away as you explore
- Pannable scatter canvas — click and drag the background to explore
- Cursor parallax — cards shift at different depths as the cursor moves
- Clear zone around the title — no cards overlap the hero text
- Click to focus a card, click again to flip and reveal the memory
- Emotion-based colour system — card colour automatically derived from Plutchik's primary emotion
- Eight primary emotions with sub-emotion intensity chips
- New card highlight — glowing border and "just added" badge, dissolves when next card is added
- Filter (Emotions) view — browse cards by emotion with a chip bar
- Modal form for adding and editing cards
- Persistent storage via localStorage with schema versioning
- Keyboard accessible — Escape dismisses focused cards
- Mobile responsive with touch panning support
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
    │   ├── Card.jsx         # Card tile used in the Emotions (filter) view
    │   ├── CardForm.jsx     # Add / edit modal form
    │   ├── FilterView.jsx   # Emotion filter view with chip bar + card grid
    │   ├── FocusedCard.jsx  # Fixed overlay for the focused + flipped card
    │   └── ScatterView.jsx  # Pannable scatter canvas with parallax
    │
    ├── css/                 # Stylesheets — one per component plus global tokens
    │   ├── global.css       # Design tokens, resets, typography
    │   ├── card.css
    │   ├── category.css
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

**Stable scatter positions** — Cards needed consistent positions across re-renders without jumping when state changed. Solved using a deterministic slot system: a grid of pixel-based positions is pre-generated, the oval clear zone is excluded, remaining slots are sorted by distance from centre and shuffled within rings for an organic look. Each card's slot is assigned by index, so positions are always stable.

**Clear zone around the hero title** — Cards needed to stay outside the title area without disrupting the scattered layout. Solved with an elliptical exclusion zone (defined in pixels) applied during slot generation. Any grid cell whose centre falls inside the ellipse is skipped, so the title always has clear space around it.

**CSS containing block bug** — `will-change: transform` on the scatter canvas creates a new CSS containing block, which broke `position: fixed` on any focused card rendered inside it. Solved architecturally by extracting `FocusedCard` as a separate component rendered at the App level, completely outside the scatter DOM tree.

**Drag vs click disambiguation** — The canvas needed to distinguish a pan gesture from a card click. Solved using a `canvasDist` ref that tracks total cursor movement during a mousedown session; movements under 6px are treated as clicks, anything larger as a pan.

**Smooth parallax** — Implemented as a `requestAnimationFrame` lerp loop using refs for target/current values, keeping re-renders minimal while achieving a fluid depth effect.

**Emotion colour system** — Rather than storing a colour on each card (which would go stale if the mapping changed), colour is derived at render time via `emotionToColor()` from `seed.js`. The card data stores only the emotion name.

**New card highlight** — The highlight needed to persist indefinitely (not fade on a timer) and dissolve only when the next card is added. Solved by tracking `newCardId` and `dissolveId` in App state — when a new card is added, the previous highlight ID moves to `dissolveId` (triggering a CSS dissolve transition) and the new card gets `newCardId`.

---

## 8. Future Improvements

- Image or audio attachment to memory cards
- Timeline-based memory view
- Search across memory content
- Expanded emotional tagging with intensity levels
- Backend and database integration for multi-device sync
- Shareable memory cards
