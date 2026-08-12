import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
} from "motion/react";
import { useRef, type ReactNode } from "react";

const EASE = [0.22, 0.8, 0.24, 1] as const;

type Variant = "text" | "card" | "accent";

const VARIANTS: Record<Variant, { from: TargetAndTransition; to: TargetAndTransition; duration: number }> = {
  text: {
    from: { opacity: 0, y: 14, clipPath: "inset(0 0 18% 0)" },
    to: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
    duration: 0.5,
  },
  card: {
    from: { opacity: 0, y: 18, scale: 0.985 },
    to: { opacity: 1, y: 0, scale: 1 },
    duration: 0.46,
  },
  accent: {
    from: { opacity: 0, y: 6 },
    to: { opacity: 1, y: 0 },
    duration: 0.38,
  },
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: Variant;
  /** when inside a RevealGroup, inherit the parent's stagger instead of whileInView */
  inGroup?: boolean;
}

/** Section-level reveal: soft mask-wipe + small rise. */
export function Reveal({ children, delay = 0, className = "", variant = "text", inGroup = false }: RevealProps) {
  const reduced = useReducedMotion();
  const v = VARIANTS[variant];
  if (reduced) return <div className={className}>{children}</div>;

  if (inGroup) {
    return (
      <motion.div
        className={className}
        variants={{
          hidden: v.from,
          show: { ...v.to, transition: { duration: v.duration, ease: EASE } },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={v.from}
      whileInView={v.to}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: v.duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container - children rendered as <Reveal inGroup /> animate in sequence. */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.06,
  delay = 0,
  as: Tag = motion.div,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: typeof motion.div;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  );
}

/**
 * Scroll-linked section wrapper: content drifts up a few px as it enters and
 * eases back down as it leaves. Enough depth to stop the page feeling flat.
 */
export function ScrollSection({
  children,
  className = "",
  strength = 26,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const y = useTransform(smooth, [0, 0.5, 1], [strength, 0, -strength]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}

/** Few-pixel parallax drift for backdrops. Returns a MotionValue for `y`. */
export function useParallax(range = 40): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, [0, 1], [0, -range]);
}

/** Hairline that draws itself under a section heading. */
export function HairRule({ dark = false }: { dark?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, ease: EASE }}
      className="mt-6 h-px w-full origin-left"
      style={{ background: dark ? "rgba(255,253,248,0.18)" : "rgba(20,19,24,0.12)" }}
      aria-hidden
    />
  );
}
