# Product Requirements Document (PRD) 🚀

## Project Overview
SHAS is a DTC luxury jewelry storefront built on a boutique, editorial aesthetic. It celebrates mindful creation and intention, targeting customers looking for timeless vermeil gold and baroque pearl jewelry.

## Core Features & Scope
- [x] **Responsive Hero Section**: Displays full-bleed visual jewelry arrangements that dynamically change based on viewport (desktop vs. mobile) and theme (light mode vs. dark mode).
- [x] **Dynamic Branding (Logos)**: Renders high-resolution brand logos (`shaslogo.png` / `shaslogodark.png`) in the header and footer that automatically toggle based on the client theme.
- [x] **Interactive Showcases**: Interactive hotspots on studio scenes allowing users to view specifications of layered jewelry models.
- [x] **Shopping Drawer & Cart**: Client state persistence for cart management (Zustand state integration).
- [x] **Favicon & Meta**: Polished meta tags and head icon configuration with `metalogo.png`.

## Success Metrics
- **Performance**: High visual fidelity with optimized responsive sizes (using native HTML `<picture>` formats) for fast LCP/INP scores.
- **Consistency**: Unified brand logos and typography across navbar, body, and footer containers.
- **Accessibility**: Support for prefers-reduced-motion, semantic HTML elements, and high text contrast ratios (light mode: dark slate `#2C2A38` text over cream background; dark mode: off-white `#FCF9F5` text).
