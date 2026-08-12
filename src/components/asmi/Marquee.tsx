import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Horizontal marquee whose speed reacts to scroll velocity.
 * Scroll fast → it lurches and can flip direction; stop → it settles to a drift.
 */
export function Marquee({
  children,
  baseVelocity = 26,
  className = "",
  paused = false,
}: {
  children: ReactNode;
  /** px per second at rest. negative = right-to-left reversed */
  baseVelocity?: number;
  className?: string;
  paused?: boolean;
}) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1200, 0, 1200], [-4, 1, 4], { clamp: false });
  const dir = useRef(1);
  const inner = useRef<HTMLDivElement>(null);

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || paused) return;
    const width = inner.current?.offsetWidth ?? 1;
    const f = factor.get();
    dir.current = f < 0 ? -1 : 1;
    // percent-per-frame relative to one copy's width
    let moveBy = ((baseVelocity * dir.current) / width) * 100 * (delta / 1000);
    moveBy += moveBy * Math.abs(f);
    baseX.set(baseX.get() + moveBy);
  });

  if (reduced) {
    return (
      <div className={`overflow-x-auto ${className}`} style={{ scrollbarWidth: "none" }}>
        <div className="flex w-max gap-3">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
      }}
    >

      <motion.div className="flex w-max flex-nowrap" style={{ x }}>
        <div ref={inner} className="flex flex-nowrap gap-3 pr-3">
          {children}
        </div>
        <div className="flex flex-nowrap gap-3 pr-3" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
