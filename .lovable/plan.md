# Waitlist "you're in" email template

A single self-contained HTML email file, styled after the asmi site (paper #FBF7F0, ink #141318, coral #FF5A47), written in asmi's voice: witty, relentless, lowercase.

## Story flow

1. **Preheader + header** - asmi wordmark, tiny line: "you're in."
2. **Hook (the story)** - a relatable Gen-Z scene told as a text thread: you fell asleep trying to plan a Saturday date, and at 2:14am asmi texts: "dinner booked at 7:30, movie tickets for 9:40. you're welcome." The message sits in a realistic iMessage bubble, with a tiny chase line underneath: "called 4 places · 2 had nothing · one had a cancellation · sat locked." One story beat = instant proof of the product.
3. **What she actually does** - one line: she calls, texts, emails and chases until it's done, so you never have to.
4. **Categories (plain language)** - six chips written like you'd actually say them: "cancel stuff you forgot you signed up for", "get a haircut or dentist slot", "fight weird charges", "call a landlord / plumber / mover", "change flights or reservations", "passport, DMV, insurance stuff".
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
