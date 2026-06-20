import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import type { Canvas } from "./useCanvases";
import { CanvasView } from "./Canvas";
import { Archive, ChevronRight } from "lucide-react";

export function CardStack({
  canvases,
  pastCount,
  onArchive,
  onMore,
}: {
  canvases: Canvas[];
  pastCount: number;
  onArchive: (id: string) => void;
  onMore: () => void;
}) {
  // index 0 = front card
  const [order, setOrder] = useState<string[]>(canvases.map((c) => c.id));
  // re-sync if canvases change shape
  if (order.length !== canvases.length || !canvases.every((c) => order.includes(c.id))) {
    const next = canvases.map((c) => c.id);
    if (next.join("|") !== order.join("|")) {
      // keep previous order for ids that survive
      const surviving = order.filter((id) => next.includes(id));
      const newOnes = next.filter((id) => !surviving.includes(id));
      const merged = [...newOnes, ...surviving];
      setOrder(merged);
    }
  }

  const stacked = order
    .map((id) => canvases.find((c) => c.id === id))
    .filter((c): c is Canvas => !!c);

  const sendToBack = () => {
    setOrder((o) => [...o.slice(1), o[0]]);
  };
  const bringBack = () => {
    setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl px-4">
      <div className="relative">
        <AnimatePresence initial={false}>
          {stacked.slice(0, 3).map((c, i) => (
            <StackedCard
              key={c.id}
              canvas={c}
              depth={i}
              onSwipeUp={sendToBack}
              onSwipeDown={bringBack}
              onArchive={() => onArchive(c.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* "More" — past tasks */}
      <button
        onClick={onMore}
        className="mt-6 flex w-full items-center justify-between rounded-2xl bg-transparent px-5 py-4 text-left transition-all hover:bg-black/[0.025]"
        style={{ border: "1px dashed rgba(26,24,20,0.12)" }}
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

function StackedCard({
  canvas,
  depth,
  onSwipeUp,
  onSwipeDown,
  onArchive,
}: {
  canvas: Canvas;
  depth: number;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onArchive: () => void;
}) {
  const [dragY, setDragY] = useState(0);
  const isFront = depth === 0;

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -110 || info.velocity.y < -500) {
      onSwipeUp();
    } else if (info.offset.y > 110 || info.velocity.y > 500) {
      onSwipeDown();
    }
    setDragY(0);
  };

  const scale = 1 - depth * 0.04;
  const yOffset = depth * 10;
  const opacity = 1 - depth * 0.12;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{
        opacity,
        y: yOffset,
        scale,
        zIndex: 10 - depth,
      }}
      exit={{ opacity: 0, y: -40, scale: 0.94, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      drag={isFront ? "y" : false}
      dragConstraints={{ top: -200, bottom: 200 }}
      dragElastic={0.22}
      onDrag={(_, info) => setDragY(info.offset.y)}
      onDragEnd={onEnd}
      style={{
        position: depth === 0 ? "relative" : "absolute",
        top: depth === 0 ? undefined : 0,
        left: depth === 0 ? undefined : 0,
        right: depth === 0 ? undefined : 0,
        transformOrigin: "top center",
        cursor: isFront ? "grab" : "default",
        pointerEvents: isFront ? "auto" : "none",
      }}
    >
      <div className="surface-card overflow-hidden">
        <CanvasView canvas={canvas} />
        {isFront && (
          <button
            onClick={onArchive}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[color:var(--color-ink-soft)] transition-all hover:bg-black/5"
            aria-label="archive"
          >
            <Archive size={14} />
          </button>
        )}
      </div>
      {isFront && Math.abs(dragY) > 30 && (
        <div
          className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-3 py-1"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(26,24,20,0.06)",
          }}
        >
          <span className="chip-mono">{dragY < 0 ? "↑ next card" : "↓ previous"}</span>
        </div>
      )}
    </motion.div>
  );
}
