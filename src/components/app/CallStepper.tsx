import { motion } from "motion/react";
import { Phone, PhoneOff, Voicemail, CheckCircle2, Loader2, Clock, RotateCw, Mail, MessageSquare, PauseCircle } from "lucide-react";
import type { Call } from "./useCanvases";

const STEPS: { key: Call["status"]; label: string }[] = [
  { key: "queued",    label: "queued" },
  { key: "dialing",   label: "dialing" },
  { key: "ringing",   label: "ringing" },
  { key: "connected", label: "on call" },
  { key: "wrapping",  label: "wrapping" },
];

const TERMINAL: Record<string, { label: string; tone: "good" | "bad" | "neutral"; Icon: typeof Phone }> = {
  success:   { label: "success",      tone: "good",    Icon: CheckCircle2 },
  voicemail: { label: "voicemail",    tone: "neutral", Icon: Voicemail },
  failed:    { label: "couldn't reach", tone: "bad",   Icon: PhoneOff },
};

export function CallStepper({ call, compact = false }: { call: Call; compact?: boolean }) {
  const terminal = TERMINAL[call.status];
  const currentIdx = STEPS.findIndex((s) => s.key === call.status);

  if (terminal) {
    const tone = terminal.tone;
    const color = tone === "good" ? "#0F766E" : tone === "bad" ? "#E64B6E" : "#6B5B8A";
    const bg    = tone === "good" ? "rgba(94,234,212,0.18)" : tone === "bad" ? "rgba(230,75,110,0.12)" : "rgba(124,58,237,0.07)";
    const Icon = terminal.Icon;
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: bg, color }}>
        <Icon size={12} strokeWidth={2} />
        <span className="label-mono" style={{ fontSize: 9.5, color }}>{terminal.label}</span>
        {call.durationSec ? <span className="font-mono text-[10px] opacity-70">{fmt(call.durationSec)}</span> : null}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${compact ? "" : "flex-wrap"}`}>
      {STEPS.map((s, i) => {
        const active = i === currentIdx;
        const passed = i < currentIdx;
        return (
          <div key={s.key} className="flex items-center gap-1.5">
            <motion.span
              animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
              className="grid place-items-center rounded-full"
              style={{
                width: active ? 22 : 16,
                height: active ? 22 : 16,
                background: active
                  ? "linear-gradient(135deg,#7C3AED,#E64BFF)"
                  : passed ? "#5EEAD4" : "rgba(124,58,237,0.10)",
                color: "white",
                boxShadow: active ? "0 0 0 4px rgba(124,58,237,0.18)" : undefined,
              }}
            >
              {active ? <Loader2 size={10} className="animate-spin" />
                : passed ? <CheckCircle2 size={9} strokeWidth={2.5} />
                : <span className="block h-1 w-1 rounded-full bg-current opacity-40" />}
            </motion.span>
            {!compact && (
              <span className="label-mono" style={{ fontSize: 9, color: active ? "var(--color-ink)" : "var(--color-ink-muted)" }}>
                {s.label}
              </span>
            )}
            {i < STEPS.length - 1 && (
              <span className="block h-px w-3" style={{ background: passed ? "#5EEAD4" : "rgba(124,58,237,0.15)" }} />
            )}
          </div>
        );
      })}
      {call.durationSec ? (
        <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px]" style={{ color: "var(--color-ink-soft)" }}>
          <Clock size={9} /> {fmt(call.durationSec)}
        </span>
      ) : null}
    </div>
  );
}

export function NextActionChip({ next }: { next: NonNullable<Call["nextAction"]> }) {
  const map = {
    callback: { Icon: RotateCw,      label: `retry in ${next.kind === "callback" ? next.inMinutes : 0}m` },
    message:  { Icon: MessageSquare, label: "text sent" },
    email:    { Icon: Mail,          label: "email sent" },
    wait_user:{ Icon: PauseCircle,   label: "waiting on you" },
  } as const;
  const { Icon, label } = map[next.kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px]"
      style={{ background: "rgba(124,58,237,0.10)", color: "#6D28D9", border: "1px solid rgba(124,58,237,0.18)" }}
    >
      <Icon size={10} strokeWidth={2} />
      {label}
    </span>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
