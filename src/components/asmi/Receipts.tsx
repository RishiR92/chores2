import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FlipNumber } from "./Ticker";

function useHoldClock() {
  const [s, setS] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const FOOTNOTES = [
  {
    n: "04",
    label: "salons called",
    line: "three said no. the fourth had a 6pm. that's the job.",
  },
  {
    n: "03",
    label: "channels tried",
    line: "call, text, email — she navigates smartly until it's done.",
  },
];

export function Receipts() {
  const clock = useHoldClock();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="why" className="relative">
      {/* full-bleed dark band, cut in with a wipe */}
      <motion.div
        ref={ref}
        initial={reduced ? undefined : { clipPath: "inset(14% 0% 14% 0%)" }}
        whileInView={reduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.55, ease: [0.22, 0.8, 0.24, 1] }}
        className="ink-section receipt-band relative overflow-hidden"
      >
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-24">
          <p className="t-mono" style={{ color: "rgba(255,253,248,0.5)" }}>
            SOMEONE HAS TO SIT THROUGH THIS
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 12 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, ease: [0.22, 0.8, 0.24, 1] }}
                className="flex items-end gap-3"
                style={{ color: "var(--citrus)" }}
              >
                <span className="hidden sm:inline">
                  <FlipNumber value={clock} size={112} />
                </span>
                <span className="sm:hidden">
                  <FlipNumber value={clock} size={62} />
                </span>
                <span className="t-mono pb-3" style={{ color: "rgba(255,253,248,0.45)" }}>
                  ON HOLD
                </span>
              </motion.div>

              <h2 className="mt-6 max-w-xl">
                she'll wait. you won't have to.
              </h2>
            </div>

            <ul className="flex flex-col divide-y" style={{ borderColor: "rgba(255,253,248,0.14)" }}>
              {FOOTNOTES.map((f, i) => (
                <motion.li
                  key={f.n}
                  initial={reduced ? undefined : { opacity: 0, y: 10 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease: [0.22, 0.8, 0.24, 1] }}
                  className="flex items-baseline gap-4 py-5"
                  style={{ borderColor: "rgba(255,253,248,0.14)" }}
                >
                  <span
                    className="font-mono shrink-0"
                    style={{ fontSize: 26, fontWeight: 700, color: "var(--coral)" }}
                  >
                    {f.n}
                  </span>
                  <span className="min-w-0">
                    <span className="t-mono block" style={{ color: "rgba(255,253,248,0.5)" }}>
                      {f.label.toUpperCase()}
                    </span>
                    <span className="t-body mt-1 block" style={{ color: "rgba(255,253,248,0.78)" }}>
                      {f.line}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
