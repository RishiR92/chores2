import { motion } from "motion/react";
import { AmbientBlobs } from "./Atmosphere";
import { WaitlistForm } from "./WaitlistForm";
import { ChannelRow } from "./ChannelIcons";
import { Bubble } from "./MessageBubble";

export function Act6Close() {
  return (
    <section id="start" className="relative" style={{ padding: "80px 20px", minHeight: "90vh" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.5 }}>
        <AmbientBlobs density={5} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center text-center">
        <motion.h2
          className="font-display lowercase"
          style={{
            color: "var(--color-espresso-strong)",
            fontSize: "clamp(2.6rem, 11vw, 6rem)",
            lineHeight: 0.94,
            letterSpacing: "-0.045em",
            fontWeight: 600,
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        >
          you stop{" "}
          <span className="font-serif italic" style={{ color: "var(--color-terracotta)", fontWeight: 400 }}>
            thinking
          </span>{" "}
          about it.
        </motion.h2>

        <motion.div
          className="mt-10 w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Bubble from="asmi" time="tomorrow · 9:03am">
            morning. what's on the list?
          </Bubble>
        </motion.div>

        <motion.div
          className="mt-10 flex justify-center px-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <WaitlistForm size="lg" />
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ChannelRow caption="no app. no signup. just text her." />
        </motion.div>
      </div>
    </section>
  );
}
