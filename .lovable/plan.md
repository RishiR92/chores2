# Asmi demo video (15s, MP4)

A short cinematic motion-graphic showing Asmi's loop: user texts in iMessage → Asmi calls the user to clarify → Asmi calls the place/person → done. Two woven micro-stories in one 15s piece: **doctor appointment** and **grandpa check-in**.

Output: `/mnt/documents/asmi-demo.mp4` — 1080×1920 (vertical, 9:16, social-ready) at 30fps.

## Story beats (15s = 450 frames @ 30fps)

```text
0:00–0:03  Scene 1  iMessage   "Can you book Jonathan with Dr. Weng?"
0:03–0:06  Scene 2  Asmi → User call (clarifying: insurance, timing)
0:06–0:09  Scene 3  Asmi → Dr. Weng's office (booking)
0:09–0:11  Scene 4  iMessage   "Check on grandpa in Spain?"
0:11–0:14  Scene 5  Asmi → Grandpa call (Spanish, warmth)
0:14–0:15  Scene 6  Done card: two ✓ confirmations stacked
```

Transitions: soft cross-fade + slight scale, ~10 frames each (in the Asmi cream / terracotta / sage palette already used on the site).

## Audio plan

Use the real call recordings already in `public/audio/` — short snippets only:

- Scene 2 (Asmi→user clarify): 3s snippet from `doc-sandra-call.mp4` (intro)
- Scene 3 (Asmi→office): 3s snippet from same file (mid-call booking moment)
- Scene 5 (grandpa): 3s snippet from `spanish-grandpa-call.mp4` (warm exchange)

Snippets are trimmed with ffmpeg to ~3s with 200ms fades, concatenated into one timeline track. Light ambient hum under iMessage scenes (silence is fine if you'd rather keep it minimal — say the word).

## Visual direction

- **Palette**: cream `#F5EFE6` background, espresso `#2C2520` text, terracotta `#C25B3F` (doc story), clay `#D4A574` (grandpa story), sage `#5F8365` (success ticks). Matches the live site.
- **Type**: Instrument Serif (display) + Inter (UI/body), same as site.
- **iMessage scenes**: realistic iOS bubble (gray incoming from user, blue outgoing from Asmi), top status bar, typing dots → bubble pop-in with spring.
- **Call scenes**: stylized "call card" with avatar circle, name, live waveform reacting to the audio snippet, soft radiating rings. Live transcript line types out under the waveform ("booking Jonathan for Tuesday 10am…").
- **Done card**: two stacked confirmation chips (terracotta + clay) with sage ✓, gentle float-in.

Persistent layer: very subtle grain + slow drifting warm gradient bloom behind every scene to keep it cohesive (the Atmosphere look from the site).

## Technical

- Scaffold a fresh Remotion project at `remotion/` (per the video-creator skill), 1080×1920, 30fps, 450 frames.
- Copy `public/audio/*.mp4` into `remotion/public/audio/` and pre-trim 3s snippets with ffmpeg (`-ss` + `-t` + fade filters) into `remotion/public/audio/trimmed/`.
- Build six scene components under `remotion/src/scenes/` wired through `<TransitionSeries>`; persistent background + audio track in `MainVideo.tsx`.
- Fonts via `@remotion/google-fonts/InstrumentSerif` and `@remotion/google-fonts/Inter`.
- Render via the programmatic script (`scripts/render-remotion.mjs`) to `/mnt/documents/asmi-demo.mp4`, then spot-check 3–4 key frames.

No changes to the live Asmi site — this is a standalone artifact you can download and share.
