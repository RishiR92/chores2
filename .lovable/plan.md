# Launch video — v6 polish

Three targeted fixes to `remotion/src/Launch16x9.tsx`. No timing or sequence changes.

## 1. Remove the "PERSONAL AI" eyebrow above every headline

The lower-left progress mark already reads `● PERSONAL AI`. The duplicate eyebrow at the top of every left-column headline is redundant.

- In `HeadlineColumn`, delete the eyebrow block (the dot + "personal AI" row) and the `eyebrowOp` it uses.
- Keep the kinetic headline + underline accent. Add a touch more top breathing room so the headline still feels anchored.
- Do **not** touch the bottom progress mark — that's the one the user wants to keep.

## 2. Redesign the two cloud scenes — "plumbers → prescriptions" and "50+ languages"

Current behavior dumps ~26 pills / language words into a flex-wrap grid all at once. Reads as a wall of text. Replace both with a **focused, fast-paced rotating reveal** so only a few items are on screen at any moment.

### Shared pattern (one component, two data sources)

A `RotatingReel` that, over the beat's ~130 frames, cycles through the full list in **rapid beats of ~14 frames each**:

- One **hero word** centered in the right stage, large italic serif, drops in with a spring + slight blur-to-sharp, holds ~8 frames, then slides up + fades as the next hero takes over.
- Two **secondary words** drift in below and above the hero at smaller size, slightly off-axis, lower opacity. They lag the hero by 4 frames and exit 4 frames earlier — so each "beat" has a clear focal point but feels alive.
- A thin accent hairline grows under the hero word each beat, then retracts.
- Items cycle through the full list (no repeats within the beat). For tasks, hero gets the verb phrase ("book dentist"); for languages, hero gets the script word ("中文", "हिन्दी", "Español").
- Total of ~8 hero reveals per beat. The eye reads each one cleanly.

Tone: still warm linen world, still terracotta/sage accents — just dynamic and editorial, not a tag cloud.

Both `TaskCloud` and `LangCloud` are replaced by this single approach with different `items[]` and font stacks. The right-stage geometry (`stageX/Y/W/H`) stays so it sits where the phone used to.

## 3. Phone bug right before the outro

At the boundary `langs → outro`, the phone briefly re-renders for the first ~28 frames of the outro (until `dissolveOp` drops below the 0.02 gate) because `beat.scene` is no longer set on the outro beat. Visible as a flash of the mobile MainVideo before the final card.

Fix: change the phone visibility condition from

```text
!beat.scene && (!isOutro || dissolveOp > 0.02)
```

to

```text
!beat.scene && !isOutro
```

The phone is fully owned by product beats; outro never shows it.

## 4. Background music must play to the end

`audio/bgm.mp3` is currently mounted inside `MainVideo`, which is embedded inside the phone frame. When the phone unmounts for the `tasks`, `langs`, and `outro` beats, the bgm cuts — that's why the video sounds like it ends on "handles your day."

Fix: in `Launch16x9.tsx`, render a top-level `<Audio src={staticFile("audio/bgm.mp3")} />` spanning the full 1550 frames, outside the phone subtree. Apply a volume curve that holds steady through `tasks` + `langs` and fades out across the last ~30 frames of the outro. The existing bgm tag inside `MainVideo` stays (it's used when MainVideo renders standalone in the 9:16 cut) — mute or duck the embedded MainVideo bgm here by wrapping the phone's MainVideo in a context that zeroes its volume, OR simpler: leave it; both copies overlap only during product beats where they're identical and additive volume is fine. Pick the simpler path unless it sounds bad on review.

## Files

- `remotion/src/Launch16x9.tsx` only.
- Re-render to `/mnt/documents/asmi-launch-16x9-v6.mp4`.
