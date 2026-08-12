# amo-grade craft pass — heavy on the hero

## What amo actually gets right

- One persistent centered anchor. The wordmark never leaves; sections change *around* it.
- Paper canvas, dot grid, ink-black type, zero gradients or glow.
- Real cutout photography floated over the canvas like a scrapbook — physical objects, not UI cards.
- An oversized graphic cursor treated as art, not chrome.
- Almost no body copy. Image + type carries the meaning.

We keep asmi's structure and voice. We raise the craft to that level, hardest at the top.

## Hero — the big move

Replace the flat first screen with a **collage stage**:

- Cutout objects float over the paper grid, layered at different depths, drifting on scroll and tilting slightly with pointer: a landline handset with a coiled cord, a torn "please hold" ticket stub, a salon chair, a wrench, a dentist appointment card, a crumpled receipt. Cut out on transparency, hard drop shadow, slightly rotated — pinned to a board, not arranged in a grid.
- Objects sit *behind* and *around* the headline, never over the text. On mobile only 2–3 survive, tucked into the corners.
- The iMessage thread card stays — it becomes the one clean, alive object in a messy pile of real-world chores.
- Headline keeps its weight but gains the amo trick: **"irritating" swaps in a second typeface** — a heavier, uglier cut that snaps in on load, so the word behaves differently from the sentence around it. One anchored moment of type personality, not a carnival.
- Custom cursor on desktop: a chunky black arrow with a small "she's on it" tail label. Reverts to normal over links.

## Texture pass — rest of the page

- **Receipts (dark band):** one cutout — a phone handset dangling off-hook — bleeds off the left edge behind the hold clock.
- **Generative UI:** restaurant cards get real cutout food/venue photography instead of flat blocks, with the same hard-shadow paper treatment.
- **Chase Engine:** unchanged in behaviour. Gets a torn-paper top edge and a faint dot grid so it reads as a page in the same notebook.
- **ChoreGrid:** small cutout objects punctuate the marquee at intervals rather than the current uniform text run.
- **Global:** deepen paper grain, tighten shadows to a single hard offset (no soft blur anywhere), and remove remaining glow/blur backgrounds.

## Imagery

Generate 8–10 cutout PNGs (transparent, hard-lit, editorial-catalogue feel, consistent lighting across the set) into `src/assets/`. Slightly desaturated so terracotta/citrus accents stay the loudest thing on screen.

## Technical notes

- New `src/components/asmi/Collage.tsx` — declarative layer list (`src`, x/y, depth, rotation), each layer bound to scroll progress and a springed pointer offset. Depth drives parallax rate and shadow size. Disabled under `prefers-reduced-motion`.
- New `src/components/asmi/Cursor.tsx` — pointer-fine only, `mousemove` into a motion value, no per-frame React state.
- Hero (`Hero.tsx`) keeps its existing sticky/scroll-progress chase logic untouched; the collage mounts as a sibling layer behind it.
- Images: `loading="lazy"` below the fold, hero layers eager, explicit width/height, `pointer-events: none`.
- No copy rewrites, no structural/routing changes, no backend.

## Out of scope

Full amo-style morphing-wordmark scroll narrative — the texture pass covers the rest of the page instead.
