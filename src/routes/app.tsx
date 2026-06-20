import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bell, Clock } from "lucide-react";
import { CanvasesProvider, useCanvases, type OptionsAction } from "@/components/app/useCanvases";
import { CardStack } from "@/components/app/CardStack";
import { GlassDock } from "@/components/app/GlassDock";
import { MeshBackdrop } from "@/components/app/MeshBackdrop";
import { AsmiOrb } from "@/components/app/AsmiOrb";

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
      <MeshBackdrop />
      <Workspace />
    </CanvasesProvider>
  );
}

function Workspace() {
  const { canvases, activeId, setActive, close, spawn, sendChat, runOptionsAction } = useCanvases();
  const navigate = useNavigate();

  const live = useMemo(() => canvases.filter((c) => c.status !== "done"), [canvases]);
  const past = useMemo(() => canvases.filter((c) => c.status === "done"), [canvases]);

  const active = canvases.find((c) => c.id === activeId) ?? live[0];
  const liveCount = live.filter((c) => c.status === "live").length;

  const orbState: "idle" | "live" | "news" | "done" =
    active?.status === "live" ? "live" : active?.status === "done" ? "done" : "idle";

  return (
    <main className="app-shell relative w-full pb-32">
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 pb-2 pt-4 sm:px-8 sm:pt-5">
        <div className="flex items-center gap-2.5">
          <AsmiOrb size={28} state="idle" />
          <a
            href="/"
            className="text-[20px] font-semibold tracking-[-0.02em]"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
          >
            asmi
          </a>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ background: "rgba(124,58,237,0.10)", color: "#6D28D9" }}
          >
            <span className={`status-dot ${liveCount > 0 ? "live" : "queued"}`} />
            <span className="label-mono" style={{ color: "#6D28D9", fontSize: 9 }}>{liveCount} active</span>
          </span>
          <button
            onClick={() => void navigate({ to: "/app/history" })}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/50"
            aria-label="history"
          >
            <Clock size={16} strokeWidth={1.8} style={{ color: "var(--color-ink-soft)" }} />
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/50"
            aria-label="notifications"
          >
            <Bell size={16} strokeWidth={1.8} style={{ color: "var(--color-ink-soft)" }} />
          </button>
        </div>
      </header>

      <section className="relative z-10 pt-3">
        {live.length > 0 ? (
          <CardStack
            canvases={live}
            pastCount={past.length}
            onArchive={(id) => {
              close(id);
              const next = live.find((c) => c.id !== id);
              if (next) setActive(next.id);
            }}
            onMore={() => { void navigate({ to: "/app/history" }); }}
            onFrontChange={(id) => setActive(id)}
          />
        ) : (
          <Empty />
        )}
      </section>

      <GlassDock
        active={active}
        onSend={(text) => active && sendChat(active.id, text)}
        onSpawn={(text) => { const id = spawn(text); setActive(id); }}
        onRunAction={(action: OptionsAction) => active && runOptionsAction(active.id, action)}
        orbState={orbState}
      />
    </main>
  );
}

function Empty() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <div className="mx-auto mb-4 grid place-items-center"><AsmiOrb size={56} state="idle" /></div>
      <p className="text-[22px] font-semibold tracking-[-0.02em]" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>
        nothing on your plate
      </p>
      <p className="mt-2 text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
        tap the orb to hand asmi a task.
      </p>
    </div>
  );
}
