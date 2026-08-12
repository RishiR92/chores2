import { motion } from "motion/react";
import { useState } from "react";
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
  const [active, setActive] = useState(JOBS[0].id);
  const job = JOBS.find((j) => j.id === active)!;

  return (
    <section id="how" className="ink-section relative grain overflow-hidden px-5 py-16 sm:px-8 md:py-24">
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: "rgba(47,91,255,0.35)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-3">
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

        <div className="mt-9 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
          {JOBS.map((j) => {
            const on = j.id === active;
            return (
              <button
                key={j.id}
                onClick={() => setActive(j.id)}
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

        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div
            className="min-w-0 rounded-[26px] p-5"
            style={{ background: "rgba(255,253,248,0.06)", border: "1px solid rgba(255,253,248,0.14)" }}
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

            <div className="mt-5 flex flex-wrap gap-2">
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

            <p className="mt-5 font-sans" style={{ fontSize: 14.5, color: "rgba(255,253,248,0.7)" }}>
              she runs several threads in parallel and informs you once the task is done.
            </p>
          </div>

          <div
            className="min-w-0 rounded-[26px] p-5"
            style={{ background: "rgba(255,253,248,0.06)", border: "1px solid rgba(255,253,248,0.14)" }}
          >
            <p className="mb-4 font-mono" style={{ fontSize: 10.5, letterSpacing: "0.06em", color: "rgba(255,253,248,0.5)" }}>
              LIVE LOG
            </p>
            <ChaseLog steps={job.steps} dark />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
