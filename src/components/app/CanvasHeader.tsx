import type { Canvas } from "./useCanvases";
import { ChannelChip } from "./ChannelChip";

export function CanvasHeader({ canvas }: { canvas: Canvas }) {
  const dotClass =
    canvas.status === "live" ? "live" : canvas.status === "waiting" ? "queued" : "done";

  const statusLine =
    canvas.status === "live"
      ? `live · ${canvas.subtitle}`
      : canvas.status === "waiting"
      ? `queued · ${canvas.subtitle}`
      : `done · ${canvas.subtitle}`;

  return (
    <header className="px-5 pt-6 pb-3 sm:px-7 sm:pt-7">
      <div className="flex items-center gap-2">
        <span className={`status-dot ${dotClass}`} />
        <ChannelChip origin={canvas.origin} />
      </div>
      <h2
        className="mt-2 text-[22px] font-medium leading-[1.2] tracking-[-0.01em] sm:text-[24px]"
        style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
      >
        {canvas.title}
      </h2>
      <div className="chip-mono mt-1.5">{statusLine}</div>
    </header>
  );
}
