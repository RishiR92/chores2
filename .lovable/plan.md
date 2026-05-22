# Asmi Launch Video — v3 fix pass

Goal: presentable and clear first, jazzy second. No sequence changes.

## Copy removals
- Remove `launches soon` tagline from the outro.
- Remove the `remembers everything.` headline beat — keep the beat's duration and phone choreography (so timing and MainVideo stay synced), but render no headline text during that window (phone-only moment).

## Problems in v2
1. Headlines sat behind the phone and got occluded — unreadable.
2. A dark oval kept appearing under/behind the phone (contact shadow + rim glow read as a random blob).
3. Phone jumped left / right / back / forward between beats — felt random, not choreographed.

## Fixes

### Layout — clear two-column stage
- Phone locked **center-right** (around x = +280 from center), vertically centered. No per-beat x/y drift.
- Headlines live in a **dedicated left column** (x: 96, width: ~900) — never behind the phone. Big serif, left-aligned, word-stagger reveal.
- Eyebrow `● asmi · personal AI` sits above the headline, accent dot only.
- Lower-third progress line stays at bottom-left.

### Phone — stable hero, subtle motion only
- One fixed pose for all product beats: `rotateY(-8deg) rotateX(4deg) scale(1)`.
- Entrance: spring up from below + slight rotate-in (kept).
- Idle: tiny vertical bob (±4px) and ±0.01 scale breath. No x drift, no per-beat camera moves.
- Per beat, only the **accent rim color** and **glow tint** change (so it still feels alive without moving).

### Remove the "random oval"
- Delete the elliptical contact shadow under the phone.
- Replace with a soft, **rectangular** drop-shadow under the phone via `filter: drop-shadow` only — no separate ellipse div.
- Inner rim light: drop the `inset box-shadow` (it was reading as an oval at corners). Replace with a thin 1px accent border on the clipped screen rect.

### Intro
- `meet asmi` wordmark stays, but **smaller** (fontSize ~280) and positioned in the left column so it doesn't collide with the phone. Phone fades in slightly delayed so the wordmark reads first.

### Outro — unchanged behavior, cleaner execution
- Phone dissolves outward, then the hero line "AI that handles your personal chores in the real world." appears center-screen, then asmi wordmark + `launches soon` fades in. Same as v2 — only the dissolve uses scale + blur + opacity, no particle ring (the particles also read as oval). Replace particle ring with a soft expanding warm flare.

### Jazz that stays
- Word-by-word kinetic stagger on headlines.
- Accent sweep band wipes across at each beat change.
- Stationary light pool top-center.
- Dust motes with per-beat energy.
- Animated progress line in the lower-third.

## Files
- Edit `remotion/src/Launch16x9.tsx` only. `MainVideo.tsx`, `Root.tsx`, render script unchanged.
- Re-render to `/mnt/documents/asmi-launch-16x9-v3.mp4`.
