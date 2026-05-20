# Asmi Demo v13 — Restore bookend content, fix bubbles

## 1. Bookend content — revert to v11, keep new font style
Keep the serif typography style from v12 (Instrument Serif, italic tagline). Restore the original copy:

- **Intro**: word "asmi" (serif, large) + small uppercase tracked label "HANDLES THE REAL WORLD"
  - Use Instrument Serif italic for "asmi" (v11 styling), not roman.
- **Outro**: small "asmi" wordmark, then three big serif italic lines:
  - "AI That Handles"
  - "Your Personal Chores"
  - "In The Physical World" (terracotta accent)
  - Bottom uppercase tracked label: "you text · asmi calls · it's done"

Both screens keep the v12 cream background and atmosphere.

## 2. Hero bubble fixes
- **Text fit**: shrink type 84 → 60px, widen bubble max-width 820 → 900px, reduce padding (48 / 56), reserve less right-padding for the timestamp. The Jonathan line must sit on 2 lines max, balanced.
- **Color**: current `#00A884 → #008F72` reads teal. Switch to the real WhatsApp outgoing-bubble green: `#25D366 → #128C7E` (or `#1FAE5C → #075E54` for dark variant). Use the brighter pair so it pops on cream.
- Keep tick + timestamp, soft glow, entry/exit animation, micro-float — unchanged.

## 3. Files
- `remotion/src/MainVideo.tsx` — Intro + Outro components, HeroBubble styling/color.
- Output: `/mnt/documents/asmi-demo-v13.mp4`

## QA
Stills at intro, outro, all 3 bubble peaks. Confirm:
- Jonathan bubble: text fits cleanly, no awkward wrap.
- Green reads as WhatsApp green, not teal.
- Outro 3-line layout matches v11.

## Out of scope
Audio, pacing, call scenes, done scene.
