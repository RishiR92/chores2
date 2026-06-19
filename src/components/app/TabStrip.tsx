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
    <div className="flex items-center gap-2">
      <div
        className="glass-strip flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-full px-1.5 py-1.5"
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`.glass-strip::-webkit-scrollbar { display: none }`}</style>
        <AnimatePresence initial={false}>
          {canvases.map((c) => {
            const active = c.id === activeId;
            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative flex shrink-0 items-center"
              >
                <button
                  onClick={() => onSelect(c.id)}
                  className={`group flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] transition-all ${
                    active ? "tab-active" : "tab-idle"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <StatusDot status={c.status} />
                  <span className="max-w-[160px] truncate">{c.title}</span>
                  {active && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose(c.id);
                      }}
                      className="ml-0.5 grid h-4 w-4 place-items-center rounded-full opacity-60 transition-opacity hover:bg-black/5 hover:opacity-100"
                    >
                      <X size={10} />
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <button
        onClick={onNew}
        aria-label="new task"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-sm transition-all hover:scale-105"
        style={{ background: "var(--color-terracotta)", boxShadow: "0 6px 16px -8px rgba(194,91,63,0.6)" }}
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
    <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inset-0 rounded-full" style={{ background: color }} />
      {status === "live" && (
        <span
          className="absolute -inset-1 rounded-full"
          style={{ border: `1px solid ${color}`, animation: "ripple 1.8s ease-out infinite" }}
        />
      )}
    </span>
  );
}
