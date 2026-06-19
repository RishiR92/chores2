import type { CanvasOrigin } from "./useCanvases";

const LABEL: Record<CanvasOrigin, { text: string; color: string; bg: string }> = {
  web: { text: "web", color: "var(--color-stone)", bg: "rgba(44,37,32,0.06)" },
  whatsapp: { text: "via whatsapp", color: "#1F7A4D", bg: "rgba(37,211,102,0.12)" },
  imessage: { text: "via imessage", color: "#1671C8", bg: "rgba(0,122,255,0.12)" },
};

export function ChannelChip({ origin }: { origin: CanvasOrigin }) {
  const l = LABEL[origin];
  return (
    <span
      className="label-mono inline-flex items-center gap-1 rounded-full px-1.5 py-0.5"
      style={{ background: l.bg, color: l.color, fontSize: 8.5 }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: l.color }} />
      {l.text}
    </span>
  );
}
