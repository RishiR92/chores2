# Asmi — "Violet Pulse" Energy + Iconography Pass

A vibrant rewrite of the visual + motion system, plus a proper icon language. Keep the card-stack architecture and 15 use cases. Replace the linen/amber world with a living purple universe, and give every surface real iconography so it reads like a 2026 consumer app (Airbnb / Arc / Linear / Things 3 / Cash App level), not a wireframe.

## 1. Palette — purple-led, status-driven

Move off amber entirely.

- **Background base:** soft white `#F7F4FF` with a permanent animated mesh.
- **Mesh blobs (drifting):** violet `#7C3AED`, magenta `#E64BFF`, indigo `#5B5BFF`, sky `#A5D8FF`, peach `#FFC4E1`. 4 blobs, 24–40s loops, blur 120px, opacity 55%.
- **Ink:** `#1A0B2E` deep aubergine. Secondary `#6B5B8A`.
- **Status (the only color language):**
  - **live** → electric violet `#7C3AED` + pulsing halo
  - **queued** → soft lilac `#C9B8FF`
  - **needs you** → magenta `#E64BFF` shimmer
  - **done** → mint `#5EEAD4` single flash → ghost
  - **paused** → slate `#9CA3B8`
- **No orange. No amber.** Strip from tokens.

## 2. Iconography — the new layer

This is what's missing. Every meaningful noun and verb gets an icon. Reference bar: Airbnb (rounded duotone), Arc (precise line), Things 3 (warm geometric), Linear (1.5px line).

### Icon system
- **Library:** `lucide-react` (already installed) at 1.5px stroke, plus a small custom set for Asmi-specific things (orb, call-wave, transcript-bars).
- **Sizes:** 14 / 16 / 20 / 24. Always paired with text at matching baseline.
- **Two treatments:**
  - **Line** (default) — `strokeWidth: 1.5`, currentColor, used inline.
  - **Tinted tile** — 28×28 or 32×32 rounded-[10px] tile, status-tinted bg (12% alpha), icon in full status color. Used for category, channel, action.
- **Motion:** icons inherit parent transitions; status icons pulse with the dot; success uses a quick scale+rotate (CheckCircle 0→1.1→1, 280ms).

### Where icons go (concrete map)
- **App header:** `Sparkles` (asmi mark), `Bell` (notifications), `Clock` (history).
- **CanvasHeader:** category icon in a tinted tile to the left of the title (Plumber→`Wrench`, Restaurant→`UtensilsCrossed`, Gift→`Gift`, Barber→`Scissors`, Dentist→`Stethoscope`, Travel→`Plane`, Ride→`Car`, Reminder→`Bell`, Shopping→`ShoppingBag`, Email→`Mail`, Quotes→`FileText`, Schedule→`CalendarDays`, Map→`MapPin`, Checklist→`ListChecks`, Message→`MessageCircle`). Channel chip becomes icon+label (`Phone`, `MessageSquare`, `Mail`).
- **Status dot:** replaced with **status glyph** — `Radio` (live, animated rings), `Clock3` (queued), `AlertCircle` (needs you), `CheckCircle2` (done), `Pause` (paused).
- **OptionsList rows:** leading tinted tile with `MapPin` + distance, `Star` rating, `DollarSign` price; trailing `Check` when selected, `ChevronUp`/`ChevronDown` priority, `X` dismissed. Swipe reveals colored action panels with icons (right→`Star` magenta, left→`Trash2` slate).
- **GlassDock idle:** `Sparkles` placeholder icon left of "ask asmi…", `ArrowUp` send, `Mic` voice (decorative).
- **Dock action mode:** each action chip leads with an icon — `PhoneCall` (call top 3), `ListOrdered` (call by priority), `MessageSquare` (message all), `Wand2` (let asmi pick).
- **Dock composer suggestions:** each chip prefixed with its category icon.
- **ParallelCalls:** per-lane `Phone` icon, live lane shows animated wave bars (custom), outcome icons (`Voicemail`, `CheckCircle2`, `XCircle`, `RotateCw` for retry, `Calendar` for booked).
- **CallStepper:** dialing `PhoneOutgoing` → talking `Radio` → done `CheckCircle2` → next `ArrowRight`.
- **TimelineFeed:** every event gets a leading icon by type (`Phone`, `Mail`, `MessageSquare`, `Calendar`, `MapPin`, `DollarSign`, `User`, `Sparkles`).
- **MapView:** `MapPin` markers with status tint, `Navigation` recenter button, `Route` directions chip.
- **SchedulingView:** `CalendarDays` header, `Clock` slot rows, `Users` party size, `Check`/`X` slot state.
- **QuotesTable:** column headers with `DollarSign`, `Star`, `Clock`, `MapPin`; cheapest row gets a `Sparkles` ribbon.
- **MessageThread:** sender avatars circle with initial, `Check`/`CheckCheck` read receipts, `Paperclip` attachments.
- **Checklist:** `Circle`/`CheckCircle2` toggle, drag handle `GripVertical`.
- **Artifacts:** file-type icons (`FileText`, `Image`, `Receipt`, `Ticket`), `Download`, `Share2`, `Eye`.
- **CardStack peek rows:** category icon left, status glyph right.
- **"More past tasks" card:** `Archive` + `ChevronRight`.
- **app.history.tsx:** every row gets category tile + status glyph + outcome icon.
- **Empty states:** large 40px line icon in lilac, one-line caption.

### Custom icons (`src/components/app/icons/`)
- `OrbMark.tsx` — the conic-gradient sphere, reusable at any size.
- `CallWave.tsx` — 4-bar animated equalizer for live calls.
- `SparkleBurst.tsx` — 6-dot burst for success moments.
- `PriorityFlame.tsx` — small flame mark for high-priority rows.

## 3. Cards — status as identity

- White surface with a **status-tinted aura** (24px soft outer glow) and a **3px top gradient bar** in the status hue.
- Category tile in header gives instant recognition.
- On drag: tilt 4°, scale 1.02, glow intensifies, leading edge shows a faint motion blur streak.
- On release-to-back: spring fling with overshoot, `SparkleBurst` at landing point.
- Peek cards tinted 8% with their status hue → the stack reads as a colorful deck.

## 4. Background — living mesh

New `MeshBackdrop.tsx` fixed behind everything: 4 blurred radial blobs animated via framer-motion + 1.5% noise SVG. Static fallback on `prefers-reduced-motion`.

## 5. Motion — dynamic & playful

- **bouncy:** `{stiffness: 500, damping: 22}` for card swaps and dock morphs.
- **squish:** `whileTap={{ scale: 0.94 }}` on every tappable.
- **fling:** `{stiffness: 280, damping: 18, mass: 0.8}` for card-to-back overshoot.
- **Sparkles:** on action fired, call ended, option selected, task done.
- **Tickers:** counts roll up with stagger.
- **Status glyph:** layered SVG with scaling ring + opacity fade.
- **Orb:** conic-gradient sphere with a slow rotating ring; live speeds the ring and adds a magenta halo pulse.

## 6. Orb + dock

- Orb 40px, conic-gradient `#7C3AED → #E64BFF → #5B5BFF → #7C3AED`, rotates 8s, inner radial highlight, tap squish-bounce.
- Glass dock: liquid blur tinted `rgba(124,58,237,0.06)`, 1px inner stroke white@70.
- Primary action chip: violet→magenta gradient, white icon+text, soft violet shadow.
- Composer pills: pastel tints from palette, hover lifts and saturates.

## 7. Typography

Keep **General Sans** (already loaded). Titles 600 / -0.02em tracking. Swap JetBrains Mono → **Space Mono** for status lines (more playful tick). Header counts use tabular 500.

## 8. Per-component restyle

`CanvasHeader`, `OptionsList`, `ParallelCalls`, `CallStepper`, `TimelineFeed`, `MapView`, `SchedulingView`, `QuotesTable`, `Checklist`, `MessageThread`, `Artifacts`, `ChannelChip`, `TaskState`, `CardStack`, `app.tsx`, `app.history.tsx` — all restyled via tokens + icons per §2 map. No structural changes.

## 9. New / changed files

- **New:** `MeshBackdrop.tsx`, `Sparkle.tsx`, `StatusGlyph.tsx`, `Ticker.tsx`, `CategoryTile.tsx`, `icons/OrbMark.tsx`, `icons/CallWave.tsx`, `icons/SparkleBurst.tsx`, `icons/PriorityFlame.tsx`, `lib/categoryIcon.ts` (maps canvas.kind → lucide icon + tint).
- **Rewrite:** `src/styles.css` (purge amber/linen, add violet palette, status tokens, mesh keyframes, glow/shadow tokens, dock tint, icon tile utility `.tile-status`), `AsmiOrb.tsx` (conic gradient ring), `GlassDock.tsx` (violet tint, icon chips), `CanvasHeader.tsx` (category tile + status glyph + Space Mono).
- **Restyle via tokens + icons:** every component in §8.
- **Mock:** add `kind` field per canvas (plumber/restaurant/gift/…) used by `categoryIcon.ts`.
- **Install:** `bun add @fontsource/space-mono`. Remove JetBrains Mono link from `__root.tsx`.

## 10. Out of scope

Architecture changes (card stack stays vertical), new use cases, auth, real calls, persistence, desktop redesign beyond reusing tokens.

## 11. Acceptance check

- `rg -i "amber|orange|#D67341|f59e|fb923"` returns nothing in `src/`.
- Mesh visibly drifts behind cards.
- Every canvas shows a category tile icon + status glyph + channel icon in the header.
- Every options row, timeline event, action chip, dock state, history row has an icon.
- Front card tilts on drag, lands with a sparkle burst.
- Orb has a rotating conic ring; tap squishes and bounces.
- `prefers-reduced-motion` collapses mesh + sparkles to static.
