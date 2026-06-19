import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";
import type { Canvas } from "./useCanvases";

export function TabStrip({
  canvases,
  activeId,
  onSelect,
  onClose,
  onNew,
}: {
  canvases: Canvas[];
  activeId?: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div className="glass-strip flex items-center gap-1 rounded-full px-1.5 py-1.5">
      <AnimatePresence initial={false}>
        {canvases.map((c) => {
          const active = c.id === activeId;
          return (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.9, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative flex items-center"
            >
              <button
                onClick={() => onSelect(c.id)}
                className={`group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] transition-all ${
                  active ? "tab-active" : "tab-idle"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <StatusDot status={c.status} />
                <span className="max-w-[180px] truncate">{c.title}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(c.id);
                  }}
                  className="ml-1 -mr-1 grid h-4 w-4 place-items-center rounded-full opacity-0 transition-opacity hover:bg-black/5 group-hover:opacity-60"
                >
                  <X size={11} />
                </span>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <button
        onClick={onNew}
        aria-label="new task"
        className="ml-1 grid h-7 w-7 place-items-center rounded-full transition-all hover:bg-black/5"
        style={{ color: "var(--color-espresso)" }}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function StatusDot({ status }: { status: Canvas["status"] }) {
  const color =
    status === "live" ? "var(--color-terracotta)" :
    status === "waiting" ? "var(--color-stone-dim)" :
    "var(--color-sage-strong)";
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: color }}
      />
      {status === "live" && (
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: color, animation: "pulse-soft 1.6s ease-in-out infinite" }}
        />
      )}
    </span>
  );
}
