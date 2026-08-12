import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Pill = { label: string; cat: "home" | "health" | "fin" | "travel" | "family"; size: "lg" | "md" | "sm" };

const CATS: Record<Pill["cat"], string> = {
  home: "#C25B3F",
  health: "#8BA888",
  fin: "#D4A574",
  travel: "#7EADC2",
  family: "#C9956F",
};

const PILLS: Pill[] = [
  { label: "cancel this subscription", cat: "fin", size: "lg" },
  { label: "why was i charged $60", cat: "fin", size: "lg" },
  { label: "my landlord's ghosting me", cat: "home", size: "lg" },
  { label: "i need a dentist", cat: "health", size: "lg" },
  { label: "chase my deposit", cat: "fin", size: "md" },
  { label: "return this order", cat: "fin", size: "md" },
  { label: "cancel my gym", cat: "fin", size: "md" },
  { label: "get my prescription", cat: "health", size: "md" },
  { label: "dinner for 6 saturday", cat: "travel", size: "md" },
  { label: "cake by friday", cat: "family", size: "md" },
  { label: "is it still in stock", cat: "home", size: "md" },
  { label: "what time do they close", cat: "home", size: "md" },
  { label: "DMV appointment", cat: "fin", size: "md" },
  { label: "a therapist who takes my insurance", cat: "health", size: "md" },
  { label: "get me 5 quotes", cat: "home", size: "md" },
  { label: "book the haircut", cat: "family", size: "sm" },
  { label: "fight this parking ticket", cat: "fin", size: "sm" },
  { label: "internet's out again", cat: "home", size: "sm" },
  { label: "reschedule my flight", cat: "travel", size: "md" },
  { label: "lower my phone bill", cat: "fin", size: "sm" },
  { label: "the AC is broken", cat: "home", size: "sm" },
  { label: "find movers", cat: "home", size: "md" },
  { label: "book the vet", cat: "family", size: "sm" },
  { label: "insurance claim", cat: "fin", size: "md" },
  { label: "flowers to mom", cat: "family", size: "sm" },
  { label: "check on grandpa", cat: "family", size: "md" },
  { label: "doctor follow-up", cat: "health", size: "sm" },
  { label: "renew my passport", cat: "travel", size: "md" },
  { label: "hotel for the wedding", cat: "travel", size: "sm" },
  { label: "locksmith, now", cat: "home", size: "sm" },
  { label: "pharmacy refill", cat: "health", size: "sm" },
  { label: "reverse this bank fee", cat: "fin", size: "sm" },
  { label: "tailor my suit", cat: "family", size: "sm" },
  { label: "car service", cat: "home", size: "sm" },
  { label: "chase this invoice", cat: "fin", size: "sm" },
  { label: "notary booking", cat: "fin", size: "sm" },
  { label: "grocery delivery", cat: "home", size: "sm" },
  { label: "table for two tonight", cat: "travel", size: "sm" },
];


// Collision-avoiding positions clamped to safe inner bounds
function generatePositions(count: number) {
  const out: { x: number; y: number; delay: number; dur: number }[] = [];
  const minDist = 12;
  const X_MIN = 8, X_MAX = 88;
  const Y_MIN = 10, Y_MAX = 88;
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, ok = false, tries = 0;
    while (!ok && tries < 120) {
      const a = Math.sin((i + 1) * 9.31 + tries * 0.7) * 10000;
      const b = Math.cos((i + 1) * 4.27 + tries * 1.3) * 10000;
      x = ((a - Math.floor(a)) * (X_MAX - X_MIN)) + X_MIN;
      y = ((b - Math.floor(b)) * (Y_MAX - Y_MIN)) + Y_MIN;
      ok = out.every((p) => Math.hypot(p.x - x, p.y - y) > minDist);
      tries++;
    }
    out.push({
      x,
      y,
      delay: ((i * 13) % 100) / 100,
      dur: 7 + ((i * 7) % 8),
    });
  }
  return out;
}

const POS = generatePositions(PILLS.length);
const MOBILE_PILLS = PILLS.slice(0, 20);

export function Act4Cloud() {
  const ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cloudOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const cloudScale = useTransform(scrollYProgress, [0.1, 0.4], [0.92, 1]);

  return (
    <section ref={ref} className="relative py-24 md:py-32" style={{ overflowX: "hidden" }}>
      <div className="text-center mb-12 md:mb-14 px-5 sm:px-6">
        <h2
          className="font-display lowercase"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(2rem, 7vw, 5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 600,
          }}
        >
          anything that needs a human on the other end.
        </h2>
        <p
          className="mt-3 md:mt-4 font-sans"
          style={{ color: "#6B6560", fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)" }}
        >
          say it how you'd say it to a friend.
        </p>
      </div>


      {isMobile ? (
        <motion.div
          className="px-4 mx-auto max-w-xl flex flex-wrap justify-center gap-2.5"
          style={{ opacity: cloudOpacity, minHeight: 500 }}
        >
          {MOBILE_PILLS.map((p, i) => (
            <FlowingPill key={p.label} pill={p} delay={(i % 6) * 0.25} dur={6 + (i % 4)} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          ref={containerRef}
          className="relative mx-auto"
          style={{
            opacity: cloudOpacity,
            scale: cloudScale,
            height: "min(78vh, 720px)",
            maxWidth: "1280px",
            paddingInline: "24px",
            overflow: "hidden",
          }}
        >
          {PILLS.map((p, i) => (
            <FloatingPill key={p.label} pill={p} pos={POS[i]} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

function FlowingPill({ pill, delay, dur }: { pill: Pill; delay: number; dur: number }) {
  const sizeClass =
    pill.size === "lg" ? "px-4 py-2.5 text-[0.9rem]"
    : pill.size === "md" ? "px-3.5 py-2 text-[0.82rem]"
    : "px-3 py-2 text-[0.78rem]";
  return (
    <motion.div
      animate={{ y: [0, -4, 0, 3, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full font-sans font-normal whitespace-nowrap ${sizeClass}`}
        style={{
          background: "rgba(251, 248, 243, 0.85)",
          color: "#5C5349",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(44,37,32,0.08)",
          minHeight: 36,
        }}
      >
        <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: CATS[pill.cat] }} />
        {pill.label}
      </span>
    </motion.div>
  );
}

function FloatingPill({
  pill, pos,
}: {
  pill: Pill;
  pos: { x: number; y: number; delay: number; dur: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      const radius = 90;
      if (d < radius && d > 0.1) {
        const force = (radius - d) * 0.15;
        setOffset({ x: -(dx / d) * force, y: -(dy / d) * force });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const sizeClass =
    pill.size === "lg" ? "px-5 py-3 text-[0.95rem]"
    : pill.size === "md" ? "px-4 py-2.5 text-[0.85rem]"
    : "px-3.5 py-2 text-[0.78rem]";

  return (
    <motion.div
      ref={ref}
      className="absolute select-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.6 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0, 6, 0] }}
        transition={{ duration: pos.dur, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
      >
        <button
          className={`group inline-flex items-center gap-2 rounded-full font-sans font-normal whitespace-nowrap transition-all duration-300 ${sizeClass}`}
          style={{
            background: "rgba(251, 248, 243, 0.85)",
            color: "#5C5349",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(44,37,32,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-terracotta)";
            e.currentTarget.style.color = "var(--color-espresso)";
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(44,37,32,0.06)";
            e.currentTarget.style.color = "#5C5349";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: CATS[pill.cat] }} />
          {pill.label}
        </button>
      </motion.div>
    </motion.div>
  );
}
