import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Minimal, consistent section reveal: soft mask-wipe + small rise. */
export function Reveal({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12, clipPath: "inset(0 0 14% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 0.8, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Hairline that draws itself under a section heading. */
export function HairRule({ dark = false }: { dark?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, ease: [0.22, 0.8, 0.24, 1] }}
      className="mt-6 h-px w-full origin-left"
      style={{ background: dark ? "rgba(255,253,248,0.18)" : "rgba(20,19,24,0.12)" }}
      aria-hidden
    />
  );
}
