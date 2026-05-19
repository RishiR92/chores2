# Asmi launch video v4 — punchy BGM + audible calls

Two focused fixes on top of the existing v3 video. No structural/UI changes.

## 1. Why the call audio isn't audible (root cause)

The render pipeline is muxing audio with `ffmpeg amix` after a silent Remotion render (`muted: true` in `scripts/render-remotion.mjs`). `amix` normalizes by dividing each input by the number of active inputs, so the BGM (which plays the entire 50s) and the 8s call snippet get equal weight when they overlap — the voice ends up roughly half as loud as it should be, and the BGM masks it.

On top of that, the trimmed call MP3s aren't loudness-normalized, so they sit several dB below the BGM to begin with.

### Fix

Stop post-muxing. Let Remotion render audio natively (Nix ffmpeg has working `aac`, the `libfdk_aac`-only issue was a red herring).

- `scripts/render-remotion.mjs`: remove `muted: true`, add `audioCodec: "aac"`, `enforceAudioTrack: true`, write directly to `/mnt/documents/asmi-demo-v4.mp4`.
- `MainVideo.tsx` mix levels:
  - Call snippets: `volume={1.4}` (gentle boost; Remotion clips above 1 only if the source is hot, these aren't).
  - BGM base: `0.20` outside calls, ducked to `0.04` during calls (was `0.07` — still too loud against the new drum track).
  - Add a 6-frame crossfade on the duck so it's not a step.
- Pre-normalize the three call MP3s once with `ffmpeg loudnorm` (target -16 LUFS, peak -1 dBTP) and overwrite in place. This is the durable fix for "voice is quiet" across any future render.

## 2. New background music — SF launch energy

Current "At Launch" by Kevin MacLeod is ambient pads. You want drum-forward, momentum-building, the kind of thing under a Linear / Arc / Rabbit launch film.

### Track brief

- 50–60s, builds across three beats matching the video arc (intro → 3 calls → outro).
- Tight punchy kick on every beat, crisp snare/clap on 2 & 4, hi-hat 16ths.
- 110–118 BPM. Subby low end, bright top.
- One melodic hook: short plucked synth or muted-guitar motif, repeats and evolves.
- Drop/lift around 0:08 (right as the first iMessage hits) and a final swell into the outro.
- No vocals, no cheesy EDM risers.

Reference vibes: ODESZA "A Moment Apart" intro energy, Tycho "Awake", Rival Consoles "Recovery", Bonobo "Cirrus".

### Source — pick one

**A. Generate with ElevenLabs Music API (preferred — tailored to the video).**
Requires `ELEVENLABS_API_KEY` secret. Saved to `remotion/public/audio/bgm.mp3` (overwrites current).

**B. Free / CC-BY track from Pixabay or Uppbeat** if you don't want to add the key. I'll pick one matching the brief, download it, and credit appropriately.

I'll wait for your choice before fetching/generating.

## 3. Out of scope

- iMessage UI, call UI, scene timing, video length — all unchanged from v3.
- No web app changes.

## Technical summary

```text
render-remotion.mjs:
  - muted: true                      // REMOVE
  + audioCodec: "aac"
  + enforceAudioTrack: true
  + outputLocation: "/mnt/documents/asmi-demo-v4.mp4"
  (drop the ad-hoc ffmpeg amix post-step entirely)

MainVideo.tsx:
  call <Audio volume={1.4} />
  bgm  base 0.20 / duck 0.04 with 6-frame ramp

one-shot:
  ffmpeg -i doc.mp3   -af loudnorm=I=-16:TP=-1 doc.norm.mp3   && mv
  ffmpeg -i hvac.mp3  -af loudnorm=I=-16:TP=-1 hvac.norm.mp3  && mv
  ffmpeg -i grandpa.mp3 -af loudnorm=I=-16:TP=-1 grandpa.norm.mp3 && mv
```

Output: `/mnt/documents/asmi-demo-v4.mp4`.
