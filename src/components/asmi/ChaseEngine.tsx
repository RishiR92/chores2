import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChaseLog, ChaseStep } from "./ChaseLog";
import { ChannelGlyph } from "./ChannelIcons";

interface Job {
  id: string;
  title: string;
  who: string;
  status: "done" | "live" | "queued";
  steps: ChaseStep[];
}

const JOBS: Job[] = [
  {
    id: "plumber",
    title: "leak under the sink",
    who: "3 plumbers, in parallel",
    status: "live",
    steps: [
      { kind: "call", text: "Bay Plumbing — quoted $180, can come 6pm", time: "11:02a", tone: "win" },
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
      { kind: "email", text: "emailed merchant for the receipt", time: "9:31a" },
      { kind: "call", text: "no reply — called merchant", time: "1:40p", tone: "fail" },
      { kind: "call", text: "$60 refunded. 3–5 days.", time: "2:06p", tone: "win" },
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
      { kind: "call", text: "tues 8:30am. added to your calendar.", time: "10:24a", tone: "win" },
    ],
  },
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
];

const STATUS = {
  done: { label: "done", bg: "var(--mint-pop)", fg: "var(--ink)" },
  live: { label: "chasing", bg: "var(--coral)", fg: "#fff" },
  queued: { label: "queued", bg: "rgba(255,253,248,0.16)", fg: "var(--cream)" },
} as const;

export function ChaseEngine() {
  const chipsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const job = JOBS[active];

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

  return (
    <section id="how" className="ink-section relative grain overflow-hidden py-16 md:py-24">
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: "rgba(47,91,255,0.35)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 px-5 sm:px-8">
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--citrus)" }}>
            THE CHASE ENGINE
          </span>
          <h2 className="max-w-2xl text-[2.1rem] sm:text-5xl">
            one task. every channel. until it's <span style={{ color: "var(--citrus)" }}>done</span>.
          </h2>
          <p className="max-w-xl font-sans" style={{ fontSize: 16.5, color: "rgba(255,253,248,0.7)" }}>
            call → voicemail → text → email → their web form → call again. she escalates on her own and
            keeps you posted in one thread.
          </p>
        </div>

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
                onClick={() => setActive(i)}
                className="shrink-0 rounded-full px-4 py-2.5 font-sans transition-colors"
                style={{
                  fontSize: 14,
                  border: "1.5px solid rgba(255,253,248,0.25)",
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
              className="min-w-0 max-w-[640px] rounded-[26px] p-5"
              style={{
                background: "rgba(255,253,248,0.06)",
                border: "1px solid rgba(255,253,248,0.14)",
              }}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h3 className="text-[1.35rem] sm:text-[1.6rem]">{job.title}</h3>
                  <p className="mt-1.5 font-mono" style={{ fontSize: 11.5, color: "rgba(255,253,248,0.55)" }}>
                    {job.who}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1.5 font-mono"
                  style={{ fontSize: 11, background: STATUS[job.status].bg, color: STATUS[job.status].fg }}
                >
                  {STATUS[job.status].label}
                </span>
              </div>

              <div className="mt-5 hidden flex-wrap gap-2 md:flex">
                {(["call", "text", "email", "web"] as const).map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans"
                    style={{
                      fontSize: 12.5,
                      color: "var(--cream)",
                      background: "rgba(255,253,248,0.08)",
                      border: "1px solid rgba(255,253,248,0.16)",
                    }}
                  >
                    <ChannelGlyph kind={k} size={13} />
                    {k}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <p
                  className="mb-4 font-mono"
                  style={{ fontSize: 10.5, letterSpacing: "0.06em", color: "rgba(255,253,248,0.5)" }}
                >
                  LIVE LOG
                </p>
                <ChaseLog steps={job.steps} dark />
              </div>

              <p className="mt-5 hidden font-sans md:block" style={{ fontSize: 14.5, color: "rgba(255,253,248,0.7)" }}>
                she runs several threads in parallel and informs you once the task is done.
              </p>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
