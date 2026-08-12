# asmi — "the most irritating assistant in the world"

A full ground-up redesign of the landing page: new story, new layout, new color world, no waitlist. Every CTA goes straight to iMessage or WhatsApp.

## The framing

She calls. She texts. She emails. She calls again. She will not leave people alone until your thing is actually done.

The whole page is built around that one joke, played straight and warm: annoying *for you*, never *to you*.

- Headline: **"the most irritating assistant in the world."**
- Sub: "she calls, texts, emails and chases — until your thing is actually done. you just text her."
- Primary buttons everywhere: **open iMessage** → https://asmi-ai.link/imsg, **open WhatsApp** → https://asmi-ai.link/whatsapp
- Waitlist form and "get early access" are deleted from the whole site.

## The story (new page flow)

1. **Hero — "she doesn't let go."**
   Big display headline, two channel buttons, and a live chat thread beside it: you text "cancel my gym, they keep dodging me" → she replies → then a compact "chase log" ticks in real time under it (called 2:41 · voicemail · texted · emailed · called again 4:15 · **cancelled ✅**). One glance = the whole product.

2. **"annoying, but only to them."**
   Three quick receipt cards showing what she'll sit through so you don't: 41 min on hold (live counter), 6 IVR menus, 3 "we'll call you back"s. Playful, fast, scroll-triggered.

3. **the chase engine.**
   The core capability view: one task, four channels stacked (call → text → email → web form), and an escalation timeline that keeps going until the status flips to done. Shows retries, voicemail, callbacks, parallel calls to 3 plumbers.

4. **"she'll handle this."**
   A tappable grid of real chores in her voice: cancel this subscription · why was i charged $60 · book the dentist · my landlord's ghosting me · find a plumber, call all 3 · DMV appointment · dispute this ticket · reschedule my flight. Tapping one previews the thread she'd run.

5. **50+ languages, one number.**
   Dense language cluster with a few popping out — she calls in whatever language the other side speaks.

6. **close — "you stop thinking about it."**
   Big final channel buttons, nothing else.

## New look

Away from the linen/terracotta editorial world into something bolder and younger, but still tasteful — not neon, not sticker-spam.

- **Base:** warm off-white paper `#FBF7F0` with a soft grain, plus one full-bleed **deep ink** section (`#141318`) mid-page for contrast/drama.
- **Accents (used deliberately, 2 per section max):** electric blue `#2F5BFF`, coral `#FF5A47`, acid citrus `#E8FF5A`, soft violet `#B39CFF`, warm cream. Color lives in chips, bubbles, status pills, and blobs — never as a rainbow gradient.
- **Type:** heavy geometric display (Bricolage Grotesque) for headlines, all lowercase, tight tracking, oversized on mobile; General Sans for body; a mono tick for the chase log timestamps.
- **Shapes:** rounded 22–28px cards, thick 2px ink borders on key cards (light neo-editorial), chunky pill buttons with a small press-down spring.
- **Motion:** springy entrances, the hold-timer counting, chase-log lines dropping in one by one, phone-ring pulse on the orb. Respects reduced-motion.
- **Mobile first:** single column, full-width cards, 44px+ tap targets, headline scales 40 → 88px, sticky bottom bar with both channel buttons on small screens.

## Technical notes

- Rewrite `src/routes/index.tsx` section order; new components under `src/components/asmi/`: `Hero.tsx`, `ChaseLog.tsx`, `ReceiptsRow.tsx`, `ChaseEngine.tsx`, `ChoreGrid.tsx`, `LangCluster.tsx`, `CloseCTA.tsx`, plus a shared `ChannelCTA.tsx` holding the two links.
- Delete `WaitlistForm.tsx` and all its usages (`Act1Opening`, `Act6Close`); retire the Act1–Act6 components that the new sections replace.
- Replace the `.landing-theme` token block in `src/styles.css` with the new palette + grain/ink-section utilities; add Bricolage Grotesque via a `<link>` in `src/routes/__root.tsx` (no CSS URL imports).
- Update `Nav.tsx`: lowercase links, CTA becomes "text asmi" → iMessage; add the mobile sticky channel bar.
- Update route `head()` meta and footer copy to the new framing.
- `/app` prototype theme stays untouched.
