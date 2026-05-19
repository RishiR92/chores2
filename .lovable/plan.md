# Asmi launch video v3 — fix audio, real iMessage UI, music

A focused rebuild of the 50s vertical demo for a Product Hunt launch. Three problems to solve, in order of impact.

## 1. Audio is silent — the real fix

The current render script passes `muted: true`, which strips ALL audio (call snippets + any music) from the MP4. That's why nothing is audible.

Fix:
- Remove `muted: true`.
- Set `audioCodec: "aac"` explicitly on `renderMedia` (Nix ffmpeg has native `aac`, not `libfdk_aac` — this combo works in the sandbox).
- Add `enforceAudioTrack: true` so silent stretches still produce a valid track.
- Mix levels in `MainVideo.tsx` via `<Audio volume={...}>`:
  - Call snippets: `1.0` while a call scene is on screen.
  - Background music: `0.18` under iMessage/intro/outro scenes, ducked to `0.06` during calls so the voice is clearly audible.

## 2. Realistic iMessage UI (replaces the empty chat)

Build a proper iOS Messages screen, not floating bubbles on a gradient:

- Real iOS status bar (time, signal, wifi, battery icons drawn in SVG).
- Messages header: back chevron, circular contact avatar with initials, contact name + "iMessage" subtitle, FaceTime icon.
- Bubble system:
  - Inbound (user → Asmi): light gray (`#E9E9EB`), left-aligned, tail on bottom-left.
  - Outbound (Asmi → user): iMessage blue gradient (`#0B93F6` → `#1FA2FF`), right-aligned, tail on bottom-right, white text.
  - Bubbles animate in with a small spring + scale-from-tail, not a generic fade.
  - Typing indicator (three pulsing dots in a gray bubble) before Asmi replies.
  - "Delivered" / "Read 9:41 AM" micro-label under the last outbound bubble.
- Realistic copy per scenario:
  - Sarah: "Hey can you book my annual physical w/ Dr. Weng? Mornings only 🙏" → Asmi: "On it. I'll call the office now and lock a morning slot."
  - Marco: "AC died again 😩 it's 95° in here" → Asmi: "Calling Pacific HVAC for a same-day visit."
  - Priya: "Can you check on Abuelo in Sevilla? He hasn't texted back." → Asmi: "Llamándolo ahora. I'll report back in español."
- Subtle iOS wallpaper tint behind the chat, not a brand gradient — sells the "this is really my phone" feel.

## 3. Call UI upgrade

Match the iMessage realism:
- iOS-style incoming/active call screen: contact avatar large and centered, name, "calling…" → live timer, mute/keypad/speaker buttons (decorative).
- Live transcript card slides up over the bottom half showing the caller's actual words synced to the audio (short, 2–3 line captions cycling).
- Keep waveform but make it react to time, smaller, under the avatar.

## 4. Background music

Use ElevenLabs Music API to generate ONE 50s track tailored to launch energy:
- Prompt: "Uplifting modern tech launch track, warm synth pads, gentle pluck arpeggio, subtle four-on-the-floor kick, optimistic and human, builds gently, no vocals, 90 BPM, Apple keynote vibe."
- Save to `remotion/public/audio/bgm.mp3`.
- Apply with ducking as described in §1.

If `ELEVENLABS_API_KEY` is not set, I'll stop and ask before proceeding rather than ship without music.

## 5. Render fixes

`scripts/render-remotion.mjs` updates:

```text
renderMedia({
  codec: "h264",
  audioCodec: "aac",
  enforceAudioTrack: true,
  // muted: true  <-- removed
  concurrency: 1,
})
```

Output → `/mnt/documents/asmi-demo-v3.mp4`.

## Out of scope

- No changes to the web app / routes.
- Keeping the existing 3-scenario structure and ~50s length.
- Reusing existing trimmed call audio files; not re-trimming.
