# Asmi Product Hunt launch video v5

This revision fixes the silent call problem at the source, makes the chat beats feel intentional, and ends on a stronger Product Hunt-style statement.

## What will change

### 1. Fix the call audio properly

The biggest issue is not just mixing: the current trimmed call files are effectively silent, while the original source recordings do contain audible speech.

#### Plan

- Rebuild all 3 call snippets from the original source recordings:
  - `doc-sandra-call.mp4`
  - `hvac-call.mp4`
  - `spanish-grandpa-call.mp4`
- Extract new 7–8 second windows that contain clear speech and align them to the on-screen captions.
- Loudness-normalize each snippet for intelligibility and consistency.
- Reduce background music much more aggressively during call scenes so the voice is the focus.
- Make the render pipeline reproducible so the final exported MP4 always includes the correct audio mix.

#### Result

When a call scene is on screen, the viewer should clearly hear the actual snippet without straining. Outside of calls, the music carries the energy.

### 2. Upgrade the background music

Replace the current track with a more launch-worthy, drum-led soundtrack from an open library.

#### Music brief

- Percussion-forward, startup launch energy
- Clean, modern, cinematic build
- Strong kick/snare pulse
- Momentum through the middle, lift into the finish
- No vocals
- Works under UI/chat visuals without feeling cheesy

I’ll use a royalty-free/open-library track that fits this brief and then mix it so it supports the story instead of fighting the call audio.

### 3. Make the three chat examples feel real and different

The chat scenes should not feel empty or repetitive.

#### New structure

1. **Example 1 — existing message already in the thread**
   - Show a realistic pre-existing inbound request already sitting in the conversation.
   - Asmi replies and immediately transitions into the corresponding call.

2. **Example 2 — new typed request**
   - Show the user actively typing a fresh request into the chat composer.
   - The typed text resolves into a sent message, then Asmi replies.

3. **Example 3 — another new typed request**
   - Same realistic chat UI, but with a different request pattern so it does not feel templated.
   - Use distinct pacing/content from example 2.

### 4. End on a stronger final beat

Replace the softer ending treatment with a high-impact closing message:

**AI That Handles Your Personal Chores in the Physical World**

This becomes the emotional finish of the video and should land with the strongest music moment.

## Exact content direction

### Chat storytelling

- Keep the chat UI realistic and populated
- Avoid empty thread space
- Use one pre-existing request + two typed-in-live requests
- Ensure each example clearly maps to a different real-world task

### Call storytelling

- Doctor booking call
- HVAC service call
- Grandfather wellness check call in Spanish

### Ending

- Final message should feel like the headline, not a small caption
- Music should peak here
- Visual pacing should feel resolved and premium

## Technical implementation

```text
MainVideo.tsx
  - Replace repetitive chat beat structure with 3 distinct message patterns
  - Update on-screen copy so each chat scene feels active and real
  - Retime captions if needed to match newly extracted audible call windows
  - Increase BGM ducking during calls
  - Rework ending scene around the final headline

audio assets
  - Re-extract call snippets from original MP4 source recordings
  - Normalize voice tracks for clarity
  - Replace bgm.mp3 with a better royalty-free launch track

render-remotion.mjs
  - Make final audio export reproducible
  - Ensure the rendered MP4 includes the intended mixed soundtrack
```

## Acceptance criteria

- All 3 call scenes have clearly audible voice snippets
- Background music feels more premium and launch-ready
- The 3 chat examples are visibly different from each other
- One example shows a pre-existing message in thread
- Two examples show new requests being typed and sent
- The video ends on: **AI That Handles Your Personal Chores in the Physical World**
- Final output is a new exported MP4 version

## Output

`/mnt/documents/asmi-demo-v5.mp4`
