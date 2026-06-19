import type { SchedulingGrid } from "./useCanvases";
import { Check, X } from "lucide-react";

export function SchedulingView({ grid }: { grid: SchedulingGrid }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-white/40 backdrop-blur-xl">
      <div className="grid grid-cols-[1fr_repeat(var(--n),minmax(0,0.6fr))_auto] items-center gap-2 border-b border-[color:var(--glass-border)] px-3 py-2" style={{ ["--n" as never]: grid.people.length }}>
        <span className="label-mono" style={{ color: "var(--color-stone-dim)", fontSize: 9 }}>slot</span>
        {grid.people.map((p) => (
          <span key={p} className="label-mono text-center" style={{ color: "var(--color-stone-dim)", fontSize: 9 }}>{p}</span>
        ))}
        <span />
      </div>
      <div className="divide-y divide-[color:var(--glass-border)]">
        {grid.slots.map((s) => {
          const allOk = s.available.every(Boolean);
          return (
            <div
              key={s.id}
              className="grid grid-cols-[1fr_repeat(var(--n),minmax(0,0.6fr))_auto] items-center gap-2 px-3 py-2"
              style={{
                ["--n" as never]: grid.people.length,
                background: s.chosen ? "rgba(139,168,136,0.14)" : undefined,
              }}
            >
              <div className="font-serif italic text-[14px]" style={{ color: "var(--color-espresso)" }}>
                {s.label}
              </div>
              {s.available.map((ok, i) => (
                <div key={i} className="flex justify-center">
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{
                      background: ok ? "rgba(139,168,136,0.22)" : "rgba(181,75,63,0.10)",
                      color: ok ? "var(--color-sage-deep)" : "#B54B3F",
                    }}
                  >
                    {ok ? <Check size={11} /> : <X size={11} />}
                  </span>
                </div>
              ))}
              <div>
                {allOk && (
                  <span className="label-mono rounded-full px-2 py-0.5" style={{ background: s.chosen ? "var(--color-sage-strong)" : "rgba(139,168,136,0.18)", color: s.chosen ? "white" : "var(--color-sage-deep)", fontSize: 8.5 }}>
                    {s.chosen ? "picked" : "all clear"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
