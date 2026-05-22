# Asmi Launch Video — 16:9 Cinematic Cut (v2)

Revising the existing `launch16x9` composition only. Inner phone demo (`MainVideo`) stays byte-for-byte unchanged. Same duration (1290f / 30fps / 1920×1080). Same scene order and timing.

## What changes

### 1. Copy updates
- Eyebrow `chief of staff` → **`personal AI`**
- Wordmark: replace uppercase `MEET ASMI` text with the **asmi wordmark** rendered as a styled lockup (lowercase italic Instrument Serif, oversized, with a small dot accent — matches the rest of the brand). Used in intro + outro beats.
- Headlines updated:
  - intro → `meet asmi` (wordmark treatment)
  - calls beat → `book appointments.`
  - hvac beat → `find vendors.`
  - gp beat → `check in on loved ones.`
  - done beat → `remembers everything.`
  - outro → final hero line (see #4)

(Sequence + per-beat timing untouched.)

### 2. Phone treatment — make it the hero, not a sidebar
Today: phone parked right edge, static tilt, minor bob. Replace with a choreographed phone performance:

- **Center-stage by default.** Phone sits roughly centered horizontally, slightly above middle. Headlines move to a stacked layout that flows *around* it (top-left eyebrow + headline, bottom-left support line) instead of competing in the left third.
- **Cinematic entrance:** flies in from below with a strong spring, rotates from `rotateX(35deg) rotateY(-20deg) scale(0.6)` settling to a hero pose `rotateX(4deg) rotateY(-6deg) scale(1)`. ~30f.
- **Per-scene camera moves** (parent transform on the phone wrapper, driven by `useCurrentFrame`):
  - intro: hero center, slow push-in
  - calls: drifts left, tilts toward camera (`rotateY(-10deg)`), accent rim brightens
  - vendors: dolly right, slight `rotateY(+8deg)` for opposite angle
  - loved ones: pulls back, soft sway
  - remembers: tilts forward (`rotateX(8deg)`), as if leaning in
  - done/outro handled in #4
- **Levitation polish:** stronger contact shadow that scales/blurs with bob; subtle accent-tinted rim light on the phone edge via layered `box-shadow`; soft parallax glow behind phone matching the scene accent.
- **Floating "escape the bezel" cameo** kept and tied to the camera move so it reads as the same object (drifts in the direction the phone is tilting away from).

### 3. Dynamic, jazzy stage
- Headlines get **kinetic treatment**: word-by-word stagger, slight per-word scale + rotateX, italic Instrument Serif at 140–180px, paired with a small caps support line in Inter.
- **Accent sweep between beats** becomes a moving color band (diagonal gradient that wipes across the canvas in 18f), not just opacity crossfade.
- **Light pool tracks the phone** (radial highlight follows phone X position) so the stage feels alive.
- More motes, varied sizes, faster drift during high-energy beats (calls / vendors), calmer during loved-ones / remembers.
- Lower-third brand mark gets a thin animated progress line that fills across the video duration.

### 4. New final shot (replaces phone in the outro beat)
During the existing outro window (`O.outro` → `TOTAL`, ~105f):
- Phone scales up + dissolves outward into light particles (`scale → 1.15`, `opacity → 0`, blur ramp, particles burst from its silhouette).
- Stage clears to a near-black warm gradient (espresso → terracotta wash).
- Hero line types/reveals center-screen with strong kinetic typography:
  > **"AI that handles your personal chores in the real world."**
- Treatment: Instrument Serif italic, mixed weights, 2–3 line break, each line springs in with overshoot and a thin accent underline that draws across. Words `personal chores` and `real world` highlighted in terracotta.
- Closes with the **asmi wordmark** + `launches soon` fading in beneath.

## Plan of work

1. Edit `remotion/src/Launch16x9.tsx`:
   - Update `BEATS` array (headlines + add `outroHero` flag on last beat).
   - Replace phone wrapper with a `<PhoneStage />` that takes a per-beat camera prop and runs the entrance + camera choreography.
   - Add `AsmiWordmark` component (styled lockup, reused for intro + outro).
   - Rework headline renderer to do word-stagger kinetic type.
   - Add accent sweep band + phone-tracking light pool.
   - Add `<OutroHero />` component for the final shot, gated on the outro beat (phone dissolves, hero line reveals).
2. No changes to `MainVideo.tsx`, `Root.tsx`, or the render script.
3. QA stills at: intro hero pose, calls (phone left, "book appointments"), vendors (phone right), loved ones, remembers, outro mid-dissolve, outro final hero line.
4. Re-render to `/mnt/documents/asmi-launch-16x9-v2.mp4`.

## Technical notes
- All motion frame-based (`useCurrentFrame` + `spring`/`interpolate`). No CSS transitions.
- Camera moves applied as a single `transform` on the phone wrapper, interpolated between per-beat target poses via crossfade on `localFrame`.
- Phone dissolve in outro: layered `filter: blur()` + `opacity` + scale, plus ~40 small divs spawned from cached positions for the particle burst (deterministic seed, no randomness per frame).
- Hero outro text uses the existing `InstrumentSerif` font already loaded — no new deps.
- No `backdropFilter`, no WebGL.
