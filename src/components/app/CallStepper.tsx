import { motion } from "motion/react";
import { Phone, PhoneOff, Voicemail, CheckCircle2, Loader2, Clock } from "lucide-react";
import type { Call } from "./useCanvases";

const STEPS: { key: Call["status"]; label: string }[] = [
  { key: "queued", label: "queued" },
  { key: "dialing", label: "dialing" },
  { key: "ringing", label: "ringing" },
  { key: "connected", label: "on call" },
  { key: "wrapping", label: "wrapping" },
];

const TERMINAL: Record<string, { label: string; tone: "good" | "bad" | "neutral"; Icon: typeof Phone }> = {
  success: { label: "success", tone: "good", Icon: CheckCircle2 },
  voicemail: { label: "voicemail", tone: "neutral", Icon: Voicemail },
  failed: { label: "couldn't reach", tone: "bad", Icon: PhoneOff },
};

export function CallStepper({ call, compact = false }: { call: Call; compact?: boolean }) {
  const terminal = TERMINAL[call.status];
  const currentIdx = STEPS.findIndex((s) => s.key === call.status);

  if (terminal) {
    const tone = terminal.tone;
    const color = tone === "good" ? "var(--color-sage-deep)" : tone === "bad" ? "#B54B3F" : "var(--color-stone)";
    const bg = tone === "good" ? "rgba(139,168,136,0.16)" : tone === "bad" ? "rgba(181,75,63,0.12)" : "rgba(44,37,32,0.06)";
    const Icon = terminal.Icon;
    return (
      <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1" style={{ background: bg, color }}>
        <Icon size={12} />
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
              animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
              className="grid place-items-center rounded-full"
              style={{
                width: active ? 22 : 16,
                height: active ? 22 : 16,
                background: active ? "var(--color-terracotta)" : passed ? "var(--color-sage-strong)" : "rgba(44,37,32,0.08)",
                color: "white",
                boxShadow: active ? "0 0 0 4px rgba(194,91,63,0.18)" : undefined,
              }}
            >
              {active ? <Loader2 size={10} className="animate-spin" /> : passed ? <CheckCircle2 size={9} /> : <span className="block h-1 w-1 rounded-full bg-current opacity-40" />}
            </motion.span>
            {!compact && (
              <span className="label-mono" style={{ fontSize: 9, color: active ? "var(--color-espresso)" : "var(--color-stone-dim)" }}>
                {s.label}
              </span>
            )}
            {i < STEPS.length - 1 && (
              <span className="block h-px w-3" style={{ background: passed ? "var(--color-sage-strong)" : "rgba(44,37,32,0.12)" }} />
            )}
          </div>
        );
      })}
      {call.durationSec ? (
        <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px]" style={{ color: "var(--color-stone)" }}>
          <Clock size={9} /> {fmt(call.durationSec)}
        </span>
      ) : null}
    </div>
  );
}

export function NextActionChip({ next }: { next: NonNullable<Call["nextAction"]> }) {
  const label =
    next.kind === "callback" ? `↻ retry in ${next.inMinutes}m` :
    next.kind === "message" ? `✉ text sent` :
    next.kind === "email" ? `✉ email sent` :
    `⏸ waiting on you`;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px]"
      style={{ background: "rgba(212,165,116,0.18)", color: "#7A5224", border: "1px solid rgba(212,165,116,0.35)" }}
    >
      {label}
    </span>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
