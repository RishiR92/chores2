import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { CanvasesProvider, useCanvases, type Canvas } from "@/components/app/useCanvases";
import { MeshBackdrop } from "@/components/app/MeshBackdrop";
import { CategoryTile } from "@/components/app/CategoryTile";
import { StatusGlyph, variantFor } from "@/components/app/StatusGlyph";
import { categoryFor } from "@/lib/categoryIcon";

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
      <MeshBackdrop />
      <HistoryPage />
    </CanvasesProvider>
  );
}

function HistoryPage() {
  const { canvases } = useCanvases();
  const past = canvases.filter((c) => c.status === "done");

  return (
    <main className="app-shell relative w-full pb-16">
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 pb-2 pt-4 sm:px-8 sm:pt-5">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/50" aria-label="back">
          <ChevronLeft size={18} style={{ color: "var(--color-ink)" }} />
        </Link>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>
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
              {past.map((c: Canvas) => {
                const cat = categoryFor(c);
                return (
                  <li key={c.id}>
                    <Link
                      to="/app"
                      className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3.5 transition-all hover:translate-x-0.5"
                      style={{
                        boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 12px 24px -18px rgba(76,29,149,0.18)",
                        border: "1px solid rgba(124,58,237,0.06)",
                      }}
                    >
                      <CategoryTile Icon={cat.Icon} tone={cat.tone} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-medium" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>
                          {c.title}
                        </div>
                        <div className="chip-mono mt-0.5">{c.subtitle}</div>
                      </div>
                      <StatusGlyph variant={variantFor(c.status)} size={12} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
