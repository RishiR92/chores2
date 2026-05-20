# Asmi Demo v12 — Launch-video polish

## Goals
1. Brand typography on bookend screens (intro + outro) matches the uploaded reference: serif wordmark "asmi" + italic serif tagline.
2. Replace WhatsApp shell entirely with a single floating green chat bubble per beat — cinematic, dynamic, on-brand.
3. Tighten the whole video — quicker, smoother transitions, launch-trailer pacing.
4. BGM ends gracefully: audible through the final beat, then a smooth musical fade to silence (no abrupt drop, no cut-off swell).

## 1. Bookend typography (intro + outro)
Match reference exactly:
- Wordmark: `Instrument Serif` (already loaded), regular, ~360px, near-black `#1A1714`, tight tracking, optical centering.
- Tagline: `Instrument Serif` italic, ~64px, warm stone `#6B6259`, generous letter spacing, sits ~40px under wordmark.
- Cream background `#F2EDE3` (slightly warmer than current), subtle vignette only — no decorative blobs on these two scenes.
- Intro: wordmark fades + rises (spring 220/22, 18 frames), tagline reveals via mask wipe left→right (24 frames, 8-frame delay).
- Outro: same composition, holds 60 frames, then gentle 18-frame fade.

## 2. Chat beats — single floating bubble (3 scenes)
Kill the WhatsAppShell entirely. Each chat beat = one hero bubble on the cream backdrop, treated like a product shot.

Per beat:
- Single outgoing bubble, WhatsApp green gradient `#00A884 → #008F72`, 48px radius, soft layered shadow (ambient + key), subtle inner highlight.
- Message text: `Inter` 600, 84px, white, line-height 1.18, max-width 760px, 56px padding.
- Tiny meta row inside bubble bottom-right: time `10:24` + double blue tick, 28px, 70% opacity.
- Entry: bubble scales 0.88→1 with spring (200/20), rises 40px, soft blur 12→0 over 14 frames. Pop SFX (existing).
- Hold ~60 frames at rest with micro-float (±3px sinusoidal).
- Exit: scales 1→0.96, blurs 0→8, fades over 12 frames as next scene wipes in.
- Background: cream + a single drifting soft green radial glow behind bubble (very low opacity) tying it to the brand color.
- No avatar, no header, no composer, no phone frame.

3 beats use the 3 existing v7 lines verbatim (doc, hvac, gp) — content unchanged.

## 3. Pacing — launch-trailer feel
- Cut intro 90→60 frames.
- Cut each "im*" interstitial 120→75 frames.
- Keep call scenes at 240 (voice-driven, can't shorten).
- Cut done 240→180, outro 90→75.
- New total ≈ 1395 frames (46.5s). Update `durationInFrames` in `Root.tsx` and `TOTAL` in `MainVideo.tsx`.
- All scene-to-scene transitions: 12-frame cross-dissolve + 24px parallax slide, eased `easeInOutCubic`. No hard cuts.
- Bubble pop SFX volume +20%; whoosh SFX on every scene change at 0.35.

## 4. Audio — graceful ending
Problem: current fade starts 105 frames before end with cubic ease — BGM ducks under the last call's voice ramp and never recovers, so the tail sounds dead.
Fix:
- Restore BGM to full base (0.42) for the last 60 frames of the `done` scene — no duck (no voice there).
- Begin fade only at the start of `outro` (last 75 frames): equal-power fade `cos²` curve to 0 over the full outro length.
- Cap voice-duck depth at 0.10 (not 0.018) so BGM stays present, just clearly behind voice.
- Add a 6-frame silence buffer at the very end so the encoder doesn't clip the tail.
- Final ffmpeg pass: `-af "loudnorm=I=-16:TP=-1.5:LRA=11"` for clean true-peak ≤ -1 dBTP.

## 5. Files
- `remotion/src/MainVideo.tsx` — rewrite chat scene component (`HeroBubble` replaces `WhatsAppShell`), update bookend typography, retime `D`/`O`, rewrite `bgmVolume`.
- `remotion/src/Root.tsx` — update `durationInFrames` to 1395.
- Output: `/mnt/documents/asmi-demo-v12.mp4` (1080×1920, 30fps, h264+aac).

## 6. QA
- Stills at: intro mid (frame 30), each bubble peak, outro mid — confirm typography + bubble composition.
- ffprobe loudness pass: true peak ≤ -1 dBTP, integrated ≥ -16 LUFS.
- Listen to final 4 seconds — BGM must decay smoothly to silence with no pop, no premature drop.

## Out of scope
Voice script, call audio content, scene order, color palette outside bubble + bookends.
