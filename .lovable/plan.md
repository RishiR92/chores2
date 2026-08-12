# voice pass + a calmer chase engine

Two things: give the whole page one consistent voice (smart, dry, funny, relentless), and rebuild the chase-engine card so it plays out step by step instead of dumping a wall of log lines.

## 1. Chase engine — replay, not a wall

Today the card shows the title, the "who", four channel chips, four log lines and a footer paragraph all at once. That is the clutter in the screenshot.

New behaviour and layout:

- **Order:** the friends/dinner example moves to first position; plumber, charge, dentist follow.
- **Nothing plays until you pick.** Tap a task pill and the card resets, then the log types itself in — one step every ~0.9s, each dropping in with the existing spring. The status chip stays neutral while it runs and flips to `done` / `chasing` only when the last step lands.
- **A small progress read** replaces the channel-chip row: `3/4` with a thin line that fills as steps land. No more four static call/text/email/web pills.
- **Trim the card:** drop the footer paragraph ("she runs several threads in parallel…") — the section lead already says it. Keep title, who-line, status, log.
- **Layout:** wider breathing room, log lines get their own row rhythm; the card gets the same square-ish 10px geometry the rest of the page moved to instead of the 26px blob.
- **Replay:** re-tapping the active pill replays the sequence. Reduced-motion shows all steps immediately.
- Section lead becomes: "call → voicemail → text → email → their web form → call again. she escalates on her own and keeps you posted in iMessage."

## 2. Copy pass — asmi's voice everywhere

Rules: lowercase, short, concrete, dry punchline at the end of a line, never cutesy, never corporate. She's the one doing the unglamorous work and slightly enjoying it.

Changes:

- **Receipts (the ink band):** delete "the hold music, the transfer, the 'we're experiencing higher than usual volume'. she sits in it so it never touches your day." Replace with a tighter, funnier one-liner under the hold clock.
- **Languages:** "no interpreter, no awkward handoff. she just switches." becomes "no interpreter, no awkward handoff. she just switches."  (already the intended line — keep, tighten the surrounding lead).
- **Hero, generative-UI section, she'll-handle-this, footer, nav:** rewrite eyebrows, headings, lead lines and the chore replies so every line carries the same energy. Existing structure and layout stay; text only.
- Nothing new is invented about capability — same claims, better lines.

## Technical notes

- `src/components/asmi/ChaseEngine.tsx`: reorder `JOBS` (friends first), add a per-selection replay driver (index state + interval, cleared on task change and on unmount), pass a `revealCount` to the log, remove the channel-chip row and footer paragraph, restyle the card.
- `src/components/asmi/ChaseLog.tsx`: accept an optional `visible` count so the parent can drive step-by-step reveal instead of the current whileInView stagger; keep the existing behaviour as the default.
- Copy-only edits in `Receipts.tsx`, `Hero.tsx`, `GenerativeUI.tsx`, `ChoreGrid.tsx`, `LangCluster.tsx`, `Nav.tsx`, and the footer in `src/routes/index.tsx`.
- No changes to tokens, routing, or the `/app` prototype.
