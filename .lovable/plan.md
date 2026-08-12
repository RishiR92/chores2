# Clearer chase steps, hero wordmark fix, real asmi logo

## 1. Chase Engine — status clarity over brevity

Rewrite the step labels so each one reads like a plain status update, not a shorthand. Steps get a bit more room (wider columns, two-line labels allowed) so nothing is clipped.

**Order of tasks:** friends dinner first, **book a dentist second**, then plumber, then the $60 charge.

Sample rewrites:

- Friends dinner: "texted all 5" → "texted all 5" / "2 didn't reply" / "**called them**" / "**booked restaurant · Sat locked**"
- Dentist: "**clinic 1 — no morning slot**" / "**clinic 2 — went to voicemail**" / "emailed clinic 3" / "**clinic 4 — 8:30am tues confirmed**"
- Plumber and charge steps get the same treatment (who was contacted + what actually happened).

Outcome chip stays, worded as a result the user can act on.

## 2. Hero background wordmark

The giant ghost "asmi" behind the hero clips on phones. Fix by scaling it to fit the viewport width on small screens and raising it clear of the bottom edge so the whole word is visible.

## 3. Logo

Use the uploaded asmi wordmark (serif italic) in place of the current text logo in the header, with the white version reserved for dark sections. Also set it as the site favicon (square, padded copy in `public/`).

## Technical notes

- `src/components/asmi/ChaseEngine.tsx` — reorder `JOBS`, rewrite `beats[].label`, widen beat column and allow 2-line labels.
- `src/styles.css` — `.ghost-mark` responsive sizing/offset.
- `src/components/asmi/Nav.tsx` — swap text logo for the image asset (uploaded via lovable-assets pointer); `public/favicon.png` + `__root.tsx` icon link.
