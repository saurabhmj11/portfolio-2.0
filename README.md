# Saurabh Lokhande - AI Engineer Portfolio

The codebase for [saurabhlokhande.com](https://saurabhlokhande.com), a "Top 1%" portfolio showcasing advanced frontend engineering, 3D visualizations, and autonomous agent integration.

## 🚀 Key Features

*   **Immersive 3D**: `React Three Fiber` scenes (Hero Crystal, Robot) with performance-optimized lazy loading.
*   **Accessibility First**: Fully keyboard-navigable "Projects" modal with focus trapping and ARIA support.
*   **Performance**: Core Web Vitals optimized with `React.lazy`, `Suspense`, and PWA capabilities.
*   **SEO**: Integrated JSON-LD Structured Data for "Person" schema.
*   **Reliability**: Automated Test Suite using `Vitest` + `React Testing Library`.

## 🛠️ Tech Stack

*   **Core**: React, TypeScript, Vite
*   **Animation**: GSAP, Framer Motion, Lenis (Smooth Scroll)
*   **3D**: Three.js, React Three Fiber, Dreis
*   **Styles**: TailwindCSS
*   **Testing**: Vitest, React Testing Library
*   **Context**: Custom `TerminalContext` for logs.

## 🏃‍♂️ Getting Started

### Prerequisites

*   Node.js > 18
*   npm

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

### 2. Accessibility (a11y)
The Project Modal implements a custom **Focus Trap** to ensure keyboard users don't get lost.
- **Escape Key**: Closes modal.
- **Focus Restore**: Returns focus to the trigger button on close.

### 3. Automated Validation
Critical paths (e.g., "Is the footer visible?", "Does mobile detection work?") are covered by `*.test.tsx` files to prevent regressions.

---

© 2025 Saurabh Lokhande. Built with <3 and AI.