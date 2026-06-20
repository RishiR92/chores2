import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { Check, ChevronRight, Star, Trash2, Flame, Sparkles } from "lucide-react";
import type { Option } from "./useCanvases";

export function OptionsList({
  options,
  summary,
  onToggle,
  onPriority,
  onDismiss,
  onClearAll,
  onAnyWorks,
}: {
  options: Option[];
  summary?: string;
  onToggle: (id: string) => void;
  onPriority: (id: string, p: Option["priority"]) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onAnyWorks: () => void;
}) {
  if (summary) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClearAll}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.10), rgba(230,75,255,0.08))",
          border: "1px solid rgba(124,58,237,0.22)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "rgba(124,58,237,0.14)" }}>
            <Sparkles size={15} strokeWidth={1.8} style={{ color: "#7C3AED" }} />
          </span>
          <div>
            <div className="text-[14px] font-medium" style={{ color: "var(--color-ink)" }}>{summary}</div>
            <div className="chip-mono mt-0.5">tap to revisit</div>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: "#7C3AED" }} />
      </motion.button>
    );
  }

  const selected = options.filter((o) => o.selected).length;
  const high = options.filter((o) => o.priority === "high").length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAnyWorks}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium"
          style={{ background: "rgba(124,58,237,0.08)", color: "#6D28D9" }}
        >
          <Sparkles size={11} strokeWidth={2} /> any works
        </motion.button>
        {(selected > 0 || high > 0) && (
          <button onClick={onClearAll} className="chip-mono px-2 py-1">
            {selected} selected{high > 0 ? ` · ${high} high` : ""} · clear
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {options.map((o) => (
          <OptionRow
            key={o.id}
            option={o}
            onToggle={() => onToggle(o.id)}
            onPriority={(p) => onPriority(o.id, p)}
            onDismiss={() => onDismiss(o.id)}
          />
        ))}
      </AnimatePresence>
      <p className="chip-mono px-1 pt-1" style={{ opacity: 0.7 }}>
        tap to select · swipe right → priority · swipe left → dismiss
      </p>
    </div>
  );
}

function OptionRow({
  option,
  onToggle,
  onPriority,
  onDismiss,
}: {
  option: Option;
  onToggle: () => void;
  onPriority: (p: Option["priority"]) => void;
  onDismiss: () => void;
}) {
  const [dragX, setDragX] = useState(0);

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 90) onPriority(option.priority === "high" ? null : "high");
    else if (info.offset.x < -90) { onDismiss(); return; }
    setDragX(0);
  };

  const priorityColor =
    option.priority === "high" ? "#E64BFF"
    : option.priority === "med" ? "#A78BFA"
    : option.priority === "low" ? "rgba(26,11,46,0.18)"
    : "transparent";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -160, transition: { duration: 0.25 } }}
      className="relative"
    >
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-between rounded-[18px] px-5"
        style={{ opacity: Math.min(1, Math.abs(dragX) / 90) }}
      >
        <span className="inline-flex items-center gap-1.5 label-mono" style={{ color: "#C026D3", opacity: dragX > 0 ? 1 : 0, fontSize: 10 }}>
          <Star size={12} strokeWidth={2} /> high priority
        </span>
        <span className="inline-flex items-center gap-1.5 label-mono" style={{ color: "#64748B", opacity: dragX < 0 ? 1 : 0, fontSize: 10 }}>
          <Trash2 size={12} strokeWidth={2} /> dismiss
        </span>
      </div>

      <motion.button
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.18}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onDragEnd={onEnd}
        whileTap={{ scale: 0.99 }}
        onClick={onToggle}
        className={`soft-row relative flex w-full items-center gap-3 px-4 py-3 text-left ${option.selected ? "is-selected" : ""}`}
        style={{ touchAction: "pan-y" }}
      >
        <span
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
          style={{ background: priorityColor }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {option.priority === "high" && (
              <Flame size={12} strokeWidth={2} style={{ color: "#E64BFF" }} />
            )}
            <span className="truncate text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>
              {option.title}
            </span>
          </div>
          {(option.subtitle || option.price || option.badge) && (
            <div className="mt-0.5 flex items-center gap-2 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
              {option.price && <span className="font-mono" style={{ color: "#6D28D9" }}>{option.price}</span>}
              {option.subtitle && <span className="truncate">· {option.subtitle}</span>}
              {option.badge && <span className="chip-mono" style={{ opacity: 0.8 }}>· {option.badge}</span>}
            </div>
          )}
        </div>

        <motion.span
          animate={{ scale: option.selected ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.28 }}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
          style={{
            background: option.selected ? "linear-gradient(135deg,#7C3AED,#E64BFF)" : "transparent",
            border: option.selected ? "none" : "1.5px solid rgba(26,11,46,0.18)",
            color: "white",
            boxShadow: option.selected ? "0 4px 10px -4px rgba(124,58,237,0.55)" : undefined,
          }}
        >
          {option.selected && <Check size={13} strokeWidth={2.6} />}
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
