# Asmi Demo v9 — QA Fixes + Top-1% Launch Video Polish

Content (script, scene order, voice snippets, durations) stays **identical to v8**. This pass only fixes the quality issues called out plus a craft pass benchmarked against current top AI-startup launch videos (Granola, Cursor, Cognition/Devin, Perplexity, Cluely, Arc, Linear). No new scenes, no rewrites.

## Reference study (what "top 1%" looks like right now)

Common traits across the best 2025-2026 AI launch films:

- **Restraint in color.** One ink, one paper, one accent. No rainbow. Granola/Linear/Cursor never put more than one saturated hue on screen at a time.
- **One typeface family, one weight shift.** Not three fonts. Either a single grotesk (Inter / Söhne / GT America) or a single editorial serif (Tiempos / Söhne Mono pairing). Never serif + sans + mono all visible at once.
- **Product-real UI, not stylized.** The phone/app shown is pixel-accurate, not a "designy" reinterpretation. Bubbles, spacing, status bar, keyboard all match the real thing.
- **Audio is the hero.** Voice is dry, loud, untouched. Music ducks aggressively (-18 dB) so dialogue never fights it.
- **Cuts are invisible.** Hard cut on a beat, or a 6-frame dip-to-black. No fancy wipes.

v8 violated all five. v9 fixes all five.

## Fixes

### 1. Call audio quality (regression)
- Root cause: each call `<Audio volume={2.4} />` — values >1 clip in the WebAudio mix and produce the crunchy distortion you heard.
- Fix: drop call volume to **1.0** (source files are already loud; they were re-trimmed in v7).
- Re-tune BGM ducking: base **0.55**, duck to **0.06** under calls with the existing 22-frame eased ramp. This gives the same perceived voice loudness without clipping.
- Add a true `-1 dB` peak limit by capping max combined volume in the bgm envelope.

### 2. Typography — kill the multicolor look
- Root cause: three font families (Instrument Serif + Inter Tight + JetBrains Mono) plus Noto Color Emoji rendering colored glyphs inside body text. The serif italics + lime accent words + orange mono labels read as "multicolor / messy".
- Fix:
  - **Drop to ONE family: Inter Tight.** Weights 400 / 500 / 700 only. Remove Instrument Serif and JetBrains Mono entirely.
  - Remove all colored words inside paragraphs. Accent color (single lime `#E8FF5A`) is used **only** on: the wordmark, one keyword per title card, and the "online" dot. Nothing else.
  - Replace Noto Color Emoji with **monochrome** emoji rendering inside titles/labels (use text-only fallback). Color emoji stays **only inside chat bubbles** where it belongs (real WhatsApp shows color emoji there).
  - All non-chat text becomes warm off-white `#F5F2EA` on near-black. No periwinkle text, no orange text.

### 3. WhatsApp UI — rebuild for pixel accuracy
Current UI has multiple breakages: header overlapping messages, bubble tails wrong side, "Today" divider styled wrong, composer height inconsistent, status bar fake, avatar monogram instead of image, message timestamps clipping bubble corners, typing indicator floating outside a bubble.

Rebuild as a self-contained `WhatsAppShell.tsx` component matching real WhatsApp dark theme exactly:

- **Device**: iPhone 15 frame, 393×852 logical px, 55px corner radius, thin titanium bezel, Dynamic Island (not notch).
- **Status bar**: real iOS — 9:41, full signal bars (SVG), 5G, 87% battery icon. Sits ABOVE the app chrome, not overlapping.
- **App header** (WhatsApp dark `#0B141A`):
  - back chevron (left), circular avatar (32px) using a generated Asmi avatar image (not initials), name "Asmi" 17px semibold, "online" 13px `#8696A0` under it, video + voice call icons (right).
  - Header height 56px, hairline border-bottom `#1F2C34`.
- **Chat area** (background `#0B141A` with subtle doodle pattern at 4% opacity):
  - Scroll pinned to **bottom** (newest message at bottom, real WhatsApp behavior).
  - "Today" divider: centered pill `#1F2C34`, 11px uppercase tracking, no lines.
  - Faded history (yesterday) shown above with `opacity: 0.55` and a "Yesterday" pill.
- **Bubbles**:
  - Incoming (Asmi): `#1F2C34`, left-aligned, tail on first bubble of group (SVG path, not a CSS triangle), 7.5px corner radius, max-width 75%.
  - Outgoing (user): `#005C4B`, right-aligned, tail on first bubble of group, same radius.
  - Padding `6px 9px 8px 12px`. Text 15px / line-height 20px Inter 400. Timestamp 11px `#8696A099` bottom-right inside bubble (with 6px reserved gap so it never overlaps text).
  - Double-tick read receipt SVG (blue `#53BDEB`) on outgoing.
- **Typing indicator**: real WhatsApp bubble (incoming style) with three dots animated frame-by-frame (each dot scales 1.0 → 1.3 on a 30-frame loop, 10-frame stagger).
- **Composer**:
  - Height 52px, background `#1F2C34`, top hairline.
  - Pill input `#2A3942` 36px tall with emoji icon (left), placeholder "Message", attach + camera icons (right).
  - Outside the pill: mic button (circular `#00A884` 36px). Swaps to send arrow when user is "typing".
- **Frame-driven message arrivals**: each new bubble springs in (damping 18, stiffness 220) with a 6px Y rise and 0.95→1 scale. Pop SFX on each.

Same chat content as v8 (history lines + current task line + Asmi ack) — only the rendering changes.

### 4. Scene polish (no content change)
- Replace all wipe/blur transitions with **hard cuts on the beat** + occasional 6-frame dip-to-black. Matches Cursor / Granola style.
- Remove floating gradient orbs and grain overlay. Replace with a single static very-subtle vignette. The orbs read as "AI slop background".
- Title cards: large Inter 700, tight tracking (-0.02em), single keyword in lime. Asymmetric left-aligned at 8% margin. No serif italic.
- Caller card during calls: simplified to a real iOS CallKit-style card (avatar, name, "mobile", green answer button visible but static). Replaces current "designy" caller card.
- End card: wordmark only, lime, centered, held 60 frames, BGM crescendo lands on the cut.

## Out of scope (explicitly unchanged)
- Voice script and call audio content
- Scene order and durations (still 50s total, same offsets as v8)
- WhatsApp flow (task on WhatsApp → call) — unchanged
- BGM track (`Asmi_Demo_-_2-3.mp3`) — unchanged

## Technical scope
Files touched:
- `remotion/src/MainVideo.tsx` — drop serif/mono fonts, fix audio volumes, swap transitions, remove orbs/grain
- `remotion/src/components/WhatsAppShell.tsx` (new) — full rebuild of phone + chat
- `remotion/src/components/CallCard.tsx` (new) — CallKit-style card
- `remotion/public/images/asmi-avatar.png` (new) — generated 256×256 avatar

Render: `asmi-demo-v9.mp4` → `/mnt/documents/`, 1080×1920, 30fps, h264 + aac, 50s.

QA pass after render: still frames at 30, 150, 300, 500, 700, 900, 1100, 1300, 1450 reviewed before delivery.
