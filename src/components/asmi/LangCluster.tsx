import { motion } from "motion/react";

const LANGS = [
  "english", "español", "हिन्दी", "العربية", "français", "中文", "português", "tagalog",
  "deutsch", "italiano", "русский", "日本語", "한국어", "polski", "tiếng việt", "türkçe",
  "বাংলা", "தமிழ்", "ਪੰਜਾਬੀ", "ελληνικά", "svenska", "nederlands", "farsi", "kiswahili",
  "עברית", "ไทย", "українська", "magyar", "română", "čeština",
];

const POP = new Set(["हिन्दी", "العربية", "español", "tagalog"]);

export function LangCluster() {
  return (
    <section id="languages" className="relative px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-[2.1rem] sm:text-5xl">50+ languages. one number.</h2>
        <p className="mx-auto mt-4 max-w-md font-sans" style={{ color: "var(--ink-soft)", fontSize: 16.5 }}>
          she speaks to whoever picks up, in whatever they speak.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-2">
          {LANGS.map((l, i) => {
            const pop = POP.has(l);
            return (
              <motion.span
                key={l}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: pop ? 1 : 0.6, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.025, type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-full px-3 py-1.5 font-sans"
                style={{
                  fontSize: pop ? 17 : 14,
                  fontWeight: pop ? 700 : 400,
                  background: pop ? "var(--coral)" : "rgba(20,19,24,0.05)",
                  color: pop ? "#fff" : "var(--ink-soft)",
                }}
              >
                {l}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
