import { motion } from "motion/react";
import { ChannelCTA } from "./ChannelCTA";

export function CloseCTA() {
  return (
    <section id="start" className="ink-section relative grain overflow-hidden px-5 py-20 sm:px-8 md:py-28">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "rgba(232,255,90,0.18)" }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-[2.4rem] sm:text-6xl"
        >
          you stop thinking about it.
        </motion.h2>
        <p className="mt-5 max-w-md font-sans" style={{ fontSize: 17, color: "rgba(255,253,248,0.72)" }}>
          text her once. she takes it from there — and won't stop until it's done.
        </p>
        <div className="mt-9">
          <ChannelCTA size="lg" variant="dark" align="center" />
        </div>
        <p className="mt-4 font-mono" style={{ fontSize: 11.5, color: "rgba(255,253,248,0.45)" }}>
          no app · no signup · she replies in seconds
        </p>
      </div>
    </section>
  );
}
