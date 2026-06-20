import type { CanvasOrigin } from "./useCanvases";
import { Globe, MessageCircle, MessageSquare } from "lucide-react";

const MAP: Record<CanvasOrigin, { text: string; color: string; Icon: typeof Globe }> = {
  web:      { text: "web",      color: "#6B5B8A", Icon: Globe },
  whatsapp: { text: "whatsapp", color: "#1F7A4D", Icon: MessageCircle },
  imessage: { text: "imessage", color: "#1671C8", Icon: MessageSquare },
};

export function ChannelChip({ origin }: { origin: CanvasOrigin }) {
  const l = MAP[origin];
  const Icon = l.Icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 label-mono"
      style={{ color: l.color, background: `${l.color}12`, fontSize: 9 }}
    >
      <Icon size={10} strokeWidth={2} />
      {l.text}
    </span>
  );
}
