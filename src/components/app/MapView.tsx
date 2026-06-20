import { motion } from "motion/react";
import { useState } from "react";
import { Star, Phone, Bookmark, BookmarkCheck, MapPin } from "lucide-react";
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
  const [selected, setSelected] = useState<string | null>(
    places.find((p) => p.status === "shortlist")?.id ?? places[0]?.id ?? null
  );
  const sel = places.find((p) => p.id === selected);

  return (
    <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "1.4 / 1",
          background:
            "radial-gradient(120% 80% at 30% 20%, #EDE6FF 0%, #DCC9FF 60%, #C9B8FF 100%)",
          border: "1px solid rgba(124,58,237,0.10)",
        }}
      >
        <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 9 + 6} x2="100" y2={i * 9 + 4} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 10 + 4} y1="0" x2={i * 10 + 6} y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          ))}
          <path d="M0 50 Q 30 38 60 44 T 100 30" stroke="#A5D8FF" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M 0 55 Q 35 60 70 52 T 100 58" stroke="#5EEAD4" strokeWidth="3" fill="none" opacity="0.5" />
        </svg>

        {places.map((p) => {
          const isSel = p.id === selected;
          const tone =
            p.status === "shortlist" ? "#7C3AED" :
            p.status === "calling"   ? "#E64BFF" :
            p.status === "booked"    ? "#0F766E" :
            "#1A0B2E";
          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(p.id)}
              className="absolute -translate-x-1/2 -translate-y-full focus:outline-none"
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            >
              <motion.div animate={{ scale: isSel ? 1.18 : 1 }} className="relative flex flex-col items-center">
                <div
                  className="grid h-8 w-8 place-items-center rounded-full text-white"
                  style={{
                    background: tone,
                    boxShadow: isSel ? `0 0 0 5px ${tone}33, 0 8px 20px -6px ${tone}` : "0 4px 10px -4px rgba(0,0,0,0.35)",
                  }}
                >
                  <MapPin size={14} strokeWidth={2.2} fill="white" />
                </div>
                {isSel && (
                  <div
                    className="absolute top-full mt-1 whitespace-nowrap rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-medium shadow"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {p.name}
                  </div>
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-2">
        {sel && (
          <motion.div
            key={sel.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/70 p-3.5 backdrop-blur-xl"
            style={{ border: "1px solid rgba(124,58,237,0.10)" }}
          >
            <div className="font-display text-[18px] font-semibold leading-tight tracking-[-0.01em]" style={{ color: "var(--color-ink)" }}>
              {sel.name}
            </div>
            <div className="mt-0.5 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
              {sel.cuisine} · {sel.distance} · {sel.vibe}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
              <span className="inline-flex items-center gap-0.5">
                <Star size={11} className="fill-current" style={{ color: "#E64BFF" }} /> {sel.rating}
              </span>
              <span>·</span>
              <span className="font-mono" style={{ color: "#6D28D9" }}>{sel.price}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onShortlist(sel.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[12px] transition-all hover:bg-white"
                style={{ color: "var(--color-ink)", border: "1px solid rgba(124,58,237,0.15)" }}
              >
                {sel.status === "shortlist"
                  ? <BookmarkCheck size={13} style={{ color: "#7C3AED" }} />
                  : <Bookmark size={13} />}
                {sel.status === "shortlist" ? "shortlisted" : "shortlist"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onCall(sel.id)}
                disabled={sel.status === "calling"}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-white transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg,#7C3AED,#E64BFF)",
                  boxShadow: "0 6px 16px -6px rgba(124,58,237,0.55)",
                }}
              >
                <Phone size={12} strokeWidth={2} />
                {sel.status === "calling" ? "calling…" : "have asmi call"}
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-1.5">
          {places.map((p) => (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(p.id)}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left transition-all ${
                p.id === selected ? "bg-white/80" : "bg-white/40 hover:bg-white/65"
              }`}
            >
              <span
                className="grid h-6 w-6 place-items-center rounded-lg text-white"
                style={{
                  background:
                    p.status === "shortlist" ? "#7C3AED" :
                    p.status === "calling"   ? "#E64BFF" :
                    p.status === "booked"    ? "#0F766E" : "#1A0B2E",
                }}
              >
                <MapPin size={11} strokeWidth={2} fill="white" />
              </span>
              <span className="flex-1 truncate text-[12.5px]" style={{ color: "var(--color-ink)" }}>{p.name}</span>
              <span className="font-mono text-[10.5px]" style={{ color: "var(--color-ink-muted)" }}>{p.distance}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
