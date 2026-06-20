import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CanvasesProvider, useCanvases, type OptionsAction } from "@/components/app/useCanvases";
import { CardStack } from "@/components/app/CardStack";
import { GlassDock } from "@/components/app/GlassDock";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "Asmi — workspace" },
      { name: "description", content: "Asmi's workspace. A card for every task she's running for you." },
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
  const { canvases, activeId, setActive, close, spawn, sendChat, runOptionsAction } = useCanvases();
  const navigate = useNavigate();

  // window: today + last 2 days = live + waiting
  const live = useMemo(() => canvases.filter((c) => c.status !== "done"), [canvases]);
  const past = useMemo(() => canvases.filter((c) => c.status === "done"), [canvases]);

  // The front of the stack drives the active id (for dock context).
  // We let CardStack handle ordering internally and report the front via state.
  const [frontId, setFrontId] = useState<string | undefined>(live[0]?.id);
  const active = canvases.find((c) => c.id === (activeId ?? frontId)) ?? live[0];

  const liveCount = live.filter((c) => c.status === "live").length;

  const orbState: "idle" | "live" | "news" | "done" =
    active?.status === "live" ? "live" : active?.status === "done" ? "done" : "idle";

  return (
    <main className="app-shell relative w-full pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 pb-2 pt-4 sm:px-8 sm:pt-5">
        <a
          href="/"
          className="text-[20px] font-semibold tracking-[-0.02em]"
          style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
        >
          asmi
        </a>
        <div className="flex items-center gap-1.5">
          <span className={`status-dot ${liveCount > 0 ? "live" : "queued"}`} />
          <span className="chip-mono">{liveCount} active</span>
        </div>
      </header>

      {/* Stack */}
      <section className="relative z-10 pt-3">
        {live.length > 0 ? (
          <CardStack
            canvases={live}
            pastCount={past.length}
            onArchive={(id) => {
              close(id);
              setActive(live.find((c) => c.id !== id)?.id ?? "");
            }}
            onMore={() => navigate({ to: "/app/history" })}
            onFrontChange={setFrontId}
          />
        ) : (
          <Empty />
        )}
      </section>

      {/* Liquid glass dock */}
      <GlassDock
        active={active}
        onSend={(text) => active && sendChat(active.id, text)}
        onSpawn={(text) => {
          const id = spawn(text);
          setActive(id);
        }}
        onRunAction={(action: OptionsAction) => active && runOptionsAction(active.id, action)}
        orbState={orbState}
      />
    </main>
  );
}

function Empty() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="text-[22px] font-medium" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>
        nothing on your plate
      </p>
      <p className="mt-2 text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
        tap the orb to hand asmi a task.
      </p>
    </div>
  );
}
