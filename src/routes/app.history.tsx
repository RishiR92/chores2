import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { CanvasesProvider, useCanvases, type Canvas } from "@/components/app/useCanvases";

export const Route = createFileRoute("/app/history")({
  component: HistoryShell,
  head: () => ({
    meta: [
      { title: "Asmi — history" },
      { name: "description", content: "Past tasks Asmi ran for you." },
    ],
  }),
});

function HistoryShell() {
  return (
    <CanvasesProvider>
      <HistoryPage />
    </CanvasesProvider>
  );
}

function HistoryPage() {
  const { canvases } = useCanvases();
  const past = canvases.filter((c) => c.status === "done");

  // group by simple bucket — for prototype, lump under "earlier"
  const groups: Record<string, Canvas[]> = { today: [], earlier: past };

  return (
    <main className="app-shell relative w-full pb-16">
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 pb-2 pt-4 sm:px-8 sm:pt-5">
        <Link
          to="/app"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
          aria-label="back"
        >
          <ChevronLeft size={18} style={{ color: "var(--color-ink)" }} />
        </Link>
        <h1
          className="text-[22px] font-medium tracking-[-0.01em]"
          style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
        >
          history
        </h1>
      </header>

      <section className="mx-auto w-full max-w-xl px-5 pt-4">
        {past.length === 0 ? (
          <p className="px-1 py-12 text-center text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
            nothing wrapped yet.
          </p>
        ) : (
          <>
            <div className="chip-mono px-1 pb-2">earlier</div>
            <ul className="space-y-2">
              {groups.earlier.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/app"
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 transition-all hover:translate-x-0.5"
                    style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 8px 20px -16px rgba(40,30,20,0.18)" }}
                  >
                    <div className="min-w-0">
                      <div
                        className="truncate text-[15px] font-medium"
                        style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                      >
                        {c.title}
                      </div>
                      <div className="chip-mono mt-0.5">done · {c.subtitle}</div>
                    </div>
                    <span className="status-dot done" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
