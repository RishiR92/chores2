import { motion } from "motion/react";
import type { Canvas as CanvasT } from "./useCanvases";
import { useCanvases } from "./useCanvases";
import { CanvasHeader } from "./CanvasHeader";
import { TaskState } from "./TaskState";
import { ParallelCalls } from "./ParallelCalls";
import { MapView } from "./MapView";
import { OptionsGrid } from "./OptionsGrid";
import { TimelineFeed } from "./TimelineFeed";
import { MessageThread } from "./MessageThread";
import { Checklist } from "./Checklist";
import { QuotesTable } from "./QuotesTable";
import { SchedulingView } from "./SchedulingView";
import { Artifacts } from "./Artifacts";
import { InlineChat } from "./InlineChat";

export function Canvas({ canvas }: { canvas: CanvasT }) {
  const { sendChat, togglePlaceShortlist, callPlace, setOptionPriority, toggleOptionSelected } = useCanvases();

  const hasTimeline = (canvas.timeline?.length ?? 0) > 0;
  const hasArtifacts = canvas.artifacts.length > 0;

  return (
    <article className="canvas-card relative overflow-hidden">
      <CanvasHeader canvas={canvas} />

      {canvas.fields && canvas.fields.length > 0 && (
        <div className="px-5 pb-2 sm:px-7">
          <TaskState fields={canvas.fields} />
        </div>
      )}

      <div className="space-y-5 px-5 pb-5 pt-3 sm:px-7">
        {canvas.places && (
          <MapView
            places={canvas.places}
            onShortlist={(id) => togglePlaceShortlist(canvas.id, id)}
            onCall={(id) => callPlace(canvas.id, id)}
          />
        )}

        {canvas.options && (
          <OptionsGrid
            options={canvas.options}
            decisionPrompt={canvas.decisionPrompt}
            onPriority={(id, p) => setOptionPriority(canvas.id, id, p)}
            onToggle={(id) => toggleOptionSelected(canvas.id, id)}
          />
        )}

        {canvas.scheduling && <SchedulingView grid={canvas.scheduling} />}

        {canvas.checklist && <Checklist items={canvas.checklist} />}

        {canvas.quotes && <QuotesTable quotes={canvas.quotes} />}

        {canvas.calls && canvas.calls.length > 0 && (
          <ParallelCalls calls={canvas.calls} parallel={canvas.parallel} />
        )}

        {canvas.thread && <MessageThread thread={canvas.thread} />}

        {(hasArtifacts || hasTimeline) && (
          <div className="grid gap-5 md:grid-cols-2">
            {hasArtifacts && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Artifacts artifacts={canvas.artifacts} />
              </motion.div>
            )}
            {hasTimeline && <TimelineFeed events={canvas.timeline!} />}
          </div>
        )}
      </div>

      <div className="border-t border-[color:var(--glass-border)] bg-white/30 px-5 py-3 backdrop-blur-md sm:px-7 sm:py-4">
        <InlineChat
          chat={canvas.chat}
          onSend={(text) => sendChat(canvas.id, text)}
          status={canvas.status}
        />
      </div>
    </article>
  );
}
