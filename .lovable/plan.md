# Mobile "zoomed in" feel — evaluation and fix

## What I checked

Rendered the live page at 394x852 (iPhone-class width) and measured the DOM:

- No actual zoom bug: viewport meta is correct (`width=device-width, initial-scale=1`), page scroll width equals 394px, and nothing overflows horizontally.
- The cause is the type and spacing scale, not zoom. At 394px the page renders:
  - hero H1 at 37.6px, every section H2 at 33.6px
  - body/lead paragraphs at 16.5–17px
  - section padding 64px top/bottom, card padding 20px
  - the hero chat card occupies nearly the full viewport height with a large empty chase-log area before scroll

So each screen shows very little content per scroll, which reads as "zoomed in".

## The fix: a tighter mobile scale

Reduce sizes only below the `sm` breakpoint; desktop stays exactly as it is today.

- Headings: hero H1 to ~30px, section H2 to ~26px, card titles to ~19px.
- Body copy: leads to ~15px, secondary/mono captions to ~11px.
- Spacing: section vertical padding from 64px to ~44px, card padding from 20px to 16px, gaps tightened one step.
- Hero: reserve less fixed height for the chase log so the card fits comfortably and the next section peeks above the fold.
- CTA pills: slightly smaller (height ~50px, icon 24px) so the pair sits lighter under the headline.
- Chat bubbles and restaurant option cards: 13.5–14px text, smaller thumbnails, so three options read as a compact list.

## Technical notes

- Edits are presentation-only: responsive class/style tweaks in `src/components/asmi/*` (`Hero`, `Receipts`, `GenerativeUI`, `ChaseEngine`, `ChoreGrid`, `LangCluster`, `CloseCTA`, `ChannelCTA`) plus the shared heading rules in `src/styles.css`.
- Prefer mobile-first values with `sm:` overrides restoring current desktop values, so nothing above 640px changes.
- Verify afterwards by re-measuring at 394px and 320px: no horizontal overflow, H1 under ~32px, and the hero plus the start of the next section visible within two scrolls.
