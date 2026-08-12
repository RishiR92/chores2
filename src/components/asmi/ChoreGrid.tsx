import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Chore {
  label: string;
  reply: string;
  tint: string;
}

const CHORES: Chore[] = [
  { label: "cancel this subscription", reply: "found the retention line. cancelled, confirmation emailed to you.", tint: "var(--coral)" },
  { label: "why was i charged $60", reply: "bank says merchant hold. disputing it now — i'll chase the merchant too.", tint: "var(--blue)" },
  { label: "book the dentist", reply: "calling the 4 nearest. mornings only, right?", tint: "var(--violet-soft)" },
  { label: "my landlord's ghosting me", reply: "called twice, texted, and emailed with a paper trail. he replied.", tint: "var(--citrus)" },
  { label: "find a plumber, call all 3", reply: "ringing all three at once. best quote so far: $180, tonight.", tint: "var(--mint-pop)" },
  { label: "DMV appointment", reply: "sat in their queue 38 min. you're in for thurs 9:10am.", tint: "var(--blue)" },
  { label: "dispute this parking ticket", reply: "filed the contest form + called the office for a hearing date.", tint: "var(--coral)" },
  { label: "reschedule my flight", reply: "on with the airline. no change fee if we move to the 6:40am.", tint: "var(--violet-soft)" },
  { label: "is this in stock?", reply: "called 5 stores. two have it — one's holding it under your name.", tint: "var(--mint-pop)" },
  { label: "chase my refund", reply: "day 3 of chasing. escalated to a supervisor, callback booked.", tint: "var(--citrus)" },
];

export function ChoreGrid() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="stories" className="relative px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-2xl text-[2.1rem] sm:text-5xl">she'll handle this.</h2>
        <p className="mt-4 max-w-lg font-sans" style={{ color: "var(--ink-soft)", fontSize: 16.5 }}>
          tap one to see how she'd run it.
        </p>

        <div className="mt-9 flex flex-wrap gap-2.5">
          {CHORES.map((c, i) => {
            const on = open === c.label;
            return (
              <motion.button
                key={c.label}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.035, type: "spring", stiffness: 300, damping: 22 }}
                onClick={() => setOpen(on ? null : c.label)}
                className="rounded-full px-4 py-3 font-sans text-left transition-colors"
                style={{
                  fontSize: 15,
                  minHeight: 46,
                  border: "2px solid var(--ink)",
                  background: on ? c.tint : "var(--cream)",
                  color: "var(--ink)",
                  fontWeight: on ? 600 : 400,
                }}
              >
                {c.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key={open}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
              className="mt-6 flex max-w-xl items-start gap-3"
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display"
                style={{ background: "var(--blue)", color: "#fff", fontSize: 13, fontWeight: 700 }}
              >
                a
              </span>
              <p
                className="rounded-3xl px-4 py-3 font-sans"
                style={{
                  fontSize: 15,
                  background: "rgba(20,19,24,0.06)",
                  borderBottomLeftRadius: 8,
                }}
              >
                {CHORES.find((c) => c.label === open)?.reply}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
