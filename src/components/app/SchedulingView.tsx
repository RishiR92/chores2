import type { SchedulingGrid } from "./useCanvases";
import { Check, X, CalendarDays, Clock } from "lucide-react";

export function SchedulingView({ grid }: { grid: SchedulingGrid }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl" style={{ border: "1px solid rgba(124,58,237,0.10)" }}>
      <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: "rgba(124,58,237,0.08)" }}>
        <CalendarDays size={13} strokeWidth={1.8} style={{ color: "#7C3AED" }} />
        <span className="label-mono" style={{ color: "var(--color-ink-soft)", fontSize: 10 }}>
          slots · {grid.people.join(" · ")}
        </span>
      </div>
      <div
        className="grid items-center gap-2 border-b px-3 py-2"
        style={{
          gridTemplateColumns: `1fr repeat(${grid.people.length}, minmax(0, 0.6fr)) auto`,
          borderColor: "rgba(124,58,237,0.06)",
        }}
      >
        <span className="label-mono" style={{ color: "var(--color-ink-muted)", fontSize: 9 }}>slot</span>
        {grid.people.map((p) => (
          <span key={p} className="label-mono text-center" style={{ color: "var(--color-ink-muted)", fontSize: 9 }}>{p}</span>
        ))}
        <span />
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(124,58,237,0.06)" }}>
        {grid.slots.map((s) => {
          const allOk = s.available.every(Boolean);
          return (
            <div
              key={s.id}
              className="grid items-center gap-2 px-3 py-2.5"
              style={{
                gridTemplateColumns: `1fr repeat(${grid.people.length}, minmax(0, 0.6fr)) auto`,
                background: s.chosen ? "rgba(94,234,212,0.14)" : undefined,
              }}
            >
              <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "var(--color-ink)" }}>
                <Clock size={11} strokeWidth={1.8} style={{ color: "var(--color-ink-soft)" }} />
                {s.label}
              </div>
              {s.available.map((ok, i) => (
                <div key={i} className="flex justify-center">
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{
                      background: ok ? "rgba(94,234,212,0.22)" : "rgba(230,75,110,0.10)",
                      color: ok ? "#0F766E" : "#E64B6E",
                    }}
                  >
                    {ok ? <Check size={11} strokeWidth={2.5} /> : <X size={11} strokeWidth={2.5} />}
                  </span>
                </div>
              ))}
              <div>
                {allOk && (
                  <span
                    className="label-mono rounded-full px-2 py-0.5"
                    style={{
                      background: s.chosen ? "#0F766E" : "rgba(94,234,212,0.20)",
                      color: s.chosen ? "white" : "#0F766E",
                      fontSize: 8.5,
                    }}
                  >
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
