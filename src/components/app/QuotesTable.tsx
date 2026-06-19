import { Star } from "lucide-react";
import type { Quote } from "./useCanvases";

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-white/40 backdrop-blur-xl">
      <div className="label-mono grid grid-cols-[1.6fr_0.6fr_0.9fr_0.9fr_0.5fr] gap-2 border-b border-[color:var(--glass-border)] px-3 py-2" style={{ color: "var(--color-stone-dim)", fontSize: 9 }}>
        <span>vendor</span>
        <span>rating</span>
        <span>price</span>
        <span>start</span>
        <span>status</span>
      </div>
      <div className="divide-y divide-[color:var(--glass-border)]">
        {quotes.map((q) => (
          <div key={q.id} className="grid grid-cols-[1.6fr_0.6fr_0.9fr_0.9fr_0.5fr] items-center gap-2 px-3 py-2.5">
            <div className="min-w-0">
              <div className="truncate text-[13px]" style={{ color: "var(--color-espresso)" }}>{q.vendor}</div>
              {q.note && <div className="truncate text-[10.5px]" style={{ color: "var(--color-stone)" }}>{q.note}</div>}
            </div>
            <div className="flex items-center gap-1 text-[11.5px]" style={{ color: "var(--color-stone)" }}>
              {q.rating ? (<><Star size={10} className="fill-current" style={{ color: "var(--color-clay)" }} />{q.rating}</>) : "—"}
            </div>
            <div className="font-mono text-[11.5px]" style={{ color: "var(--color-ink)" }}>{q.price}</div>
            <div className="text-[11.5px]" style={{ color: "var(--color-stone)" }}>{q.availability}</div>
            <div>
              <span
                className="label-mono rounded-full px-1.5 py-0.5"
                style={{
                  fontSize: 8.5,
                  background: q.status === "received" ? "rgba(139,168,136,0.2)" : q.status === "declined" ? "rgba(181,75,63,0.12)" : "rgba(44,37,32,0.06)",
                  color: q.status === "received" ? "var(--color-sage-deep)" : q.status === "declined" ? "#B54B3F" : "var(--color-stone)",
                }}
              >
                {q.status === "received" ? "in" : q.status === "declined" ? "no" : "…"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
