import { motion } from "motion/react";
import type { Canvas as CanvasT } from "./useCanvases";
import { useCanvases } from "./useCanvases";
import { CanvasHeader } from "./CanvasHeader";
import { TaskState } from "./TaskState";
import { CallViz } from "./CallViz";
import { Artifacts } from "./Artifacts";
import { InlineChat } from "./InlineChat";

export function Canvas({ canvas }: { canvas: CanvasT }) {
  const { sendChat } = useCanvases();
  return (
    <article className="glass-card relative overflow-hidden">
      <CanvasHeader canvas={canvas} />

      <div className="px-7 pb-2">
        <TaskState fields={canvas.fields} />
      </div>

      {canvas.kind === "call" && canvas.transcript.length > 0 && (
        <div className="px-7 pt-5">
          <CallViz canvas={canvas} />
        </div>
      )}

      {canvas.artifacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-7 pt-5"
        >
          <Artifacts artifacts={canvas.artifacts} />
        </motion.div>
      )}

      <div className="mt-6 border-t border-[color:var(--glass-border)] bg-white/20 px-7 py-4 backdrop-blur-md">
        <InlineChat
          chat={canvas.chat}
          onSend={(text) => sendChat(canvas.id, text)}
          status={canvas.status}
        />
      </div>
    </article>
  );
}
