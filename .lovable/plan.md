# AI-to-AI film — V4 (motion rebuild)

Three real problems with the current cut, and how V4 fixes them.

## 1. Music must carry the whole film

The film currently goes dead silent after the call. That kills momentum exactly where the insight is supposed to land.

- Score runs unbroken from frame 0 to the final logo.
- During the real call the music ducks down under the voices (low bed, no masking), then swells back the moment "Herman's is fully vegan" ends — that swell becomes the reveal moment instead of silence.
- Score builds in three stages: curious/low in the opening, tight and tense under the proof, wide and confident from the insight to the end.
- The call recording still ends exactly on "Herman's is fully vegan." Nothing spoken after it.

## 2. Insight lines stop being a slide-show

Today each line fades in, fades out, next line — a deck. V4 makes the insight one continuous moving passage:

- Lines live in a single shared space and move through it: as a new line arrives, the previous one scales down and drifts off-axis rather than disappearing, so the thought accumulates instead of resetting.
- Camera-style movement (slow push and lateral drift) runs across the whole insight section, so the frame is never static.
- Key words ("AI", "answered", "agent-to-agent") land on their own beat with a distinct treatment (weight/colour/scale shift), instead of the whole line appearing at once.
- The final statement does not fade in; it settles into position as the motion comes to rest, and the frame holds there.

## 3. Background stops fighting the copy

The dot field and its floating "AI answered" labels currently sit directly behind the headline.

- Behind any headline, the field is pushed out to the edges and dimmed — a clear centre pocket for the text, always.
- Floating labels only appear in sections with no headline over them, never under the copy.
- Dot density and pulse are reduced overall; motion behind text slows so nothing twitches next to a word.
- A subtle vignette/darkening sits between field and text for contrast, so type reads on any device at feed size.

## Structure (unchanged story, rebuilt execution)

1. Scale — thousands of people use asmi to deal with the real world.
2. Observation — more calls are being answered by AI.
3. Proof — one real asmi call, three lines, ends on "Herman's is fully vegan."
4. Insight — an AI asked. an AI answered. this is already happening. (one continuous passage)
5. Shift — the real world is becoming agent-to-agent. asmi is already there.
6. End — wordmark, "built for whoever answers."

## Technical notes

- New file `remotion/src/AiToAiFilmV4.tsx`; V3 and earlier exports untouched. New compositions `aiToAiV4Widescreen` / `aiToAiV4Vertical`, render script defaults updated.
- `Field` gains a `focus` prop: when a headline is on screen it dims, spreads to the margins, and disables labels.
- Insight section becomes a single transform-driven stack (shared layout, spring-driven position/scale) rather than independent opacity gates.
- Audio: one continuous score track with a ducking envelope keyed to the three speech clips, swell at the end of the vegan line; masters at ~-14 LUFS, true peak ≤ -1 dBTP, H.264/AAC 48kHz, ≤ 39s, both formats composed separately.
- Verification: full watch with sound in both formats, sound-off read at feed size, contact sheets checked for text/background collisions at every headline frame.
