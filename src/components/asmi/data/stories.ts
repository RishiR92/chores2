import type { ChannelKind } from "../ChannelIcons";

export type Story = {
  id: string;
  setup: string;
  message: string;
  time: string;
  aftermath: string;
  channels: ChannelKind[];
};

export const STORIES: Story[] = [
  {
    id: "gym",
    setup: "you'd been putting it off since january.",
    message:
      "you're out. i called, they said come in person, so i emailed them the cancellation clause. they also snuck in one more month - refunded.",
    time: "tuesday, 10:04am",
    aftermath: "you never talked to anyone.",
    channels: ["call", "text", "email"],
  },
  {
    id: "landlord",
    setup: "your landlord read it and did nothing.",
    message:
      "your AC is on the schedule. thursday 10am, work order #4471. took 3 days and 11 messages, but he answered.",
    time: "friday, 4:22pm",
    aftermath: "it took her three days. you thought about it once.",
    channels: ["call", "text", "email"],
  },
  {
    id: "dentist",
    setup: "the tooth thing. you know the one.",
    message:
      "found one that takes your insurance and isn't 40 minutes away. thursday 4:15. i already gave them your info.",
    time: "monday, 11:31am",
    aftermath: "you have not called a dentist since 2021.",
    channels: ["call", "web"],
  },
  {
    id: "cake",
    setup: "you remembered at 11pm the night before.",
    message:
      "cake's ordered, pickup saturday 11am. the guy said happy birthday to her, i said i'd pass it on.",
    time: "saturday, 8:02am",
    aftermath: "she'll think you planned it weeks ago.",
    channels: ["call", "text"],
  },
];

// ── Section 3: watch her work ────────────────────────────────

export type WorkLine = {
  channel: ChannelKind;
  who: string;
  note: string;
  state: "working" | "dead" | "won";
  at: string;
};

export type Scenario = {
  id: string;
  tab: string;
  ask: string;
  lines: WorkLine[];
  receipt: string;
  receiptMeta: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "gym",
    tab: "cancel my gym",
    ask: "they won't let me cancel my gym, i've tried twice",
    lines: [
      { channel: "call", who: "front desk", note: "6 min hold · \"come in person\"", state: "dead", at: "9:12" },
      { channel: "call", who: "corporate line", note: "IVR → escalated to a human", state: "working", at: "9:14" },
      { channel: "text", who: "member services", note: "read ✓ · sent your member id", state: "working", at: "9:21" },
      { channel: "email", who: "billing@", note: "cancellation clause + receipt trail", state: "working", at: "9:34" },
      { channel: "web", who: "member portal", note: "form submitted", state: "won", at: "10:01" },
    ],
    receipt: "cancelled. confirmation #GX-88214.",
    receiptMeta: "they tried to charge one more month - $59 refunded.",
  },
  {
    id: "charge",
    tab: "why was i charged $60",
    ask: "there's a $60 charge on my card i didn't make",
    lines: [
      { channel: "call", who: "bank fraud line", note: "22 min hold · claim opened", state: "working", at: "day 1" },
      { channel: "email", who: "disputes team", note: "sent statement + screenshot", state: "working", at: "day 1" },
      { channel: "call", who: "the merchant", note: "voicemail, then a callback", state: "dead", at: "day 2" },
      { channel: "call", who: "inbound: bank", note: "they called back. she picked up.", state: "working", at: "day 3" },
      { channel: "web", who: "dispute portal", note: "evidence uploaded", state: "won", at: "day 3" },
    ],
    receipt: "$60 back on your card.",
    receiptMeta: "3 days, 7 touchpoints. you heard about it once.",
  },
  {
    id: "dentist",
    tab: "i need a dentist",
    ask: "i need a dentist that takes my insurance, ideally this week",
    lines: [
      { channel: "call", who: "smile co · mission", note: "no answer", state: "dead", at: "2:01" },
      { channel: "call", who: "dr. patel", note: "not in network", state: "dead", at: "2:02" },
      { channel: "call", who: "bright dental", note: "in network · nothing till june", state: "dead", at: "2:03" },
      { channel: "call", who: "harbor dental", note: "in network · had a cancellation", state: "won", at: "2:05" },
      { channel: "web", who: "new patient form", note: "filled with your info", state: "won", at: "2:09" },
    ],
    receipt: "thursday 4:15, harbor dental.",
    receiptMeta: "4 calls in 4 minutes. covered by your plan.",
  },
];

// ── Section 4: how people actually say it ────────────────────

export const CHORE_LABELS_YOUNG = [
  "cancel this thing i signed up for",
  "why was i charged $60",
  "my landlord's ghosting me",
  "i need a dentist",
  "get my prescription",
  "return this",
  "is it still in stock",
  "dinner for 6 saturday",
  "cake by friday",
  "what time do they close",
  "chase my deposit",
  "the DMV",
  "a therapist who takes my insurance",
  "get me 5 quotes",
  "book the haircut",
];
