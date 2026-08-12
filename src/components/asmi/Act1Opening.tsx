import { motion, useReducedMotion } from "motion/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { AmbientBlobs } from "./Atmosphere";
import { WaitlistForm } from "./WaitlistForm";
import { ChannelRow } from "./ChannelIcons";
import { Bubble, TypingBubble } from "./MessageBubble";

const TICKER = [
  "the dentist",
  "your landlord",
  "that refund",
  "the DMV",
  "a birthday cake",
  "dinner for six",
];

export function Act1Opening({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef ?? internalRef;

  return (
    <section ref={ref} className="relative overflow-hidden px-5 sm:px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <AmbientBlobs density={6} />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
        {/* Left — the pitch */}
        <div className="text-center md:text-left">
          <motion.p
            className="label-mono mb-5"
            style={{ color: "var(--color-terracotta-deep)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            asmi
          </motion.p>

          <motion.h1
            className="font-display lowercase"
            style={{
              color: "var(--color-espresso-strong)",
              fontSize: "clamp(3rem, 9.5vw, 6.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              fontWeight: 600,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.05 }}
          >
            just text{" "}
            <span className="font-serif italic" style={{ color: "var(--color-terracotta)", fontWeight: 400 }}>
              her
            </span>
            .
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 font-sans md:mx-0"
            style={{
              color: "var(--color-ink)",
              fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)",
              lineHeight: 1.45,
              maxWidth: "27rem",
              fontWeight: 300,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            she calls, texts, emails and chases — until the thing is actually done.
          </motion.p>

          <motion.div
            className="mt-5 flex items-center justify-center gap-2 md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="font-sans" style={{ color: "var(--color-stone-dim)", fontSize: 14 }}>
              like
            </span>
            <Ticker />
          </motion.div>

          <motion.div
            className="mt-9 flex flex-col items-center gap-6 md:items-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <WaitlistForm size="lg" />
            <div className="md:self-start">
              <ChannelRow />
            </div>
          </motion.div>
        </div>

        {/* Right — the thread */}
        <HeroThread />
      </div>
    </section>
  );
}

function Ticker() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % TICKER.length), 1900);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <span className="relative inline-block" style={{ height: 26, minWidth: 168 }}>
      {TICKER.map((t, idx) => (
        <motion.span
          key={t}
          className="absolute left-0 top-0 whitespace-nowrap font-serif italic"
          style={{ color: "var(--color-espresso)", fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
          animate={{ opacity: i === idx ? 1 : 0, y: i === idx ? 0 : 8 }}
          transition={{ duration: 0.35 }}
        >
          {t}
        </motion.span>
      ))}
    </span>
  );
}

const THREAD_DELAYS = { you: 0.55, typing: 1.1, asmi: 1.9, chips: 2.5, done: 3.1 };

function HeroThread() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? 4 : 0);

  useEffect(() => {
    if (reduced) return;
    const ts = [
      setTimeout(() => setStep(1), THREAD_DELAYS.you * 1000),
      setTimeout(() => setStep(2), THREAD_DELAYS.asmi * 1000),
      setTimeout(() => setStep(3), THREAD_DELAYS.chips * 1000),
      setTimeout(() => setStep(4), THREAD_DELAYS.done * 1000),
    ];
    return () => ts.forEach(clearTimeout);
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, rotate: -2.5 }}
      animate={{ opacity: 1, y: 0, rotate: -1.6 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.25 }}
      className="mx-auto w-full max-w-md"
    >
      <div
        className="rounded-[28px] p-4 sm:p-5"
        style={{
          background: "rgba(251,248,243,0.72)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(44,37,32,0.07)",
          boxShadow: "0 40px 80px -50px rgba(44,37,32,0.55)",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="label-mono" style={{ color: "var(--color-stone-dim)" }}>
            today · 9:04am
          </span>
          <span className="label-mono" style={{ color: "var(--color-stone-dim)" }}>
            imessage
          </span>
        </div>

        <div className="space-y-3">
          <Bubble from="you">my landlord's ghosting me about the AC</Bubble>

          {step === 0 && <TypingBubble />}

          {step >= 1 && (
            <Bubble from="asmi">
              on it — calling now, texting the property manager, emailing a paper trail.
            </Bubble>
          )}

          {step >= 2 && (
            <div className="flex flex-wrap gap-1.5 pl-1">
              {["called ✓", "texted ✓", "emailed ✓"].map((c, i) => (
                <motion.span
                  key={c}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: i * 0.12 }}
                  className="rounded-full px-2.5 py-1 font-sans"
                  style={{
                    fontSize: 11.5,
                    color: "var(--color-sage-deep)",
                    background: "rgba(139,168,136,0.16)",
                  }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
          )}

          {step >= 3 && (
            <Bubble from="asmi">
              <span style={{ fontWeight: 500 }}>work order #4471.</span> tech comes thursday, 10am.
            </Bubble>
          )}
        </div>
      </div>
    </motion.div>
  );
}
