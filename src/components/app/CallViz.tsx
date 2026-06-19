import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Canvas } from "./useCanvases";

export function CallViz({ canvas }: { canvas: Canvas }) {
  const last = canvas.transcript[canvas.transcript.length - 1];
  const speaker = last?.speaker ?? "asmi";

  return (
    <div className="flex items-stretch gap-6 rounded-2xl border border-[color:var(--glass-border)] bg-white/30 p-5 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-center gap-2.5">
        <Wave active={canvas.status === "live"} accent={speaker === "asmi"} />
        <span
          className="label-mono"
          style={{ color: speaker === "asmi" ? "var(--color-terracotta)" : "var(--color-sage-strong)", fontSize: 9.5 }}
        >
          {speaker === "asmi" ? "asmi" : "them"}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="label-mono mb-2" style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}>
          transcript
        </div>
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {canvas.transcript.slice(-4).map((line, i, arr) => (
              <motion.li
                key={`${canvas.id}-${canvas.transcriptCursor - (arr.length - 1 - i)}`}
                initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                animate={{ opacity: i === arr.length - 1 ? 1 : 0.55, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45 }}
                className="text-[14px] leading-snug"
                style={{ color: "var(--color-espresso)" }}
              >
                <span
                  className="mr-2 font-serif italic"
                  style={{ color: line.speaker === "asmi" ? "var(--color-terracotta-deep)" : "var(--color-sage-deep)" }}
                >
                  {line.speaker === "asmi" ? "asmi" : "them"}:
                </span>
                {line.text}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

function Wave({ active, accent }: { active: boolean; accent: boolean }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setPhase((p) => p + 1), 140);
    return () => clearInterval(t);
  }, [active]);

  const color = accent ? "var(--color-terracotta)" : "var(--color-sage-strong)";
  const bars = 5;
  return (
    <div className="flex h-12 w-12 items-center justify-center gap-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid var(--glass-border)" }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = active ? 6 + ((Math.sin((phase + i * 1.4) * 0.9) + 1) * 9) : 6;
        return (
          <span
            key={i}
            style={{
              width: 2.5,
              height: h,
              borderRadius: 999,
              background: color,
              transition: "height 140ms ease-in-out",
            }}
          />
        );
      })}
    </div>
  );
}
