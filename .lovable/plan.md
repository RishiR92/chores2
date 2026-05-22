# Launch video — v10

Three targeted fixes on top of v9.

Two targeted fixes on top of v9.

## 1. Restore v7 audio portions, just cleaner

v7 used the simplest trim of each source — `-ss 0 -t 8` straight from the call mp4s, no fade, no compression. The user liked those snippets (content + length). v8 added a 1.4× boost that clipped; v9 changed the trim points and ended Spanish on a different phrase.

Go back to the v7 portions exactly, and apply only a transparent quality pass:

- `doc.mp3` ← `doc-sandra-call.mp4` `-ss 0 -t 8`
- `hvac.mp3` ← `hvac-call.mp4` `-ss 0 -t 8`
- `grandpa.mp3` ← `spanish-grandpa-call.mp4` `-ss 0 -t 8`

ffmpeg chain on each (no level boost, no re-trim of the speech window):

```text
-af "highpass=f=85,lowpass=f=9000,
     afftdn=nr=12:nf=-28,
     acompressor=threshold=-20dB:ratio=2.5:attack=8:release=140,
     loudnorm=I=-17:TP=-1.8:LRA=11,
     afade=t=in:st=0:d=0.05,
     afade=t=out:st=7.9:d=0.1"
-ac 2 -ar 48000 -b:a 192k
```

What this does and does not do:

- `highpass/lowpass` removes phone-line rumble and hiss without touching speech band.
- `afftdn` does light spectral denoise (NR 12 dB) — cleans hum, leaves voice natural.
- Gentle compressor evens dynamics; `loudnorm` normalizes perceived loudness across all three so no snippet is louder than the others.
- 50 ms head fade-in / 100 ms tail fade-out only — prevents click/pop at the edit point but does NOT shorten the heard content (the speech itself is unchanged from v7).
- No 1.4× boost (that was the v8 clipping cause). Volume in `MainVideo.tsx` stays at 1.0.

Result: same words, same length, same cut points as v7 — just cleaner and level-matched.

## 2. Tasks + Languages — drop the center→right slide, give the left text room

The current v9 motion is: reel turns at center for ~5 beats, slides to the right rail (frames 80→94), headline enters on the left (frame 94+), beat ends at 130. The user doesn't like the slide-right move and feels the left headline gets clipped by the cut.

New motion — keep the reel centered the whole time, let the headline arrive underneath, and hold longer:

```text
beat starts
  └─ 0–80f   reel rotates at center stage, ~5 turns       (unchanged)
  └─ 80–96f  reel scales down slightly and slides UP      (no horizontal move)
  └─ 90f     headline fades in BELOW the reel, centered   (caption-style)
  └─ 96–170f reel keeps cycling small at the top,
             headline holds large at center               (~2.5s dwell)
  └─ 170–180f everything fades out for the cut
```

Concretely in `Launch16x9.tsx`:

- In `RotatingReel`, replace the horizontal slide (`stageCenterX → stageRightX`) with a vertical lift + scale-down. From frame 80→96, the reel translates ~280px upward and scales from 1.0 → 0.72. `stageX` stays at `stageCenterX` (no left/right movement at all).
- In the main render, change the headline gate for scene beats from `localFrame >= 94` to `localFrame >= 90`. Pass `localFrame - 90` and `beatLen - 90`.
- Move the headline column for scene beats from the left rail (`left: 96, width: 820`) to a centered band beneath the lifted reel (`left: 0, right: 0, top: ~55%`, `text-align: center`, slightly smaller `fontSize: 132` so two lines fit comfortably below the smaller reel). This is a scoped layout override inside `HeadlineColumn` when a `centered` prop is passed; the existing left-rail layout for the non-scene beats is unchanged.
- Extend the scene beats so the headline has room to land: `D.tasks: 130 → 180`, `D.langs: 130 → 180` (+1.66s each, total +3.3s on the cut). `D.outro` and earlier beats unchanged. `TOTAL` recomputes automatically.

Net effect: reel stays anchored center stage (no lateral slide), word, word, word, word, word, then it gracefully lifts and shrinks while "your personal chores handled." rises into view below it, holds for a clear ~2.5s beat, then cuts.

## 3. Outro — keep the asmi logo small

v9 promoted the "asmi" wordmark in the outro to 180px with a 26px circle — too dominant. Revert to a discreet stamp at the top so the "AI that handles your personal chores in the real world." line is the hero.

In `OutroHero` (`Launch16x9.tsx`):

- Wordmark `fontSize: 180 → 64`, `letterSpacing: -7 → -2`, accent circle `26×26 → 12×12` with `border: 2px solid accent` and `marginBottom: 32 → 12`.
- Stamp container `top: 12% → 9%`, `gap: 20 → 10`, hairline rule width `120 → 80`.
- Hero line (`fontSize: 118`) and bottom caption stay as-is — they remain the visual focus.

## Files

- `remotion/src/Launch16x9.tsx` — reel slide replaced with lift+scale; headline gated at 90 with new centered layout; `D.tasks` and `D.langs` bumped to 180; outro wordmark shrunk back to small stamp.
- `remotion/public/audio/trimmed/{doc,hvac,grandpa}.mp3` — regenerated from `-ss 0 -t 8` of the original sources with the cleanup chain above.
- Render to `/mnt/documents/asmi-launch-16x9-v10.mp4`.
