import { motion } from "motion/react";
import { Check, Flame } from "lucide-react";
import type { Option } from "./useCanvases";

const PRIORITY_CYCLE: (Option["priority"])[] = [null, "high", "med", "low"];
const PRIORITY_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  high: { bg: "rgba(194,91,63,0.16)", color: "var(--color-terracotta-deep)", label: "high" },
  med: { bg: "rgba(212,165,116,0.18)", color: "#7A5224", label: "med" },
  low: { bg: "rgba(44,37,32,0.06)", color: "var(--color-stone)", label: "low" },
};

export function OptionsGrid({
  options,
  decisionPrompt,
  onPriority,
  onToggle,
}: {
  options: Option[];
  decisionPrompt?: string;
  onPriority: (id: string, p: Option["priority"]) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {decisionPrompt && (
        <p className="text-[12.5px]" style={{ color: "var(--color-stone)" }}>
          <Flame size={11} className="mr-1 inline" style={{ color: "var(--color-terracotta)" }} />
          {decisionPrompt}
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const ps = o.priority ? PRIORITY_STYLE[o.priority] : null;
          return (
            <motion.div
              layout
              key={o.id}
              className={`group relative rounded-2xl border p-3.5 transition-all ${
                o.selected ? "border-[color:var(--color-terracotta)] bg-white/70" : "border-[color:var(--glass-border)] bg-white/40"
              }`}
            >
              <button
                onClick={() => onToggle(o.id)}
                className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full border transition-all"
                style={{
                  background: o.selected ? "var(--color-terracotta)" : "rgba(255,255,255,0.7)",
                  borderColor: o.selected ? "var(--color-terracotta)" : "var(--glass-border)",
                  color: o.selected ? "white" : "var(--color-stone-dim)",
                }}
                aria-label="select"
              >
                {o.selected && <Check size={11} />}
              </button>

              <div className="pr-7">
                <div className="font-serif italic text-[16px] leading-tight" style={{ color: "var(--color-espresso)" }}>
                  {o.title}
                </div>
                {o.subtitle && (
                  <div className="mt-0.5 text-[11.5px]" style={{ color: "var(--color-stone)" }}>
                    {o.subtitle}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {o.price && (
                    <span className="font-mono text-[11px]" style={{ color: "var(--color-ink)" }}>
                      {o.price}
                    </span>
                  )}
                  {o.badge && (
                    <span className="label-mono rounded-full bg-white/70 px-1.5 py-0.5" style={{ color: "var(--color-stone)", fontSize: 8.5 }}>
                      {o.badge}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    const i = PRIORITY_CYCLE.indexOf(o.priority ?? null);
                    onPriority(o.id, PRIORITY_CYCLE[(i + 1) % PRIORITY_CYCLE.length]);
                  }}
                  className="label-mono rounded-full px-2 py-0.5 transition-all"
                  style={{
                    background: ps?.bg ?? "transparent",
                    color: ps?.color ?? "var(--color-stone-dim)",
                    border: `1px dashed ${ps ? "transparent" : "rgba(44,37,32,0.18)"}`,
                    fontSize: 9,
                  }}
                >
                  {ps?.label ?? "set priority"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
