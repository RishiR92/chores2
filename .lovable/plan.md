# Launch video — v7 polish

Four targeted changes to `remotion/src/Launch16x9.tsx`. No timing changes.

## 1. New headline on the tasks beat

Replace the headline `"from plumbers\nto prescriptions."` with `"your personal\nchores handled."` on the `tasks` beat (BEATS[5]). Matches the outro's "personal chores" highlight and ties the two screens together. Sequence and duration stay the same.

## 2. Recolor tasks + languages hero words to match the outro highlight

The outro renders "personal chores" and "real world" in TERRACOTTA (`#C25B3F`) on linen — that's the warm accent the user wants echoed.

- In `RotatingReel`, paint the large hero word in TERRACOTTA instead of ESPRESSO, for both `tasks` and `langs` scenes.
- Secondary drifting words stay in muted ESPRESSO/STONE so the hero word leads the eye.
- The hairline rule under the hero stays on the beat's `accent` (CLAY for tasks, SAGE for langs) so the scene still has its own color signature in the backdrop and counter.

Net effect: the hero verbs / language words feel like the same family as the closing card.

## 3. Realistic phone shell — less flat black

Today the phone body is rendered by the `MainVideo` chrome and reads as a solid black slab. Upgrade only the outer shell in `Launch16x9.tsx`:

- Replace the single drop-shadow on the phone wrapper with a layered titanium-style frame: a subtle vertical gradient body (`#3a3a3e → #1c1c1f → #2a2a2e`), a 1px inner highlight on the top edge (rgba white 0.18), a 1px inner shadow on the bottom edge (rgba black 0.5), and a soft accent rim-light using the current beat's `accent` at ~0.25 opacity.
- Keep the screen cutout (`clipPath: inset(110px 90px 110px 90px round 130px)`) exactly as is so `MainVideo` content is untouched.
- Add a faint reflective sheen — a diagonal linear-gradient highlight at ~8% opacity moving very slowly with `frame` — to sell the glass/metal read without distracting from the screen.

The user keeps seeing real app footage inside; only the bezel reads as a premium device instead of a black rectangle.

## 4. Make the phone feel alive — levitate + remove the awkward tilt

Current state: `totalRotX = entryRotX + 4`, `totalRotY = entryRotY + -8`, and a tiny `bob` of ±4px. Reads as static and tilted oddly.

Replace with a continuous, gentle levitation loop once the entry spring resolves:

- Vertical float: `sin(frame / 55) * 14` px (bigger, smoother bob).
- Subtle yaw: `sin(frame / 90) * 2.5` deg added to rotateY (settles around 0, no constant left lean).
- Subtle pitch: `sin(frame / 110 + 1.2) * 1.5` deg on rotateX.
- Breath scale: `1 + sin(frame / 75) * 0.012` (slightly more pronounced than today).
- Drop-shadow Y offset and blur also breathe with the float so the shadow grows when the phone rises — sells the levitation.
- Remove the fixed `+4` / `-8` resting tilt so the phone hovers roughly upright with only the live micro-motion.

Entry spring is unchanged (still drops in from below and settles); the new motion just takes over once `phoneIn` ≈ 1.

## Files

- `remotion/src/Launch16x9.tsx` only.
- Re-render to `/mnt/documents/asmi-launch-16x9-v7.mp4`.
