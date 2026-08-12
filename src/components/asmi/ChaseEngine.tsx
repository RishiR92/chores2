import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ChaseLog, ChaseStep } from "./ChaseLog";
import { Reveal, RevealGroup } from "./Reveal";


interface Job {
  id: string;
  title: string;
  who: string;
  status: "done" | "live";
  steps: ChaseStep[];
}

const JOBS: Job[] = [
  {
    id: "friends",
    title: "dinner with 5 friends, saturday",
    who: "5 friends + the restaurant",
    status: "live",
    steps: [
      { kind: "text", text: "texted all 5 — 3 said saturday", time: "6:02p" },
      { kind: "call", text: "called the two who ghosted", time: "7:30p", tone: "fail" },
      { kind: "text", text: "both in. saturday locked.", time: "9:14p", tone: "win" },
      { kind: "call", text: "calling the bar for a table of 5", time: "now" },
    ],
  },
  {
    id: "plumber",
    title: "leak under the sink",
    who: "3 plumbers, in parallel",
    status: "live",
    steps: [
      { kind: "call", text: "Bay Plumbing — $180, can come 6pm", time: "11:02a", tone: "win" },
      { kind: "call", text: "Rooter Bros — booked out till friday", time: "11:04a", tone: "fail" },
      { kind: "call", text: "Mission Pipe — on hold, still ringing", time: "now" },
      { kind: "text", text: "sending you the two live options", time: "next" },
    ],
  },
  {
    id: "charge",
    title: "why was i charged $60?",
    who: "your bank + the merchant",
    status: "done",
    steps: [
      { kind: "call", text: "called the bank, opened dispute #4471", time: "9:15a" },
      { kind: "email", text: "emailed the merchant for a receipt", time: "9:31a" },
      { kind: "call", text: "silence. so she called them.", time: "1:40p", tone: "fail" },
      { kind: "call", text: "$60 back. 3–5 days.", time: "2:06p", tone: "win" },
    ],
  },
  {
    id: "dentist",
    title: "book a dentist, mornings only",
    who: "4 clinics near you",
    status: "done",
    steps: [
      { kind: "call", text: "clinic 1 — no morning slots", time: "10:05a", tone: "fail" },
      { kind: "call", text: "clinic 2 — voicemail, left one", time: "10:09a", tone: "fail" },
      { kind: "email", text: "emailed clinic 3 for a morning slot", time: "10:12a" },
      { kind: "call", text: "tues 8:30am. already in your calendar.", time: "10:24a", tone: "win" },
    ],
  },
];

const STATUS = {
  done: { label: "done", bg: "var(--mint-pop)", fg: "var(--ink)" },
  live: { label: "chasing", bg: "var(--coral)", fg: "#fff" },
} as const;

const STEP_MS = 900;

export function ChaseEngine() {
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [active, setActive] = useState(0);
  const [runId, setRunId] = useState(0);
  const [shown, setShown] = useState(0);
  const job = JOBS[active];
  const total = job.steps.length;
  const running = shown < total;

  // replay the log one step at a time — but only once the section is on screen
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
          <Reveal inGroup variant="accent">
            <p className="t-body max-w-xl" style={{ color: "rgba(255,253,248,0.7)" }}>
              call → voicemail → text → email → their web form → call again. she escalates on her own
              and keeps you posted in iMessage.
            </p>
          </Reveal>
        </RevealGroup>

        <div
          ref={chipsRef}
          className="mt-8 flex gap-2 overflow-x-auto px-5 pb-2 sm:px-8"
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
              className="min-w-0 max-w-[620px] p-5 sm:p-7"
              style={{
                borderRadius: 10,
                background: "rgba(255,253,248,0.06)",
                border: "1px solid rgba(255,253,248,0.14)",
              }}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h3 className="text-[1.15rem] sm:text-[1.55rem]">{job.title}</h3>
                  <p className="t-mono mt-1.5" style={{ color: "rgba(255,253,248,0.55)" }}>
                    {job.who}
                  </p>
                </div>
                <span
                  className="shrink-0 px-3 py-1.5 font-mono"
                  style={{
                    fontSize: 11,
                    borderRadius: 999,
                    background: running ? "rgba(255,253,248,0.14)" : STATUS[job.status].bg,
                    color: running ? "rgba(255,253,248,0.8)" : STATUS[job.status].fg,
                  }}
                >
                  {running ? "working" : STATUS[job.status].label}
                </span>
              </div>

              <div className="mt-6 mb-5 flex items-center gap-3">
                <span className="t-mono" style={{ color: "rgba(255,253,248,0.5)" }}>
                  {shown}/{total}
                </span>
                <span
                  className="h-px flex-1 overflow-hidden"
                  style={{ background: "rgba(255,253,248,0.16)" }}
                  aria-hidden
                >
                  <motion.span
                    className="block h-px"
                    animate={{ width: `${(shown / total) * 100}%` }}
                    transition={{ duration: 0.4, ease: [0.22, 0.8, 0.24, 1] }}
                    style={{ background: "var(--citrus)" }}
                  />
                </span>
              </div>

              <div style={{ minHeight: total * 34 }}>
                <ChaseLog steps={job.steps} dark visible={shown} />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
