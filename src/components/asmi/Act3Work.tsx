import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { SCENARIOS } from "./data/stories";
import { ChannelGlyph } from "./ChannelIcons";
import { Bubble } from "./MessageBubble";

export function Act3Work() {
  const [active, setActive] = useState(0);
  const s = SCENARIOS[active];

  return (
    <section id="how" className="relative px-5 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="label-mono mb-4" style={{ color: "var(--color-stone-dim)" }}>
          watch her work
        </p>
        <h2
          className="font-display lowercase"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(2.1rem, 7vw, 4.2rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontWeight: 600,
          }}
        >
          one text. five things at once.
        </h2>

        {/* Scenario tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => setActive(i)}
              className="rounded-full px-4 py-2 font-sans transition-all"
              style={{
                fontSize: 13.5,
                background: i === active ? "var(--color-espresso)" : "rgba(251,248,243,0.75)",
                color: i === active ? "var(--color-cream)" : "var(--color-stone)",
                border: "1px solid rgba(44,37,32,0.08)",
              }}
            >
              {sc.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            <Bubble from="you">{s.ask}</Bubble>

            <div
              className="mt-6 rounded-[26px] p-4 sm:p-6"
              style={{
                background: "rgba(251,248,243,0.7)",
                border: "1px solid rgba(44,37,32,0.07)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 40px 80px -60px rgba(44,37,32,0.6)",
              }}
            >
              <div className="relative pl-5">
                <span
                  className="absolute left-[6px] top-2 bottom-2 w-px"
                  style={{ background: "rgba(44,37,32,0.12)" }}
                />
                {s.lines.map((l, i) => (
                  <motion.div
                    key={l.who + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.1, type: "spring", stiffness: 320, damping: 26 }}
                    className="relative flex items-start gap-3 py-2.5"
                  >
                    <span
                      className="absolute -left-5 top-3 grid place-items-center rounded-full"
                      style={{
                        width: 13,
                        height: 13,
                        background: "var(--color-cream)",
                        border: `1.5px solid ${
                          l.state === "won"
                            ? "var(--color-sage-strong)"
                            : l.state === "dead"
                              ? "rgba(44,37,32,0.2)"
                              : "var(--color-terracotta)"
                        }`,
                      }}
                    />
                    <span
                      className="mt-[3px] shrink-0"
                      style={{
                        color:
                          l.state === "won"
                            ? "var(--color-sage-strong)"
                            : l.state === "dead"
                              ? "var(--color-stone-dim)"
                              : "var(--color-terracotta)",
                      }}
                    >
                      <ChannelGlyph kind={l.channel} size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-sans"
                        style={{
                          color: l.state === "dead" ? "var(--color-stone-dim)" : "var(--color-espresso)",
                          fontSize: 15,
                        }}
                      >
                        {l.who}
                      </p>
                      <p className="font-sans" style={{ color: "var(--color-stone-dim)", fontSize: 13 }}>
                        {l.note}
                      </p>
                    </div>
                    <span className="label-mono shrink-0 pt-1" style={{ color: "var(--color-stone-dim)", fontSize: 11 }}>
                      {l.at}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Bubble from="asmi" size="lg">
                <span style={{ fontWeight: 500 }}>{s.receipt}</span>
                <br />
                <span style={{ opacity: 0.75 }}>{s.receiptMeta}</span>
              </Bubble>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
