## Plan

Restore the launch video so the three call examples use the same audio content that is actually present in the v7 render.

### What I’ll change
1. Replace the current trimmed call files with clips that match the v7 render instead of using the first 8 seconds of each source file.
   - `doc.mp3` from about `70.0s`
   - `hvac.mp3` from about `62.0s`
   - `grandpa.mp3` from about `60.0s`
   - keep duration at `8s` for all three
2. Keep the non-audio changes you already asked for untouched:
   - no center-to-right move for tasks/languages
   - more hold time before the next screen
   - smaller ASMI logo on the last screen
3. Render a new versioned export so you can compare it directly against v7.

### Validation
- Re-extract the three call segments from the new render.
- Compare those segments against the corresponding audio sections inside `asmi-launch-16x9-v7.mp4` to confirm they match.
- Only deliver the new render after that check passes.

### Technical details
- Current bug: the last revert used `-ss 0 -t 8`, but v7 did not use the first 8 seconds of those source recordings.
- I traced the actual v7 render and found strong matches at these source offsets:
  - doctor call: `70.0s`
  - HVAC call: `62.0s`
  - grandpa call: `60.0s`
- Files involved:
  - sources: `remotion/public/audio/doc-sandra-call.mp4`, `remotion/public/audio/hvac-call.mp4`, `remotion/public/audio/spanish-grandpa-call.mp4`
  - trims to replace: `remotion/public/audio/trimmed/doc.mp3`, `remotion/public/audio/trimmed/hvac.mp3`, `remotion/public/audio/trimmed/grandpa.mp3`
  - render entry already uses those trims through `remotion/src/MainVideo.tsx`

### Result
The next export will keep the current motion/layout fixes, but the three call examples will use the real v7 call audio content rather than the wrong early sections from the source files.