# SHAS Handcrafted Luxury Jewelry 💎

SHAS is a premium, handcrafted luxury jewelry storefront built with a modern, editorial aesthetic. It features a boutique catalog, interactive "shop-the-look" scenes, smooth momentum scrolling, custom vector animations, and responsive dark/light mode asset optimization.

## ✨ Brand Features

- **Dynamic Responsive Hero**: Full-bleed background assets (`shashdesktop.png` / `shashmob.png` / `shashdesktopdark.png` / `shashmobdark.png`) that dynamically switch depending on dark/light mode and mobile/desktop viewports.
- **Dynamic Theme Branding**: Auto-resolving logos (`shaslogo.png` / `shaslogodark.png`) in the navbar and footer that adapt immediately to light, dark, or system preferences.
- **Interactive Hotspot Studio**: Point-of-interest indicators overlaying high-fidelity jewelry layouts, allowing customers to explore and add items directly to their cart.
- **Next.js-like routing**: Modern layout structures and index pages managed via React Router 7.
- **Ultra-Smooth Scrolling**: Custom momentum scrolling powered by Lenis + GSAP ScrollTrigger alignment.
- **Motion Preferencing**: Built-in support for OS `prefers-reduced-motion` settings.

---

## 🛠️ Tech Stack

- **Runtime & Manager**: [Bun](https://bun.sh/)
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation Orchestrator**: [GSAP 3](https://gsap.com/)
- **Gestures & spring physics**: [Framer Motion 12](https://framer.com/motion)
- **Smooth Scroll**: [Lenis 1.3](https://github.com/darkroomengineering/lenis)
- **State Store**: [Zustand](https://docs.pmnd.rs/zustand)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies using Bun:
```bash
bun install
```

### 2. Run Dev Server
Start the local development server:
```bash
bun run dev
```

### 3. Build Production Bundle
Build and minify the client resources:
```bash
bun run build
```

---

## 📂 Project Structure

```text
src/
├── assets/         # High-resolution logos, favicons, and backgrounds
├── components/     # Layout headers, footers, theme toggles, and UI drawers
├── hooks/          # Custom utility hooks
├── layouts/        # Root layouts coordinating scroll engines and provider contexts
├── pages/          # Router page views (Home, About, Contact, Collections)
├── store/          # Zustand states (useThemeStore, useCartStore)
└── types/          # Zod schema models and typescript models
onpkg_docs/         # Project requirements, task trackers, and agent skills
```

---

## 📜 License
MIT
