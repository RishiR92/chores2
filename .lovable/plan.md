# text-lite hero + a new "generative UI" section

Three changes: strip the hero down to something bold and visual that reveals copy as you scroll, add a new section about visual interfaces inside iMessage, and re-cut the "annoying" section to the 3 genuinely worst things.

## 1. Hero: bold first, words later

Right now the hero fires everything at once — badge, headline, a full paragraph, CTA, a chat thread, and a 6-step chase log. Too much for one screen.

New behaviour:

- **First screen is 5 words + 2 buttons.** Giant lowercase headline ("the most **irritating** assistant in the world."), the two channel buttons, nothing else. No sub-paragraph, no badge, no chase log visible.
- **The thread types itself out** beside/below the headline: "cancel my gym, they keep dodging me" → she replies. Two bubbles, that's it. Feels alive without reading like copy.
- **Scroll reveals the chase.** As you scroll the first ~600px, the chase log lines drop in one at a time, pinned next to the thread — call, voicemail, text, email, called again, **cancelled ✅**. The story unfolds by scrolling instead of being dumped as text. Progress is tied to scroll position, so scrolling back rewinds it.
- The old sub-paragraph becomes a single short line that fades in only after the log finishes: "she doesn't stop until it's done."
- Reduced-motion / no-JS: everything renders in its final state.

Mobile: headline scales down but stays huge; thread and log stack under it with the same scroll reveal.

## 2. New section — "she doesn't send you links. she sends you the answer."

A new section (placed right after the receipts, before the chase engine) about generative UI in the chat.

The pitch, said in very few words: you ask for something, and instead of ten tabs you get a small, beautiful interface inside the thread — photos, ratings, hours, distance, the one she recommends — you tap, she calls. Intent in, result out; no app in between.

What it looks like (all custom-built, nothing copied from the screenshot):

- A phone-shaped thread. You: "bars near me with actual veg food."
- She replies, then a **card carousel** renders in the bubble: 3 place cards with a photo, name, rating, one-line why, and open-till time. One card wears a small "asmi picks this" tag.
- Tapping a card selects it, the others dim, and a single button slides up: **"call this one"** → the card flips to a live status pill ("calling · on hold 2:14") and then "table for 5, 7:30pm ✅".
- Photos are generated (elegant, moody food/bar shots), not a screenshot paste-in.
- Around it, three tiny mono labels — `no app` · `no tabs` · `one tap` — and the section headline. That's all the text.
- Below the phone, a thin strip of other generative UIs she can render in-thread, as small abstract chips: quotes table, time slots, map pin list, order tracker. Visual only, no paragraph.

## 3. Receipts: the 3 worst things

Keep **on hold** (live-counting timer) and **phone menus** (the keypad). Replace the third one and sharpen all three to the things people actually hate:

1. **on hold** — timer ticking past 41 minutes, "she doesn't hang up."
2. **phone menus** — 6 menus deep to reach a human.
3. **"we'll call you back"** → replaced with **being bounced between departments / re-explaining yourself from scratch** — the transfer counter (`transferred ×4`, "told the story 4 times"). This is the one people rage about most and it beats the callback joke.

Headline stays "annoying — but only to them."

## Technical notes

- `Hero.tsx`: split into headline block + `HeroThread` (typing bubbles) + scroll-driven `ChaseLog`. Use `useScroll`/`useTransform` from `motion/react` on a tall hero container; drive per-step opacity from a progress value. Honour `useReducedMotion`.
- New `src/components/asmi/GenerativeUI.tsx` + `PlaceCard.tsx`; add it to `src/routes/index.tsx` after `<Receipts />`. Generate 3 images into `src/assets/` and import them.
- `Receipts.tsx`: swap the third card's body/caption for the transfer counter.
- Add a nav link for the new section; update route `head()` description to mention visual, tappable interfaces in chat.
- Palette, fonts and existing tokens unchanged.
