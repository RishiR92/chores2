import { motion } from "motion/react";

type OrbState = "idle" | "live" | "news" | "done";

export function AsmiOrb({
  state = "idle",
  size = 36,
  onClick,
  className = "",
}: {
  state?: OrbState;
  size?: number;
  onClick?: () => void;
  className?: string;
}) {
  const live = state === "live" || state === "news";
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`asmi-orb ${live ? "live" : "idle"} ${className}`}
      style={{ width: size, height: size }}
      aria-label="asmi"
    >
      {state === "news" && (
        <span
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--color-amber-deep)", boxShadow: "0 0 0 2px white" }}
        />
      )}
    </motion.button>
  );
}
