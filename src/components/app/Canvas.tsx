import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Canvas as CanvasT } from "./useCanvases";
import { useCanvases } from "./useCanvases";
import { CanvasHeader } from "./CanvasHeader";
import { OptionsList } from "./OptionsList";
import { ParallelCalls } from "./ParallelCalls";
import { MapView } from "./MapView";
import { TimelineFeed } from "./TimelineFeed";
import { MessageThread } from "./MessageThread";
import { Checklist } from "./Checklist";
import { QuotesTable } from "./QuotesTable";
import { SchedulingView } from "./SchedulingView";
import { Artifacts } from "./Artifacts";

// Renamed export from `Canvas` → `CanvasView` so the file name doesn't clash
// with the `Canvas` type from useCanvases.
export function CanvasView({ canvas }: { canvas: CanvasT }) {
  const {
    togglePlaceShortlist,
    callPlace,
    toggleOptionSelected,
    setOptionPriority,
    dismissOption,
    clearOptionsState,
    anyWorks,
  } = useCanvases();

  const [showDetails, setShowDetails] = useState(false);

  // ── Determine the ONE primary block and what to collapse under "details"
  const hasOptions = !!canvas.options && canvas.options.length > 0;
  const hasOptionsSummary = !!canvas.optionsSummary;
  const hasCalls = !!canvas.calls && canvas.calls.length > 0;
  const hasPlaces = !!canvas.places && canvas.places.length > 0;
  const hasScheduling = !!canvas.scheduling;
  const hasChecklist = !!canvas.checklist && canvas.checklist.length > 0;
  const hasQuotes = !!canvas.quotes && canvas.quotes.length > 0;
  const hasThread = !!canvas.thread;
  const hasTimeline = (canvas.timeline?.length ?? 0) > 0;
  const hasArtifacts = canvas.artifacts.length > 0;

  return (
    <article className="relative">
      <CanvasHeader canvas={canvas} />

      <div className="space-y-4 px-5 pb-5 sm:px-7">
        {/* Primary block — options take precedence when present */}
        {(hasOptions || hasOptionsSummary) && (
          <OptionsList
            options={canvas.options ?? []}
            summary={canvas.optionsSummary}
            onToggle={(id) => toggleOptionSelected(canvas.id, id)}
            onPriority={(id, p) => setOptionPriority(canvas.id, id, p)}
            onDismiss={(id) => dismissOption(canvas.id, id)}
            onClearAll={() => clearOptionsState(canvas.id)}
            onAnyWorks={() => anyWorks(canvas.id)}
          />
        )}

        {!hasOptions && !hasOptionsSummary && hasCalls && (
          <ParallelCalls calls={canvas.calls!} parallel={canvas.parallel} />
        )}

        {!hasOptions && !hasOptionsSummary && !hasCalls && hasPlaces && (
          <MapView
            places={canvas.places!}
            onShortlist={(id) => togglePlaceShortlist(canvas.id, id)}
            onCall={(id) => callPlace(canvas.id, id)}
          />
        )}

        {!hasOptions && !hasOptionsSummary && !hasCalls && !hasPlaces && hasScheduling && (
          <SchedulingView grid={canvas.scheduling!} />
        )}

        {!hasOptions && !hasOptionsSummary && !hasCalls && !hasPlaces && !hasScheduling && hasChecklist && (
          <Checklist items={canvas.checklist!} />
        )}

        {!hasOptions && !hasOptionsSummary && !hasCalls && !hasPlaces && !hasScheduling && !hasChecklist && hasThread && (
          <MessageThread thread={canvas.thread!} />
        )}

        {/* Top artifact (most recent) when status = done or paused */}
        {hasArtifacts && (canvas.status === "done" || canvas.status === "waiting") && (
          <Artifacts artifacts={canvas.artifacts.slice(0, 1)} />
        )}

        {/* Latest timeline event collapsed */}
        {hasTimeline && (
          <LatestEvent text={canvas.timeline![canvas.timeline!.length - 1].text} ts={canvas.timeline![canvas.timeline!.length - 1].ts} />
        )}

        {/* Details — everything secondary, collapsed by default */}
        {(hasOptions || hasOptionsSummary) && (hasCalls || hasPlaces || hasScheduling || hasChecklist || hasThread || hasQuotes) || (hasArtifacts && canvas.status === "live") || (hasTimeline && (canvas.timeline?.length ?? 0) > 1) ? (
          <div>
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-1 py-2 text-left"
            >
              <span className="chip-mono">details</span>
              <motion.span animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} style={{ color: "var(--color-ink-soft)" }} />
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: showDetails ? "auto" : 0, opacity: showDetails ? 1 : 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {hasOptions && hasCalls && <ParallelCalls calls={canvas.calls!} parallel={canvas.parallel} />}
                {hasQuotes && <QuotesTable quotes={canvas.quotes!} />}
                {hasArtifacts && canvas.status === "live" && <Artifacts artifacts={canvas.artifacts} />}
                {hasTimeline && (canvas.timeline?.length ?? 0) > 1 && <TimelineFeed events={canvas.timeline!} />}
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function LatestEvent({ text, ts }: { text: string; ts: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl px-1 py-2">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--color-ink-soft)" }} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px]" style={{ color: "var(--color-ink-soft)" }}>
          {text}
        </div>
        <div className="chip-mono mt-0.5">{ts}</div>
      </div>
    </div>
  );
}

// Back-compat: some older callers import { Canvas } from this file.
export { CanvasView as Canvas };
