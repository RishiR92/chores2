import { CheckCheck } from "lucide-react";
import type { MessageThreadT } from "./useCanvases";

export function MessageThread({ thread }: { thread: MessageThreadT }) {
  return (
    <div className="rounded-2xl bg-white/55 p-3.5 backdrop-blur-xl" style={{ border: "1px solid rgba(124,58,237,0.10)" }}>
      <div className="mb-2 flex items-center justify-between">
        <span className="label-mono" style={{ color: "var(--color-ink-muted)", fontSize: 9.5 }}>
          {thread.channel} · {thread.with}
        </span>
      </div>
      <div className="space-y-1.5">
        {thread.lines.map((line) => {
          const me = line.role === "asmi";
          return (
            <div key={line.id} className={`flex items-end gap-1.5 ${me ? "justify-end" : "justify-start"}`}>
              {!me && (
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-medium text-white"
                  style={{ background: "#A78BFA" }}
                >
                  {thread.with[0]}
                </span>
              )}
              <div
                className="max-w-[80%] rounded-2xl px-3 py-1.5 text-[13px] leading-snug"
                style={{
                  background: me ? "linear-gradient(135deg,#7C3AED,#E64BFF)" : "rgba(255,255,255,0.92)",
                  color: me ? "white" : "var(--color-ink)",
                  borderBottomRightRadius: me ? 6 : undefined,
                  borderBottomLeftRadius: !me ? 6 : undefined,
                  boxShadow: me ? "0 6px 14px -8px rgba(124,58,237,0.45)" : undefined,
                }}
              >
                {line.text}
                {line.ts && (
                  <div className="mt-0.5 flex items-center justify-end gap-1 text-[9px] opacity-70">
                    {line.ts}
                    {me && <CheckCheck size={9} />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
