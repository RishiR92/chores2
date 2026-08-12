# Sharper first screen, live chase, moving options

Five focused changes on the landing page. No backend, no new routes.

## 1. First screen background — kill the "AI default" look

Today the hero sits on off-white paper with two big blurred purple/coral orbs. Blurred pastel orbs are the single most generic AI-site tell, and they're why it reads as a template.

Replacement direction — **"desk of an assistant who won't quit"**: keep the warm paper base and grain, drop both blur orbs, and build depth from flat, printed elements instead:

- A faint ruled/dot grid that fades out toward the bottom, like a legal pad.
- One oversized, very low-contrast ink wordmark or phone glyph bleeding off the left edge (poster print, not glow).
- A single hard-edged citrus shape anchored behind the CTA — flat colour, no blur, slight rotation, so it reads like a highlighter swipe rather than a gradient.
- Very slow parallax on the grid only (a few px on scroll), so it feels alive without floating.

Net effect: bold, printed, deliberate. Nothing glows, nothing gradients.

## 2. Chase engine starts when you get there

Right now the first task's step-by-step log has already finished playing by the time the section scrolls into view. Fix: hold the log at zero steps until the section is actually on screen, then start the ~0.9s cadence. Switching tasks by tapping a pill still replays from step one. Reduced-motion users keep the instant full log.

## 3. Restaurant options get motion

The three option cards currently just sit there. They will slide in from the right, one after another with a small stagger, as that section scrolls into view — springy, settling into place, not a slow fade. Once revealed they stay put so tapping and booking behaves exactly as now. Reduced-motion: no slide.

## 4. Generative UI copy

Replace the paragraph with: "no ten tabs, no wall of text. she builds the exact view you need in the thread — then goes and books it."

## 5. Personality pass on the copy

A pass over the page so every line sounds like asmi — quick, dry, taking a small jab at the thing she's fighting (hold music, ghosting clinics, subscription retention flows), never smug and never long. Targets: hero subline and scroll hint, receipts band, chase engine intro, chore grid punchlines, language section, footer tagline. Same structure, sharper voice, nothing gets longer.

## Technical notes

- Hero background: replace the two `blur-3xl` divs in `Hero.tsx` with CSS-driven print elements; add tokens/utility to `src/styles.css`.
- Chase engine: gate the interval in `ChaseEngine.tsx` behind an in-view check (`useInView` from motion/react on the section, `once: true`).
- Options: wrap each card in `GenerativeUI.tsx` with a viewport-triggered `motion.div` (`initial x: 40`, staggered `delay`, `viewport={{ once: true }}`), respecting `useReducedMotion`.
- Copy edits stay inside the existing component string constants.
