import { motion } from "motion/react";

type OrbState = "idle" | "live" | "news" | "done";

export function AsmiOrb({
  state = "idle",
  size = 40,
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
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      onClick={onClick}
      className={`asmi-orb ${live ? "live" : "idle"} ${className}`}
      style={{ width: size, height: size }}
      aria-label="asmi"
    >
      {state === "news" && (
        <span
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full"
          style={{ background: "#E64BFF", boxShadow: "0 0 0 2px white" }}
        />
      )}
    </motion.button>
  );
}
