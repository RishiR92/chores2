# Hero rewrite — "just text her" (Gen-Z, USA)

The current hero is a scroll-driven serif statement ("The screen era is over.") with the wordmark and waitlist form fading in underneath. It reads as a luxury-brand manifesto: beautiful, but slow, abstract, and it leaves no room for the iMessage/WhatsApp proof point. Bolting channel icons onto that headline would look like a logo strip stapled to a poem.

## The problem with the current headline

"The screen era is over." is a thesis, not a hook. It asks the visitor to agree with a philosophy before knowing what the product does. Gen-Z scans in about two seconds and wants: what is it, does it look fun, do my friends use it, how do I start. It also fights the icons — a manifesto about ending screens can't credibly be flanked by two messaging-app logos.

## New headline direction

Replace the manifesto with a verb. The magic is that there's nothing to install and nothing to manage: you text a contact, and the messy real-world stuff — the calling, waiting, chasing — stops being yours.

Primary (recommended):

```text
              just text her.
   asmi calls the plumber, argues with the bank,
      chases the refund for a week. you don't.

        [ iMessage ]   [ WhatsApp ]
          no app. no signup. just text.
```

Alternates to swap in if the team prefers:
- "text asmi. she handles it." / "your life admin, in your DMs."
- "she'll make the call." (phone-call anxiety is the sharpest Gen-Z pain point)
- "never be on hold again."
- "unbothered." with the sub carrying the explanation

"The screen era is over." is not deleted — it moves to a later act as a quieter statement line, so the brand thesis survives without blocking the hook.

The hero must land three product truths in under two seconds: (1) it lives in the messages app you already use, (2) it makes real phone calls to real humans and businesses, (3) it keeps going for hours or days until the thing is actually done.

## Where the icons go

A single **channel row** directly under the sub-headline: two rounded 40px tiles (iMessage blue-green gradient bubble, WhatsApp green) plus a "no app. no signup." caption. They are the trust cue, not decoration — placed after the promise, before the CTA. On tap they open the respective deep link (sms:/wa.me) once the numbers exist; until then they are visual only and the CTA stays the waitlist form.

A second, smaller **channel trail** sits under the thread card: `call → text → email → web` with tiny icons and the caption "until it's actually done." That single line carries the escalation model — the thing no other assistant does — without a paragraph of explanation.


## Making it feel Gen-Z without copying Tomo

Tomo's energy comes from: one bold sentence, oversized rounded type, a live-looking product artifact on screen, and playful micro-motion. We take the energy, not the layout.

1. **Typography with attitude** — keep Newsreader for one accent word, but set the main line in a heavy geometric sans, lowercase, tight tracking. Lowercase is the single strongest Gen-Z signal. The accent word "her" stays serif italic terracotta, so it still reads as asmi.
2. **A live artifact, not an abstract blob** — a tilted iMessage thread card floating right (desktop) / below (mobile) that types itself out: "my sink is leaking" → "on it — calling 5 plumbers now" → a live row of 5 tiny call chips flipping from ringing to voicemail to **booked, tue 2pm ✓**. Parallel calling is the most screenshot-worthy thing asmi does, so it is the hero's proof. Reuses the visual language already built in the /app prototype.
3. **Task-category ticker** — one line under the sub-headline cycling the real jobs in asmi's own words: "the dentist" / "the AC guy" / "your bank" / "that refund" / "the birthday cake" / "the group dinner". Six categories, no feature grid, fully scannable.
4. **Motion that snaps** — the slow scroll-scrub dim is replaced by an entrance landing in under a second: words pop on a spring, thread card slides up, icons bounce in last, call chips resolve on a stagger. Scroll-scrub stays only for the exit into Act 2.
5. **Social proof line** — a small avatar cluster + "2,400+ on the list" under the CTA. Peer count does heavy lifting for this audience.
6. **Palette** — keep linen/espresso/terracotta so the rest of the site matches, but raise hero contrast: espresso goes near-black, terracotta becomes a filled CTA pill instead of a thin outline, ambient blobs get more saturation so the page feels alive.
7. **Copy tone** — short, lowercase, second person, zero corporate words. "no app. no signup. just text." beats "seamless multi-channel assistant". Never say "productivity" or "save time" — the promise is *not thinking about it*, so the closing microcopy is "you stop thinking about it."

## Layout

```text
 ┌───────────────────────────────────────────────┐
 │  asmi                              [waitlist] │
 │                                               │
 │   just text her.        ┌───────────────┐     │
 │   she calls, argues,    │ imessage card │     │
 │   and chases it down.   │ calling 5…    │     │
 │   → the dentist         │ ●●●●●         │     │
 │                         │ booked tue ✓  │     │
 │   [iMessage] [WhatsApp] └───────────────┘     │
 │   no app. no signup.    call→text→email→web   │
 │                                               │
 │   [ get early access → ]                      │
 │   ●●●● 2,400+ waiting                         │
 └───────────────────────────────────────────────┘
```

Mobile stacks: headline → category ticker → icons row → thread card → channel trail → CTA. Hero becomes a real 100svh section with content, not a sticky scroll-scrub stage, so the fold always shows the promise, the icons and the CTA.


## Technical notes

- Rewrite `src/components/asmi/Act1Opening.tsx`; keep `AmbientBlobs` and `WaitlistForm`, drop the word-by-word scroll dim.
- New `src/components/asmi/ChannelIcons.tsx` (inline SVG for iMessage bubble and WhatsApp glyph — no logo images) and `src/components/asmi/HeroThread.tsx` for the self-typing thread card.
- Nav gains an always-visible state on the hero instead of appearing only after 85vh, so the waitlist CTA is reachable immediately.
- Add a display-sans font (e.g. Bricolage Grotesque or General Sans, loaded via `<link>` in `src/routes/__root.tsx`) and a `--font-display` token in the `.landing-theme` scope; existing sections keep Newsreader/Figtree.
- Motion via the existing `motion/react`; all entrance animation collapses to static under `prefers-reduced-motion`.
- Act 2 onwards untouched; "the screen era is over." is re-placed as a one-line statement between Act 2 and Act 3.

## Out of scope

Real deep-link phone numbers, backend for the waitlist beyond what exists, redesign of Acts 2–6, the /app prototype.
