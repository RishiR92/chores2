import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IMessageMark, WhatsAppMark } from "./ChannelIcons";
import { IMSG_LINK, WA_LINK } from "./ChannelCTA";

export function Nav() {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(251, 247, 240, 0.78)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(20,19,24,0.07)",
      }}
    >
      <div
        className="mx-auto flex max-w-7xl items-center px-4 py-2.5 md:px-6"
        style={{ minHeight: 58 }}
      >
        <a
          href="#"
          className="font-display shrink-0"
          style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}
        >
          asmi
        </a>

        <AnimatePresence>
          {past && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="ml-auto flex items-center gap-2"
            >
              <span className="hidden font-mono sm:block" style={{ fontSize: 11, color: "var(--ink-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                text her on
              </span>
              <a href={IMSG_LINK} target="_blank" rel="noopener noreferrer" aria-label="text asmi on imessage">
                <IMessageMark size={32} />
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" aria-label="text asmi on whatsapp">
                <WhatsAppMark size={32} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
