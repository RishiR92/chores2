# Hero cutouts, background fix, and a text-lite chase engine

## 1. New cutout objects (replace the rotary phone, bell and "47" calendar)

The current three read as generic vintage props. Replace with objects that instantly say "the chore asmi is fighting for you":

- a gym membership card (the cancellation everyone dreads)
- a folded utility/credit-card bill with a highlighted charge
- a dentist appointment reminder card
- a tangled phone cord with a small handset (kept — it's the one prop that means "on hold")
- a pair of salon scissors

Generated as cutout PNGs with the same hard-lit, hard-shadow, slightly desaturated treatment so the set stays consistent. The old cut-bell / cut-ticket / cut-chair files are removed and every usage (hero, chore marquees, hold band) is repointed to the new set.

## 2. Mobile: fewer, visible objects

Today the two mobile layers sit at coordinates that push them off-screen or behind text. Fix: exactly **one** cutout on mobile — the coiled handset, tucked into the bottom-left gutter under the CTA, small and low-opacity, never overlapping the headline or thread card. Desktop keeps three (handset left, bill bottom-right, gym card top-right) instead of six, so it reads pinned rather than cluttered.

## 3. Background wordmark + red line

- Remove the vertical red margin rule entirely.
- The giant ghost "asmi" is currently anchored off the left edge, so it clips on mobile and looks right-shifted on laptop. Re-anchor it centered horizontally and bottom-aligned, sized off viewport width so the full word is always readable at any width, still at very low ink opacity behind the content.

## 4. Copy changes

- Generative UI: "no ten tabs, no wall of text. she builds the exact view you need in chat — then goes and books it."
- Language section: "no training, no awkward handoffs. she talks naturally and keeps chasing."

## 5. Chase engine — kill the wall of text

Today it's a paragraph, pills, and a 4-line log of full sentences. Restructure it the way the rest of the page works — visual first:

- Drop the intro paragraph; keep only the eyebrow and the headline.
- Task pills stay (they're the interaction), but the card becomes a **channel relay** instead of a text log: a horizontal run of channel glyphs (call → voicemail → text → email → web → call) that light up one by one as the sequence plays, with the failed ones stamped out and the winning one snapping into the accent colour.
- Each step carries **three or four words max** plus a timestamp, sitting under its glyph — the sentence-length lines are cut ("called the bank, opened dispute #4471" becomes "dispute opened"). The outcome line at the end is the only full sentence, and it lands as a stamped result chip ("$60 back — 3–5 days").
- Progress reads from the lit glyphs, so the numeric counter and progress bar go away.
- Mobile: the relay scrolls horizontally within the card and auto-advances with the playback, so nothing wraps into a paragraph.

## Technical notes

- New cutouts generated into `src/assets/`; `PILE` in `Hero.tsx` rewritten (3 desktop layers, 1 mobile layer); `ChoreGrid.tsx` and `Receipts.tsx` imports repointed.
- `src/styles.css`: delete `.pad-rule` and its usage in `Hero.tsx`; rewrite `.ghost-mark` positioning (centered, `clamp()` sized off `vw`).
- `ChaseEngine.tsx`: replace the `ChaseLog` block with a new relay renderer driven by the same `shown` state and in-view gate; step copy shortened in the `JOBS` data. `ChaseLog.tsx` stays for other usages if any remain, otherwise removed.
- Copy edits are string changes in `GenerativeUI.tsx` and `LangCluster.tsx`.
- No routing, backend, or data changes.
