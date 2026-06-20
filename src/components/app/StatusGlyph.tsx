import { Radio, Clock3, AlertCircle, CheckCircle2, Pause } from "lucide-react";
import type { CanvasStatus } from "./useCanvases";

type Variant = "live" | "queued" | "needs" | "done" | "paused";

const MAP: Record<Variant, { Icon: typeof Radio; color: string; label: string }> = {
  live:   { Icon: Radio,         color: "#7C3AED", label: "live" },
  queued: { Icon: Clock3,        color: "#8B7DCC", label: "queued" },
  needs:  { Icon: AlertCircle,   color: "#C026D3", label: "needs you" },
  done:   { Icon: CheckCircle2,  color: "#0F766E", label: "done" },
  paused: { Icon: Pause,         color: "#64748B", label: "paused" },
};

export function variantFor(s: CanvasStatus): Variant {
  if (s === "live") return "live";
  if (s === "waiting") return "queued";
  return "done";
}

export function StatusGlyph({
  variant,
  size = 14,
  showLabel = false,
}: {
  variant: Variant;
  size?: number;
  showLabel?: boolean;
}) {
  const { Icon, color, label } = MAP[variant];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="status-glyph" data-status={variant}>
        <span className="ring" />
        <Icon size={size} color={color} strokeWidth={2} style={{ position: "relative" }} />
      </span>
      {showLabel && (
        <span className="label-mono" style={{ color, fontSize: 9.5 }}>{label}</span>
      )}
    </span>
  );
}
