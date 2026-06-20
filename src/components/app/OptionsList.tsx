import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { Check, ChevronRight } from "lucide-react";
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
      <button
        onClick={onClearAll}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left"
        style={{ background: "rgba(214,115,65,0.08)", border: "1px solid rgba(214,115,65,0.2)" }}
      >
        <div>
          <div className="text-[14px] font-medium" style={{ color: "var(--color-ink)" }}>
            {summary}
          </div>
          <div className="chip-mono mt-0.5">tap to revisit</div>
        </div>
        <ChevronRight size={16} style={{ color: "var(--color-amber-deep)" }} />
      </button>
    );
  }

  const selected = options.filter((o) => o.selected).length;
  const high = options.filter((o) => o.priority === "high").length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onAnyWorks}
          className="rounded-full px-3 py-1.5 text-[12.5px] font-medium"
          style={{ background: "rgba(26,24,20,0.05)", color: "var(--color-ink)" }}
        >
          any works
        </button>
        {(selected > 0 || high > 0) && (
          <button onClick={onClearAll} className="chip-mono px-2 py-1">
            {selected} selected{high > 0 ? ` · ${high} high` : ""}  · clear
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
        tap to select · swipe right for high priority · swipe left to dismiss
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
    if (info.offset.x > 90) {
      onPriority(option.priority === "high" ? null : "high");
    } else if (info.offset.x < -90) {
      onDismiss();
      return;
    }
    setDragX(0);
  };

  const priorityColor =
    option.priority === "high"
      ? "var(--color-amber)"
      : option.priority === "med"
      ? "rgba(214,115,65,0.5)"
      : option.priority === "low"
      ? "rgba(26,24,20,0.2)"
      : "transparent";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -120, transition: { duration: 0.25 } }}
      className="relative"
    >
      {/* swipe backgrounds */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-between rounded-[18px] px-5"
        style={{ opacity: Math.min(1, Math.abs(dragX) / 90) }}
      >
        <span
          className="chip-mono"
          style={{ color: "var(--color-amber-deep)", opacity: dragX > 0 ? 1 : 0 }}
        >
          ↑ high priority
        </span>
        <span
          className="chip-mono"
          style={{ color: "var(--color-stone)", opacity: dragX < 0 ? 1 : 0 }}
        >
          dismiss →
        </span>
      </div>

      <motion.button
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.18}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onDragEnd={onEnd}
        onClick={onToggle}
        className={`soft-row relative flex w-full items-center gap-3 px-4 py-3 text-left ${
          option.selected ? "is-selected" : ""
        }`}
        style={{ touchAction: "pan-y" }}
      >
        {/* priority rail */}
        <span
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
          style={{ background: priorityColor }}
        />

        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>
            {option.title}
          </div>
          {(option.subtitle || option.price || option.badge) && (
            <div className="mt-0.5 flex items-center gap-2 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
              {option.price && <span className="font-mono">{option.price}</span>}
              {option.subtitle && <span className="truncate">· {option.subtitle}</span>}
              {option.badge && (
                <span className="chip-mono" style={{ opacity: 0.8 }}>
                  · {option.badge}
                </span>
              )}
            </div>
          )}
        </div>

        <span
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all"
          style={{
            background: option.selected ? "var(--color-amber)" : "transparent",
            border: option.selected ? "none" : "1.5px solid rgba(26,24,20,0.15)",
            color: "white",
          }}
        >
          {option.selected && <Check size={13} strokeWidth={2.5} />}
        </span>
      </motion.button>
    </motion.div>
  );
}
