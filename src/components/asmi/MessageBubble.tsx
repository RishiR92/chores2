import { motion } from "motion/react";

export function Bubble({
  children,
  from = "asmi",
  time,
  delay = 0,
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  from?: "asmi" | "you";
  time?: string;
  delay?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  const mine = from === "you";
  const fontSize = size === "lg" ? "clamp(1.05rem, 2.6vw, 1.5rem)" : "clamp(0.98rem, 2.1vw, 1.12rem)";
  return (
    <div className={`flex w-full ${mine ? "justify-end" : "justify-start"} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 420, damping: 26, delay }}
        className="max-w-[36rem]"
        style={{ transformOrigin: mine ? "bottom right" : "bottom left" }}
      >
        <div
          className="font-sans"
          style={{
            background: mine ? "var(--color-terracotta)" : "var(--color-cream)",
            color: mine ? "var(--color-cream)" : "var(--color-espresso-strong)",
            border: mine ? "none" : "1px solid rgba(44,37,32,0.07)",
            borderRadius: 22,
            borderBottomRightRadius: mine ? 7 : 22,
            borderBottomLeftRadius: mine ? 22 : 7,
            padding: size === "lg" ? "1rem 1.25rem" : "0.75rem 1rem",
            fontSize,
            lineHeight: 1.42,
            fontWeight: 400,
            boxShadow: mine
              ? "0 14px 30px -18px rgba(194,91,63,0.75)"
              : "0 14px 30px -20px rgba(44,37,32,0.4)",
          }}
        >
          {children}
        </div>
        {time && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.35, duration: 0.5 }}
            className="label-mono mt-1.5"
            style={{
              color: "var(--color-stone-dim)",
              textAlign: mine ? "right" : "left",
              paddingInline: 6,
            }}
          >
            {time}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export function TypingBubble({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="inline-flex items-center gap-1.5"
      style={{
        background: "var(--color-cream)",
        border: "1px solid rgba(44,37,32,0.07)",
        borderRadius: 22,
        borderBottomLeftRadius: 7,
        padding: "0.7rem 0.95rem",
      }}
      aria-label="asmi is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 6, height: 6, borderRadius: 99, background: "var(--color-stone-dim)" }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  );
}

export function Aftermath({ children, delay = 0.15 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay }}
      className="font-serif italic"
      style={{
        color: "var(--color-stone)",
        fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
        lineHeight: 1.4,
      }}
    >
      {children}
    </motion.p>
  );
}
