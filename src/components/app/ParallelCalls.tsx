import { motion, AnimatePresence } from "motion/react";
import type { Call } from "./useCanvases";
import { CallStepper, NextActionChip } from "./CallStepper";

export function ParallelCalls({ calls, parallel }: { calls: Call[]; parallel?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="label-mono" style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}>
          {parallel ? "in parallel" : "call queue"} · {calls.length}
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {calls.map((call) => (
            <motion.div
              key={call.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[color:var(--glass-border)] bg-white/40 p-3.5 backdrop-blur-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="min-w-0">
                  <div className="font-serif italic text-[16px] leading-tight" style={{ color: "var(--color-espresso)" }}>
                    {call.person}
                  </div>
                  {call.role && (
                    <div className="text-[11.5px]" style={{ color: "var(--color-stone)" }}>
                      {call.role}
                    </div>
                  )}
                </div>
                <CallStepper call={call} />
              </div>
              {(call.result || call.nextAction) && (
                <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[color:var(--glass-border)] pt-2">
                  {call.result && (
                    <span className="text-[12.5px]" style={{ color: "var(--color-ink)" }}>
                      → {call.result}
                    </span>
                  )}
                  {call.nextAction && <NextActionChip next={call.nextAction} />}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
