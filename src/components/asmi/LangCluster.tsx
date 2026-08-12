import { Reveal, RevealGroup } from "./Reveal";
import { RollingWord } from "./Ticker";

const LANGS = [
  "english", "中文", "हिन्दी", "español", "العربية", "français", "বাংলা", "português",
  "русский", "اردو", "bahasa", "deutsch", "日本語", "ਪੰਜਾਬੀ", "मराठी",
  "తెలుగు", "türkçe", "தமிழ்", "tiếng việt", "한국어",
];

export function LangCluster() {
  return (
    <section id="languages" className="relative px-5 py-11 sm:px-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <RevealGroup>
          <Reveal inGroup variant="accent">
            <p className="t-mono" style={{ color: "var(--ink-dim)" }}>
              50+ LANGUAGES · ONE NUMBER
            </p>
          </Reveal>
          <Reveal inGroup variant="text">
            <h2 className="mt-5 leading-[1.08]">
              whoever picks up, she answers in{" "}
              <RollingWord
                words={LANGS}
                className="justify-items-start"
                style={{ color: "var(--coral)" }}
              />
            </h2>
          </Reveal>
          <Reveal inGroup variant="accent">
            <p className="t-body mt-5 max-w-md" style={{ color: "var(--ink-soft)" }}>
              no interpreter, no awkward handoff. she just switches.
            </p>
          </Reveal>
        </RevealGroup>
      </div>
    </section>
  );
}
