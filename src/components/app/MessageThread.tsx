import type { MessageThreadT } from "./useCanvases";

export function MessageThread({ thread }: { thread: MessageThreadT }) {
  return (
    <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/40 p-3.5 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="label-mono" style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}>
          {thread.channel} · {thread.with}
        </span>
      </div>
      <div className="space-y-1.5">
        {thread.lines.map((line) => {
          const me = line.role === "asmi";
          return (
            <div key={line.id} className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] rounded-2xl px-3 py-1.5 text-[13px] leading-snug"
                style={{
                  background: me ? "var(--color-terracotta)" : "rgba(255,255,255,0.8)",
                  color: me ? "var(--color-cream)" : "var(--color-espresso)",
                  borderBottomRightRadius: me ? 6 : undefined,
                  borderBottomLeftRadius: !me ? 6 : undefined,
                }}
              >
                {line.text}
                {line.ts && (
                  <div className="mt-0.5 text-[9px] opacity-60">{line.ts}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
