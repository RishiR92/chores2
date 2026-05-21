# Asmi Launch Video — 16:9 Cinematic Cut (Hybrid)

Goal: A 1920×1080, ~43s launch film. The existing 9:16 phone demo (intro, WhatsApp bubbles, call card, doc, outro) is preserved exactly — only the world around the phone changes.

## Direction: "Asmi OS, on your desk" (C × B hybrid)

A bold, branded kinetic stage (C) with the warmth and "UI escapes the bezel" intimacy of a founder's desk (B). Confident enough to stop a scroll, human enough to feel like real life.

### The look
- **Canvas:** painterly warm gradient backdrop — linen/sand/morning tones from the brand palette, with a soft top-down light pool and a subtle vignette. Feels like a sunlit desk surface without being a photo.
- **Phone:** enters from below with a spring, locks into a 3D tilt (`perspective(2400px) rotateX(6deg) rotateY(-9deg)`), levitates slightly above an implied desk plane with a soft contact shadow. Gentle bob + ±2° drift throughout.
- **Accent wash:** a single hot accent (terracotta) lives in the rim light and floor glow; it **shifts hue per scene** to match what's on screen (sage for WhatsApp, sky-blue for the call card, clay for the doc, terracotta for intro/outro). The whole room subtly repaints between scenes via a soft color sweep, not a hard wipe.
- **Kinetic editorial type (left third):** big serif lockups occluded by the phone — "MEET ASMI", "TEXTS YOUR CONTACTS.", "JOINS YOUR CALLS.", "REMEMBERS EVERYTHING.", "ALWAYS ON." One headline per scene, slow rise + fade.
- **UI escapes the bezel (the B moment):** at peak of each scene, one element from inside the phone — a WhatsApp bubble, the call card, a doc snippet — detaches as a translucent floating card, drifts out beside the device for ~30 frames, then snaps back in. Soft drop shadow, slight parallax.
- **Ambient props (sparse, painted, not photo):** a faint coffee-cup silhouette and a notebook edge live in the bottom corners as low-contrast painterly shapes — desk warmth without realism risk.
- **Dust motes / light particles:** a few drifting specks in the key light beam for atmosphere.

### Vibe
Premium consumer-AI launch. Confident, warm, scroll-stopping. Reads as "this is my actual life, and it's beautifully designed."

## Plan of work

1. **New composition** `launch16x9` in `remotion/src/Root.tsx` at 1920×1080, 30fps, same duration as `main` (1290 frames). Keep `main` (9:16) untouched.
2. **Refactor minimally:** extract the phone frame + inner scene sequence from `MainVideo.tsx` into a reusable `<PhoneStage />` component. No content changes to the inner demo.
3. **New file** `remotion/src/Launch16x9.tsx`:
   - Painterly gradient backdrop + light pool + vignette + drifting motes.
   - Per-scene accent driver: reads current frame, maps to scene index, interpolates accent hue + headline.
   - Editorial type slot (left third) with spring-in headlines.
   - `<PhoneStage />` placed right-third, scaled to ~88% canvas height, with 3D tilt and bob.
   - "Escape the bezel" overlay: 4–5 floating card cameos timed to each scene's peak.
   - Painterly coffee/notebook silhouettes in corners.
4. **Render script:** add `remotion/scripts/render-launch.mjs` (copy of existing, composition `launch16x9`, output `/mnt/documents/asmi-launch-16x9-v1.mp4`).
5. **QA stills** at intro, first WhatsApp bubble, call-card peak (with escaped card), doc, outro. Verify: phone uncut, type legible, accent matches scene, no element clips 1920×1080.
6. **Render full MP4** and report path + size.

## Technical notes
- All motion via `useCurrentFrame()` + `spring()`/`interpolate()`. No CSS animations.
- 3D phone tilt via parent CSS `transform: perspective(...) rotateX/Y(...) scale(...)`. No WebGL.
- No `backdropFilter` (sandbox renderer constraint). Use layered gradients + `filter: blur()` sparingly.
- Reuse existing `PHONE` / `PHONE_BODY` / `SCREEN` geometry from `MainVideo.tsx`.
- Add one display font for editorial type: `@remotion/google-fonts/Instrument_Serif` (matches the warm brand palette).
- Floating "escape" cards reuse the same JSX building blocks as the inner scenes (WhatsApp bubble, call-card chrome) at a smaller scale, so visual language stays consistent.
