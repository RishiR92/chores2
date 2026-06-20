import { useEffect, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import type { Canvas } from "./useCanvases";
import { CanvasView } from "./Canvas";
import { Archive, ChevronRight } from "lucide-react";

export function CardStack({
  canvases,
  pastCount,
  onArchive,
  onMore,
  onFrontChange,
}: {
  canvases: Canvas[];
  pastCount: number;
  onArchive: (id: string) => void;
  onMore: () => void;
  onFrontChange?: (id: string) => void;
}) {
  const [order, setOrder] = useState<string[]>(canvases.map((c) => c.id));

  useEffect(() => {
    const next = canvases.map((c) => c.id);
    setOrder((prev) => {
      const surviving = prev.filter((id) => next.includes(id));
      const newOnes = next.filter((id) => !surviving.includes(id));
      const merged = [...newOnes, ...surviving];
      return merged.join("|") === prev.join("|") ? prev : merged;
    });
  }, [canvases]);

  useEffect(() => {
    if (order[0] && onFrontChange) onFrontChange(order[0]);
  }, [order, onFrontChange]);

  const stacked = order
    .map((id) => canvases.find((c) => c.id === id))
    .filter((c): c is Canvas => !!c);

  const sendToBack = () => setOrder((o) => (o.length > 1 ? [...o.slice(1), o[0]] : o));
  const bringBack = () => setOrder((o) => (o.length > 1 ? [o[o.length - 1], ...o.slice(0, -1)] : o));

  const front = stacked[0];
  const peeks = stacked.slice(1, 3);

  return (
    <div className="relative mx-auto w-full max-w-xl px-4">
      {front && (
        <FrontCard
          key={front.id}
          canvas={front}
          onSwipeUp={sendToBack}
          onSwipeDown={bringBack}
          onArchive={() => onArchive(front.id)}
        />
      )}

      {/* peeks below the front card */}
      <div className="relative -mt-4 space-y-2 px-2">
        <AnimatePresence initial={false}>
          {peeks.map((c, i) => (
            <PeekCard key={c.id} canvas={c} depth={i + 1} onTap={bringBack} />
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={onMore}
        className="mt-6 flex w-full items-center justify-between rounded-2xl bg-transparent px-5 py-4 text-left transition-all hover:bg-black/[0.025]"
        style={{ border: "1px dashed rgba(26,24,20,0.14)" }}
      >
        <div>
          <div className="text-[14px] font-medium" style={{ color: "var(--color-ink)" }}>
            more · {pastCount} past tasks
          </div>
          <div className="chip-mono mt-0.5">view history</div>
        </div>
        <ChevronRight size={18} style={{ color: "var(--color-ink-soft)" }} />
      </button>
    </div>
  );
}

function FrontCard({
  canvas,
  onSwipeUp,
  onSwipeDown,
  onArchive,
}: {
  canvas: Canvas;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onArchive: () => void;
}) {
  const [dragY, setDragY] = useState(0);

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -110 || info.velocity.y < -500) onSwipeUp();
    else if (info.offset.y > 110 || info.velocity.y > 500) onSwipeDown();
    setDragY(0);
  };

  return (
    <motion.div
      layout
      key={canvas.id}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      drag="y"
      dragConstraints={{ top: -180, bottom: 180 }}
      dragElastic={0.22}
      onDrag={(_, info) => setDragY(info.offset.y)}
      onDragEnd={onEnd}
      className="relative z-10"
      style={{ transformOrigin: "top center", cursor: "grab", touchAction: "pan-x" }}
    >
      <div className="surface-card relative overflow-hidden">
        <CanvasView canvas={canvas} />
        <button
          onClick={onArchive}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[color:var(--color-ink-soft)] transition-all hover:bg-black/5"
          aria-label="archive"
        >
          <Archive size={14} />
        </button>
      </div>
      {Math.abs(dragY) > 30 && (
        <div
          className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-3 py-1"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(26,24,20,0.06)",
          }}
        >
          <span className="chip-mono">{dragY < 0 ? "↑ next card" : "↓ previous"}</span>
        </div>
      )}
    </motion.div>
  );
}

function PeekCard({ canvas, depth, onTap }: { canvas: Canvas; depth: number; onTap: () => void }) {
  const dotClass =
    canvas.status === "live" ? "live" : canvas.status === "waiting" ? "queued" : "done";
  return (
    <motion.button
      layout
      onClick={onTap}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1 - (depth - 1) * 0.18, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      className="flex w-full items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 text-left transition-all hover:translate-y-[-1px]"
      style={{
        marginInline: depth * 6,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.9) inset, 0 1px 0 rgba(0,0,0,0.02), 0 12px 24px -18px rgba(40,30,20,0.18)",
      }}
    >
      <span className={`status-dot ${dotClass}`} />
      <span
        className="min-w-0 flex-1 truncate text-[14px] font-medium"
        style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
      >
        {canvas.title}
      </span>
      <span className="chip-mono truncate" style={{ maxWidth: 120 }}>
        {canvas.subtitle}
      </span>
    </motion.button>
  );
}
