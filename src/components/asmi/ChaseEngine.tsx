import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ChannelGlyph, ChannelKind } from "./ChannelIcons";
import { Reveal, RevealGroup } from "./Reveal";

interface Beat {
  kind: ChannelKind;
  label: string;
  time: string;
  tone?: "fail" | "win";
}

interface Job {
  id: string;
  title: string;
  who: string;
  beats: Beat[];
  outcome: string;
}

const JOBS: Job[] = [
  {
    id: "friends",
    title: "dinner with 5 friends, saturday",
    who: "5 friends + the restaurant",
    beats: [
      { kind: "text", label: "texted all 5", time: "6:02p" },
      { kind: "call", label: "called them", time: "7:30p", tone: "fail" },
      { kind: "call", label: "got the yes", time: "8:40p" },
      { kind: "text", label: "booked restaurant · Sat locked", time: "9:14p", tone: "win" },

    ],

    outcome: "table for 5, 8pm saturday — booked",
  },
  {
    id: "dentist",
    title: "book a dentist, mornings only",
    who: "4 clinics near you",
    beats: [
      { kind: "call", label: "clinic 1 — no morning slot", time: "10:05a", tone: "fail" },
      { kind: "call", label: "clinic 2 — went to voicemail", time: "10:09a", tone: "fail" },
      { kind: "email", label: "emailed clinic 3", time: "10:12a" },
      { kind: "call", label: "clinic 4 — 8:30am tues confirmed", time: "10:24a", tone: "win" },
    ],
    outcome: "tues 8:30am — already in your calendar",
  },
  {
    id: "plumber",
    title: "leak under the sink",
    who: "3 plumbers, in parallel",
    beats: [
      { kind: "call", label: "plumber A — $180, 6pm", time: "11:02a", tone: "win" },
      { kind: "call", label: "plumber B — booked out", time: "11:04a", tone: "fail" },
      { kind: "call", label: "plumber C — still on hold", time: "11:11a" },
      { kind: "text", label: "2 live options", time: "11:20a", tone: "win" },
    ],
    outcome: "plumber at your door, 6pm today",
  },
  {
    id: "charge",
    title: "why was i charged $60?",
    who: "your bank + the merchant",
    beats: [
      { kind: "call", label: "dispute opened", time: "9:15a" },
      { kind: "email", label: "receipt requested", time: "9:31a" },
      { kind: "call", label: "bank went silent", time: "1:40p", tone: "fail" },
      { kind: "call", label: "refund agreed", time: "2:06p", tone: "win" },
    ],
    outcome: "$60 back — 3–5 days",
  },
];


const STEP_MS = 900;

export function ChaseEngine() {
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [active, setActive] = useState(0);
  const [runId, setRunId] = useState(0);
  const [shown, setShown] = useState(0);
  const job = JOBS[active];
  const total = job.beats.length;
  const done = shown >= total;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setShown(total);
      return;
    }
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= total) clearInterval(id);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [active, runId, total, reduced, inView]);

  // keep the rail pinned to the left so the first step stays fully visible
  useEffect(() => {
    const rail = railRef.current;
    if (rail) {
      rail.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [active]);

  useEffect(() => {
    const chips = chipsRef.current;
    const chip = chips?.children[active] as HTMLElement | undefined;
    if (chips && chip) {
      chips.scrollTo({
        left: chip.offsetLeft - chips.offsetLeft - chips.clientWidth / 2 + chip.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [active]);

  const select = (i: number) => {
    setActive(i);
    setRunId((r) => r + 1);
  };

  return (
    <section ref={sectionRef} id="how" className="ink-section relative grain overflow-hidden py-11 sm:py-16 md:py-24">
      <span className="torn-top" aria-hidden />
      <div className="dot-field dot-field-light" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        <RevealGroup className="flex flex-col gap-3 px-5 sm:px-8">
          <Reveal inGroup variant="accent">
            <span className="t-mono" style={{ color: "var(--citrus)" }}>
              THE CHASE ENGINE
            </span>
          </Reveal>
          <Reveal inGroup variant="text">
            <h2 className="max-w-2xl">one task. every channel. until it's done.</h2>
          </Reveal>
        </RevealGroup>

        <div
          ref={chipsRef}
          className="mt-7 flex gap-2 overflow-x-auto px-5 pb-2 sm:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {JOBS.map((j, i) => {
            const on = i === active;
            return (
              <button
                key={j.id}
                onClick={() => select(i)}
                className="shrink-0 whitespace-nowrap px-4 py-2.5 font-sans transition-colors"
                style={{
                  fontSize: "var(--t-base)",
                  borderRadius: 10,
                  border: "1px solid rgba(255,253,248,0.28)",
                  background: on ? "var(--cream)" : "transparent",
                  color: on ? "var(--ink)" : "rgba(255,253,248,0.75)",
                  fontWeight: on ? 600 : 400,
                }}
              >
                {j.title}
              </button>
            );
          })}
        </div>

        <div className="mt-4 px-5 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 max-w-[760px] p-5 sm:p-7"
              style={{
                borderRadius: 10,
                background: "rgba(255,253,248,0.06)",
                border: "1px solid rgba(255,253,248,0.14)",
              }}
            >
              <p className="t-mono" style={{ color: "rgba(255,253,248,0.55)" }}>
                {job.who}
              </p>

              {/* channel relay */}
              <div
                ref={railRef}
                className="mt-6 flex items-start gap-0 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {job.beats.map((b, i) => {
                  const lit = i < shown;
                  const accent =
                    b.tone === "win" ? "var(--mint-pop)" : b.tone === "fail" ? "var(--coral)" : "var(--citrus)";
                  return (
                    <div key={b.label + i} className="flex shrink-0 items-start">
                      {i > 0 && (
                        <span
                          className="mt-[19px] block h-px w-3 shrink-0 sm:w-10"
                          style={{
                            background: lit ? "rgba(255,253,248,0.45)" : "rgba(255,253,248,0.14)",
                            transition: "background 260ms",
                          }}
                          aria-hidden
                        />
                      )}
                      <div className="flex w-[88px] flex-col items-center gap-2 sm:w-[130px]">




                        <motion.span
                          className="grid place-items-center rounded-full"
                          animate={
                            lit
                              ? { scale: 1, opacity: 1, borderColor: accent, color: accent }
                              : { scale: 0.86, opacity: 0.35 }
                          }
                          transition={{ type: "spring", stiffness: 420, damping: 18 }}
                          style={{
                            width: 38,
                            height: 38,
                            border: "1.5px solid rgba(255,253,248,0.3)",
                            color: "rgba(255,253,248,0.6)",
                            background: lit && b.tone === "win" ? "rgba(126,217,167,0.14)" : "transparent",
                          }}
                        >
                          <ChannelGlyph kind={b.kind} size={16} />
                        </motion.span>
                        <span
                          className="text-center font-sans text-[10.5px] sm:text-[12.5px]"
                          style={{
                            lineHeight: 1.25,
                            color: lit ? "var(--cream)" : "rgba(255,253,248,0.32)",
                            fontWeight: b.tone === "win" ? 600 : 400,
                            textDecoration: lit && b.tone === "fail" ? "line-through" : "none",
                            transition: "color 260ms",
                          }}
                        >

                          {b.label}
                        </span>
                        <span
                          className="font-mono"
                          style={{ fontSize: 10.5, color: lit ? "rgba(255,253,248,0.45)" : "transparent" }}
                        >
                          {b.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ minHeight: 48 }} className="mt-5">
                <AnimatePresence>
                  {done && (
                    <motion.p
                      initial={reduced ? false : { opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: -1.2 }}
                      transition={{ type: "spring", stiffness: 340, damping: 15 }}
                      className="inline-block px-4 py-2 font-display"
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        borderRadius: 8,
                        color: "var(--ink)",
                        background: "var(--mint-pop)",
                      }}
                    >
                      {job.outcome}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
