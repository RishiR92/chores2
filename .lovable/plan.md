# Asmi Demo v8 — Sleek 2026 Launch Video Redesign

Full reset on visual language and chat UI. Same content/script and same scene order, but a fresh design system and a realistic WhatsApp-style chat that feels like an ongoing conversation, not a first-time hello.

## What changes

### 1. New background music
- Replace `remotion/public/audio/bgm.mp3` with the newly uploaded `Asmi_Demo_-_2-3.mp3`.
- Probe the new track's duration/peaks with ffprobe, then align video length so the outro lands on the track's climax (no premature fade).
- Re-tune ducking against the new track's dynamics: louder in intro/outro, smooth duck under each call snippet (~22-frame eased ramp).

### 2. Chat UI — switch to realistic WhatsApp
Current iMessage mock looks web-like. Replace with a high-fidelity WhatsApp mobile UI:

- **Phone frame**: thin device bezel, rounded 48px corners, Dynamic Island, true iOS status bar (time, signal, wifi, battery as SVG).
- **WhatsApp header**: dark teal/charcoal bar, back chevron, circular avatar with Asmi monogram, "Asmi" name + "online" subtitle, video/call icons on right.
- **Chat starts pinned at TOP** (header at top, messages flow downward). Composer pinned at bottom with full-width input + mic/send button.
- **Conversation continuity**: thread opens with 2–3 faded older messages from unrelated past tasks (e.g. "Booked the dentist for Tue 4pm ✅", "Reminder: Mom's birthday gift", a dismissed grocery thread) above a subtle "Today" date divider. Then the current task message appears — feels like a returning user, not first contact.
- **Bubbles**: WhatsApp green (#005C4B outgoing, #1F2C34 incoming on dark theme, or #DCF8C6/#FFFFFF on light), tail on first bubble of each group, timestamp + double-tick read receipts, proper line-height and padding.
- **Typing indicator**: three-dot pulse inside a bubble (frame-driven, not CSS).
- **Emoji**: keep Noto Color Emoji font already bundled.
- **Composer**: realistic height (~52px), rounded pill input with attach + emoji icons, mic icon that swaps to send arrow when user is "typing".

Two WhatsApp scenes update: doc-Sandra thread and HVAC typing scene. Both start from the top of the screen with the header visible.

### 3. Brand new visual system (independent of website theme)
2026 launch-video aesthetic. Editorial-meets-tech:

- **Palette** (committed hex):
  - Background: `#0B0B0F` (near-black with warm tint)
  - Surface: `#15151C`
  - Primary accent: `#E8FF5A` (electric lime) — used sparingly for emphasis
  - Secondary accent: `#FF5A3C` (signal orange) — for call/urgency moments
  - Soft accent: `#A8B5FF` (periwinkle) — for atmosphere
  - Text: `#F5F2EA` (warm off-white) / muted `#7A7A85`
- **Typography**:
  - Display: `Instrument Serif` (large editorial titles, italic accents)
  - UI/Body: `Inter Tight` (tight tracking, 500/600 weights)
  - Mono detail: `JetBrains Mono` (timestamps, micro-labels)
- **Motion system**:
  - Default entrance: 18-frame blur-to-sharp + 8px Y rise, ease `[0.16, 1, 0.3, 1]`
  - Accent moments: spring `{damping: 18, stiffness: 140}` with slight overshoot
  - Scene transitions: directional `wipe` with a thin lime divider line OR a soft `fade` with film-grain crossfade — two variants only, used consistently
  - Persistent grain texture overlay (5% opacity) across whole video for cinema feel
  - Subtle floating gradient orbs (periwinkle + orange, very low opacity, slow drift) as persistent background
- **Typographic detail**: large editorial headlines with mixed weight (regular + italic serif), micro-labels in mono uppercase tracking-wide above each scene title.
- **Layout**: asymmetric, off-center, generous negative space. No centered slideshow vibe.

### 4. Audio polish
- HVAC snippet already re-cut in v7 — keep.
- Re-verify all 3 call snippets have clean fade-in (120ms) and fade-out (300ms).
- BGM base volume tuned to new track; duck depth retuned (likely 0.18 under calls, 0.55 normal, 0.7 outro climax).
- iMessage "ting" SFX → swap for WhatsApp-style soft "pop" SFX (synth bell at 1200/1800Hz, shorter decay).

## Scene list (unchanged content, new dressing)
Same sequence as v7 — only visual treatment and chat scenes change:

1. Cold open — editorial title card
2. Doc/Sandra call (audio + caller card)
3. WhatsApp thread with Asmi (doc follow-up, with prior chat history visible above)
4. HVAC call (audio + caller card)
5. WhatsApp typing scene (HVAC follow-up)
6. Spanish grandpa call (audio + caller card)
7. Closing title — climax with BGM peak

## Technical notes
- File edits scoped to: `remotion/src/MainVideo.tsx`, `remotion/public/audio/bgm.mp3`, `remotion/public/audio/sfx/whatsapp-pop.mp3` (new), possibly split chat component into `remotion/src/components/WhatsAppShell.tsx` for cleanliness.
- Add Google Fonts: `Instrument Serif`, `Inter Tight`, `JetBrains Mono` via `@remotion/google-fonts`.
- Render: `asmi-demo-v8.mp4` to `/mnt/documents/`, 1080x1920, 30fps, h264 + aac stereo, ~50s.
- Keep render script unchanged.

## Out of scope
- Script/voiceover content (unchanged)
- Scene order (unchanged)
- Total duration (~50s, unchanged)
