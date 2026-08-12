# mobile cleanup: lighter CTAs, swipeable examples, better "she doesn't stop"

## 1. CTA system — less text, more icon

Replace the two long buttons with one compact unit used everywhere:

```text
        text her on
      [ ]  [ ]      <- imessage + whatsapp icon buttons
```

- One small shared caption "text her on" above/left, then two chunky icon-only pill buttons (imessage blue, whatsapp green) with accessible labels.
- Same component reused in hero, close section (dark variant), so the page reads consistently.
- Remove the sticky bottom imessage/whatsapp bar entirely (mobile clutter).
- Remove the "text asmi" button from the header — nav becomes just the wordmark, so the hero owns the CTA.

## 2. Examples become real mobile sliders

Chase engine job chips and the job card currently don't move on mobile. Make them a proper swipe deck:

- Job cards turn into a horizontally snapping carousel (scroll-snap + drag), one card per screen on mobile, with dot indicators and edge peek so it's obvious it slides.
- Chips above become a scroll-snapped rail that keeps the active chip centered.
- Same treatment for the "she'll handle this" chore set on mobile so all example surfaces feel identical.

## 3. Chase engine mobile de-clutter

On small screens hide:
- the call / text / email / web chip row
- the line "she runs several threads in parallel and informs you once the task is done."

Both stay on desktop. Mobile card shows only: title, who, status pill, live log.

## 4. Section transitions

Only the hero feels alive; everything below just fades. Add a consistent minimal reveal used by every section: a short mask-wipe + 12px rise with a small stagger for children, plus a thin hairline rule that draws itself under each section heading. Fast (~0.4s), spring-free, reduced-motion safe — subtle, not bouncy.

## 5. "she doesn't stop until it's done."

The scroll-triggered stamped line under the CTAs is weak and gets lost. Move it into the chase card as the payoff:

- When the log finishes, the last row flips into a full-width badge across the bottom of the card: a coral/mint "she doesn't stop until it's done." stamp that snaps in with a slight rotation, like a rubber stamp on a receipt.
- The `visible/6` counter is replaced by that stamp on completion, so the line arrives exactly when the chase resolves rather than floating in the header area.
- Underline/self-draw removed; the stamp carries the emphasis.

## Technical notes

- `ChannelCTA.tsx`: new icon-pair layout + caption prop; delete `StickyChannelBar` and its usage in `src/routes/index.tsx`.
- `Nav.tsx`: drop the CTA anchor.
- `ChaseEngine.tsx`: carousel with scroll-snap container, `md:` gate for the chip row and parallel-threads copy.
- `ChoreGrid.tsx`: mobile snap rail.
- New shared `Reveal.tsx` wrapper for the section transition; apply to Receipts, GenerativeUI, ChaseEngine, ChoreGrid, LangCluster, CloseCTA.
- `Hero.tsx`: remove the standalone signature block, add the stamp inside the chase card.
