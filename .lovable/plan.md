## Plan

### 1. Fix phone-call audio balance
- Rebalance the three call snippets so the caller side reads at the same perceived level as Asmi (current flat 2.2x boost preserves the imbalance — tune per clip with gentle limiting).
- Keep background music almost silent during call windows in both `MainVideo` and `Launch16x9` so dialogue dominates.
- Match all three calls to consistent loudness.

### 2. Rebuild the language cloud (centered, website-style)
- **Center anchor (large)**: `50+ languages.` in serif italic, espresso, centered — modest size (not the giant top headline).
- **Subtitle under it (smaller, but bold/highlighted, not muted)**: `your accent. your way.` in serif italic, in the **terracotta family** (`#C25B3F`, same as outro), at roughly 55–60% the size of the anchor — visible and confident, just smaller.
- **Cloud around the anchor**: ~40 language names in a tight ellipse around the center, denser in the middle, thinning toward the edges. No corner outliers.
- **Subtle base state**: low-opacity espresso/stone, small/medium sizes — feels like the website screenshot.
- **One-at-a-time pop**: every ~22 frames a single language bubbles up — scales, brightens, shifts to terracotta, then settles. Only one prominent pop at a time.
- **Hide the top headline** during this beat so the centered cluster is the only focus.

### 3. Render and verify
- Export `asmi-launch-16x9-v15.mp4`.
- Spot-check frames: centered anchor + highlighted subtitle, terracotta pops, tight cluster, and call voice clarity.

### Files
- `remotion/src/MainVideo.tsx` — call audio levels + BGM duck floor.
- `remotion/src/Launch16x9.tsx` — wrapper BGM duck + full rewrite of `LangCloud`.