import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Chore {
  label: string;
  reply: string;
  tint: string;
}

const CHORES: Chore[] = [
  { label: "cancel this subscription", reply: "found the retention line. cancelled, confirmation emailed to you.", tint: "var(--coral)" },
  { label: "lower my internet bill", reply: "2 hrs with retentions. $34 off a month, same speed.", tint: "var(--blue)" },
  { label: "chase my insurance claim", reply: "day 6 of chasing. adjuster assigned, callback booked for 4pm.", tint: "var(--violet-soft)" },
  { label: "book a haircut saturday", reply: "called 3 shops. 11:15am saturday, the one you liked last time.", tint: "var(--citrus)" },
  { label: "reschedule my flight", reply: "on with the airline. no change fee if we move to the 6:40am.", tint: "var(--mint-pop)" },
  { label: "DMV appointment", reply: "sat in their queue 38 min. you're in for thurs 9:10am.", tint: "var(--blue)" },
  { label: "dispute this parking ticket", reply: "filed the contest form + called the office for a hearing date.", tint: "var(--coral)" },
  { label: "my landlord's ghosting me", reply: "called twice, texted, and emailed with a paper trail. he replied.", tint: "var(--citrus)" },
  { label: "return this order", reply: "got the label out of them and booked the pickup for tuesday.", tint: "var(--violet-soft)" },
  { label: "is this in stock nearby?", reply: "called 5 stores. two have it — one's holding it under your name.", tint: "var(--mint-pop)" },
  { label: "find a mover for the 14th", reply: "3 quotes in. cheapest $420, soonest is the 13th. want the list?", tint: "var(--blue)" },
  { label: "get my car serviced", reply: "booked friday 8am, they'll do the loaner. quoted $190.", tint: "var(--coral)" },
  { label: "renew my passport", reply: "checked the wait times, booked your appointment, listed what to bring.", tint: "var(--violet-soft)" },
  { label: "cancel my gym", reply: "they dodged twice. third call + written notice — cancelled, no fee.", tint: "var(--citrus)" },
  { label: "vet slot for the dog", reply: "two clinics full. third had a 5:40pm cancellation — took it.", tint: "var(--mint-pop)" },
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
