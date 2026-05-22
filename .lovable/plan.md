## Plan

Restore the launch video to use the exact same call audio content that was used in v7/before, with no extra cleanup pass and no alternate processing.

### What I’ll change
1. Replace the three trimmed call files with the exact v7-style extractions from the original source call videos:
   - `doc.mp3`
   - `hvac.mp3`
   - `grandpa.mp3`
2. Use the same portions as v7:
   - start at `0s`
   - duration `8s`
   - no denoise, no compression, no loudness pass, no fades
3. Keep the non-audio changes you already asked for intact unless you tell me otherwise:
   - tasks/languages no center-to-right move
   - more time before advancing
   - small asmi logo on the last screen
4. Re-render a new output file so you can compare it directly against v7.

### Technical details
- Source files:
  - `remotion/public/audio/doc-sandra-call.mp4`
  - `remotion/public/audio/hvac-call.mp4`
  - `remotion/public/audio/spanish-grandpa-call.mp4`
- Output files to overwrite:
  - `remotion/public/audio/trimmed/doc.mp3`
  - `remotion/public/audio/trimmed/hvac.mp3`
  - `remotion/public/audio/trimmed/grandpa.mp3`
- Rendering code already references these trimmed files through the existing Remotion sequences, so no scene timing changes are needed for the audio revert.
- I’ll render a new versioned export after the audio files are restored.

### Result
The next render will keep the current motion/layout fixes, but the call audio itself will match v7 exactly instead of the processed version now in v10.