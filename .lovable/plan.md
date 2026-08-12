# Waitlist "you're in" email template

A single self-contained HTML email file, styled after the asmi site (paper #FBF7F0, ink #141318, coral #FF5A47), written in asmi's voice: witty, relentless, lowercase.

## Story flow

1. **Preheader + header** - asmi wordmark, tiny line: "you're in."
2. **Hook (the story)** - a short scene: you've been on hold 41 minutes, the gym still won't cancel, the dentist never called back. asmi sits through all of it so you never have to. 3-4 short lines, big display type on the punchline.
3. **What she actually does** - one line: she calls, texts, emails and chases until it's done.
4. **Categories** - compact 2-column grid of 6 chips: bills & subscriptions, appointments, disputes & refunds, local errands, travel changes, life admin (passport, DMV, insurance).
5. **How it works** - three numbered beats: text her → she plans it with you in the thread → she calls/emails/chases and reports back.
6. **CTA block** - two big buttons: "open iMessage" (blue) → https://asmi-ai.link/imsg and "open WhatsApp" (green) → https://asmi-ai.link/whatsapp, with "no app. no signup. just text her." beneath.
7. **Sign-off + footer** - "she doesn't stop until it's done." plus a plain-text unsubscribe/company line placeholder.

## Email-client compatibility

- Table-based layout, 600px max width, all styling inline; no flexbox/grid, no external CSS or webfonts (system font stack: Helvetica/Arial fallback for the body, Georgia italic for the asmi wordmark so it reads like the logo without an image).
- Bulletproof VML-free padded-table buttons so they render in Outlook; `<!--[if mso]>` fallbacks for rounded corners.
- Single-column stack on mobile via a small `@media` block plus widths that already collapse gracefully where media queries are ignored (Gmail app).
- Dark-mode friendly: explicit background colors on every table cell, `color-scheme` meta.
- No background images; emoji avoided; alt text on the only image (logo, referenced by absolute URL to the hosted asset, with a text fallback).

## Deliverable

- `/mnt/documents/asmi-waitlist-invite.html` - the standalone file, downloadable and ready to paste into any ESP.
- Rendered and visually QA'd at desktop and mobile widths before delivery.
