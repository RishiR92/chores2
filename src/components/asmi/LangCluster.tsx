import { motion } from "motion/react";
import { Reveal, RevealGroup } from "./Reveal";

const LANGS = [
  "english", "中文", "हिन्दी", "español", "العربية", "français", "বাংলা", "português",
  "русский", "اردو", "bahasa indonesia", "deutsch", "日本語", "ਪੰਜਾਬੀ", "मराठी",
  "తెలుగు", "türkçe", "தமிழ்", "tiếng việt", "한국어",
];




export function LangCluster() {
  return (
    <section id="languages" className="relative px-5 py-11 sm:px-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <RevealGroup>
          <Reveal inGroup variant="text">
            <h2 className="text-[1.65rem] sm:text-5xl">50+ languages. one number.</h2>
          </Reveal>
          <Reveal inGroup variant="accent">
            <p className="mx-auto mt-4 max-w-md font-sans" style={{ color: "var(--ink-soft)", fontSize: 15 }}>
              she speaks to whoever picks up, in whatever they speak.
            </p>
          </Reveal>
        </RevealGroup>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-2">
          {LANGS.map((l, i) => (
            <motion.span
              key={l}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.025, type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-full px-3 py-1.5 font-sans"
              style={{
                fontSize: 15,
                fontWeight: 500,
                background: "rgba(20,19,24,0.05)",
                color: "var(--ink-soft)",
              }}
            >
              {l}
            </motion.span>
          ))}
        </div>

      </div>
    </section>
  );
}
