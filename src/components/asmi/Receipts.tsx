import { motion } from "motion/react";
import { Reveal, RevealGroup } from "./Reveal";
import { useEffect, useState } from "react";

function HoldTimer() {
  const [s, setS] = useState(41 * 60 + 12);
  useEffect(() => {
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <span className="font-mono" style={{ fontSize: 34, fontWeight: 700 }}>
      {mm}:{ss}
    </span>
  );
}

const CARDS = [
  {
    tag: "on hold",
    color: "var(--coral)",
    body: <HoldTimer />,
    caption: "elevator music, forever. she doesn't hang up.",
  },
  {
    tag: "phone menus",
    color: "var(--blue)",
    body: (
      <div className="flex flex-wrap gap-1.5">
        {["1", "2", "3", "4", "0", "#"].map((k) => (
          <span
            key={k}
            className="grid h-9 w-9 place-items-center rounded-xl font-mono"
            style={{
              fontSize: 13,
              border: "1.5px solid rgba(20,19,24,0.15)",
              background: k === "4" ? "var(--citrus)" : "transparent",
              fontWeight: k === "4" ? 700 : 400,
            }}
          >
            {k}
          </span>
        ))}
      </div>
    ),
    caption: "six menus deep to reach a human. press 4.",
  },
  {
    tag: "nobody replies",
    color: "var(--violet-soft)",
    body: (
      <div className="flex flex-col gap-1.5">
        {[
          { c: "called", r: "rang out", dead: true },
          { c: "texted", r: "delivered · 2 days", dead: true },
          
          { c: "emailed", r: "replied ✅", dead: false },
        ].map((x) => (
          <div key={x.c} className="flex items-center gap-2 font-mono" style={{ fontSize: 12 }}>
            <span
              className="w-16 shrink-0 rounded-full px-2 py-0.5 text-center"
              style={{
                background: x.dead ? "rgba(20,19,24,0.07)" : "var(--mint-pop)",
                color: x.dead ? "var(--ink-dim)" : "var(--ink)",
                fontWeight: x.dead ? 400 : 700,
              }}
            >
              {x.c}
            </span>
            <span style={{ color: x.dead ? "var(--ink-dim)" : "var(--ink)", textDecoration: x.dead ? "line-through" : "none" }}>
              {x.r}
            </span>
          </div>
        ))}
      </div>
    ),
    caption: "she keeps switching channels until one of them works.",
  },
];


export function Receipts() {
  return (
    <section id="why" className="relative px-5 py-11 sm:px-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <RevealGroup>
          <Reveal inGroup variant="text">
            <h2 className="max-w-2xl text-[1.65rem] sm:text-5xl">
              annoying — but only to <span style={{ color: "var(--coral)" }}>them</span>.
            </h2>
          </Reveal>
          <Reveal inGroup variant="accent">
            <p className="mt-4 max-w-lg font-sans" style={{ color: "var(--ink-soft)", fontSize: 15 }}>
              all the stuff that makes you put it off for three weeks. she just… sits there and does it.
            </p>
          </Reveal>
        </RevealGroup>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.article
              key={c.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 220, damping: 24 }}
              className="soft-card flex min-w-0 flex-col gap-3.5 p-4 sm:gap-4 sm:p-5"
            >
              <span
                className="inline-flex w-fit items-center rounded-full px-3 py-1 font-mono"
                style={{ fontSize: 11, background: c.color, color: c.color === "var(--blue)" ? "#fff" : "var(--ink)" }}
              >
                {c.tag}
              </span>
              <div className="min-h-[56px]">{c.body}</div>
              <p className="font-sans" style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>
                {c.caption}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
