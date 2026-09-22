# AI-to-AI film — V4 (motion rebuild)

Same story, rebuilt as a motion piece instead of a sequence of text cards.

## 1. Music runs the whole way

Silence after the call killed the momentum right where the insight should land.

- One continuous score from first frame to the logo.
- Under the real call it ducks low (voices stay clean), then swells the instant "Herman's is fully vegan" lands — the swell becomes the reveal, not silence.
- Three energy stages: curious in the opening, tight under the proof, wide and confident through the insight and ending.
- The recording still ends exactly on "Herman's is fully vegan." Nothing spoken after it.

## 2. The insight becomes motion graphics, not lines of text

Right now each thought fades in and out — a slide show. In V4 the insight is shown, and text only stamps the conclusion.

- The two call participants stay on screen as living signal nodes. After the call ends, the exchange between them replays as pure motion: a pulse leaves one node, is caught by the other, and returns — no caption needed to say "an AI asked, an AI answered."
- That single exchange then multiplies: one pair becomes dozens across the frame, pulses firing everywhere, so the viewer sees "this is already happening" before reading it.
- Only two text moments survive in this stretch, and they arrive as weight, not as a slide: "this is already happening." and "the real world is becoming agent-to-agent."
- Words build by phrase with a scale/weight shift on the key word, and the previous phrase drifts back in depth instead of disappearing — the thought accumulates.
- A slow continuous camera push and drift runs under the whole section, so no frame is ever static.

## 3. The background becomes the story, and stops fighting the copy

New behaviour for the dot field — a magnetic force model rather than random twinkling:

- Every dot reacts to an invisible attractor. When a headline or the call takes focus, the attractor pushes outward: dots sweep away from centre like particles repelled by a magnet, clearing a wide pocket for the type, and drift slowly at the edges.
- When text clears, the force reverses: dots rush back in and reorganise around the active nodes, then lock into the agent-to-agent lattice for the finale.
- Every dot moves on smooth springs with per-dot delay, so the sweep reads as one fluid organism, not a hard cut.
- Floating "AI answered" labels only appear where no headline sits, at low opacity, and get swept out by the same force.
- A soft darkening between field and type guarantees contrast at feed size.

## Structure

1. Scale — thousands of people use asmi to deal with the real world.
2. Observation — more calls are being answered by AI.
3. Proof — one real asmi call, three lines, ends on "Herman's is fully vegan."
4. Insight (mostly wordless) — the exchange replays and multiplies across the field.
5. Shift — "this is already happening." → "the real world is becoming agent-to-agent." → "asmi is already there."
6. End — wordmark, "built for whoever answers."

## Technical notes

- New file `remotion/src/AiToAiFilmV4.tsx`; V3 and earlier untouched. New compositions `aiToAiV4Widescreen` / `aiToAiV4Vertical`; render script defaults updated.
- Particle field rewritten with a per-dot force model: each dot holds a home position, and a per-scene attractor (centre, strength, polarity) drives spring-damped displacement, so repel/attract is one parameter animated over time rather than separate states.
- Pulse motion between nodes driven by interpolated position along the signal path, with trailing glow; multiplication stage instantiates the same pulse component across generated node pairs with staggered offsets.
- Text uses spring-driven transform stacks (position, scale, depth), not opacity gates.
- Audio: one score track with a ducking envelope keyed to the three speech clips and a swell after the vegan line; masters ~-14 LUFS, true peak ≤ -1 dBTP, H.264/AAC 48kHz, ≤ 39s, both formats composed separately.
- Verification: full watch with sound in both formats, sound-off read at feed size, contact sheets checked for any text/background collision at every headline frame.
