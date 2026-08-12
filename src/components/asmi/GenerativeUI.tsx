import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Phone, Star } from "lucide-react";
import { Reveal, RevealGroup } from "./Reveal";
import barImg from "@/assets/place-bar.jpg";
import vegImg from "@/assets/place-veg.jpg";
import tavernImg from "@/assets/place-tavern.jpg";

interface Place {
  id: string;
  name: string;
  img: string;
  rating: number;
  reviews: number;
  why: string;
  meta: string;
  pick?: boolean;
}

const PLACES: Place[] = [
  {
    id: "harlequin",
    name: "The Harlequin",
    img: vegImg,
    rating: 4.3,
    reviews: 861,
    why: "actual veg menu, open late, 0.3 mi",
    meta: "open till 11 · $$",
    pick: true,
  },
  {
    id: "question",
    name: "Question Mark Tavern",
    img: tavernImg,
    rating: 4.9,
    reviews: 335,
    why: "highest rated, tiny — needs a booking",
    meta: "open till 10 · $$",
  },
  {
    id: "horse",
    name: "Horsefeather",
    img: barImg,
    rating: 4.4,
    reviews: 1084,
    why: "big tables, great drinks, 1.2 mi",
    meta: "open till 12 · $$$",
  },
];

type Phase = "choose" | "calling" | "done";


export function GenerativeUI() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("choose");
  const [hold, setHold] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (phase !== "calling") return;
    const id = window.setInterval(() => setHold((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const book = () => {
    setHold(0);
    setPhase("calling");
    timers.current.push(window.setTimeout(() => setPhase("done"), 3200));
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("choose");
    setSelected(null);
  };

  const chosen = PLACES.find((p) => p.id === selected);
  const mm = String(Math.floor(hold / 60)).padStart(2, "0");
  const ss = String(hold % 60).padStart(2, "0");

  return (
    <section id="thread" className="relative px-5 py-11 sm:px-8 sm:py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <RevealGroup className="min-w-0">
          <Reveal inGroup variant="accent">
            <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--ink-dim)" }}>
              GENERATIVE UI, IN THE CHAT
            </span>
          </Reveal>
          <Reveal inGroup variant="text">
            <h2 className="mt-3">
              she plans it with you. then she <span style={{ color: "var(--coral)" }}>goes and does it</span>.
            </h2>
          </Reveal>
          <Reveal inGroup variant="accent">
            <div className="mt-6 flex flex-wrap gap-2">
              {["plan", "tap", "done"].map((t) => (
                <span
                  key={t}
                  className="rounded-full px-3 py-1.5 font-mono"
                  style={{ fontSize: 11, border: "2px solid var(--ink)", background: "var(--citrus)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal inGroup variant="accent">
            <p className="mt-6 max-w-md font-sans" style={{ fontSize: 15, color: "var(--ink-soft)" }}>
              no ten tabs, no wall of text. she builds the exact view you need in the thread — then goes and books it.
            </p>
          </Reveal>
        </RevealGroup>

        {/* the thread */}
        <div className="min-w-0">
          <div className="edge-card mx-auto min-w-0 max-w-[520px] overflow-hidden p-3.5 sm:p-5">
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
              <span className="ml-auto shrink-0 font-mono" style={{ fontSize: "var(--t-mono)", color: "var(--ink-dim)" }}>
                imessage
              </span>
            </div>

            <div className="flex flex-col gap-2.5 py-3.5">
              <div
                className="max-w-[86%] self-end rounded-3xl px-4 py-2.5 font-sans"
                style={{ fontSize: "var(--t-sm)", background: "var(--blue)", color: "#fff", borderBottomRightRadius: 8 }}
              >
                bars near me with actual veg food, table for 5
              </div>
              <div
                className="max-w-[86%] self-start rounded-3xl px-4 py-2.5 font-sans"
                style={{ fontSize: "var(--t-sm)", background: "rgba(20,19,24,0.06)", borderBottomLeftRadius: 8 }}
              >
                found 3. tap the one you like 👇
              </div>
            </div>

            {/* cards */}
            <div className="flex flex-col gap-2.5">
              {PLACES.map((p, i) => {
                const on = selected === p.id;
                const dim = selected !== null && !on;
                return (
                  <motion.div
                    key={p.id}
                    initial={reduced ? false : { opacity: 0, x: 56, rotate: 1.5 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.12 }}
                    className="min-w-0"
                  >
                  <motion.button
                    onClick={() => phase === "choose" && setSelected(on ? null : p.id)}
                    whileTap={{ scale: 0.98 }}
                    animate={{ opacity: dim ? 0.4 : 1 }}
                    className="w-full min-w-0 rounded-2xl p-2.5 text-left"
                    style={{
                      border: on ? "2px solid var(--ink)" : "1px solid rgba(20,19,24,0.12)",
                      background: on ? "var(--citrus)" : "var(--cream)",
                    }}
                  >

                    <div className="flex min-w-0 gap-3">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        width={640}
                        height={640}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-[68px] sm:w-[68px]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate font-display" style={{ fontSize: 15, fontWeight: 700 }}>
                            {p.name}
                          </span>
                          {p.pick && (
                            <span
                              className="shrink-0 rounded-full px-2 py-0.5 font-mono"
                              style={{ fontSize: 9.5, background: "var(--coral)", color: "#fff" }}
                            >
                              her pick
                            </span>
                          )}
                        </div>
                        <div
                          className="mt-1 flex items-center gap-1.5 font-mono"
                          style={{ fontSize: 11, color: "var(--ink-dim)" }}
                        >
                          <Star size={11} fill="currentColor" style={{ color: "var(--coral)" }} />
                          <span style={{ color: "var(--ink)" }}>{p.rating}</span>
                          <span>({p.reviews})</span>
                          <span>· {p.meta}</span>
                        </div>
                        <p className="mt-1 font-sans" style={{ fontSize: "var(--t-sm)", color: "var(--ink-soft)" }}>
                          {p.why}
                        </p>
                      </div>
                      <span
                        className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                        style={{
                          border: on ? "none" : "1.5px solid rgba(20,19,24,0.2)",
                          background: on ? "var(--ink)" : "transparent",
                          color: "var(--cream)",
                        }}
                        aria-hidden
                      >
                        {on && <Check size={12} strokeWidth={3} />}
                      </span>
                    </div>
                  </motion.button>
                  </motion.div>

                );
              })}
            </div>

            {/* action / status */}
            <div className="mt-3 min-h-[58px]">
              <AnimatePresence mode="wait">
                {phase === "choose" && chosen && (
                  <motion.button
                    key="book"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    onClick={book}
                    className="pill-btn pill-blue w-full"
                  >
                    <Phone size={17} strokeWidth={2.4} />
                    book {chosen.name.split(" ").slice(-1)[0]} for 5
                  </motion.button>
                )}

                {phase === "calling" && (
                  <motion.div
                    key="calling"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3"
                    style={{ border: "2px solid var(--ink)", background: "var(--cream)" }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: "var(--coral)" }}
                    />
                    <span className="min-w-0 truncate font-sans" style={{ fontSize: "var(--t-base)" }}>
                      calling {chosen?.name} · on hold
                    </span>
                    <span className="ml-auto shrink-0 font-mono" style={{ fontSize: 13, fontWeight: 700 }}>
                      {mm}:{ss}
                    </span>
                  </motion.div>
                )}

                {phase === "done" && (
                  <motion.button
                    key="done"
                    initial={{ opacity: 0, rotateX: -70 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    onClick={reset}
                    className="w-full rounded-2xl px-4 py-3 text-left"
                    style={{ border: "2px solid var(--ink)", background: "var(--mint-pop)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Check size={16} strokeWidth={3} />
                      <span className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>
                        table for 5, 7:30pm
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono" style={{ fontSize: 11 }}>
                      added to your calendar · tap to replay
                    </p>
                  </motion.button>
                )}

                {phase === "choose" && !chosen && (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-4 text-center font-mono"
                    style={{ fontSize: 11, color: "var(--ink-dim)" }}
                  >
                    tap one. she does the awkward phone part.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
