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

## 2. New section — "she plans it with you. then she goes and does it."

A new section (placed right after the receipts, before the chase engine) about generative UI in the chat: the deciding half and the doing half, in one thread.

The pitch, in very few words: you say what you want, she renders a small, beautiful interface right in the chat — photos, ratings, hours, distance, the one she'd pick — you tap to decide, and she immediately goes off and executes it. Planning and action in the same thread. No app, no ten tabs.

What it looks like (all custom-built, nothing copied from the screenshot):

- A phone-shaped thread. You: "bars near me with actual veg food, table for 5."
- She replies, then a **card carousel** renders in the bubble: 3 place cards with a photo, name, rating, one-line why, and open-till time. One card wears a small "asmi picks this" tag.
- Tapping a card selects it, the others dim, and a single button slides up: **"book this one"** → the card flips into the doing half: a live status pill ("calling · on hold 2:14") → "table for 5, 7:30pm ✅ — added to your calendar".
- That flip is the whole point of the section: **decide → done, without leaving the thread.**
- Photos are generated (elegant, moody food/bar shots), not a screenshot paste-in.
- Around it, three tiny mono labels — `plan` · `tap` · `done` — and the section headline. That's all the text.
- Below the phone, a thin strip of other generative UIs she can render in-thread, as small abstract chips: quotes table, time slots, map pin list, **group poll for friends**, order tracker. Visual only, no paragraph.

## 3. Receipts: the 3 worst things

Not all phone pain — spread it across channels so it isn't three flavours of "calls".

1. **on hold** — timer ticking past 41 minutes, "she doesn't hang up."
2. **phone menus** — 6 menus deep to reach a human. Press 4.
3. **nobody replies** (new) — the ghosting card: call rings out, text sits on "delivered" for two days, DM unread… then the email finally lands a reply. A small four-channel strip where three go grey/dead and the last one flips green: "she kept switching channels until one worked."

Headline stays "annoying — but only to them."

## 4. Friends / group coordination example

Everywhere the page shows a list of examples, one of them is now group coordination — the most relatable Gen-Z case:

- **Chore grid**: add "pick a night that works for all 6 of us".
- **Chase engine**: add a job — "dinner with 5 friends saturday": she texts all 5, chases the two who didn't reply, locks the night, then calls the restaurant and books it. Shows the multi-person chase clearly.
- **Generative UI strip**: the group-poll chip above.


## 5. Works the same on phone and laptop

Every interaction above must land on both — nothing concept-critical hidden on mobile.

- Hero: scroll-driven chase reveal works on touch scroll; headline scales 40 → 88px; thread stacks under it.
- Generative UI phone: on desktop it sits beside the copy with the card carousel side-by-side; on mobile the cards become a horizontal snap-scroll inside the phone, with the tap → book → done flip identical.
- Chase engine tabs: horizontal snap chips on mobile, wrapped row on desktop.
- 44px+ tap targets everywhere, no hover-only affordances (every hover has a tap equivalent), sticky bottom channel bar stays on small screens.

## Technical notes

- `Hero.tsx`: split into headline block + `HeroThread` (typing bubbles) + scroll-driven `ChaseLog`. Use `useScroll`/`useTransform` from `motion/react` on a tall hero container; drive per-step opacity from a progress value. Honour `useReducedMotion`.
- New `src/components/asmi/GenerativeUI.tsx` + `PlaceCard.tsx`; add it to `src/routes/index.tsx` after `<Receipts />`. Generate 3 images into `src/assets/` and import them.
- `Receipts.tsx`: replace the third card with the four-channel ghosting strip.
- `ChoreGrid.tsx` + `ChaseEngine.tsx`: add the friends/group-coordination entries.
- Add a nav link for the new section; update route `head()` description to mention visual, tappable interfaces in chat.
- Palette, fonts and existing tokens unchanged.

