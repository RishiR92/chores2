# asmi.com — a story-led rewrite for a younger US audience

The site should feel like reading someone's texts, not reading a product page. No "life admin", no "multichannel", no "AI assistant that…". The words on screen are the words asmi would actually text you, and the words you'd actually text a friend.

The whole page makes one emotional argument: **the thing you've been avoiding is already done.** That feeling — relief, plus a little disbelief — is the product.

Current site opens with "The screen era is over." over a scroll-scrubbed serif manifesto, and the examples are plumber, HVAC, prescription refill, check on mom. That's a 40-year-old homeowner. Under-30s don't call plumbers; they get ghosted by a landlord, get charged for a gym they left in 2023, and would genuinely rather suffer than call the dentist.

## The spine: stories first, product later

Top of the page is one story after another, each told as a real message that arrives. No feature list, no icon grid, no "how it works" in the first three screens. The product explains itself because you're watching it happen.

Each story is one screen. Big message bubble, small timestamp, one line of aftermath. That's it.

## Section 1 — Hero

```text
              you were asleep.

     "booked you 7:30 at the italian place
      and two seats for the 9:40. you're welcome."

                                    — asmi, 2:14am

        [ iMessage ]   [ WhatsApp ]
           no app. just text her.
```

- The headline is the setup; the bubble is the punchline. The message types itself in, the timestamp lands, then the reply chips appear underneath: `called 4 places · 2 had nothing · one had a cancellation`.
- Lowercase, heavy display sans for the setup line, the message in a real iMessage-style bubble with the terracotta/linen palette.
- Channel icons sit under it as the trust cue: no download, no signup, it's just a contact in your phone.
- CTA: filled pill, "get her number →", plus "2,400+ waiting".
- The scroll cue is literally a downward-drifting next bubble, so scrolling feels like scrolling a thread.

## Section 2 — The story reel (3–4 screens, scroll-snapped)

Each is a different person, a different moment, same shape. Real voice. Real stakes. Nothing heroic — small things that were quietly ruining someone's week.

1. **the gym**
   > "you're out. i called, they said come in person, so i emailed them the cancellation clause. they refunded the month they snuck in too."
   > *— tuesday, 10:04am · you never called anyone*

2. **the landlord**
   > "your AC is on the schedule. thursday 10am, work order #4471. took 3 days and 11 messages but he answered."
   > *— it took her 3 days. you thought about it once.*

3. **the dentist**
   > "found one that takes your insurance and isn't 40 minutes away. thursday 4:15. i already gave them your info."
   > *— you have not called a dentist since 2021.*

4. **the birthday**
   > "cake's ordered, pickup saturday 11am. the guy said happy birthday to her, i said i'd pass it on."
   > *— you remembered at 11pm the night before.*

The italic aftermath line under each is the emotional beat — that's where the relatability lives, and it's the part people screenshot.

Then one full-bleed clearing screen:

> **you're not bad at this. this stuff is just built to waste your time.**

## Section 3 — Watch her work (the one demo)

Now, and only now, show the machinery. Keep the existing parallel-call visualization — it's the best thing on the site — but rescope it from plumber to something young and unglamorous. Default scenario: **the gym cancellation**. Two other tabs the visitor can flick: **the disputed charge**, **the dentist**.

What has to be legible without reading a caption:

- she does **five things at once** (five rows going simultaneously)
- she doesn't stop at calling — the rail down the side shows the escalation: *called → on hold → texted → emailed → filled their form*
- she **keeps going for days** — one scenario visibly spans a timeline, with "day 3 — they finally called back. she picked up."

Ending state is always a receipt: a confirmation number, an amount refunded, a time booked. Concrete beats adjectives.

## Section 4 — Anything with a human on the other end

Keep the floating pill cloud, rewrite every label in how people actually say it:

- "cancel this thing i signed up for", "why was i charged $60", "my landlord's ghosting me", "i need a dentist", "get my prescription", "return this", "is it still in stock", "dinner for 6 saturday", "cake by friday", "what time do they close", "chase my deposit", "the DMV", "find a therapist who takes my insurance", "get me 5 quotes"

Then it widens — same cloud, drifting into the household and family stuff, which is where the older/high-frequency use cases live: AC repair, movers, the vet, an insurance claim, flowers to mom, calling grandpa. Line over it: **"if it needs a human on the other end, she'll handle it."**

This is the one place the category gets named, quietly: *the calls, the holds, the follow-ups, the chasing. all of it.*

## Section 5 — Receipts

Three story cards (keep the existing beautiful treatment), but now with the proof attached: elapsed time, how many calls, which channels, the confirmation number. Same voice as section 2, just with the evidence visible. The third one is the Spanish-language call to abuela, which bridges naturally into the language cloud that follows (keep it — it's strong and matches the launch video).

## Section 6 — Close

> **she'll text you when it's done.**
> that's the whole thing.

Waitlist form, channel icons, and the morning habit — currently invisible on the site — as one last bubble: *"morning. anything today?" — 9:03am*.

## Voice rules

- Write it like a text: lowercase, contractions, short. "on it." "done." "you're out." "he finally answered."
- Never: life admin, productivity, seamless, save time, errands, task management, assistant, leverage, effortless.
- Every claim carries an artifact — a time, a number, an amount, a confirmation code.
- The aftermath lines do the emotional work; the bubbles do the product work. Don't mix them.

## Design

- **Type:** heavy geometric display sans (Bricolage Grotesque or General Sans), all lowercase, for setup lines; Newsreader italic kept only for the wordmark and aftermath lines; Figtree for body.
- **Color:** keep linen / espresso / terracotta so the site still matches the launch video. Higher contrast up top, sage reserved strictly for "done ✓", slightly more saturated ambient blobs.
- **Motif:** the message bubble is the page's repeated unit. Every section is a variation on a thread, so scrolling the site feels like scrolling a conversation.
- **Motion:** typing indicators, bubbles landing with a small spring, timestamps fading in a beat later, receipts stamping in. 200–400ms, never slow. Scroll-scrub kept only for section 3. Everything static under `prefers-reduced-motion`.
- **Interaction:** tap to switch demo scenario, tap a cloud pill to see its outcome bubble, nav always visible so the CTA is one tap away.

## Technical notes

- `Act1Opening.tsx` becomes a real content hero (no sticky scroll-scrub). New `MessageBubble.tsx`, `ChannelIcons.tsx` (inline SVG, no logo images), `HeroStory.tsx`.
- New `Act2Stories.tsx` for the scroll-snapped story reel, with copy in `src/components/asmi/data/stories.ts`.
- `Act2CallViz.tsx` → `Act3Work.tsx`: same GSAP/ScrollTrigger machinery, new scenario data in `data/scenarios.ts`, plus the escalation rail and multi-day timeline.
- `Act4Cloud.tsx`: labels only. `Act5.tsx`: story data + receipts row. `Act6Close.tsx`: new close and morning bubble. `Nav.tsx`: always visible.
- Display font via `<link>` in `src/routes/__root.tsx`; `--font-display` token added inside the `.landing-theme` scope in `src/styles.css`.
- New title/description/og in `src/routes/index.tsx`.

## Out of scope

Backend or waitlist changes, real phone numbers/deep links, the `/app` prototype, the launch video.
