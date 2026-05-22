# Launch video — v9 polish

Four fixes addressing the v8 review.

## 1. Mobile screen is blacked out — restore the screen

The v8 bezel uses `border: 10px solid transparent` + `background-image: linear-gradient(transparent,transparent), linear-gradient(...)` + `background-clip: padding-box, border-box`. In the Remotion Chromium render the padding-box layer is rendering opaque (covering the screen) instead of transparent.

Swap to a proven, simple pattern that cannot fill the interior:

- Replace the border-image trick with a single div using a real CSS `border` of solid dark color (no background, no background-clip lists). The interior is naturally transparent because no `background` is set.

```text
{
  position: 'absolute',
  inset: '100px 80px 100px 80px',
  borderRadius: 140,
  border: '10px solid #242427',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.16),
              inset 0 -1.5px 0 rgba(0,0,0,0.55),
              0 0 24px rgba(accent, 0.22)',
}
```

- Keep the inner hairline div (1px accent + 3px inset black) so the screen rim still reads premium.
- Verify MainVideo is the first child inside the transformed phone wrapper so subsequent siblings (the bezel ring) overlay only the bezel area, not the screen.

## 2. Spanish call audio gets cut at the end

`D.gp = 240` frames = 8.0s. The current trimmed `grandpa.mp3` is `-ss 0 -t 8` which cuts the speaker mid-sentence at 8.0s with no fade. The user wants it to end naturally.

- Re-extract `grandpa.mp3` starting from a point in the call where a clean 7.5s phrase exists. Use `-ss 3 -t 7.6` from the original `spanish-grandpa-call.mp4` so the snippet ends on a natural pause, then add `afade=t=out:st=7.0:d=0.6` to ensure a soft tail within the 8.0s window.
- For consistency also re-extract `doc.mp3` (`-ss 0 -t 7.6`, fade out 7.0..7.6) and `hvac.mp3` (`-ss 0 -t 7.6`, fade out 7.0..7.6) with the same loudnorm chain plus a `highpass=f=80,lowpass=f=8000,acompressor=threshold=-18dB:ratio=3:attack=10:release=120` chain — gentle compression evens out perceived loudness without clipping. Final mp3 at 192kbps stereo 48kHz.
- Audio volume in `MainVideo.tsx` stays at `1.0` (no further boosting).

Result: all three call snippets feel finished, with even loudness and clean tails. Spanish in particular ends on a phrase, not a cut.

## 3. Tasks + Languages — 4–6 turns at center, then slide right, then headline

Beat length is 130 frames; each reel turn is `BEAT = 16` frames. Five turns at center = 80 frames. Then a quick slide to the right (~14 frames), then the left headline arrives for the remainder.

In `RotatingReel`:

- Change the slide interpolation from `[22, 40]` to `[80, 94]`, so the reel stays centered for the first ~5 turns, then migrates to `stageRightX = 940` in 14 frames.

In the headline gate (`Launch16x9.tsx`):

- For scene beats, mount `HeadlineColumn` only when `localFrame ≥ 94` (just after the slide finishes).
- Pass `localFrame - 94` and `beatLen - 94` so its entrance spring and exit fade animate over the remaining ~36 frames.

Net effect: word, word, word, word, word lands center stage → reel slides right → "your personal chores handled." enters from the left → cut to next beat.

## 4. ASMI logo at the end

No logo asset exists in the repo (`remotion/public/` has no images). The current outro builds an italic serif "asmi" wordmark + colored dot inline. Two options:

A. **Stylized inline logomark (no upload required, ship now).** Promote the existing serif "asmi" wordmark in the outro from the small top stamp (56px) to a centered hero logomark sized at ~180px, sitting just above the "AI that handles your personal chores" line. Add a thin terracotta circle around it (or replace the dot with an outlined ring) so it reads as a finished brand mark rather than just text. Keep the small top stamp as a corner-mark.

B. **Use a user-supplied logo asset.** If the user has an SVG/PNG logo file, drop it into `remotion/public/logo.svg` and replace the inline wordmark with `<Img src={staticFile('logo.svg')} />` at the outro hero position.

**Default to option A** for this iteration since no asset exists. Render the larger outlined wordmark in the outro hero stack and re-render. If the user later provides a logo file, we swap it in.

## Files

- `remotion/src/Launch16x9.tsx` — bezel fix, reel timing, headline gate, outro logo treatment.
- `remotion/src/MainVideo.tsx` — no code changes (volumes already 1.0).
- `remotion/public/audio/trimmed/{doc,hvac,grandpa}.mp3` — regenerated with better trim points + fade-out + compression.
- Render to `/mnt/documents/asmi-launch-16x9-v9.mp4`.
