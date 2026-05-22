# Asmi Launch Video — v4 polish

Scope: visual polish only. Sequence, timing, and MainVideo untouched.

## Changes

### 1. New beat copy (was hidden)
- Second-to-last beat (the `done` window where MainVideo shows the 3 completed tasks):
  show headline **`completes tasks in background.`** using the same left-column kinetic
  serif treatment as the other product beats. Accent stays sky-blue.

### 2. Outro — classy editorial statement
Current outro reads dated (dark slab + colored words + thick underline). Replace with a
restrained editorial layout:

- **Background**: stay in the warm linen world — soft cream gradient with a faint warm
  vignette (no espresso/dark wash, no terracotta flood).
- **Top stamp**: small `asmi` wordmark + dot, centered ~18% from top, hairline below it.
- **Hero line** centered mid-screen, Instrument Serif italic, ~118px, espresso color:

  > AI that handles your personal chores
  > in the real world.

  - Two lines, balanced. `personal chores` and `real world` rendered in **terracotta italic**
    inline (no boldface, no separate spans that break spacing). Use a single span per line
    with inline highlight spans — no `display:inline-block` on the highlights so word
    spacing collapses correctly (fixes the missing space between "handles" and "your").
  - Slow line-by-line fade + 14px rise. No bounce.
- **Hairline rule** under the second line, ~80px wide, terracotta, draws across in 18f.
- **Bottom caption**: a small all-caps tagline in stone gray:
  `personal AI · launches soon` — same eyebrow style as the rest of the video, sits low.
  (Replaces the giant trailing wordmark.)

### 3. Spacing fix
- Root cause: hero line wrapped words inside `display:inline-block` spans, which strips
  the natural whitespace between them. Re-author as plain text strings with inline
  `<span>` only for the highlighted words; no inline-block.

## Files
- Edit `remotion/src/Launch16x9.tsx` only.
- Re-render to `/mnt/documents/asmi-launch-16x9-v4.mp4`.
