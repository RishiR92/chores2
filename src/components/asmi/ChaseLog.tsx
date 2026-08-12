import { motion } from "motion/react";
import { ChannelGlyph, ChannelKind } from "./ChannelIcons";

export interface ChaseStep {
  kind: ChannelKind;
  text: string;
  time: string;
  tone?: "normal" | "fail" | "win";
}

export function ChaseLog({
  steps,
  dark = false,
  delay = 0,
}: {
  steps: ChaseStep[];
  dark?: boolean;
  delay?: number;
}) {
  const line = dark ? "rgba(255,253,248,0.16)" : "rgba(20,19,24,0.12)";
  const dim = dark ? "rgba(255,253,248,0.55)" : "var(--ink-dim)";
  const body = dark ? "var(--cream)" : "var(--ink)";

  return (
    <ul className="relative flex flex-col gap-2.5 pl-5">
      <span
        className="absolute left-[7px] top-2 bottom-2 w-px"
        style={{ background: line }}
        aria-hidden
      />
      {steps.map((s, i) => {
        const win = s.tone === "win";
        const fail = s.tone === "fail";
        const accent = win ? "var(--mint-pop)" : fail ? "var(--coral)" : "var(--blue)";
        return (
          <motion.li
            key={s.text + i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: delay + i * 0.14, type: "spring", stiffness: 260, damping: 22 }}
            className="relative flex items-center gap-2.5"
          >
            <span
              className="absolute -left-5 grid place-items-center rounded-full"
              style={{
                width: 15,
                height: 15,
                background: win ? accent : dark ? "var(--ink)" : "var(--cream)",
                border: `2px solid ${accent}`,
                color: accent,
              }}
              aria-hidden
            />
            <span style={{ color: accent }} aria-hidden>
              <ChannelGlyph kind={s.kind} size={14} />
            </span>
            <span
              className="font-sans"
              style={{ fontSize: 14, color: body, fontWeight: win ? 600 : 400 }}
            >
              {s.text}
            </span>
            <span className="font-mono ml-auto shrink-0" style={{ fontSize: 11, color: dim }}>
              {s.time}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
