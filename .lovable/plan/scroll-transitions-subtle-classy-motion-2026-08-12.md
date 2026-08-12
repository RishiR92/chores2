# Scroll transitions: subtle, classy motion

Right now each whole section fades in as one block, so scrolling feels like a slideshow of flat panels. The fix is layered, small-scale motion — nothing flashy.

## What changes

1. **Staggered content, not whole blocks**
   Instead of one reveal per section, the eyebrow label, heading, lead line and cards animate in sequence (~60ms apart). The eye follows a line of movement instead of a slab appearing.

2. **Headings that settle**
   Section headings rise slightly with a soft mask-wipe from the baseline up, so type "sets" rather than fades.

3. **Cards with depth**
   Card grids (receipts, chore grid, restaurant options, chase task card) reveal with a small lift + scale (0.98 → 1) and a barely-visible shadow bloom, staggered left-to-right.

4. **Gentle scroll parallax**
   Section backdrops and the atmosphere layer drift a few pixels slower than the page. Enough to add depth, not enough to notice consciously.

5. **Sticky-feel headers**
   As a section scrolls past, its heading fades and drifts up slightly ahead of the content — a light "handoff" between sections.

6. **Accent details**
   Hairline rules keep drawing themselves; small accents (coral dot, mono labels) fade in last so each section lands on a beat.

## Rules

- Everything stays under 500ms, easing `[0.22, 0.8, 0.24, 1]`.
- No horizontal slides, bounces, rotations, or long delays.
- Full `prefers-reduced-motion` bypass, as today.
- Hero stays as-is — its scroll-driven chat reveal already works.

## Technical notes

- Extend `src/components/asmi/Reveal.tsx`: add `RevealGroup` (stagger container via Motion `staggerChildren`) and a `variant` prop (`text` | `card` | `accent`) so callers pick the motion flavour.
- Add a `useParallax` hook wrapping `useScroll` + `useTransform` for the few-pixel drift; apply in `Atmosphere.tsx` and section headers.
- Update `Receipts`, `ChoreGrid`, `GenerativeUI`, `ChaseEngine`, `LangCluster`, `CloseCTA` to wrap their internals in `RevealGroup` instead of one outer `Reveal` in `src/routes/index.tsx`.
- Transforms/opacity only, `will-change` on parallax layers, to keep mobile scrolling at 60fps.
