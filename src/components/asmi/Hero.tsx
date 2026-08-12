import { motion } from "motion/react";
import { ChannelCTA } from "./ChannelCTA";
import { ChaseLog, ChaseStep } from "./ChaseLog";

const THREAD: { from: "you" | "asmi"; text: string }[] = [
  { from: "you", text: "cancel my gym. they keep dodging me" },
  { from: "asmi", text: "on it. i'll keep at them till it's cancelled 🫡" },
];

const STEPS: ChaseStep[] = [
  { kind: "call", text: "called front desk — 14 min hold", time: "2:41p" },
  { kind: "call", text: "voicemail. left one.", time: "2:58p", tone: "fail" },
  { kind: "text", text: "texted the manager", time: "3:10p" },
  { kind: "email", text: "emailed cancellation notice", time: "3:12p" },
  { kind: "call", text: "called again. got Dana.", time: "4:15p" },
  { kind: "web", text: "cancelled. $0 next month.", time: "4:22p", tone: "win" },
];

export function Hero() {
  return (
    <section className="relative grain overflow-hidden px-5 pt-28 pb-16 sm:px-8 md:pt-36 md:pb-24">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "rgba(179,156,255,0.35)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-64 -left-28 h-[320px] w-[320px] rounded-full blur-3xl"
        style={{ background: "rgba(255,90,71,0.22)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="min-w-0">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.04em",
              background: "var(--citrus)",
              border: "2px solid var(--ink)",
            }}
          >
            <span className="relative inline-grid place-items-center" style={{ width: 7, height: 7 }}>
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: "var(--ink)" }} />
            </span>
            she's already calling someone
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-5 text-[2.7rem] leading-[0.92] sm:text-6xl lg:text-[5.4rem]"
          >
            the most{" "}
            <span className="relative inline-block">
              irritating
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute left-0 right-0 -bottom-1 h-[10px] origin-left rounded-full sm:h-[14px]"
                style={{ background: "var(--coral)", zIndex: -1 }}
                aria-hidden
              />
            </span>{" "}
            assistant in the world.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed sm:text-[1.2rem]"
            style={{ color: "var(--ink-soft)" }}
          >
            she calls, texts, emails and calls <em>again</em> — she will not leave people alone until
            your thing is actually done. you just text her.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8"
          >
            <ChannelCTA size="lg" />
            <p className="mt-3 font-mono" style={{ fontSize: 11.5, color: "var(--ink-dim)" }}>
              no app · no signup · 50+ languages
            </p>
          </motion.div>
        </div>

        {/* thread + chase log */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="edge-card min-w-0 p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px dashed rgba(20,19,24,0.15)" }}>
            <span
              className="relative grid h-8 w-8 place-items-center rounded-full font-display"
              style={{ background: "var(--blue)", color: "#fff", fontSize: 14, fontWeight: 700 }}
            >
              a
            </span>
            <div className="min-w-0">
              <p className="font-display truncate" style={{ fontWeight: 700, fontSize: 15 }}>
                asmi
              </p>
              <p className="font-mono" style={{ fontSize: 10.5, color: "var(--ink-dim)" }}>
                imessage · today
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 py-4">
            {THREAD.map((m, i) => (
              <motion.div
                key={m.text}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.5, type: "spring", stiffness: 300, damping: 22 }}
                className={`max-w-[86%] rounded-3xl px-4 py-2.5 font-sans ${
                  m.from === "you" ? "self-end" : "self-start"
                }`}
                style={{
                  fontSize: 14.5,
                  background: m.from === "you" ? "var(--blue)" : "rgba(20,19,24,0.06)",
                  color: m.from === "you" ? "#fff" : "var(--ink)",
                  borderBottomRightRadius: m.from === "you" ? 8 : undefined,
                  borderBottomLeftRadius: m.from === "you" ? undefined : 8,
                }}
              >
                {m.text}
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl p-3.5" style={{ background: "rgba(20,19,24,0.04)" }}>
            <p className="mb-3 font-mono" style={{ fontSize: 10.5, color: "var(--ink-dim)", letterSpacing: "0.06em" }}>
              THE CHASE
            </p>
            <ChaseLog steps={STEPS} delay={1.2} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
