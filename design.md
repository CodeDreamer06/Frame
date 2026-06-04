# Design — Frame AI Image Studio

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
- App pages: **Workbench** — the interface IS the product. Function carries the page; enrichment is forbidden. The prompt area, the canvas, the gallery grid, the settings form — these are the content. Typography, accent discipline, and microinteraction quality communicate the brand.

## Theme
- `--color-paper`         oklch(13% 0.01 65)
- `--color-paper-2`       oklch(17% 0.012 65)
- `--color-paper-3`       oklch(21% 0.012 65)
- `--color-rule`          oklch(28% 0.01 65)
- `--color-rule-2`        oklch(35% 0.01 65)
- `--color-neutral`       oklch(55% 0.008 65)
- `--color-muted`         oklch(68% 0.006 65)
- `--color-ink-2`         oklch(82% 0.006 70)
- `--color-ink`           oklch(93% 0.006 75)
- `--color-accent`        oklch(72% 0.17 70)
- `--color-accent-ink`    oklch(18% 0.04 70)
- `--color-accent-hover`  oklch(78% 0.17 70)
- `--color-accent-subtle` oklch(20% 0.04 70)
- `--color-focus`         oklch(72% 0.17 70)
- `--color-success`       oklch(72% 0.16 145)
- `--color-warning`       oklch(78% 0.16 85)
- `--color-error`         oklch(62% 0.22 25)

Anchor hue: **65–75° (warm amber/ochre)**. All neutrals tinted toward this
anchor. No cool greys. The accent is amber at 72% lightness and 0.17 chroma —
warm, distinctive, visible on the dark canvas without dominating.

## Typography
- Display: **Fraunces**, weight 600, style normal, tracking -0.02em
- Body:    **IBM Plex Sans**, weight 400/500
- Mono:    **JetBrains Mono**, weight 400
- Display tracking: -0.02em
- Type scale anchor: `--text-display` = clamp(2.75rem, 5vw + 1rem, 5.25rem)
- Scale ratio: major third (1.25)

## Spacing
4-point named scale. The values are in `tokens.css`. Pages must use named
tokens (`var(--space-md)`), never raw values. Tailwind spacing utilities
(p-4, gap-3, etc.) are permitted since they follow a consistent 4px base.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` for enters, `--ease-in: cubic-bezier(0.7, 0, 0.84, 0)` for exits
- Durations: `--dur-micro: 120ms`, `--dur-short: 220ms`, `--dur-long: 420ms`
- Reveal pattern: one orchestrated stagger entrance per page, max 3 primitives
- Reduced-motion fallback: opacity-only crossfade, ≤ 150ms
- Library: framer-motion for entrance/exit/layout animations; CSS transitions for hover/focus states

## Microinteractions stance
- Silent success — no "Done!" toasts when the action's effect is visible
- Hover transitions: 220ms ease-out, specify exact properties (never transition-all)
- Focus rings: instant (no transition), 2px solid --color-focus, 2px offset
- Button press: framer-motion whileTap scale(0.98)
- Input focus: border-color transition to accent, no layout shift
- Accordion sections: grid-template-rows 0fr → 1fr, 420ms ease-out

## CTA voice
- Primary CTA: `bg-accent text-accent-ink rounded-lg`, Fraunces font-semibold, 44px min-height
- Secondary CTA: `bg-paper-3 border border-rule text-muted hover:text-ink-2 rounded-lg`

## Per-page allowances
- App pages MUST NOT use enrichment — function carries the page.
- No hero sections, no marketing structure, no social proof.
- Empty states are typographic: heading + one line + one button.

## What pages MUST share
- The wordmark: amber square + "Frame" in Fraunces 600
- The accent colour (amber, oklch 72% 0.17 70) and its placement (< 5% per viewport)
- The display + body fonts (Fraunces + IBM Plex Sans)
- The CTA voice (button shape, radius, padding)
- The sidebar component (shared, imported from components/Sidebar.tsx)
- The header pattern (h-14, border-b, font-display title)

## What pages MAY differ on
- Section organization (collapsible vs flat)
- Grid column count
- Which framer-motion primitives to use (within the 3-per-page cap)
- Content-specific controls (sliders, toggles, selectors)

## Exports

See `tokens.css` at project root for the portable token file.
