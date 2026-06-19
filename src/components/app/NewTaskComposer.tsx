import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Phone, Search, Bell, Wrench } from "lucide-react";

const SUGGESTIONS = [
  { icon: Phone, text: "call my plumber and book Saturday morning" },
  { icon: Search, text: "find best ramen near Mission for dinner" },
  { icon: Bell, text: "remind dad sunday about his appointment" },
  { icon: Wrench, text: "get 3 quotes to fix the garage door" },
];

export function NewTaskComposer({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSubmit(t);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center px-4"
      style={{ background: "rgba(44,37,32,0.22)", backdropFilter: "blur(10px)" }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        className="canvas-card w-full max-w-xl p-6"
      >
        <p className="font-serif italic text-[24px]" style={{ color: "var(--color-espresso)" }}>
          what should <span className="ink-underline">asmi</span> handle?
        </p>
        <div className="mt-4 rounded-2xl border border-[color:var(--glass-border)] bg-white/65 p-3 backdrop-blur-xl">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
              if (e.key === "Escape") onClose();
            }}
            rows={3}
            placeholder="a call, a research, a check-in…"
            className="w-full resize-none bg-transparent text-[15px] outline-none placeholder:italic"
            style={{ color: "var(--color-espresso)" }}
          />
          <div className="flex items-center justify-between pt-2">
            <span className="label-mono" style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}>
              enter to send · esc to close
            </span>
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="grid h-8 w-8 place-items-center rounded-full transition-all disabled:opacity-40"
              style={{ background: "var(--color-terracotta)", color: "var(--color-cream)" }}
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.text}
                onClick={() => setText(s.text)}
                className="flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-white/40 px-3 py-2 text-left text-[12.5px] transition-all hover:bg-white/70"
                style={{ color: "var(--color-stone)" }}
              >
                <Icon size={12} style={{ color: "var(--color-terracotta)" }} />
                <span className="flex-1">{s.text}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
