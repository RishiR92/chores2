# Asmi Web App — Liquid Linen Redesign (Final Plan)

Mobile-first reset of `/app`. Wabi-inspired liquid glass, a single living orb, a physical card stack, zero clutter. Decisions are locked — no more open questions.

## 1. North star

Asmi is a quiet operator. Three jobs for the UI:

1. Show what Asmi is doing right now in one glance.
2. Let the user steer by tapping and swiping — never by typing.
3. Get out of the way.

If a pixel doesn't serve one of those three, it's cut.

## 2. Visual system — "Liquid Linen"

- **Page**: flat warm linen `#EFECE7`. No gradients, no orbs, no dot grid, no paper texture.
- **Card surface**: pure white `#FFFFFF`, 28px radius, shadow `0 2px 0 rgba(0,0,0,0.02), 0 24px 48px -28px rgba(40,30,20,0.18)`.
- **Liquid glass**: `backdrop-filter: blur(32px) saturate(180%)`, white @ 55%, inner highlight `inset 0 1px 0 rgba(255,255,255,0.7)`. Used for the dock and the orb only.
- **Ink**: text `#1A1814`, secondary `#7A6F66`, hairlines ink @ 6%.
- **Accent (one)**: **Asmi Amber** `#D67341`. Used only for the orb's live state and the primary action chip. Nothing else is colored.
- **Status**: live = amber breathing dot, queued = ink @ 25% steady, done = thin ink check. That's the whole status vocabulary.
- **Typography**: one face — **General Sans** (Fontshare), three weights (400/500/600). Mono **JetBrains Mono** 10px only for timestamps. No serif, no italics, no display font.
- **Motion**: spring `{stiffness: 420, damping: 36}` for layout; 180ms ease-out for opacity. Orb breathes scale 1 → 1.04 → 1 over 3.2s.

## 3. Layout — three zones

```text
┌──────────────────────────────┐
│ asmi              ◐ 3 active │  44px header
├──────────────────────────────┤
│                              │
│   ╭────────────────────╮     │
│   │  ACTIVE CANVAS     │  ← front card
│   │  (full content)    │     │
│   ╰────────────────────╯     │
│    ░░░░░░░░░░░░░░░░░░        │  card 2 peek (8px down, 96% scale)
│     ░░░░░░░░░░░░░░░          │  card 3 peek
│      [ more · 12 past ]      │  last card → /app/history
│                              │
├──────────────────────────────┤
│  ╭─────────────────────╮     │
│  │ ask asmi…       ◉   │  ← liquid glass dock + orb
│  ╰─────────────────────╯     │
└──────────────────────────────┘
```

### Card stack — vertical swipe, locked

After weighing both: **vertical (up/down)** wins.

- Horizontal is already the user's mental model for "tabs / months" elsewhere. Vertical reads as "stack of cards on a desk" — matches Wabi, matches the physical metaphor, and frees horizontal swipe for in-card gestures (option rows, transcript scrub).
- **Swipe up** on the front card → it lifts and tucks to the back of the stack (round-robin through active canvases). Spring physics, rubber-band at the edges.
- **Swipe down** on the front card → previous card returns to front.
- **Long-press** on the front card → "archive" / "close" sheet (one button each, glass).
- Behind the front card: up to 2 peeks rendered (96% and 92% scale, 8px and 16px offset down, dimmed 6%/12%). Anything older collapses into a static **"more · N past"** card sitting at the bottom of the stack → tap routes to `/app/history`.
- Window: today + last 2 days live in the stack. Older = history route.

Horizontal swipe inside a card is reserved for **option rows** (see §5) and for transcript/timeline scrub. Two axes, two purposes, no conflict.

### Glass dock — one chrome, three modes

The dock is a single liquid-glass pill at the bottom. It morphs in place:

- **Idle**: `ask asmi…` placeholder + small breathing orb on the right. Typing here routes to the active canvas as a chat message.
- **Tap the orb**: dock expands upward into a composer sheet with 4 suggestion chips ("call my plumber", "book a table", "find a gift", "remind dad") → sending spawns a new canvas, dock collapses back.
- **≥1 option selected in the active canvas**: dock morphs into an action row — `Call top 3 · Call by priority · Message all · Let asmi pick`. No new bar pops up; the dock IS the action surface.

Result: no FAB, no nav, no tab strip. One pill does composer, chat, and bulk actions.

## 4. Canvas content — clutter rules

Every canvas, no exceptions:

- Header: title (General Sans 500, 19px) + one mono status line (`live · 2:14` or `queued · 4pm` or `done · cvs main st`). No big "live" badge, no channel logos shouting — channel chip is a 12px ghost mark next to the title.
- **Max 3 blocks visible** below the header. Anything else collapses into a single `details ›` chip that expands inline.
- Block default = the one thing that matters next (current call, current decision, current artifact). Everything else collapsed.
- Empty fields hidden, never shimmer-lined.
- Timeline collapsed to the latest event with a chevron.
- Artifacts shown only when status = done or paused.
- No inline chat inside the card. Chat lives in the dock.

A canvas should read like one thought, not a dashboard.

## 5. Multi-select options flow

Used in 5 of the 15 seeded canvases: plumber, barber, birthday gift, Saturday dinner, dentist.

- Options render as a **vertical list of soft glass rows** inside the card. Each row: name, one-line meta, price.
- Top of list: one chip — **"any works"** — selects all, clears priorities, instantly enables the dock action row.
- Per-row gestures:
  - **Tap row** → toggle selection (amber check appears right).
  - **Swipe right** → mark high priority (amber bar on the left edge).
  - **Swipe left** → dismiss (slide-out + 3s undo toast).
- Sticky chip near the top: `2 selected · 1 high` — tap to clear.
- The moment ≥1 row is selected, the dock becomes the action row (see §3). Fire an action → list collapses into a summary chip ("calling 3 plumbers"), canvas swaps to the live calls block.

## 6. Orb states (the only place color speaks)

The orb is the AI's presence and the only living color in the system:

- **Idle**: pale glass, no glow, slow breath.
- **Working**: amber inner gradient, faster breath, soft outer halo.
- **Has news**: amber pulse + small dot badge.
- **Done**: a single bright pulse, fades to idle within 2s.

Color appears nowhere else. Everything else is ink on linen.

## 7. History route

`src/routes/app.history.tsx` — same Liquid Linen system. Chronological list grouped by day. Row = title + outcome + tap-to-reopen. No new ideas.

## 8. Files

- **New**: `src/routes/app.history.tsx`, `src/components/app/CardStack.tsx`, `src/components/app/GlassDock.tsx`, `src/components/app/AsmiOrb.tsx`, `src/components/app/OptionsList.tsx`.
- **Rewrite**: `src/styles.css` (Liquid Linen tokens, `.glass-pill`, `.card-surface`, orb keyframes, kill orbs/dot-grid/ink-underline/paper noise), `src/routes/app.tsx` (three-zone shell), `src/components/app/Canvas.tsx` (3-block max, collapsed details, no inline chat), `src/components/app/CanvasHeader.tsx` (one status line, no italic, ghost channel mark).
- **Restyle via tokens only**: ParallelCalls, MapView, SchedulingView, QuotesTable, MessageThread, Checklist, TimelineFeed, Artifacts, ChannelChip, TaskState. Hide empty fields, collapse by default.
- **Mock**: add `multiSelect: true` plus a couple of pre-selected/priority defaults on the 5 canvases so the flow demos on load.
- **Delete**: `TabStrip.tsx`, `NewTaskComposer.tsx`, `HistoryRail.tsx`, `InlineChat.tsx`, `OptionsGrid.tsx` (replaced by GlassDock + OptionsList).
- **Fonts**: load General Sans + JetBrains Mono via Fontshare/Google `<link>` in `src/routes/__root.tsx`.

## 9. Out of scope

Auth, real calls, persistence, dark mode, desktop redesign beyond reusing the mobile system at wider widths.