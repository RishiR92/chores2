import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Marquee } from "./Marquee";
import { Reveal, RevealGroup } from "./Reveal";

interface Chore {
  label: string;
  reply: string;
}

const CHORES: Chore[] = [
  { label: "cancel this subscription", reply: "found the retention line they hide. cancelled, confirmation in your inbox." },
  { label: "lower my internet bill", reply: "2 hrs with retentions. $34 off a month, same speed. you're welcome." },
  { label: "chase my insurance claim", reply: "day 6 of politely refusing to go away. adjuster assigned, callback at 4pm." },
  { label: "book a haircut saturday", reply: "called 3 shops. 11:15am saturday — the one you actually liked." },
  { label: "reschedule my flight", reply: "held the airline line. no change fee if we take the 6:40am." },
  { label: "DMV appointment", reply: "38 minutes in their queue so you weren't. thurs 9:10am, you're in." },
  { label: "dispute this parking ticket", reply: "contest form filed, office called, hearing date pinned down." },
  { label: "my landlord's ghosting me", reply: "two calls, a text, and an email with a paper trail. he replied." },
  { label: "return this order", reply: "prised the label out of them and booked tuesday pickup." },
  { label: "is this in stock nearby?", reply: "called 5 stores. two have it — one's holding yours at the counter." },
  { label: "find a mover for the 14th", reply: "3 quotes in. cheapest $420, soonest the 13th. pick one, i'll book it." },
  { label: "get my car serviced", reply: "friday 8am, loaner included, $190 quoted. haggled a little." },
  { label: "renew my passport", reply: "wait times checked, appointment booked, and a list of what to bring." },
  { label: "cancel my gym", reply: "they dodged twice. third call plus written notice — cancelled, no fee." },
  { label: "vet slot for the dog", reply: "two clinics full. third had a 5:40pm cancellation. took it instantly." },
];

const ROW_A = CHORES.slice(0, 8);
const ROW_B = CHORES.slice(8);

function Request({
  chore,
  active,
  onSelect,
}: {
  chore: Chore;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="shrink-0 whitespace-nowrap px-4 py-3 text-left transition-colors"
      style={{
        borderRadius: 10,
        border: "1px solid var(--ink)",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--cream)" : "var(--ink)",
        fontSize: "var(--t-base)",
      }}
    >
      {chore.label}
    </button>
  );
}

export function ChoreGrid() {
  const [open, setOpen] = useState<Chore | null>(null);

  return (
    <section id="stories" className="relative py-11 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <RevealGroup>
          <Reveal inGroup variant="text">
            <h2 className="max-w-2xl">she'll handle this.</h2>
          </Reveal>
          <Reveal inGroup variant="accent">
            <p className="t-body mt-4 max-w-lg" style={{ color: "var(--ink-soft)" }}>
              tap one. see exactly how she'd close it.
            </p>
          </Reveal>
        </RevealGroup>
      </div>

      <div className="mt-9 flex flex-col gap-3">
        <Marquee baseVelocity={30} paused={!!open}>
          {ROW_A.map((c, i) => (
            <Fragment key={c.label}>
              <Request chore={c} active={open?.label === c.label} onSelect={() => setOpen(c)} />
              {i % 3 === 2 && <Punctuation src={i % 6 === 2 ? wrenchImg : bellImg} />}
            </Fragment>
          ))}
        </Marquee>
        <Marquee baseVelocity={-24} paused={!!open}>
          {ROW_B.map((c, i) => (
            <Fragment key={c.label}>
              <Request chore={c} active={open?.label === c.label} onSelect={() => setOpen(c)} />
              {i % 3 === 1 && <Punctuation src={i % 6 === 1 ? ticketImg : receiptImg} />}
            </Fragment>
          ))}
        </Marquee>
      </div>


      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key={open.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 0.8, 0.24, 1] }}
              className="mt-8 flex max-w-xl items-start gap-3"
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display"
                style={{ background: "var(--ink)", color: "var(--cream)", fontSize: 13, fontWeight: 700 }}
              >
                a
              </span>
              <p
                className="t-body px-4 py-3"
                style={{
                  background: "rgba(20,19,24,0.06)",
                  borderRadius: 18,
                  borderBottomLeftRadius: 6,
                }}
              >
                {open.reply}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
