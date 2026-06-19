import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { Canvas } from "./useCanvases";

export function HistoryRail({
  canvases,
  onReopen,
}: {
  canvases: Canvas[];
  onReopen: (id: string) => void;
}) {
  return (
    <div className="mt-10">
      <div className="label-mono mb-3 px-1" style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}>
        recent
      </div>
      <div className="flex flex-wrap gap-2.5">
        {canvases.map((c) => (
          <motion.button
            key={c.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onReopen(c.id)}
            className="group flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-white/30 px-3.5 py-1.5 backdrop-blur-xl transition-all hover:bg-white/55"
            style={{ color: "var(--color-stone)" }}
          >
            <span
              className="grid h-4 w-4 place-items-center rounded-full"
              style={{ background: "rgba(139,168,136,0.25)", color: "var(--color-sage-deep)" }}
            >
              <Check size={9} />
            </span>
            <span className="font-serif italic text-[13px]">{c.title}</span>
            <span className="text-[11px]" style={{ color: "var(--color-stone-dim)" }}>
              {c.subtitle}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
