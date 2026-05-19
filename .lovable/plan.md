# Asmi launch video v6 — aesthetic overhaul

Structure is locked. This pass is purely about craft: typography, motion, transitions, chat UI polish, and audio quality. Goal: feels like a launch film made by a top SF creative studio.

## 1. Use the uploaded background music

- Replace `remotion/public/audio/bgm.mp3` with the user-uploaded `Asmi_Demo_Music.mp3`.
- Re-time scene beats so key visual moments (scene cuts, headline reveals, final card) land on actual musical hits in the new track.
- Final headline lands on the track's strongest moment.

## 2. Fix call audio quality and the music ↔ call handoff

Current call audio sounds thin and the duck feels abrupt.

- Re-extract each call snippet from the original source MP4s at the cleanest 7–8s window (clear speech, no clipping).
- Process each snippet: high-pass at 90 Hz, light de-noise, EQ presence lift around 2–4 kHz, gentle compression, then normalize to about −14 LUFS / −1 dBTP.
- Smooth crossfade between BGM and call audio:
  - 18–24 frame ramp in/out (vs current 6).
  - BGM drops further during calls (about −18 dB instead of light duck) and low-pass filters slightly so the call sits on top.
  - Add a short pre-roll (a phone connect/UI tick) so the cut into a call feels intentional, not jarring.

## 3. Modern, sleek visual direction

Pick one cohesive art direction and apply everywhere. Proposed:

- Aesthetic: warm minimal editorial, soft off-white background with deep ink text, one warm accent (terracotta/amber), subtle film grain, gentle vignette.
- Type system:
  - Display: a refined modern serif (e.g. Instrument Serif or Fraunces) for headlines and the final message.
  - UI/body: a clean geometric sans (e.g. Geist or Inter Tight) for chat, captions, labels.
  - Strict scale (display / title / body / caption). No more than 2 families.
- Color: single accent used sparingly (active states, key word highlights, final headline underline).
- Texture: soft grain layer, subtle radial light, slow ambient drift on the background — never static frames.

## 4. iMessage chat screens — make them beautiful

- Pixel-accurate iOS look: correct status bar, Dynamic Island, contact header with avatar + "Asmi", time row, proper bubble radii and tails, read receipts, tapback-ready spacing.
- Bubbles: real iOS blue gradient for outbound, true light gray for inbound, correct text color and weight.
- Typing animation:
  - Cursor blink in composer.
  - Characters appear with subtle per-character spring, not robotic typewriter.
  - "Sending" → bubble lifts from composer into the thread (shared-layout style move), then "Delivered" fades in.
- Incoming reply: 3-dot typing indicator bubble first, then the message bubble springs in.
- Scene 1 thread shows realistic prior context (timestamp divider, 2–3 historical messages) so it doesn't feel empty.

## 5. Motion system

One coherent motion language across the whole film.

- Default entrance: 8–12px rise + blur(6px → 0) + opacity, ~18 frames, soft ease.
- Accent entrance (headlines, final card): spring with mild overshoot, slightly longer.
- Default exit: inverse, faster (~10 frames).
- Scene transitions: only 2 styles, reused:
  - Soft cross-dissolve with a 6px blur bridge for calm cuts.
  - Vertical clip-reveal (mask wipes up) for energetic cuts into calls.
- Persistent background layer (grain + slow gradient drift + faint floating shapes) continues across all scenes so cuts feel like one film, not a slideshow.
- Subtle parallax on chat phones and call cards (2–4px drift) so nothing is ever fully static.

## 6. Final headline beat

"AI That Handles Your Personal Chores In The Physical World"

- Set in display serif, large, left-aligned with generous leading.
- Reveal line-by-line with mask wipe + soft blur clear.
- Accent underline draws under "Physical World" on the music's peak.
- Hold ~45 frames, then a clean fade with grain.

## Technical implementation

```text
remotion/public/audio/
  bgm.mp3                    # replaced with uploaded Asmi_Demo_Music.mp3
  trimmed/doc.mp3            # re-extracted, cleaned, normalized to -14 LUFS
  trimmed/hvac.mp3           # same
  trimmed/grandpa.mp3        # same

remotion/src/MainVideo.tsx
  - Retime scenes to musical hits
  - New duck curve: 18-24f ramp, BGM -18 dB + low-pass during calls
  - Add persistent background layer (grain, gradient drift, soft shapes)
  - Apply unified entrance/exit motion primitives
  - Swap transitions to the 2 chosen styles only

remotion/src/components/IMessage*.tsx (new/refactor)
  - Pixel-accurate iOS shell (Dynamic Island, status bar, header)
  - Bubble component with gradient, tail, read receipt
  - Typing composer with caret + per-char spring
  - Typing indicator bubble + bubble-lift send animation

remotion/src/components/Type.tsx (new)
  - Load display serif + UI sans via @remotion/google-fonts
  - Export <Display/>, <Title/>, <Body/>, <Caption/> for consistent scale

remotion/src/scenes/FinalHeadline.tsx
  - Line-by-line mask reveal, accent underline draw on music peak

remotion/scripts/render-remotion.mjs
  - Keep two-stage render (silent video + WAV audio) + ffmpeg mux
  - Pre-process call MP3s with loudnorm + EQ before bundling
```

## Out of scope

- Overall scene order, length, and the 3-example + calls + final-message structure (already approved).
- Web app pages.

## Output

`/mnt/documents/asmi-demo-v6.mp4`
