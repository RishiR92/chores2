# Fixing the "vibecoded" feel + making the page move

## The honest critique

I went through every section below the hero. Here's what actually reads as AI-generated to a Gen-Z eye — none of it is about "not enough animation":

**1. Every section is the same shape.**
Eyebrow label → lowercase h2 → grey one-liner → a grid/cloud of rounded pills or cards. Receipts, Chase Engine, She'll handle this, Languages — same skeleton four times. Real sites vary rhythm: one section is a full-bleed image, one is a single number, one is a list, one is a quote. Sameness is the #1 tell.

**2. Pill soup.**
Rounded-full chips are used for: tags, phone keys, chore prompts, channel labels, language names, status badges. When one shape does six jobs, nothing reads as intentional.

**3. Numbers that no designer would pick.**
Font sizes in the code are `14.5`, `11.5`, `10.5`, `1.65rem`, `12.5`. Spacing is ad-hoc per component. There's no type scale and no spacing scale — everything is nudged inline. This is invisible individually and screams "generated" collectively.

**4. Two colour systems fighting.**
The global tokens are still the old "Violet Pulse" palette; the landing page overrides them inside `.landing-theme` with coral/citrus/mint/blue. Sections then pick tint colours at random per card (`--citrus` here, `--violet-soft` there) with no meaning attached. Colour that means nothing looks decorative rather than designed.

**5. Nothing is real.**
No photography, no texture, no hand, no faces, no product screenshot, no logos, no voice recording waveform. It's 100% synthetic shapes and text. Gen-Z reads flat vector-only pages as templates.

**6. Copy tics.**
An `✅` emoji inside a mono row, em-dashes everywhere, "she just… sits there and does it", every heading lowercase with a coloured last word. The lowercase-with-one-accent-word move is repeated 5×.

**7. Motion is uniform.**
Everything currently uses the same spring and the same fade-up. Uniform motion = no motion, perceptually. That's why it feels static even though animations exist.

## What I'll change

### A. Structure — break the four-identical-sections pattern
- **Receipts** becomes a full-bleed dark band with one giant live hold-timer as the hero element and the two other pains as small footnotes beside it — one loud idea, not three equal cards.
- **She'll handle this** stops being a pill cloud. It becomes a marquee of real requests scrolling in two opposing rows (drag/hover to slow), with the reply appearing as an iMessage thread below on tap.
- **Languages** becomes a single sentence that live-swaps the language mid-line ("she'll say it in **español**") rather than a pill grid.
- **Chase Engine** stays as the interactive centrepiece — it's the one section that earns its complexity.

### B. Design system discipline
- Define a real type scale (6 steps) and spacing scale in `src/styles.css`; delete every inline `fontSize: 14.5`-style number from the section components and replace with scale classes.
- Collapse the landing palette to **ink, paper, one accent (coral), one signal (mint = done)**. Colour is only used to mean "done", "live", or "failed" — never as random card tint.
- One shape language: pills only for statuses; everything else gets square-ish 4px/10px corners. Kill the rounded-full default.
- Remove the `✅`, trim the lowercase+accent-word heading formula to at most 2 uses on the page.

### C. Something real
- One textured element carried through: a paper/print grain + a hand-drawn ink underline already half-built in `Atmosphere.tsx`, used sparingly.
- A stamped/printed "receipt" texture for the Receipts band so it reads as an object, not a div.

### D. Motion with variety (the actual ask)
Instead of one fade-up everywhere:
- **Receipts**: numbers count/tick up on entry, digits flipping like a departure board.
- **Marquee section**: continuous horizontal drift that reacts to scroll velocity — scroll fast, it lurches; stop, it settles.
- **Chase Engine**: the log lines type/tick in one at a time when the card enters, not all at once.
- **Languages**: the swapping word does a vertical roll.
- **Section handoffs**: the dark band clips in with a wipe rather than a fade, so the page has one strong "cut" moment.
- Everything still under 500ms, single easing, full `prefers-reduced-motion` bypass.

## Technical notes

- `src/styles.css`: add `--step-0..5` type scale + spacing tokens inside `.landing-theme`; prune unused colour tokens.
- New `src/components/asmi/Marquee.tsx` (scroll-velocity-linked, via `useVelocity` + `useAnimationFrame`).
- New `src/components/asmi/Ticker.tsx` for digit-roll numbers and the rolling language word.
- Rewrite `Receipts.tsx` as the dark band; refactor `ChoreGrid.tsx` into the marquee + thread; simplify `LangCluster.tsx`.
- `Reveal.tsx` gains a `wipe` variant for the band cut; existing variants stay.
- No backend or copy-meaning changes beyond the tics listed above.
