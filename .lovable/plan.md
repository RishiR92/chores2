# Asmi Demo v9 — Recovery Pass

Baseline: **v7 text, scene order, timings, and flow** are the source of truth. The current `MainVideo.tsx` (v8) drifted from that — extra emoji, "Yesterday" history block, periwinkle/orange accent text, decorative atmospherics. Roll the **content** back to v7 verbatim, then upgrade only the **execution and finish**.

Goal: same story v7 told, but rendered at a top 1% AI-launch-video level of craft.

## 1. Content rollback (back to v7 exactly)
- Voice script: unchanged (already v7 lines).
- Scene order: Intro → WA(task 1) → Call 1 → WA(task 2) → Call 2 → WA(task 3) → Call 3 → Done → Outro.
- Durations: same as v7 (3/4/8/4/8/4/8/8/3 s, 50s total, 1500 frames).
- WhatsApp threads: only the v7 lines — no "Yesterday" history block, no extra ack pairs. Each WA scene shows past chats from other tasks (so it reads like a real ongoing thread) plus the one new task message, then Asmi's one-line ack. This matches v7 and the "real user, not first-time" note from earlier.
- Flow rule (locked): every task starts on WhatsApp, then Asmi calls. Unchanged.

## 2. Audio fixes (call quality regression)
- Drop call `Audio volume` from `2.4` → `1.0`. Values >1 clip in Remotion's WebAudio mix and produce the crunch heard in v8.
- BGM envelope: base `0.55`, duck to `0.06` under calls with the existing 22-frame eased ramp. Net perceived voice loudness matches v7 without clipping.
- Add a hard cap at `0.9` on the BGM curve so the mix never peaks into the limiter.

## 3. Typography — one family, one accent
- Remove **Instrument Serif** and **JetBrains Mono** imports entirely.
- Single family: **Inter Tight** (400 / 500 / 700).
- Single accent color: lime `#E8FF5A`. Used only on the wordmark, one keyword per title card, the "online" dot, and the call tag. Nothing else.
- Body / captions / labels: warm off-white `#F5F2EA` on near-black. No periwinkle text, no orange text.
- Color emoji (Noto Color Emoji) stays scoped to **chat bubbles only**. Titles and labels use no emoji.

## 4. WhatsApp UI rebuild (extracted to its own component)
The current shell breaks on header spacing, bubble tails, timestamp clipping, status bar realism, and avatar. Rebuild as `WhatsAppShell.tsx`, real WhatsApp dark theme:

- iPhone 15 frame, 393×852 logical, 55px corner radius, Dynamic Island.
- Real iOS status bar (9:41, signal, 5G, battery).
- Header `#0B141A`, 56px, back chevron + 32px circular avatar (generated PNG, not initials) + "Asmi" 17px semibold + "online" 13px `#8696A0` + video/voice icons.
- Chat area `#0B141A` with 4% doodle pattern, pinned to bottom.
- Incoming bubble `#1F2C34`, outgoing `#005C4B`, 7.5px radius, SVG tail on first bubble of group, 15px Inter 400 / 20px line-height, timestamp 11px `#8696A099` bottom-right with reserved 6px gap, blue double-tick on outgoing.
- Typing indicator inside an incoming bubble, three dots scale 1.0→1.3 on 30-frame loop with 10-frame stagger.
- Composer 52px, `#2A3942` pill input, mic `#00A884` swapping to send arrow when typing.
- Frame-driven bubble arrivals: spring damping 18 / stiffness 220, 6px Y rise, 0.95→1 scale, pop SFX on each.

Chat content per scene is the v7 content, no additions.

## 5. Call scene polish
- CallKit-style caller card: avatar, name, "mobile", static green answer button. Removes the current "designy" caller card.
- Captions: single Inter 500 line, fades in/out per cue, no italics, no mono.
- Subtle waveform stays but desaturated to ink-on-near-black with only lime on the active peak.

## 6. Scene transitions and atmosphere
- Replace wipe/blur transitions with **hard cuts on the beat** plus an occasional 6-frame dip-to-black. Matches Cursor / Granola / Linear style.
- Remove floating gradient orbs and grain overlay. Replace with one static, very subtle vignette.
- Title cards: Inter 700, tracking -0.02em, left-aligned at 8% margin, one keyword in lime.
- End card: wordmark only, lime, centered, held 60 frames; BGM crescendo lands on the cut.

## Out of scope (locked)
- Voice script, call audio content, scene order, durations, WhatsApp flow, BGM track. All identical to v7.

## Files
- `remotion/src/MainVideo.tsx` — rollback chat content to v7, drop serif/mono, fix audio volumes, swap transitions, remove orbs/grain.
- `remotion/src/components/WhatsAppShell.tsx` (new) — phone + chat rebuild.
- `remotion/src/components/CallCard.tsx` (new) — CallKit-style card.
- `remotion/public/images/asmi-avatar.png` (new) — generated 256×256 avatar.

## Render and QA
- Output: `/mnt/documents/asmi-demo-v9.mp4`, 1080×1920, 30fps, h264 + aac, 50s.
- QA before delivery: still frames at 30, 150, 300, 500, 700, 900, 1100, 1300, 1450, plus audio loudness check (no >0 dBFS peaks, voice ≥ -16 LUFS, music ducks ≥ 18 dB under voice).
