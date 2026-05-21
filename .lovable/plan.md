# Asmi Launch Video — 16:9 Cinematic Cut

Goal: Take the existing 9:16 phone demo and rebuild it as a 1920×1080 launch film. The inner phone screen content stays exactly the same (intro, WhatsApp bubbles, call card, doc, outro). What changes is the **world around the phone** — a designed environment that makes the device feel like a hero product, not a screenshot in a frame.

## Research notes — what current AI launches do

- **Rabbit r1 / rabbitOS 2** — orange-on-black, device floating on infinite seamless backdrop, slow turntable, hard product-shot lighting.
- **Humane Ai Pin** — soft studio gradient, macro close-ups, light beams cutting across the device, almost jewelry-ad framing.
- **Apple Intelligence** — frosted glass surfaces, Siri rainbow halo bleeding off the phone edges into the canvas, UI elements physically leaving the screen.
- **Friend pendant** — moody cinematic environments (rain, neon, intimate rooms) with device as quiet anchor.
- **Arc Search / Granola** — playful 3D objects floating around a phone, kinetic typography, oversized punctuation as scenery.

Common winning move: the phone is **not** centered on a flat wall. The world reacts to what's on screen — light spills out, UI fragments escape the bezel, the camera drifts.

## Three concept directions (pick one)

### A. "Levitating Glass" — Apple-grade product film
- Charcoal seamless studio with a soft top-down key light and a colored rim light that shifts with each scene (warm amber → cool teal → soft magenta).
- iPhone floats dead-center, slow Y-axis rotation (±8°) and gentle bob. Subtle contact shadow on an implied floor.
- Behind the phone: huge, slow-moving kinetic typography — "MEET ASMI" / "YOUR CHIEF OF STAFF" / "ALWAYS ON" — set in a refined display serif, partially occluded by the device.
- Light from the phone screen spills onto the backdrop (the rim color picks up whatever's on screen — green for WhatsApp, blue for the call card).
- Vibe: premium, confident, quiet. Closest to Apple / Humane.

### B. "Desk of a Founder" — lived-in cinematic
- Top-down + 3/4 angle of a warm wooden desk: open notebook, coffee cup, AirPods, soft window light, a plant out of focus.
- iPhone lies on the desk, then lifts into frame and tilts toward camera as the demo begins.
- Notifications, call cards, and doc fragments **escape the screen** and float above the desk as translucent cards before snapping back in.
- Soft parallax camera drift, shallow depth of field, dust motes in the light beam.
- Vibe: human, founder-friendly, "this is actually my life." Closest to Granola / Friend.

### C. "Asmi OS" — bold, branded, kinetic  *(recommended)*
- Full-bleed brand-color canvas (deep ink navy with a single hot accent — e.g. electric lime or coral) that **changes hue per scene** to match the demo content.
- Phone enters from below with a spring, locks into a slight 3D tilt (perspective, not flat), levitates with a soft floor glow.
- Around the phone: oversized supporting elements — a giant ⌘ key, a massive quotation mark, a 3D pill that says "9:41 AM", a circular waveform pulsing to the call card.
- Between scenes the whole canvas does a hard color-wipe transition; the phone stays locked while the world repaints around it.
- Big editorial type lockups on the left, phone on the right (rule-of-thirds), captions narrate the value props: "Texts your contacts." "Joins your calls." "Remembers everything."
- Vibe: confident consumer-AI launch, scroll-stopping, social-ready. Closest to Rabbit / Arc.

All three keep the existing inner phone demo 100% untouched — only the outer 1920×1080 stage changes.

## Plan of work (after you pick A / B / C)

1. **New composition** `launch16x9` registered in `remotion/src/Root.tsx` at 1920×1080, 30fps, same duration as current demo (~43s). Existing 9:16 `main` composition stays as-is.
2. **New file** `remotion/src/Launch16x9.tsx` that:
   - Renders the chosen environment (background, lights, kinetic type, floating props).
   - Embeds the existing phone frame + inner stage from `MainVideo.tsx` as a reusable `<PhoneStage />` component, scaled to fit ~85% of canvas height and positioned per the chosen concept.
   - Drives all motion from `useCurrentFrame()` + `spring()` / `interpolate()`.
3. **Refactor** `MainVideo.tsx` minimally: extract the phone frame + inner scene sequence into `<PhoneStage />` so both the 9:16 and 16:9 comps share one source of truth. No content changes.
4. **Per-scene world reactions**: the outer environment reads which inner scene is active (by frame range) and shifts rim light / accent color / supporting type to match.
5. **Render** `/mnt/documents/asmi-launch-16x9-v1.mp4` via the existing `scripts/render-remotion.mjs` (add a `--composition launch16x9` switch or a second script).
6. **QA**: pull stills at intro, first WhatsApp bubble, call card, doc, outro — confirm phone is uncut, environment reads cleanly, type is legible, no element clips the 1920×1080 frame.

## Technical notes
- Reuse `PHONE` / `PHONE_BODY` / `SCREEN` geometry already in `MainVideo.tsx`; just wrap it and apply a parent `transform: perspective(2400px) rotateY(...) rotateX(...) scale(...)` for the 3D tilt in concepts A and C.
- No WebGL / Three.js needed — CSS 3D transforms + layered gradients + SVG are enough and stay safe inside the sandbox renderer (no `backdropFilter`).
- Fonts: keep current body font; add one display face for the kinetic type (e.g. `@remotion/google-fonts/Instrument_Serif` for A/B, `Space_Grotesk` for C).

## Question for you
Which concept should I build — **A (Levitating Glass)**, **B (Founder's Desk)**, or **C (Asmi OS, recommended)**? Or mix elements from two?
