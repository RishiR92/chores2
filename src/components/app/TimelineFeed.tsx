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
  spawned: "#7C3AED",
  researching: "#5B5BFF",
  dialed: "#A78BFA",
  connected: "#7C3AED",
  voicemail: "#E64B6E",
  message_sent: "#0F766E",
  email_sent: "#0F766E",
  callback_scheduled: "#A78BFA",
  wrapped: "#0F766E",
  user_input: "#6B5B8A",
  handoff: "#6B5B8A",
};

export function TimelineFeed({ events }: { events: TimelineEvent[] }) {
  return (
    <div>
      <div className="label-mono mb-2" style={{ color: "var(--color-ink-muted)", fontSize: 9.5 }}>
        activity
      </div>
      <ol className="relative space-y-2 pl-4">
        <span className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: "rgba(124,58,237,0.15)" }} />
        {events.map((e) => {
          const Icon = ICON[e.kind] ?? Phone;
          const tone = TONE[e.kind];
          return (
            <li key={e.id} className="relative flex items-start gap-2.5">
              <span
                className="absolute -left-4 top-0.5 grid h-[16px] w-[16px] place-items-center rounded-full"
                style={{ background: "white", border: `1.5px solid ${tone}`, color: tone }}
              >
                <Icon size={8} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px]" style={{ color: "var(--color-ink)" }}>{e.text}</div>
                <div className="font-mono text-[9.5px]" style={{ color: "var(--color-ink-muted)" }}>{e.ts}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
