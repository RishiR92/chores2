import { motion } from "motion/react";
import type { CanvasField } from "./useCanvases";

export function TaskState({ fields }: { fields: CanvasField[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-4">
      {fields.map((f) => (
        <div key={f.label} className="min-w-0">
          <dt
            className="label-mono"
            style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}
          >
            {f.label}
          </dt>
          <dd className="mt-1 min-h-[20px] text-[14px]" style={{ color: "var(--color-espresso)" }}>
            {f.value ? (
              <motion.span
                key={f.value}
                initial={{ opacity: 0, y: 4, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                className="font-serif italic"
              >
                {f.value}
              </motion.span>
            ) : (
              <span className="shimmer-line" />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
