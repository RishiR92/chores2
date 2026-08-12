# Landing page copy + content cleanup

## 1. Generative UI section
- Remove the capability pill row ("3 quotes, side by side", "time slots to tap", "map of what's near", "poll your group", "live order tracker") — asmi doesn't do those. The section keeps only the headline, the plan/tap/done chips, the one-line explainer, and the live restaurant-picker thread, which already tells the story: she shows visual options, you tap one, she calls.

## 2. Chase engine
- Plumber task title drops "call all 3" → "leak under the sink".
- Footer line becomes: "she runs several threads in parallel and informs you once the task is done."
- Dentist log: the clinic-3 step becomes an email ("emailed clinic 3 for a morning slot") instead of a web form.
- Friends log: "nudged the two who ghosted" becomes "called the two who ghosted".

## 3. "she'll handle this" chip grid
Remove chores already shown above (dentist, plumber, group dinner, the $60 charge, the restaurant pick) and replace with fresh everyday tasks that span asmi's full range:
- bills & money: "cancel this subscription", "lower my internet bill", "chase my insurance claim"
- appointments: "book a haircut saturday", "reschedule my flight", "DMV appointment"
- disputes & admin: "dispute this parking ticket", "my landlord's ghosting me", "return this order"
- errands & local: "is this in stock nearby?", "find a mover for the 14th", "get my car serviced"
- life admin: "renew my passport", "cancel my gym", "get a vet slot for the dog"
Each keeps a short in-her-voice reply on tap.

## 4. Languages
Show only pills from the world's 20 most-spoken languages (english, mandarin, hindi, spanish, arabic, french, bengali, portuguese, russian, urdu, indonesian, german, japanese, punjabi, marathi, telugu, turkish, tamil, vietnamese, korean) and highlight the biggest few (english, mandarin, hindi, spanish, arabic) as popped-out terracotta pills.

## 5. Nav
Remove the section links (why, in the chat, how she chases, what she'll do, languages). Nav keeps the asmi wordmark and the "text asmi" button only.

## 6. "she doesn't stop until it's done."
Make it land subtly but with more punch: instead of plain text under the CTAs, it appears as a small hand-stamped line — lowercase display type, a coral underline that draws itself in, and a soft spring-in — sized down and set on one line so it reads as a signature rather than a subhead.

## Technical notes
- Files touched: `GenerativeUI.tsx` (delete CHIPS), `ChaseEngine.tsx` (JOBS data + copy), `ChoreGrid.tsx` (CHORES list), `LangCluster.tsx` (LANGS/POP), `Nav.tsx` (links), `Hero.tsx` (signature line treatment).
- Copy/data-only plus one small motion tweak; no layout or backend changes.
