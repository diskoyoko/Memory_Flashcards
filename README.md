# Fragmented Memory Cards

## 1. Project Overview

Humain — Memory Cards is a single-page web application that allows users to capture and revisit personal memories through an interactive flashcard system.

The project is built around the idea that memories are not stored as linear records, but as fragmented moments that are recalled through triggers. To reflect this, memory cards are presented in a scattered layout, allowing users to explore them non-linearly, similar to how memories surface in the mind.

Each card represents a memory and is paired with an emotional category, enabling users to associate not only what happened, but how it felt. Through simple interactions such as selecting, flipping, and organizing cards, the system acts as a personal archive where users can revisit past experiences.

This version focuses on a minimal working system for capturing and interacting with memories. Future iterations may expand the archive through additional features such as image attachments, audio recordings, and a more nuanced emotional tagging system.

---

## 2. Problem Statement

Memories are inherently fragile and fragmented. Over time, they can fade, lose clarity, or become difficult to access without a trigger. While some moments remain vivid, many others are gradually forgotten or disconnected from their original emotional context.

Existing digital tools tend to store memories as static records (such as notes or photos), but often fail to capture the emotional dimension that gives those memories meaning.

This project addresses that gap by allowing users to record memories alongside emotional categories. By linking memories to how they were felt, the system enables users to revisit past experiences in a more reflective and affective way.

Through interaction with memory cards, users are not only recalling information, but re-engaging with the emotional states attached to those moments, using memory as a trigger for feeling rather than just recollection.

---

## 3. User Journey Overview

The user journey is designed to reflect how memories are experienced — non-linear, fragmented, and often triggered through interaction rather than direct search.

### Entry — Encountering Memory Fragments
When users enter the page, they are presented with a scattered layout of memory cards across the screen. This visual arrangement represents the fragmented nature of memory, where moments exist as disconnected pieces rather than a structured timeline.

Users can visually scan and select any card that draws their attention, simulating how certain memories surface unexpectedly.

### Interaction — Focusing and Revealing
Clicking on a card brings it into focus at the center of the screen. The front of the card displays a title and color, acting as a soft cue or trigger.

Clicking again flips the card to reveal the memory content on the back, including its emotional category and tags. This interaction mimics the process of recalling a memory — from a vague cue to a more detailed recollection.

### Reflection — Reconnecting Through Emotion
By reading the memory and its associated emotional category, users are able to reconnect not only with the event, but with how it felt at that moment.

The system emphasizes emotional recall, allowing users to revisit experiences through feeling rather than just factual detail.

### Contribution — Capturing New Memories
Users can add new memory cards through a simple input form. They record the memory text, assign an emotional category, and provide contextual tags.

This process encourages intentional reflection, turning everyday experiences into stored fragments within the archive.

### Organisation — Structuring the Fragments
Users can switch from scatter view to category view, where memories are grouped by emotional categories.

This provides a structured perspective of their emotional landscape, allowing patterns across memories to emerge while still preserving the fragmented nature of the original interaction.

## 4. Technical Stack

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

## 5. Features

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

## 6. Folder Structure

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

## 7. Challenges and Solutions

One of the main challenges was translating an abstract concept — fragmented memory and emotion — into a functional and structured system. Balancing emotional expression with clear data structure required simplifying the model into a single main category (emotion) and flexible tags.

The scatter layout required cards to appear at consistent random-looking positions across re-renders without jumping as state changed. This was solved by deriving each card's position deterministically from its ID rather than using `Math.random()`, so the layout remains stable even as cards are added or deleted.

Implementing the card flip animation required careful use of CSS `transform-style: preserve-3d` and `backface-visibility: hidden` on each face, along with precise z-index layering so that the edit and delete buttons on the back face remained interactive after the flip.

Managing the focused, flipped, and modal states across the app without a state management library required careful design of the state shape in `App.jsx`, ensuring that focusing, flipping, editing, and dismissing a card never left the UI in a conflicting state.

---

## 8. Future Improvements

This project represents the first version of a larger concept.

Future iterations may include:
- Image attachment to memory cards
- Audio recording for memory capture
- Expanded emotional tagging system
- Search and filtering capabilities
- Timeline-based memory view
- Backend and database integration for multi-device sync
- Enhanced visual storytelling interactions
