# Asmi Demo v10 — v7 base + v9 WhatsApp zoom

## Decision
v7 is the source of truth for everything — script, scene order, timings, transitions, typography, colors, atmosphere, call card, end card. The only thing pulled from v9 is the **zoomed-in WhatsApp phone rendering** used during chat scenes.

## Steps

1. **Restore v7 `MainVideo.tsx`** — locate the commit that produced `/mnt/documents/asmi-demo-v7.mp4` (walk back through `git log` for `remotion/src/MainVideo.tsx`, render quick stills, compare to v7) and restore that file verbatim. Everything outside the WhatsApp scenes stays exactly as v7.

2. **Port the v9 WhatsApp shell into v7** — keep the v9 phone rendering used during chat scenes:
   - iPhone 15 frame, Dynamic Island, real iOS status bar
   - WhatsApp dark theme header (`#1F2C34`), chat area (`#0B141A`), outgoing bubble (`#005C4B`), incoming (`#1F2C34`)
   - 32px circular avatar, "Asmi" + "online", composer pill
   - Zoomed framing so the phone fills the vertical frame the way v9 did
   - Bubble arrivals: spring (220/18), 6px Y rise, 0.95→1 scale, with the same pop SFX v7 used
   - Chat **content** = v7 lines verbatim. No "Yesterday" block, no extra ack pairs, no v9 content drift.

3. **Audio sanity check (calls + BGM)**
   - Call `Audio volume`: 1.0 (never >1; >1 clips in WebAudio).
   - BGM: base 0.55, duck to 0.06 under calls with 22-frame eased ramp, cap at 0.9.
   - After render, run an ffmpeg loudness pass on `asmi-demo-v10.mp4`:
     - peak ≤ -1 dBFS (no clipping)
     - integrated voice loudness ≥ -16 LUFS during call scenes
     - BGM ducks ≥ 18 dB under voice
   - If any check fails, retune and re-render before delivery.

4. **Render** → `/mnt/documents/asmi-demo-v10.mp4` (1080×1920, 30fps, h264 + aac, same duration as v7).

5. **Frame QA** — stills at the start of each WhatsApp scene to confirm the zoomed phone matches v9 framing, plus one still per non-WA scene to confirm v7 look is intact.

## Out of scope (locked, do not touch)
Voice script, call audio content, scene order, scene durations, transitions, title cards, end card, color palette outside the WhatsApp shell, atmosphere layers, BGM track.

## Files
- `remotion/src/MainVideo.tsx` — restore v7, swap chat scene's phone rendering for the v9 WhatsApp shell.
- Output: `/mnt/documents/asmi-demo-v10.mp4`.
