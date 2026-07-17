# UI & Design System 🎨

## Aesthetics & Theme
- Sleek editorial handcrafted luxury styling.
- Interactive hotspots, smooth momentum scrolling (Lenis), and responsive layouts.
- Dynamic color modes resolving between light mode (Cream/Burgundy) and dark mode (Charcoal/Gold).

## Color Palette (CSS Variables)

```css
:root {
  /* Constant Brand Colors */
  --shas-burgundy: #A61C2E;
  --shas-gold: #E5A924;
  --shas-cream: #FCF9F5;
  --shas-charcoal: #2C2A38;
  --shas-plum: #8A5260;

  /* Dynamic Brand Tokens (Light Mode) */
  --shas-bg: #FCF9F5;
  --shas-brand: #A61C2E;
  --shas-accent: #E5A924;
  --shas-heading: #2C2A38;
  --shas-secondary: #8A5260;
  --shas-border: #E9DDD4;
}

.dark {
  /* Dynamic Brand Tokens (Dark Mode) */
  --shas-bg: #1B181E;
  --shas-brand: #E5A924;
  --shas-accent: #A61C2E;
  --shas-heading: #FCF9F5;
  --shas-secondary: #C3B4BD;
  --shas-border: #38303B;
}
```

## Typography
- Serif Font (Headings): `Cormorant Garamond` or `Playfair Display`.
- Sans Font (Body & Buttons): `Inter` or standard browser sans-serif.

## Key UI Components
- **Navbar**: Sticky header with backdrop-blur (`backdrop-blur-md bg-background/95`). Logo changes dynamically between `shaslogo.png` (light mode) and `shaslogodark.png` (dark mode).
- **Hero Background**: Full-bleed background displaying `shashdesktop.png` (desktop, light), `shashdesktopdark.png` (desktop, dark), `shashmob.png` (mobile, light), or `shashmobdark.png` (mobile, dark).
- **Favicon**: Configured in `index.html` referencing `metalogo.png`.
