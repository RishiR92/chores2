import type { CanvasOrigin } from "./useCanvases";

const LABEL: Record<CanvasOrigin, { text: string; color: string }> = {
  web: { text: "web", color: "var(--color-ink-soft)" },
  whatsapp: { text: "whatsapp", color: "#1F7A4D" },
  imessage: { text: "imessage", color: "#1671C8" },
};

export function ChannelChip({ origin }: { origin: CanvasOrigin }) {
  const l = LABEL[origin];
  return (
    <span className="chip-mono inline-flex items-center gap-1" style={{ color: l.color, opacity: 0.85 }}>
      <span className="h-1 w-1 rounded-full" style={{ background: l.color }} />
      {l.text}
    </span>
  );
}
