import type { Canvas, TranscriptLine } from "../useCanvases";

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const marcoTranscript: TranscriptLine[] = [
  { speaker: "asmi", text: "Hi, is this Marco? Calling on behalf of Aanya about the HVAC unit." },
  { speaker: "them", text: "Yeah, this is Marco. What's going on with it?" },
  { speaker: "asmi", text: "AC's blowing warm since Tuesday. She's hoping to get someone out this week." },
  { speaker: "them", text: "I could swing by Thursday afternoon, maybe around 3?" },
  { speaker: "asmi", text: "Thursday at 3 works. What's the diagnostic fee?" },
  { speaker: "them", text: "Eighty-five, applied to the repair if she goes ahead." },
  { speaker: "asmi", text: "Perfect. I'll text her to confirm. Thanks Marco." },
];

const dadTranscript: TranscriptLine[] = [
  { speaker: "asmi", text: "Reminder queued for Sunday 11am — your weekly call with dad." },
];

const rxTranscript: TranscriptLine[] = [
  { speaker: "asmi", text: "Walgreens on Mission — pickup ready by 4pm." },
  { speaker: "them", text: "Confirmed. We'll have it at the counter." },
];

export function seedCanvases(): Canvas[] {
  const now = Date.now();
  return [
    {
      id: "marco-hvac",
      title: "Marco — HVAC repair",
      kind: "call",
      status: "live",
      subtitle: "calling now · 0:42 in",
      fields: [
        { label: "who", value: "Marco · West Bay HVAC" },
        { label: "when", value: "right now" },
        { label: "goal", value: "book a visit, ask diagnostic fee" },
        { label: "outcome", value: undefined },
      ],
      transcript: marcoTranscript.slice(0, 3),
      transcriptCursor: 3,
      fullTranscript: marcoTranscript,
      artifacts: [],
      chat: [
        { id: uid(), role: "asmi", text: "i'm on with marco. i'll lock a time and check the fee — anything to add?" },
      ],
      createdAt: now - 1000 * 60 * 2,
    },
    {
      id: "dad-checkin",
      title: "Dad — weekly check-in",
      kind: "message",
      status: "waiting",
      subtitle: "queued · Sunday 11am",
      fields: [
        { label: "who", value: "Dad" },
        { label: "when", value: "Sun · 11:00 AM" },
        { label: "goal", value: "warm nudge, ask about the back" },
      ],
      transcript: dadTranscript,
      transcriptCursor: 1,
      fullTranscript: dadTranscript,
      artifacts: [],
      chat: [
        { id: uid(), role: "asmi", text: "i'll ring him sunday. want me to mention the photos from last weekend?" },
      ],
      createdAt: now - 1000 * 60 * 60 * 6,
    },
    {
      id: "rx-refill",
      title: "Refill prescription",
      kind: "errand",
      status: "done",
      subtitle: "done · 4:08 PM",
      fields: [
        { label: "who", value: "Walgreens · Mission" },
        { label: "when", value: "today, 4pm" },
        { label: "goal", value: "refill + pickup window" },
        { label: "outcome", value: "ready at counter" },
      ],
      transcript: rxTranscript,
      transcriptCursor: 2,
      fullTranscript: rxTranscript,
      artifacts: [
        { id: uid(), kind: "confirmation", title: "Pickup confirmed", body: "Walgreens · Mission St · ready by 4:00 PM. Rx #5582." },
      ],
      chat: [],
      createdAt: now - 1000 * 60 * 60 * 24,
    },
  ];
}

const genericTranscript: TranscriptLine[] = [
  { speaker: "asmi", text: "Hi — calling on behalf of a customer. Quick one." },
  { speaker: "them", text: "Sure, what do you need?" },
  { speaker: "asmi", text: "Looking to set this up for them and confirm the details." },
  { speaker: "them", text: "Yeah, we can do that. What time works?" },
  { speaker: "asmi", text: "Let's lock it in. I'll send the confirmation through." },
];

export function scriptedSpawn(prompt: string): Canvas {
  const id = uid();
  const lower = prompt.toLowerCase();
  const kind: Canvas["kind"] =
    lower.includes("call") || lower.includes("book") || lower.includes("appointment") ? "call" :
    lower.includes("text") || lower.includes("message") || lower.includes("remind") ? "message" :
    lower.includes("order") || lower.includes("pickup") || lower.includes("refill") ? "errand" : "call";

  const title = prompt.length > 48 ? prompt.slice(0, 46) + "…" : prompt;

  return {
    id,
    title: title || "new task",
    kind,
    status: kind === "message" ? "waiting" : "live",
    subtitle: kind === "call" ? "spinning up the call…" : kind === "message" ? "drafted, holding" : "running this for you",
    fields: [
      { label: "who", value: "finding the right contact…" },
      { label: "when", value: undefined },
      { label: "goal", value: prompt },
      { label: "outcome", value: undefined },
    ],
    transcript: kind === "call" ? [genericTranscript[0]] : [],
    transcriptCursor: kind === "call" ? 1 : 0,
    fullTranscript: kind === "call" ? genericTranscript : [],
    artifacts: [],
    chat: [{ id: uid(), role: "asmi", text: "on it. i'll keep this canvas live as it moves." }],
    createdAt: Date.now(),
  };
}

export function advanceScript(c: Canvas): Canvas {
  if (c.status === "done") return c;
  if (c.transcriptCursor < c.fullTranscript.length) {
    const next = c.transcriptCursor + 1;
    const updated: Canvas = {
      ...c,
      transcript: c.fullTranscript.slice(0, next),
      transcriptCursor: next,
    };
    // When transcript completes for call, populate outcome + artifact
    if (next === c.fullTranscript.length && c.kind === "call") {
      const lastFieldsHaveOutcome = updated.fields.some((f) => f.label === "outcome" && f.value);
      if (!lastFieldsHaveOutcome) {
        updated.fields = updated.fields.map((f) =>
          f.label === "outcome" ? { ...f, value: "Thu 3:00 PM · $85 diagnostic" } :
          f.label === "when" && !f.value ? { ...f, value: "Thu 3:00 PM" } :
          f.label === "who" && f.value?.startsWith("finding") ? { ...f, value: "Marco · West Bay HVAC" } : f,
        );
        updated.artifacts = [
          ...updated.artifacts,
          { id: uid(), kind: "confirmation", title: "Appointment held", body: "Thu 3:00 PM · diagnostic $85, applied to repair." },
          { id: uid(), kind: "summary", title: "Call summary", body: "Marco can come Thursday afternoon. Confirmed fee. Awaiting your sign-off." },
        ];
        updated.subtitle = "wrapped · awaiting your nod";
      }
    }
    return updated;
  }
  return c;
}
