import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Oversized ink arrow — treated as a graphic, not chrome.
 * Desktop pointers only; never mounts on touch or reduced-motion.
 */
export function Cursor() {
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.35 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    setOn(true);
    document.body.classList.add("ink-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(!!el?.closest("a,button,[role='button']"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("ink-cursor");
    };
  }, [x, y]);

  if (!on) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:block"
      style={{ x: sx, y: sy }}
      aria-hidden
    >
      <motion.div
        animate={{ scale: hot ? 0.82 : 1, rotate: hot ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="relative"
      >
        <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
          <path
            d="M2 1.6 L2 27.4 L8.6 21.2 L12.6 30.4 L17.4 28.3 L13.4 19.4 L22.6 19.1 Z"
            fill="var(--ink)"
            stroke="var(--cream)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <motion.span
          animate={{ opacity: hot ? 1 : 0, y: hot ? 0 : 4 }}
          transition={{ duration: 0.16 }}
          className="absolute left-6 top-6 whitespace-nowrap font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            background: "var(--ink)",
            color: "var(--cream)",
            padding: "3px 6px",
            borderRadius: 4,
          }}
        >
          she's on it
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
