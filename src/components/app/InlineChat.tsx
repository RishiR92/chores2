import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import type { ChatMsg, CanvasStatus } from "./useCanvases";

export function InlineChat({
  chat,
  onSend,
  status,
}: {
  chat: ChatMsg[];
  onSend: (text: string) => void;
  status: CanvasStatus;
}) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="space-y-3">
      {chat.length > 0 && (
        <div ref={scrollRef} className="max-h-44 space-y-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {chat.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug ${
                    m.role === "user" ? "chat-user" : "chat-asmi"
                  }`}
                >
                  {m.pending ? <TypingDots /> : m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <form onSubmit={submit} className="flex items-end gap-2">
        <div className="flex-1 rounded-full border border-[color:var(--glass-border)] bg-white/55 px-4 py-2 backdrop-blur-xl">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={status === "done" ? "task wrapped — type to reopen the thread…" : "push this forward…"}
            className="w-full bg-transparent text-[14px] outline-none placeholder:italic"
            style={{ color: "var(--color-espresso)" }}
          />
        </div>
        <button
          type="submit"
          aria-label="send"
          disabled={!text.trim()}
          className="grid h-9 w-9 place-items-center rounded-full transition-all disabled:opacity-40"
          style={{
            background: "var(--color-terracotta)",
            color: "var(--color-cream)",
          }}
        >
          <ArrowUp size={15} />
        </button>
      </form>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: "var(--color-stone-dim)",
            animation: `typing-dot 1.1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
