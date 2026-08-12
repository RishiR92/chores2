import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChannelCTA } from "./ChannelCTA";
import { ChannelGlyph, ChannelKind } from "./ChannelIcons";

const THREAD: { from: "you" | "asmi"; text: string }[] = [
  { from: "you", text: "cancel my gym. they keep dodging me" },
  { from: "asmi", text: "on it 🫡" },
];

interface Step {
  kind: ChannelKind;
  text: string;
  time: string;
  tone?: "fail" | "win";
}

const STEPS: Step[] = [
  { kind: "call", text: "called — 14 min hold", time: "2:41p" },
  { kind: "call", text: "voicemail", time: "2:58p", tone: "fail" },
  { kind: "text", text: "texted the manager", time: "3:10p" },
  { kind: "email", text: "emailed a paper trail", time: "3:12p" },
  { kind: "call", text: "called again. got Dana.", time: "4:15p" },
  { kind: "web", text: "cancelled. $0 next month.", time: "4:22p", tone: "win" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 46]);
  const [shown, setShown] = useState(0);


  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.round(Math.min(1, Math.max(0, (v - 0.06) / 0.62)) * STEPS.length);
    setShown(n);
  });

  const visible = reduced ? STEPS.length : shown;
  const done = visible >= STEPS.length;

  return (
    <section ref={ref} className="relative" style={{ height: "205vh" }}>
      <div className="sticky top-0 grain overflow-hidden">
        <motion.div
          className="pad-grid"
          style={{ y: gridY }}
          aria-hidden
        />
        <div className="pad-rule" aria-hidden />
        <span className="ghost-mark" aria-hidden>
          asmi
        </span>


        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center gap-5 px-5 pt-[68px] pb-[60px] sm:gap-7 sm:px-8 md:pt-28 md:pb-24 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-[1.95rem] leading-[0.94] sm:text-6xl lg:text-[5.6rem]"
            >
              the most{" "}
              <span className="relative inline-block">
                <span className="relative z-10">irritating</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute left-0 right-0 -bottom-1 h-[11px] origin-left rounded-full sm:h-[16px]"
                  style={{ background: "var(--coral)" }}
                  aria-hidden
                />
              </span>{" "}
              assistant in the world.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-6 sm:mt-8"
            >
              <motion.span
                className="hi-swipe"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.65, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ left: -10, right: "18%", top: -8, bottom: -8, transformOrigin: "left" }}
                aria-hidden
              />
              <div className="relative">
                <ChannelCTA size="lg" />
              </div>
            </motion.div>

          </div>

          {/* thread + scroll-revealed chase */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="edge-card min-w-0 p-3 sm:p-5"
          >
            <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px dashed rgba(20,19,24,0.15)" }}>
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display"
                style={{ background: "var(--blue)", color: "#fff", fontSize: 14, fontWeight: 700 }}
              >
                a
              </span>
              <p className="font-display truncate" style={{ fontWeight: 700, fontSize: 15 }}>
                asmi
              </p>
              <span className="ml-auto font-mono shrink-0" style={{ fontSize: "var(--t-mono)", color: "var(--ink-dim)" }}>
                imessage
              </span>
            </div>

            <div className="flex flex-col gap-2 py-3">
              {THREAD.map((m, i) => (
                <motion.div
                  key={m.text}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.55, type: "spring", stiffness: 300, damping: 22 }}
                  className={`max-w-[86%] rounded-3xl px-4 py-2.5 font-sans ${
                    m.from === "you" ? "self-end" : "self-start"
                  }`}
                  style={{
                    fontSize: "var(--t-sm)",
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

            <div className="rounded-2xl p-3 sm:p-3.5" style={{ background: "rgba(20,19,24,0.04)" }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono" style={{ fontSize: "var(--t-mono)", color: "var(--ink-dim)", letterSpacing: "0.06em" }}>
                  THE CHASE
                </p>
                <p className="font-mono" style={{ fontSize: "var(--t-mono)", color: "var(--ink-dim)" }}>
                  {visible}/{STEPS.length}
                </p>
              </div>

              <ul className="relative flex flex-col gap-2 pl-5 sm:gap-2.5" style={{ minHeight: 96 }}>
                <span
                  className="absolute left-[7px] top-2 bottom-2 w-px"
                  style={{ background: "rgba(20,19,24,0.12)" }}
                  aria-hidden
                />
                <AnimatePresence initial={false}>
                  {STEPS.slice(0, visible).map((s) => {
                    const accent =
                      s.tone === "win" ? "var(--mint-pop)" : s.tone === "fail" ? "var(--coral)" : "var(--blue)";
                    return (
                      <motion.li
                        key={s.text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        className="relative flex items-center gap-2.5"
                      >
                        <span
                          className="absolute -left-5 rounded-full"
                          style={{
                            width: 15,
                            height: 15,
                            background: s.tone === "win" ? accent : "var(--cream)",
                            border: `2px solid ${accent}`,
                          }}
                          aria-hidden
                        />
                        <span style={{ color: accent }} aria-hidden>
                          <ChannelGlyph kind={s.kind} size={14} />
                        </span>
                        <span
                          className="font-sans"
                          style={{ fontSize: 14, fontWeight: s.tone === "win" ? 600 : 400 }}
                        >
                          {s.text}
                        </span>
                        <span className="ml-auto shrink-0 font-mono" style={{ fontSize: 11, color: "var(--ink-dim)" }}>
                          {s.time}
                        </span>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>

            <div className="mt-3 min-h-[40px]">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="stamp"
                    initial={{ opacity: 0, scale: 0.86, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1, rotate: -2.2 }}
                    transition={{ type: "spring", stiffness: 420, damping: 15 }}
                    className="font-display w-full rounded-2xl px-3 py-2.5 text-center uppercase"
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: "0.01em",
                      color: "var(--coral)",
                      border: "2.5px solid var(--coral)",
                      background: "rgba(255,90,71,0.07)",
                    }}
                  >
                    she doesn't stop until it's done.
                  </motion.div>
                ) : (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-3 text-center font-mono"
                    style={{ fontSize: "var(--t-mono)", color: "var(--ink-dim)" }}
                  >
                    keep scrolling ↓ she's not done yet
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
