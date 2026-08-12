import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const LINES: { text: string; art: "hold" | "ivr" | "missed" | "vm" | "later" }[] = [
  { text: "on hold for 41 minutes.", art: "hold" },
  { text: "press 4 for billing.", art: "ivr" },
  { text: "\"we tried reaching you.\"", art: "missed" },
  { text: "left a voicemail. never heard back.", art: "vm" },
  { text: "i'll do it tomorrow.", art: "later" },
];

export function Act2Dread() {
  return (
    <section id="why" className="relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-3xl">
        <p className="label-mono mb-10" style={{ color: "var(--color-stone-dim)" }}>
          why you haven't done it yet
        </p>

        <div className="space-y-8 md:space-y-12">
          {LINES.map((l, i) => (
            <motion.div
              key={l.text}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              <h3
                className="font-display lowercase"
                style={{
                  color: "var(--color-espresso-strong)",
                  fontSize: "clamp(1.6rem, 5.5vw, 3rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.035em",
                  fontWeight: 500,
                }}
              >
                {l.text}
              </h3>
              <div className="shrink-0">
                <Artifact kind={l.art} index={i} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-24 md:mt-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="font-serif"
            style={{
              color: "var(--color-espresso)",
              fontSize: "clamp(1.9rem, 6vw, 3.6rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              textWrap: "balance",
            }}
          >
            you're not lazy.{" "}
            <span className="italic" style={{ color: "var(--color-terracotta)" }}>
              this stuff is just built to waste your time.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
      style={{
        background: "rgba(251,248,243,0.8)",
        border: "1px solid rgba(44,37,32,0.07)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 18px 40px -34px rgba(44,37,32,0.6)",
      }}
    >
      {children}
    </div>
  );
}

function Artifact({ kind, index }: { kind: string; index: number }) {
  const reduced = useReducedMotion();
  const [t, setT] = useState(2441);
  useEffect(() => {
    if (kind !== "hold" || reduced) return;
    const id = setInterval(() => setT((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [kind, reduced]);

  if (kind === "hold") {
    const m = Math.floor(t / 60);
    const s = String(t % 60).padStart(2, "0");
    return (
      <Shell>
        <motion.span
          className="inline-block rounded-full"
          style={{ width: 7, height: 7, background: "var(--color-terracotta)" }}
          animate={reduced ? {} : { opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className="label-mono" style={{ color: "var(--color-espresso)", fontSize: 13 }}>
          {m}:{s} on hold
        </span>
      </Shell>
    );
  }

  if (kind === "ivr") {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
    return (
      <Shell>
        <div className="grid grid-cols-3 gap-1">
          {keys.map((k) => (
            <motion.span
              key={k}
              className="label-mono grid place-items-center rounded-md"
              style={{
                width: 20,
                height: 18,
                fontSize: 10,
                color: k === "4" ? "var(--color-cream)" : "var(--color-stone-dim)",
                background: k === "4" ? "var(--color-terracotta)" : "rgba(44,37,32,0.05)",
              }}
              animate={k === "4" && !reduced ? { scale: [1, 0.9, 1] } : {}}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              {k}
            </motion.span>
          ))}
        </div>
      </Shell>
    );
  }

  if (kind === "missed") {
    return (
      <Shell>
        <span
          className="grid place-items-center rounded-full font-sans"
          style={{ width: 20, height: 20, background: "var(--color-terracotta)", color: "var(--color-cream)", fontSize: 11 }}
        >
          3
        </span>
        <span className="font-sans" style={{ color: "var(--color-stone)", fontSize: 13 }}>
          missed calls
        </span>
      </Shell>
    );
  }

  if (kind === "vm") {
    return (
      <Shell>
        <div className="flex items-end gap-[3px]" style={{ height: 18 }}>
          {[6, 12, 17, 9, 14, 7, 11, 4].map((h, i) => (
            <motion.span
              key={i}
              className="rounded-full"
              style={{ width: 3, height: h, background: "rgba(44,37,32,0.25)" }}
              animate={reduced ? {} : { opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
        <span className="label-mono" style={{ color: "var(--color-stone-dim)", fontSize: 12 }}>
          0:38 · unheard
        </span>
      </Shell>
    );
  }

  return (
    <div className="relative" style={{ height: 54, width: 210 }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute left-0 top-0"
          style={{ transform: `translate(${i * 6}px, ${i * 5}px)` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 - i * 0.18 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 + i * 0.12 }}
        >
          <Shell>
            <span className="font-sans whitespace-nowrap" style={{ color: "var(--color-stone)", fontSize: 12.5 }}>
              reminder · tomorrow 9am
            </span>
          </Shell>
        </motion.div>
      ))}
    </div>
  );
}
