import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const EASE = [0.22, 0.8, 0.24, 1] as const;

/** One digit column that rolls vertically like a split-flap board. */
function Digit({ value, size }: { value: string; size: number }) {
  const reduced = useReducedMotion();
  if (reduced || !/\d/.test(value)) {
    return (
      <span className="font-mono tabular-nums" style={{ fontSize: size, lineHeight: 1 }}>
        {value}
      </span>
    );
  }
  const n = Number(value);
  return (
    <span
      className="relative inline-block overflow-hidden font-mono tabular-nums"
      style={{ height: size * 1.06, width: size * 0.62, lineHeight: 1 }}
      aria-hidden
    >
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: -n * size * 1.06 }}
        transition={{ duration: 0.42, ease: EASE }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} style={{ height: size * 1.06, fontSize: size, lineHeight: `${size * 1.06}px` }}>
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** Split-flap number/clock. Pass any string; digits roll, separators stay. */
export function FlipNumber({ value, size = 64 }: { value: string; size?: number }) {
  return (
    <span className="inline-flex items-baseline" aria-label={value}>
      {value.split("").map((ch, i) => (
        <Digit key={i} value={ch} size={size} />
      ))}
    </span>
  );
}

/** Word that rolls upward on a fixed interval. */
export function RollingWord({
  words,
  interval = 1600,
  className = "",
  style,
}: {
  words: string[];
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [interval, reduced, words.length]);

  if (reduced) {
    return (
      <span className={className} style={style}>
        {words[0]}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-grid overflow-hidden align-bottom ${className}`}
      style={{ ...style, gridTemplateAreas: '"w"' }}
    >
      {/* invisible sizer keeps layout from jumping */}
      <span className="invisible" style={{ gridArea: "w" }}>
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          style={{ gridArea: "w" }}
          className="whitespace-nowrap"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
