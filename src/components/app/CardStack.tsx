import { useEffect, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { Archive, ChevronRight } from "lucide-react";
import type { Canvas } from "./useCanvases";
import { CanvasView } from "./Canvas";
import { CategoryTile } from "./CategoryTile";
import { StatusGlyph, variantFor } from "./StatusGlyph";
import { SparkleBurst } from "./Sparkle";
import { categoryFor } from "@/lib/categoryIcon";

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
  const [burst, setBurst] = useState(0);

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

  const sendToBack = () => { setOrder((o) => (o.length > 1 ? [...o.slice(1), o[0]] : o)); setBurst((b) => b + 1); };
  const bringBack = () => { setOrder((o) => (o.length > 1 ? [o[o.length - 1], ...o.slice(0, -1)] : o)); setBurst((b) => b + 1); };
  const promote = (id: string) => setOrder((o) => [id, ...o.filter((x) => x !== id)]);

  const front = stacked[0];
  const peeks = stacked.slice(1, 3);

  return (
    <div className="relative mx-auto w-full max-w-xl px-4">
      {front && (
        <FrontCard
          key={front.id}
          canvas={front}
          burstKey={burst}
          onSwipeUp={sendToBack}
          onSwipeDown={bringBack}
          onArchive={() => onArchive(front.id)}
        />
      )}

      <div className="relative -mt-3 space-y-2 px-2">
        <AnimatePresence initial={false}>
          {peeks.map((c, i) => (
            <PeekCard key={c.id} canvas={c} depth={i + 1} onTap={() => promote(c.id)} />
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onMore}
        className="mt-6 flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all hover:bg-white/40"
        style={{
          border: "1px dashed rgba(124,58,237,0.25)",
          background: "rgba(255,255,255,0.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center gap-3">
          <CategoryTile Icon={Archive} tone="violet" size="sm" />
          <div>
            <div className="text-[14px] font-medium" style={{ color: "var(--color-ink)" }}>
              {pastCount} past tasks
            </div>
            <div className="chip-mono mt-0.5">open history</div>
          </div>
        </div>
        <ChevronRight size={18} style={{ color: "#7C3AED" }} />
      </motion.button>
    </div>
  );
}

function FrontCard({
  canvas,
  burstKey,
  onSwipeUp,
  onSwipeDown,
  onArchive,
}: {
  canvas: Canvas;
  burstKey: number;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onArchive: () => void;
}) {
  const [dragY, setDragY] = useState(0);
  const variant = variantFor(canvas.status);

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -110 || info.velocity.y < -500) onSwipeUp();
    else if (info.offset.y > 110 || info.velocity.y > 500) onSwipeDown();
    setDragY(0);
  };

  const tilt = Math.max(-5, Math.min(5, dragY / 30));

  return (
    <motion.div
      key={canvas.id}
      drag="y"
      dragConstraints={{ top: -180, bottom: 180 }}
      dragElastic={0.22}
      onDrag={(_, info) => setDragY(info.offset.y)}
      onDragEnd={onEnd}
      animate={{ rotate: tilt, scale: Math.abs(dragY) > 0 ? 1.015 : 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative z-10"
      style={{ transformOrigin: "top center", cursor: "grab", touchAction: "pan-x" }}
    >
      <div className="surface-card relative overflow-hidden" data-status={canvas.status}>
        <span className="status-bar" data-status={canvas.status} />
        <CanvasView canvas={canvas} />
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onArchive}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full transition-all hover:bg-violet-50"
          style={{ color: "var(--color-ink-soft)", background: "rgba(247,244,255,0.6)" }}
          aria-label="archive"
        >
          <Archive size={14} strokeWidth={1.8} />
        </motion.button>
        <span key={burstKey} className="absolute inset-x-0 top-1/3">
          <SparkleBurst size={120} color="#E64BFF" />
        </span>
      </div>
      {Math.abs(dragY) > 30 && (
        <div
          className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-3 py-1"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(124,58,237,0.15)",
            color: "#7C3AED",
          }}
        >
          <span className="chip-mono" style={{ color: "#7C3AED" }}>
            {dragY < 0 ? "↑ next" : "↓ previous"}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function PeekCard({ canvas, depth, onTap }: { canvas: Canvas; depth: number; onTap: () => void }) {
  const variant = variantFor(canvas.status);
  const cat = categoryFor(canvas);
  const tint =
    variant === "live" ? "rgba(124,58,237,0.05)" :
    variant === "queued" ? "rgba(201,184,255,0.10)" :
    "rgba(94,234,212,0.07)";
  return (
    <motion.button
      layout
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1 - (depth - 1) * 0.15, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:translate-y-[-1px]"
      style={{
        marginInline: depth * 8,
        background: `linear-gradient(180deg, #fff, ${tint})`,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.9) inset, 0 12px 28px -18px rgba(76,29,149,0.22)",
        border: "1px solid rgba(124,58,237,0.06)",
      }}
    >
      <CategoryTile Icon={cat.Icon} tone={cat.tone} size="sm" />
      <span
        className="min-w-0 flex-1 truncate text-[14px] font-medium"
        style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
      >
        {canvas.title}
      </span>
      <StatusGlyph variant={variant} size={12} />
    </motion.button>
  );
}
