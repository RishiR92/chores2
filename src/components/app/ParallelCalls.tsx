import { motion, AnimatePresence } from "motion/react";
import { Phone } from "lucide-react";
import type { Call } from "./useCanvases";
import { CallStepper, NextActionChip } from "./CallStepper";
import { CallWave } from "./Sparkle";

export function ParallelCalls({ calls, parallel }: { calls: Call[]; parallel?: boolean }) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {calls.map((call) => {
          const isLive = call.status === "connected" || call.status === "ringing" || call.status === "dialing";
          return (
            <motion.div
              key={call.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="soft-row px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                    style={{
                      background: isLive ? "rgba(124,58,237,0.12)" : "rgba(26,11,46,0.05)",
                      color: isLive ? "#7C3AED" : "var(--color-ink-soft)",
                    }}
                  >
                    {isLive ? <CallWave color="#7C3AED" size={14} /> : <Phone size={14} strokeWidth={1.8} />}
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-[15px] font-medium leading-tight"
                      style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                    >
                      {call.person}
                    </div>
                    {call.role && (
                      <div className="font-mono text-[10.5px]" style={{ color: "var(--color-ink-soft)" }}>
                        {call.role}
                      </div>
                    )}
                  </div>
                </div>
                <CallStepper call={call} compact />
              </div>
              {(call.result || call.nextAction) && (
                <div className="mt-2 flex flex-wrap items-center gap-2 pt-2" style={{ borderTop: "1px solid rgba(26,11,46,0.05)" }}>
                  {call.result && (
                    <span className="text-[12.5px]" style={{ color: "var(--color-ink-soft)" }}>→ {call.result}</span>
                  )}
                  {call.nextAction && <NextActionChip next={call.nextAction} />}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      {parallel && calls.length > 1 && (
        <p className="chip-mono px-1" style={{ opacity: 0.7 }}>
          {calls.length} in parallel
        </p>
      )}
    </div>
  );
}
