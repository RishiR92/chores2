import type { Canvas } from "./useCanvases";

export function CanvasHeader({ canvas }: { canvas: Canvas }) {
  const chip =
    canvas.status === "live" ? { label: "live", color: "var(--color-terracotta)" } :
    canvas.status === "waiting" ? { label: "waiting", color: "var(--color-stone-dim)" } :
    { label: "done", color: "var(--color-sage-strong)" };

  return (
    <header className="flex items-start justify-between gap-6 px-7 pt-7 pb-4">
      <div>
        <div className="flex items-center gap-3">
          <h2
            className="font-serif italic text-[28px] leading-tight"
            style={{ color: "var(--color-espresso)" }}
          >
            {canvas.title}
          </h2>
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
        </div>
        <p
          className="mt-1.5 text-[13px]"
          style={{ color: "var(--color-stone)" }}
        >
          {canvas.subtitle}
        </p>
      </div>
    </header>
  );
}
