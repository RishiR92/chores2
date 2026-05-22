# Launch video — v8 polish

Three focused fixes addressing the three issues raised. No timing changes to the overall video.

## 1. Remove the black "container" — just a levitating iPhone

The current shell renders a 1080×1920 dark-gradient slab around a clipped screen rectangle. Outside the screen cutout (90px sides, 110px top/bottom) it reads as a chunky black box, not a phone.

Replace with a true floating-screen treatment in `Launch16x9.tsx`:

- Delete the titanium gradient slab, the accent rim-light layer, and the diagonal sheen overlay.
- Keep the `MainVideo` clip exactly as is (same `clipPath: inset(110px 90px 110px 90px round 130px)`) so the screen content stays untouched.
- Replace the surrounding shell with a thin, realistic iPhone bezel:
  - A 6–8px dark titanium ring (`#2a2a2e → #1a1a1c` vertical gradient) hugging the screen rect only — drawn as a frame around `inset(110px 90px ...)`, not the whole 1080×1920 wrapper.
  - 1px inner highlight (white 0.18) on top edge, 1px inner shadow (black 0.55) on bottom edge.
  - Subtle accent rim-light (`accent` at 0.18) on that thin ring only.
- Soft drop-shadow continues to breathe with the float — it sells the levitation now that the slab is gone.
- The phone wrapper background outside the screen rect becomes fully transparent — no more black rectangle behind the device.

Net effect: only the screen + a thin bezel hovers in the warm linen scene.

## 2. Tasks + Languages: hero enters center, then slides right while left headline appears

Currently the left headline and the right-side reel hero animate in simultaneously. The user wants a beat-driven reveal: hero word lands in the visual center first, then slides to the right and the left-side headline arrives.

In `Launch16x9.tsx`:

- For `tasks` and `langs` beats, gate the left `HeadlineColumn` so it only mounts after `localFrame ≥ 28` (after the first hero word has landed center-stage). Re-use the existing `outOp` logic for exit.
- In `RotatingReel`, add a `centerHold` phase tied to `localFrame`:
  - `localFrame 0 → 22`: stage origin is `centerX = 1920/2 - stageW/2`, stage Y unchanged. Hero word springs in at full visual center.
  - `localFrame 22 → 40`: stage `left` interpolates from center to the current right-side `stageX = 940` with an `easeInOut`. Hero word travels with the stage.
  - `localFrame ≥ 40`: stage rests at the right-side position; subsequent reel cycling continues as today.
- The counter and hairline rule travel with the stage, so the whole reel block migrates as one composition.
- Left `HeadlineColumn` fade-in starts at `localFrame ≈ 32` (just as the stage finishes settling on the right). Same serif treatment as other beats.

Result: the eye is led by the word at center, then handed off to the headline as the word slots to the right — feels more directed and editorial than the current side-by-side reveal.

## 3. Call-snippet audio quality

The three trimmed snippets (`doc.mp3`, `hvac.mp3`, `grandpa.mp3`) are 8s 192kbps mp3 stems, but each `<Audio volume={1.4}>` boosts past unity and clips on loud syllables — that's the "bad quality" read. Source `.mp4`s are 84–100kbps AAC so we cannot exceed their fidelity, but we can stop the clipping and even out perceived loudness.

Steps:

1. Re-extract the three trimmed clips from the originals using `ffmpeg` with `loudnorm` (target `I=-16 LUFS, TP=-1.5, LRA=11`) plus a gentle `highpass=f=80` to clean phone-line rumble. Output 192kbps mp3, 48kHz stereo.
2. Overwrite the existing files in `remotion/public/audio/trimmed/` (same filenames so `MainVideo.tsx` paths stay valid).
3. Drop the `volume={1.4}` boost on all three `<Audio>` tags in `MainVideo.tsx` to `volume={1.0}` — loudnorm now handles the gain headroom without clipping.

Verification: re-render `/mnt/documents/asmi-launch-16x9-v8.mp4`, listen to the three call beats — voices should sit louder than v7 but without the harsh crunch on consonants.

## Files

- `remotion/src/Launch16x9.tsx` — fixes 1 and 2.
- `remotion/src/MainVideo.tsx` — fix 3 (volume drops only).
- `remotion/public/audio/trimmed/{doc,hvac,grandpa}.mp3` — regenerated assets.
- Render to `/mnt/documents/asmi-launch-16x9-v8.mp4`.
