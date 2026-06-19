## Asmi Web App — Visual Prototype (Plan v1)

A new route `/app` that prototypes the Asmi product surface. Everything is mocked — no auth, no backend, no real AI. Goal: nail the *feel* of dynamic task canvases.

### Core concept
Each user message that implies a task spawns a **Canvas** — a living, breathing card in the workspace that holds that task end-to-end. Canvases live as **tabs** along the top. Active canvas takes center stage; finished ones dim and slide to a history rail. New chats inside a canvas push the task forward; truly new asks spawn a new canvas.

### Vibe — "Soft glass / organic"
Not the editorial site. A sibling product surface in the same family.
- Background: very pale linen wash with two slow-drifting blurred orbs (warm peach + sage) behind frosted glass — alive, never busy.
- Surfaces: `backdrop-blur-2xl`, 30–50% white over the wash, hairline `1px` warm border, soft inner highlight.
- Type: Newsreader italic for canvas titles + key moments only; Figtree for everything functional. Mono for status chips.
- Color: keep espresso/terracotta/sage tokens. Terracotta is reserved for the live/active pulse and primary action. Sage for "done."
- Motion: canvases *bloom in* (scale 0.96 → 1, blur 16 → 0, 420ms cubic-bezier(0.2,0.8,0.2,1)). Tabs morph with shared-layout feel. Closing a canvas: gentle deflate + drift to history rail. All motion under 500ms, nothing bouncy.

### Layout
```text
┌─────────────────────────────────────────────────────────────┐
│  asmi          [ Marco HVAC • live ] [ Dad check-in ] [ + ] │  ← tab strip (glass)
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ╭──────────────── ACTIVE CANVAS ────────────────╮          │
│   │  title · status chip · who/when/what          │          │
│   │  ─────────────────────────────────────────    │          │
│   │  [ dynamic body: call viz / artifact / etc ]  │          │
│   │  ─────────────────────────────────────────    │          │
│   │  inline chat with Asmi  ───────────  [send]   │          │
│   ╰────────────────────────────────────────────────╯          │
│                                                              │
│  recent  ·  ▢ ▢ ▢   (dim cards, click to reopen)             │
└─────────────────────────────────────────────────────────────┘
```
Left edge: slim collapsible rail with "New task" + past canvases grouped by day. No traditional sidebar density — closer to Arc/Dia restraint.

### Canvas anatomy (all four asked for)
A canvas is one component that composes blocks based on `task.kind`:
1. **Header** — italic title, mono status chip (`live` pulses terracotta, `done` sage, `waiting` stone), one-line "for you · 2 min ago".
2. **Structured task state** — small grid of fields (Who / When / Goal / Outcome). Fields fill in progressively with a soft shimmer as the task advances.
3. **Live call visualization** (when kind=call) — circular waveform, speaker label flipping between Asmi / caller, live transcript ticker. Reuses the language and motion of Act2 on the site.
4. **Artifacts** — generated outputs surface as small frosted cards beneath the body: "Summary," "Confirmation," "Calendar hold." Click to expand inline.
5. **Inline chat thread** — pinned to the bottom of the canvas, not a separate page. User types → mock Asmi reply streams in with a typing shimmer → canvas state updates in response. Chat is *of the canvas*, not above it.

### Prototype interactions (all mocked, scripted)
- Land on `/app` with two seeded canvases: **Marco HVAC** (live call, mid-flight) and **Dad's weekly check-in** (waiting). One dimmed past canvas: **Refill prescription** (done).
- "+ New task" opens a centered glass composer ("what should asmi handle?"). Pressing send: composer scales into a new tab, canvas blooms in, fields fill one by one, a fake call viz starts.
- Inside Marco HVAC canvas: scripted transcript advances on a timer; sending a chat message ("ask him about Saturday") injects a user bubble + scripted Asmi ack + a new transcript line.
- Closing a canvas: confirm chip → deflate → lands in history rail with a sage check.

### Files to add
- `src/routes/app.tsx` — the workspace shell, tab strip, history rail, background wash.
- `src/components/app/Canvas.tsx` — the composable canvas card.
- `src/components/app/CanvasHeader.tsx`, `TaskState.tsx`, `CallViz.tsx`, `Artifacts.tsx`, `InlineChat.tsx` — block primitives.
- `src/components/app/TabStrip.tsx`, `HistoryRail.tsx`, `NewTaskComposer.tsx`.
- `src/components/app/mock/scripts.ts` — seeded canvases + scripted timelines (transcripts, replies, artifact reveals).
- `src/components/app/useCanvases.ts` — local React state store (no persistence). Handles spawn / focus / close / advance.
- Small additions to `src/styles.css`: a `.glass` utility set, bloom/deflate keyframes, the slow orb-drift background.

### Out of scope (call out, don't build)
- Auth, accounts, real AI, real calls, persistence across reload, mobile-optimized layout (desktop-first prototype; basic responsive only).
- Editing the marketing site at `/`. Add a discreet link from the nav to `/app` only if you want; default plan is no nav change.

### Done = 
Open `/app`, see the workspace breathing. Click into Marco HVAC and watch the call advance. Open the composer, type any task, watch a fresh canvas bloom into a new tab. Close it, see it settle into history. The whole thing should feel like one continuous, light, soft-glass surface — recognizably Asmi, distinctly *not* ChatGPT.
