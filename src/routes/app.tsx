import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TabStrip } from "@/components/app/TabStrip";
import { Canvas } from "@/components/app/Canvas";
import { HistoryRail } from "@/components/app/HistoryRail";
import { NewTaskComposer } from "@/components/app/NewTaskComposer";
import { CanvasesProvider, useCanvases } from "@/components/app/useCanvases";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "Asmi — Workspace" },
      { name: "description", content: "Asmi workspace. A canvas spins up for every task you hand off." },
    ],
  }),
});

function AppShell() {
  return (
    <CanvasesProvider>
      <Workspace />
    </CanvasesProvider>
  );
}

function Workspace() {
  const { canvases, activeId, setActive, close, spawn } = useCanvases();
  const [composerOpen, setComposerOpen] = useState(false);
  const live = canvases.filter((c) => c.status !== "done");
  const past = canvases.filter((c) => c.status === "done");
  const active = canvases.find((c) => c.id === activeId) ?? live[0] ?? past[0];

  return (
    <main className="app-wash relative min-h-screen w-full overflow-hidden">
      {/* Background orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb orb-peach" />
        <div className="orb orb-sage" />
        <div className="orb orb-clay" />
        <div className="absolute inset-0 dot-grid opacity-40" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex flex-col gap-2 px-4 pb-2 pt-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:pt-5">
        <div className="flex items-baseline gap-2">
          <a href="/" className="font-serif italic text-[22px] leading-none" style={{ color: "var(--color-espresso)" }}>
            asmi
          </a>
          <span className="label-mono hidden sm:inline" style={{ color: "var(--color-stone-dim)", fontSize: 9 }}>
            workspace
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <TabStrip
            canvases={live}
            activeId={active?.id}
            onSelect={setActive}
            onClose={close}
            onNew={() => setComposerOpen(true)}
          />
        </div>
      </header>

      {/* Stage */}
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-stretch px-3 pb-24 pt-3 sm:px-6 sm:pt-6">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.97, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Canvas canvas={active} />
            </motion.div>
          ) : (
            <EmptyState onNew={() => setComposerOpen(true)} />
          )}
        </AnimatePresence>

        {past.length > 0 && <HistoryRail canvases={past} onReopen={setActive} />}
      </section>

      <AnimatePresence>
        {composerOpen && (
          <NewTaskComposer
            onClose={() => setComposerOpen(false)}
            onSubmit={(text) => {
              const id = spawn(text);
              setComposerOpen(false);
              setActive(id);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="canvas-card flex flex-col items-center justify-center gap-5 px-10 py-24 text-center">
      <p className="font-serif italic text-[28px]" style={{ color: "var(--color-espresso)" }}>
        nothing on your plate.
      </p>
      <p className="text-[14px]" style={{ color: "var(--color-stone)" }}>
        hand asmi a task — a new canvas will spin up for it.
      </p>
      <button onClick={onNew} className="btn-pill mt-3">
        + new task
      </button>
    </div>
  );
}
