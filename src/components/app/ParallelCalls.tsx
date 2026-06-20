import { motion, AnimatePresence } from "motion/react";
import type { Call } from "./useCanvases";
import { CallStepper, NextActionChip } from "./CallStepper";

export function ParallelCalls({ calls, parallel }: { calls: Call[]; parallel?: boolean }) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {calls.map((call) => (
          <motion.div
            key={call.id}
            layout
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="soft-row px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <div className="min-w-0">
                <div
                  className="text-[15px] font-medium leading-tight"
                  style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                >
                  {call.person}
                </div>
                {call.role && (
                  <div className="chip-mono mt-0.5" style={{ textTransform: "none", letterSpacing: 0 }}>
                    {call.role}
                  </div>
                )}
              </div>
              <CallStepper call={call} compact />
            </div>
            {(call.result || call.nextAction) && (
              <div className="mt-2 flex flex-wrap items-center gap-2 pt-2" style={{ borderTop: "1px solid rgba(26,24,20,0.05)" }}>
                {call.result && (
                  <span className="text-[12.5px]" style={{ color: "var(--color-ink-soft)" }}>
                    → {call.result}
                  </span>
                )}
                {call.nextAction && <NextActionChip next={call.nextAction} />}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {parallel && calls.length > 1 && (
        <p className="chip-mono px-1" style={{ opacity: 0.7 }}>
          {calls.length} in parallel
        </p>
      )}
    </div>
  );
}
