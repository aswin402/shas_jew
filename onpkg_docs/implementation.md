# Technical Implementation Document 🛠️

## Architectural Stack
- **Runtime & Manager**: Bun
- **Framework**: React 19 + React Router 7 Layout Routing
- **Build Tool**: Vite 8 with `@tailwindcss/vite` configuration
- **Styles**: Tailwind CSS v4 (configured via `index.css` imports)
- **State Store**: Zustand (managing `useThemeStore` and `useCartStore` states)
- **Scroll & Motion**: Lenis + GSAP (ScrollTrigger timelines for layout reveals)

## Feature Implementation Details

### 1. Dynamic Hero Background Image
- **Logic**: Reads the active theme from the Zustand store. Switches background image sources dynamically between light and dark versions.
- **Markup**: Uses a responsive `<picture>` tag targeting mobile vs desktop sizes:
  - Mobile (max-width `1023px`): `shashmob.png` (light) / `shashmobdark.png` (dark)
  - Desktop (min-width `1024px`): `shashdesktop.png` (light) / `shashdesktopdark.png` (dark)

### 2. Dynamic Theme Logos
- **Logic**: Swaps header and footer logo sources based on theme evaluation (`logoLight` vs `logoDark`).
- **Assets**: `shaslogo.png` (light mode) / `shaslogodark.png` (dark mode) imported as static assets and resolved by Vite.

### 3. Favicon configuration
- Uses `src/assets/metalogo.png` referenced directly in the `index.html` head links.
