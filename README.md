# Saurabh Lokhande - AI Engineer Portfolio

The codebase for [saurabh-anil-lokhande.netlify.app](https://saurabh-anil-lokhande.netlify.app/), a "Top 1%" portfolio showcasing advanced frontend engineering, 3D visualizations, and autonomous agent integrations.

## 🚀 Key Features

* **Immersive 3D**: `React Three Fiber` scenes (Hero Crystal, Robot) with performance-optimized lazy loading.
* **Advanced AI Integrations**: Features like `AutonomousAgentHUD`, `RAGSimulator`, `LangGraphInteractive`, and `Chatbot` for a true AI engineer showcase.
* **Interactive Core**: Advanced interactivity via `InteractiveCore`, `CommandPalette`, and seamless `SmoothScroll` with Lenis.
* **Data Visualization & Audio**: Includes `TelemetryDashboard`, `LiveStats`, and `AudioVisualizer` for a multi-sensory experience.
* **Accessibility First**: Fully keyboard-navigable modals with focus trapping and ARIA support.
* **Performance & SEO**: Core Web Vitals optimized with `React.lazy`, `Suspense`, PWA capabilities, and integrated JSON-LD Structured Data for "Person" schema.
* **Reliability**: Automated Test Suite using `Vitest` + `React Testing Library`.

## 🛠️ Tech Stack

* **Core**: React, TypeScript, Vite
* **Animation & Scrolling**: GSAP, Framer Motion, Lenis (Smooth Scroll)
* **3D**: Three.js, React Three Fiber, Dreis
* **Styles**: TailwindCSS
* **Testing**: Vitest, React Testing Library
* **Context**: Custom `TerminalContext` and `AudioContext`.

## 🏃‍♂️ Getting Started

### Prerequisites

* Node.js > 18
* npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Testing (Reliability)

This project maintains a unit and component test suite to ensure stability.

```bash
# Run all tests
npm test

# Run specific test
npx vitest run Footer.test.tsx
```

### Building for Production

```bash
npm run build
```

## 🧠 Engineering Highlights

### 1. Performance Optimization

Heavy 3D assets (`Hero3D`, `Robot3D`) are **lazy-loaded** to ensure the main content is interactive immediately.

```tsx
const Hero3D = React.lazy(() => import('./Hero3D'));
// ...
<Suspense fallback={null}><Hero3D /></Suspense>
```

### 2. AI & Data Integrations

Demonstrating real-time telemetry, simulated RAG workflows, and LangGraph interactive components to showcase deep AI engineering expertise.

### 3. Accessibility (a11y)

The Project Modal implements a custom **Focus Trap** to ensure keyboard users don't get lost.

* **Escape Key**: Closes modal.
* **Focus Restore**: Returns focus to the trigger button on close.

### 4. Automated Validation

Critical paths (e.g., "Is the footer visible?", "Does mobile detection work?") are covered by `*.test.tsx` files to prevent regressions.

---

© 2026 Saurabh Lokhande. Built with <3 and AI.