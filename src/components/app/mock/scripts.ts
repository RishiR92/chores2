import type { Canvas, Call, Place, Option, TimelineEvent, Artifact, ChecklistItem, Quote, SchedulingGrid, MessageThreadT, ChatMsg } from "../useCanvases";

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const t = (kind: TimelineEvent["kind"], text: string, ts = "now"): TimelineEvent => ({ id: uid(), ts, kind, text });
const art = (kind: Artifact["kind"], title: string, body: string, meta?: string): Artifact => ({ id: uid(), kind, title, body, meta });
const asmi = (text: string): ChatMsg => ({ id: uid(), role: "asmi", text });

// ────────────────────────────────────────────────────────────────────────────
// 15 seeded canvases - each demonstrates a distinct interaction pattern.
// ────────────────────────────────────────────────────────────────────────────

export function seedCanvases(): Canvas[] {
  const now = Date.now();
  const base = (overrides: Partial<Canvas>): Canvas => ({
    id: uid(),
    title: "untitled",
    status: "live",
    mode: "action",
    origin: "web",
    subtitle: "",
    createdAt: now,
    artifacts: [],
    chat: [],
    timeline: [],
    ...overrides,
  });

  return [
    // 1 ─ Single live call (no transcript shown - privacy)
    base({
      id: "marco-hvac",
      title: "Marco - HVAC repair",
      origin: "whatsapp",
      status: "live",
      mode: "action",
      subtitle: "calling now",
      fields: [
        { label: "for", value: "Aanya" },
        { label: "goal", value: "book visit · ask diagnostic fee" },
        { label: "started", value: "0:42 ago" },
      ],
      calls: [
        {
          id: "c1",
          person: "Marco",
          role: "West Bay HVAC",
          phone: "(415) 555-0142",
          status: "connected",
          durationSec: 42,
        },
      ],
      timeline: [
        t("spawned", "You handed this off from WhatsApp", "2m ago"),
        t("dialed", "Dialed Marco at West Bay HVAC", "1m ago"),
        t("connected", "Connected - Asmi is on the call", "now"),
      ],
      chat: [asmi("i'm on with marco now. won't share the live transcript - i'll bring back the outcome when we wrap.")],
    }),

    // 2 ─ Research with map (SF restaurants)
    base({
      id: "dinner-sf",
      title: "Dinner in SF for 5",
      origin: "imessage",
      status: "live",
      mode: "research",
      subtitle: "5 spots within 1.4 mi",
      fields: [
        { label: "party", value: "5 · Fri 7:30pm" },
        { label: "vibe", value: "lively, not loud" },
        { label: "budget", value: "$$–$$$" },
      ],
      places: [
        { id: "p1", name: "Nopa", cuisine: "California", rating: 4.6, price: "$$$", x: 0.22, y: 0.34, distance: "0.4 mi", vibe: "buzzy" },
        { id: "p2", name: "Rintaro", cuisine: "Izakaya", rating: 4.7, price: "$$$", x: 0.58, y: 0.46, distance: "0.9 mi", vibe: "warm" },
        { id: "p3", name: "Foreign Cinema", cuisine: "Mediterranean", rating: 4.5, price: "$$$", x: 0.74, y: 0.62, distance: "1.1 mi", vibe: "courtyard" },
        { id: "p4", name: "Liholiho Yacht Club", cuisine: "Hawaiian", rating: 4.6, price: "$$$", x: 0.38, y: 0.68, distance: "0.7 mi", vibe: "fun" },
        { id: "p5", name: "Zuni Café", cuisine: "Bistro", rating: 4.5, price: "$$$", x: 0.46, y: 0.24, distance: "0.5 mi", vibe: "classic", status: "shortlist" },
      ],
      chat: [asmi("tap a pin to peek. shortlist a few - i'll call them in parallel and grab the first 7:30 that holds 5.")],
    }),

    // 3 ─ Parallel calls (plumbers)
    base({
      id: "plumber-sat",
      title: "Plumber for Saturday",
      origin: "web",
      status: "live",
      mode: "research",
      subtitle: "5 picks · choose who to call",
      parallel: true,
      fields: [
        { label: "issue", value: "kitchen sink slow drain" },
        { label: "window", value: "Sat 9am–1pm" },
      ],
      options: [
        { id: "pl-1", title: "Mike's Plumbing", subtitle: "4.8 · Mission · same-day", price: "$95 visit", badge: "open now", priority: "high", selected: true },
        { id: "pl-2", title: "Bay Drain Pros", subtitle: "4.6 · SoMa", price: "$110 visit", badge: "weekends" },
        { id: "pl-3", title: "RotoFlow SF", subtitle: "4.7 · Bernal", price: "$85 visit", badge: "fast", priority: "med", selected: true },
        { id: "pl-4", title: "ACE Plumbing", subtitle: "4.5 · citywide", price: "$120 visit" },
        { id: "pl-5", title: "Bernie's Drains", subtitle: "4.9 · indie", price: "$90 visit", badge: "trusted", priority: "low" },
      ],
      calls: [
        { id: "p-a", person: "Mike's Plumbing", role: "(415) 555-0188", status: "connected", durationSec: 28 },
        { id: "p-b", person: "Bay Drain Pros", role: "(415) 555-0211", status: "voicemail", result: "left callback message", nextAction: { kind: "callback", inMinutes: 10, note: "retry at 11:42am" } },
        { id: "p-c", person: "RotoFlow SF", role: "(415) 555-0249", status: "ringing" },
      ],
      timeline: [
        t("spawned", "Found 5 plumbers nearby", "3m ago"),
      ],
      chat: [asmi("tap the ones worth calling. swipe right to mark high priority. tap 'any works' if you don't care who.")],
    }),

    // 4 ─ Done (history)
    base({
      id: "rx-refill",
      title: "Refill prescription",
      origin: "imessage",
      status: "done",
      mode: "done",
      subtitle: "wrapped · 4:08 PM",
      fields: [
        { label: "pharmacy", value: "Walgreens · Mission" },
        { label: "ready by", value: "today 4pm" },
        { label: "rx", value: "#5582" },
      ],
      calls: [{ id: "rx-1", person: "Walgreens Mission", status: "success", durationSec: 124, result: "Confirmed pickup window" }],
      artifacts: [art("confirmation", "Pickup confirmed", "Walgreens · Mission St · ready by 4:00 PM. Rx #5582.")],
      timeline: [t("wrapped", "All done - confirmation sent to you", "1h ago")],
    }),

    // 5 ─ Scheduled message
    base({
      id: "dad-checkin",
      title: "Dad - weekly check-in",
      origin: "whatsapp",
      status: "waiting",
      mode: "action",
      subtitle: "queued · Sunday 11:00 AM",
      fields: [
        { label: "who", value: "Dad" },
        { label: "when", value: "Sun 11:00 AM" },
        { label: "topic", value: "back · grandkids photos" },
      ],
      thread: {
        with: "Dad",
        channel: "whatsapp",
        lines: [
          { id: uid(), role: "asmi", text: "Draft: 'Hey dad - quick check-in. How's the back this week? Aanya sent over photos from Saturday 💛'", ts: "draft" },
        ],
      },
      timeline: [t("spawned", "Scheduled from your weekly routine", "6h ago"), t("message_sent", "Will fire Sunday at 11am", "queued")],
      chat: [asmi("i'll send the draft sunday at 11. tweak the wording anytime.")],
    }),

    // 6 ─ Voicemail → callback scheduled
    base({
      id: "insurance",
      title: "Insurance claim follow-up",
      origin: "web",
      status: "live",
      mode: "action",
      subtitle: "voicemail · callback in 10 min",
      fields: [
        { label: "claim", value: "#CLM-44219" },
        { label: "agent", value: "Sarah · ext 412" },
        { label: "held for", value: "14 min" },
      ],
      calls: [
        { id: "ins-1", person: "Sarah (Allstate)", role: "ext 412", status: "voicemail", durationSec: 840, result: "Held 14m → voicemail", nextAction: { kind: "callback", inMinutes: 10, note: "retry at 2:14 PM" } },
      ],
      timeline: [
        t("dialed", "Dialed Allstate main line", "20m ago"),
        t("connected", "Transferred to Sarah's queue", "16m ago"),
        t("voicemail", "Went to voicemail after 14m hold", "2m ago"),
        t("callback_scheduled", "Retry queued for 2:14 PM", "now"),
        t("message_sent", "Texted Sarah: 'tried at 2:00 - will retry shortly'", "now"),
      ],
      artifacts: [art("message", "Text sent to Sarah", "Hi Sarah - tried claim #CLM-44219 at 2:00. Will retry at 2:14. Available till 4 PM.")],
      chat: [asmi("she didn't pick up. i texted her, and i'll redial in 10. want me to escalate to a supervisor instead?")],
    }),

    // 7 ─ Research with options + priority
    base({
      id: "gift-mom",
      title: "Birthday gift for mom",
      origin: "imessage",
      status: "live",
      mode: "research",
      subtitle: "6 picks · set priority or let asmi choose",
      fields: [
        { label: "occasion", value: "60th · next Sat" },
        { label: "budget", value: "≤ $180" },
        { label: "ships by", value: "Thu" },
      ],
      decisionPrompt: "tag priorities on the ones you love. asmi blends ratings, ship time, and your taste.",
      options: [
        { id: "g1", title: "Olive wood cheese board", subtitle: "Made in Florence", price: "$94", badge: "ships Tue", priority: "high", selected: true },
        { id: "g2", title: "Linen robe - sage", subtitle: "Parachute Home", price: "$148", badge: "in stock", priority: "med" },
        { id: "g3", title: "Watercolor class for two", subtitle: "Mission · Sat 10am", price: "$120", badge: "1 seat left" },
        { id: "g4", title: "Aesop hand & body trio", subtitle: "Resurrection set", price: "$85", priority: "low" },
        { id: "g5", title: "Custom photo book", subtitle: "Artifact Uprising · 60 pgs", price: "$95", badge: "needs photos" },
        { id: "g6", title: "Le Creuset braiser 3.5qt", subtitle: "Cerise", price: "$170", badge: "ships Wed", selected: true },
      ],
      chat: [asmi("tap a priority chip - high, med, low. multi-select what's in the running. i can also just decide.")],
    }),

    // 8 ─ Sequence: call → voicemail → email
    base({
      id: "gym-cancel",
      title: "Cancel gym membership",
      origin: "web",
      status: "live",
      mode: "action",
      subtitle: "called → voicemail → emailed",
      fields: [
        { label: "member", value: "you · since 2021" },
        { label: "policy", value: "30-day notice" },
        { label: "saves", value: "$89/mo" },
      ],
      calls: [
        { id: "gy-1", person: "Fitness SF - Mission desk", status: "voicemail", durationSec: 64, result: "Left message · no callback in 24h" },
      ],
      timeline: [
        t("dialed", "Called Mission front desk", "yesterday"),
        t("voicemail", "Voicemail - left request", "yesterday"),
        t("email_sent", "Sent formal cancellation email", "10m ago"),
        t("wrapped", "Awaiting written confirmation", "now"),
      ],
      artifacts: [
        art("email", "Cancellation email sent", "To: cancellations@fitnesssf.com - formal 30-day notice citing policy §4.2, effective Aug 18. Requested written confirmation.", "delivered"),
      ],
      chat: [asmi("phone route was dead. email gives us a paper trail - that's what they need anyway for the 30-day notice.")],
    }),

    // 9 ─ Scheduling grid (multi-person)
    base({
      id: "dentist",
      title: "Family dentist - coordinate 3",
      origin: "web",
      status: "live",
      mode: "research",
      subtitle: "finding 1 slot that fits all three",
      fields: [
        { label: "people", value: "you · partner · kid" },
        { label: "office", value: "Dr. Chen · Noe Valley" },
      ],
      scheduling: {
        people: ["you", "partner", "kid"],
        slots: [
          { id: "s1", label: "Tue 9:00", available: [true, true, false] },
          { id: "s2", label: "Tue 3:30", available: [false, true, true] },
          { id: "s3", label: "Wed 10:00", available: [true, true, true], chosen: true },
          { id: "s4", label: "Thu 4:30", available: [true, false, true] },
          { id: "s5", label: "Fri 9:30", available: [true, true, true] },
        ],
      },
      chat: [asmi("wed 10 lights up green for all three. lock it?")],
    }),

    // 10 ─ Negotiation result
    base({
      id: "cable-bill",
      title: "Negotiate cable bill",
      origin: "web",
      status: "done",
      mode: "done",
      subtitle: "saved $42/mo · 18 min call",
      fields: [
        { label: "before", value: "$129/mo" },
        { label: "after", value: "$87/mo" },
        { label: "term", value: "12 mo locked" },
      ],
      calls: [{ id: "cb-1", person: "Xfinity retention", status: "success", durationSec: 1080, result: "Retention offer accepted" }],
      artifacts: [
        art("savings", "Saved $42/mo · $504/yr", "Retention promo applied - Performance Pro plan, $87/mo for 12 months. Confirmation #XF-991042."),
        art("summary", "Call summary", "Asked for retention. Threatened churn politely. Agent offered $87 with no contract. Accepted."),
      ],
      timeline: [t("wrapped", "Promo applied · confirmation in inbox", "2h ago")],
    }),

    // 11 ─ Vendor quote table
    base({
      id: "dog-walker",
      title: "Dog walker - Mission",
      origin: "imessage",
      status: "live",
      mode: "research",
      subtitle: "4 quotes in · 1 pending",
      fields: [
        { label: "dog", value: "Mochi · 22 lb" },
        { label: "schedule", value: "M/W/F midday" },
      ],
      quotes: [
        { id: "q1", vendor: "Wag · pro tier", rating: 4.7, price: "$28 / walk", availability: "starts Mon", status: "received" },
        { id: "q2", vendor: "Lila (indie)", rating: 4.9, price: "$32 / walk", availability: "starts Wed", note: "trial walk free", status: "received" },
        { id: "q3", vendor: "Mission Pups", rating: 4.6, price: "$25 / walk", availability: "starts Mon", status: "received" },
        { id: "q4", vendor: "Rover · Sasha P.", rating: 4.8, price: "-", availability: "-", status: "pending" },
      ],
      chat: [asmi("lila's the highest-rated but slowest start. mission pups is cheapest. shall i book trials with two?")],
    }),

    // 12 ─ Pure message thread (no call)
    base({
      id: "amazon-return",
      title: "Return Amazon order",
      origin: "web",
      status: "live",
      mode: "action",
      subtitle: "chatting with support",
      fields: [
        { label: "order", value: "#114-2298" },
        { label: "item", value: "Kettle · defective" },
      ],
      thread: {
        with: "Amazon support",
        channel: "imessage",
        lines: [
          { id: uid(), role: "asmi", text: "Hi - requesting return + refund for order #114-2298. Kettle arrived with a cracked base.", ts: "2:01 PM" },
          { id: uid(), role: "them", text: "Sorry about that! I can issue a prepaid label and refund on drop-off. Photos for our records?", ts: "2:03 PM" },
          { id: uid(), role: "asmi", text: "Attached 2 photos. Drop-off at UPS - any nearest to 94110?", ts: "2:04 PM" },
          { id: uid(), role: "them", text: "Label generated. UPS Mission @ 24th will be closest. Refund in 3–5 days after scan.", ts: "2:05 PM" },
        ],
      },
      artifacts: [art("receipt", "Return label", "UPS prepaid · tracking 1Z999AA10123456784 · drop at UPS Mission @ 24th.")],
      chat: [asmi("label's in your inbox. drop it any time this week.")],
    }),

    // 13 ─ Parallel quote dashboard (contractors)
    base({
      id: "contractors",
      title: "Bathroom remodel - 3 quotes",
      origin: "web",
      status: "live",
      mode: "action",
      subtitle: "3 contractors · all in flight",
      parallel: true,
      fields: [
        { label: "scope", value: "guest bath · full" },
        { label: "site visit", value: "this week" },
      ],
      calls: [
        { id: "ct-1", person: "Bayview Build", status: "success", durationSec: 312, result: "Site visit Thu 10am · ballpark $18–24k" },
        { id: "ct-2", person: "Reform & Co", status: "connected", durationSec: 96 },
        { id: "ct-3", person: "SF Reno Group", status: "queued" },
      ],
      quotes: [
        { id: "ctq1", vendor: "Bayview Build", price: "$18–24k", availability: "Thu site visit", status: "received" },
        { id: "ctq2", vendor: "Reform & Co", price: "-", availability: "-", status: "pending" },
        { id: "ctq3", vendor: "SF Reno Group", price: "-", availability: "-", status: "pending" },
      ],
      chat: [asmi("first quote's in. i'll line them up side by side once all three answer.")],
    }),

    // 14 ─ Multi-task itinerary
    base({
      id: "tahoe",
      title: "Weekend in Tahoe",
      origin: "imessage",
      status: "live",
      mode: "action",
      subtitle: "4 sub-tasks · 2 done",
      fields: [
        { label: "dates", value: "Fri–Sun" },
        { label: "party", value: "4 adults · 1 dog" },
      ],
      checklist: [
        { id: "ch1", label: "Cabin booked", status: "done", detail: "Airbnb · West Shore · $640 total" },
        { id: "ch2", label: "Rental car held", status: "done", detail: "Hertz · SUV · pickup SFO 5pm" },
        { id: "ch3", label: "Saturday dinner reservation", status: "doing", detail: "calling Sunnyside · 7:30 for 4" },
        { id: "ch4", label: "Trail permits", status: "todo", detail: "Eagle Lake - opens 7am Fri" },
      ],
      chat: [asmi("two locked. i'm on with sunnyside right now - permits queue opens friday morning.")],
    }),

    // 15 ─ Sequential calls (first available wins)
    base({
      id: "haircut",
      title: "Haircut today",
      origin: "whatsapp",
      status: "live",
      mode: "research",
      subtitle: "4 salons · pick a few to try",
      fields: [
        { label: "window", value: "today 4–7pm" },
        { label: "stylist", value: "anyone good" },
      ],
      options: [
        { id: "hc-1", title: "Edo Salon", subtitle: "Hayes · 4.7", price: "$65", badge: "stylist mid", priority: "high" },
        { id: "hc-2", title: "Public Barber", subtitle: "Mission · 4.6", price: "$45", badge: "walk-in", selected: true },
        { id: "hc-3", title: "Peoples Barber", subtitle: "Pac Heights · 4.8", price: "$55" },
        { id: "hc-4", title: "Fellow Barber", subtitle: "Lower Haight · 4.5", price: "$50", badge: "today only" },
      ],
      timeline: [t("spawned", "Pulled 4 nearby salons", "1m ago")],
      chat: [asmi("tap any to add. i'll call them in priority order until one says yes for tonight.")],
    }),
  ];
}

// scripted spawn for new task composer
export function scriptedSpawn(prompt: string): Canvas {
  const lower = prompt.toLowerCase();
  const isResearch = /find|best|near|options|compare|search/.test(lower);
  return {
    id: uid(),
    title: prompt.length > 56 ? prompt.slice(0, 54) + "…" : prompt,
    status: "live",
    mode: isResearch ? "research" : "action",
    origin: "web",
    subtitle: isResearch ? "researching…" : "spinning up…",
    createdAt: Date.now(),
    fields: [
      { label: "ask", value: prompt },
      { label: "started", value: "just now" },
    ],
    timeline: [t("spawned", "Canvas spawned", "now")],
    artifacts: [],
    chat: [asmi(isResearch ? "looking now - i'll surface options you can act on." : "on it. i'll keep this canvas live as it moves.")],
  };
}

// gentle world tick - only nudge live call durations
export function tickWorld(c: Canvas): Canvas {
  if (c.status !== "live" || !c.calls) return c;
  let changed = false;
  const calls = c.calls.map((call) => {
    if (call.status === "connected" || call.status === "ringing" || call.status === "wrapping") {
      changed = true;
      return { ...call, durationSec: (call.durationSec ?? 0) + 1 };
    }
    return call;
  });
  return changed ? { ...c, calls } : c;
}

// re-exports so old imports keep working if any
export type { Canvas, Call, Place, Option, TimelineEvent, Artifact, ChecklistItem, Quote, SchedulingGrid, MessageThreadT, ChatMsg };
