import { motion } from "motion/react";
import { useState } from "react";
import { Star, Phone, Bookmark, BookmarkCheck } from "lucide-react";
import type { Place } from "./useCanvases";

export function MapView({
  places,
  onShortlist,
  onCall,
}: {
  places: Place[];
  onShortlist: (id: string) => void;
  onCall: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(places.find((p) => p.status === "shortlist")?.id ?? places[0]?.id ?? null);
  const sel = places.find((p) => p.id === selected);

  return (
    <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
      {/* map */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)]"
        style={{
          aspectRatio: "1.4 / 1",
          background:
            "radial-gradient(120% 80% at 30% 20%, #EDE3D2 0%, #DFD3BC 60%, #C9BB9F 100%)",
        }}
      >
        {/* faux streets */}
        <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 9 + 6} x2="100" y2={i * 9 + 4} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 10 + 4} y1="0" x2={i * 10 + 6} y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          ))}
          <path d="M0 50 Q 30 38 60 44 T 100 30" stroke="#8FB6C9" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 0 55 Q 35 60 70 52 T 100 58" stroke="#A6C49E" strokeWidth="3" fill="none" opacity="0.45" />
        </svg>

        {/* pins */}
        {places.map((p) => {
          const isSel = p.id === selected;
          const tone =
            p.status === "shortlist" ? "var(--color-terracotta)" :
            p.status === "calling" ? "var(--color-clay)" :
            p.status === "booked" ? "var(--color-sage-strong)" :
            "var(--color-espresso)";
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="absolute -translate-x-1/2 -translate-y-full focus:outline-none"
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            >
              <motion.div
                animate={{ scale: isSel ? 1.15 : 1 }}
                className="relative flex flex-col items-center"
              >
                <div
                  className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold text-white shadow-md"
                  style={{ background: tone, boxShadow: isSel ? `0 0 0 4px ${tone}33` : "0 4px 10px -4px rgba(0,0,0,0.35)" }}
                >
                  {p.name[0]}
                </div>
                <div className="h-2 w-2 -mt-1 rotate-45" style={{ background: tone }} />
                {isSel && (
                  <div
                    className="absolute top-full mt-1 whitespace-nowrap rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-medium shadow"
                    style={{ color: "var(--color-espresso)" }}
                  >
                    {p.name}
                  </div>
                )}
              </motion.div>
            </button>
          );
        })}
      </div>

      {/* detail / list */}
      <div className="space-y-2">
        {sel && (
          <motion.div
            key={sel.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[color:var(--glass-border)] bg-white/55 p-3.5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-serif italic text-[20px] leading-tight" style={{ color: "var(--color-espresso)" }}>
                  {sel.name}
                </div>
                <div className="mt-0.5 text-[12px]" style={{ color: "var(--color-stone)" }}>
                  {sel.cuisine} · {sel.distance} · {sel.vibe}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[12px]" style={{ color: "var(--color-stone)" }}>
                  <span className="inline-flex items-center gap-0.5">
                    <Star size={11} className="fill-current" style={{ color: "var(--color-clay)" }} /> {sel.rating}
                  </span>
                  <span>·</span>
                  <span>{sel.price}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onShortlist(sel.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--glass-border)] bg-white/70 px-3 py-1.5 text-[12px] transition-all hover:bg-white"
                style={{ color: "var(--color-espresso)" }}
              >
                {sel.status === "shortlist" ? <BookmarkCheck size={13} style={{ color: "var(--color-terracotta)" }} /> : <Bookmark size={13} />}
                {sel.status === "shortlist" ? "shortlisted" : "shortlist"}
              </button>
              <button
                onClick={() => onCall(sel.id)}
                disabled={sel.status === "calling"}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-white transition-all disabled:opacity-60"
                style={{ background: "var(--color-terracotta)" }}
              >
                <Phone size={12} />
                {sel.status === "calling" ? "calling…" : "have asmi call"}
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-1.5">
          {places.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left transition-all ${
                p.id === selected ? "bg-white/70" : "bg-white/30 hover:bg-white/55"
              }`}
            >
              <span
                className="grid h-5 w-5 place-items-center rounded-full text-[9.5px] font-semibold text-white"
                style={{
                  background:
                    p.status === "shortlist" ? "var(--color-terracotta)" :
                    p.status === "calling" ? "var(--color-clay)" :
                    p.status === "booked" ? "var(--color-sage-strong)" : "var(--color-espresso)",
                }}
              >
                {p.name[0]}
              </span>
              <span className="flex-1 truncate text-[12.5px]" style={{ color: "var(--color-espresso)" }}>{p.name}</span>
              <span className="text-[10.5px]" style={{ color: "var(--color-stone-dim)" }}>{p.distance}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
