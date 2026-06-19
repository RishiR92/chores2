import type { Canvas } from "./useCanvases";
import { ChannelChip } from "./ChannelChip";
import { Search, Zap, CheckCircle2 } from "lucide-react";

export function CanvasHeader({ canvas }: { canvas: Canvas }) {
  const chip =
    canvas.status === "live" ? { label: "live", color: "var(--color-terracotta)" } :
    canvas.status === "waiting" ? { label: "queued", color: "var(--color-stone-dim)" } :
    { label: "done", color: "var(--color-sage-strong)" };

  const ModeIcon = canvas.mode === "research" ? Search : canvas.mode === "done" ? CheckCircle2 : Zap;

  return (
    <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-3 sm:px-7 sm:pt-7 sm:pb-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className="font-serif italic text-[24px] leading-tight sm:text-[30px]"
            style={{ color: "var(--color-espresso)" }}
          >
            <span className="ink-underline">{canvas.title}</span>
          </h2>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className="label-mono inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
            style={{
              background: "rgba(255,255,255,0.55)",
              color: chip.color,
              border: "1px solid var(--glass-border)",
              fontSize: 9.5,
            }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{
                background: chip.color,
                animation: canvas.status === "live" ? "pulse-soft 1.6s ease-in-out infinite" : undefined,
              }}
            />
            {chip.label}
          </span>
          <span
            className="label-mono inline-flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{ background: "rgba(44,37,32,0.05)", color: "var(--color-stone)", fontSize: 9 }}
          >
            <ModeIcon size={9} />
            {canvas.mode}
          </span>
          <ChannelChip origin={canvas.origin} />
          <span className="text-[11.5px]" style={{ color: "var(--color-stone)" }}>
            · {canvas.subtitle}
          </span>
        </div>
      </div>
    </header>
  );
}
