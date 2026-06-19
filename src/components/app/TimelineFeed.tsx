import { Phone, PhoneOff, Voicemail, MessageSquare, Mail, Sparkles, Clock, CheckCircle2, UserPlus, Search } from "lucide-react";
import type { TimelineEvent } from "./useCanvases";

const ICON: Record<TimelineEvent["kind"], typeof Phone> = {
  spawned: Sparkles,
  researching: Search,
  dialed: Phone,
  connected: Phone,
  voicemail: Voicemail,
  message_sent: MessageSquare,
  email_sent: Mail,
  callback_scheduled: Clock,
  wrapped: CheckCircle2,
  user_input: UserPlus,
  handoff: UserPlus,
};

const TONE: Record<TimelineEvent["kind"], string> = {
  spawned: "var(--color-stone-dim)",
  researching: "var(--color-sky)",
  dialed: "var(--color-clay)",
  connected: "var(--color-terracotta)",
  voicemail: "#B54B3F",
  message_sent: "var(--color-sage-strong)",
  email_sent: "var(--color-sage-strong)",
  callback_scheduled: "var(--color-clay)",
  wrapped: "var(--color-sage-deep)",
  user_input: "var(--color-stone)",
  handoff: "var(--color-stone)",
};

export function TimelineFeed({ events }: { events: TimelineEvent[] }) {
  return (
    <div>
      <div className="label-mono mb-2" style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}>
        activity
      </div>
      <ol className="relative space-y-2 pl-4">
        <span className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: "rgba(44,37,32,0.10)" }} />
        {events.map((e) => {
          const Icon = ICON[e.kind] ?? Phone;
          const tone = TONE[e.kind];
          return (
            <li key={e.id} className="relative flex items-start gap-2.5">
              <span
                className="absolute -left-4 top-0.5 grid h-[15px] w-[15px] place-items-center rounded-full"
                style={{ background: "var(--color-cream)", border: `1.5px solid ${tone}`, color: tone }}
              >
                <Icon size={7.5} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px]" style={{ color: "var(--color-espresso)" }}>{e.text}</div>
                <div className="font-mono text-[9.5px]" style={{ color: "var(--color-stone-dim)" }}>{e.ts}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
