import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import { AsmiOrb } from "./AsmiOrb";
import type { Canvas, OptionsAction } from "./useCanvases";

const SUGGESTIONS = [
  "call my plumber for saturday",
  "find ramen near mission",
  "remind dad sunday at 11",
  "get 3 quotes for the garage door",
];

const ACTIONS: { id: OptionsAction; label: string }[] = [
  { id: "call_top", label: "call top 3" },
  { id: "call_priority", label: "call by priority" },
  { id: "message_all", label: "message all" },
  { id: "asmi_pick", label: "let asmi pick" },
];

export function GlassDock({
  active,
  onSend,
  onSpawn,
  onRunAction,
  orbState,
}: {
  active?: Canvas;
  onSend: (text: string) => void;
  onSpawn: (text: string) => void;
  onRunAction: (action: OptionsAction) => void;
  orbState: "idle" | "live" | "news" | "done";
}) {
  const [composer, setComposer] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // count selected options on active canvas to drive action mode
  const selected = (active?.options ?? []).filter((o) => o.selected).length;
  const hasOptions = !!active?.options && active.options.length > 0;
  const actionMode = hasOptions && selected > 0 && !composer;

  useEffect(() => {
    if (composer) setTimeout(() => inputRef.current?.focus(), 50);
  }, [composer]);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    if (composer) {
      onSpawn(t);
      setComposer(false);
    } else if (active) {
      onSend(t);
    }
    setText("");
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4 sm:pb-6">
      <div className="pointer-events-auto w-full max-w-xl">
        <AnimatePresence mode="wait">
          {composer ? (
            <motion.div
              key="composer"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="glass-pill rounded-[28px] p-3"
            >
              <div className="flex items-start gap-2">
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                    if (e.key === "Escape") setComposer(false);
                  }}
                  rows={2}
                  placeholder="hand asmi a task…"
                  className="min-h-[48px] flex-1 resize-none bg-transparent px-2 pt-2 text-[15px] leading-snug outline-none placeholder:text-[color:var(--color-ink-soft)]"
                  style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                />
                <button
                  onClick={() => setComposer(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[color:var(--color-ink-soft)] hover:bg-black/5"
                  aria-label="close"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setText(s)}
                    className="shrink-0 rounded-full bg-white/70 px-3 py-1.5 text-[12px] text-[color:var(--color-ink-soft)] hover:bg-white"
                    style={{ border: "1px solid rgba(26,24,20,0.06)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-1 flex items-center justify-between px-1">
                <span className="chip-mono">enter to send</span>
                <button
                  onClick={submit}
                  disabled={!text.trim()}
                  className="grid h-9 w-9 place-items-center rounded-full transition-all disabled:opacity-40"
                  style={{ background: "var(--color-ink)", color: "white" }}
                  aria-label="send"
                >
                  <ArrowUp size={15} />
                </button>
              </div>
            </motion.div>
          ) : actionMode ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="glass-pill flex items-center gap-1.5 rounded-full p-1.5"
            >
              <span
                className="chip-mono shrink-0 rounded-full px-2.5 py-1"
                style={{ background: "rgba(214,115,65,0.12)", color: "var(--color-amber-deep)" }}
              >
                {selected} selected
              </span>
              <div className="flex flex-1 gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {ACTIONS.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => onRunAction(a.id)}
                    className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-all"
                    style={
                      i === 0
                        ? { background: "var(--color-amber)", color: "white" }
                        : { background: "rgba(255,255,255,0.65)", color: "var(--color-ink)" }
                    }
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="glass-pill flex items-center gap-2 rounded-full py-2 pl-5 pr-2"
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder={active ? "ask asmi…" : "hand asmi a task…"}
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[color:var(--color-ink-soft)]"
                style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
              />
              {text.trim() ? (
                <button
                  onClick={submit}
                  className="grid h-9 w-9 place-items-center rounded-full"
                  style={{ background: "var(--color-ink)", color: "white" }}
                  aria-label="send"
                >
                  <ArrowUp size={15} />
                </button>
              ) : (
                <AsmiOrb state={orbState} size={36} onClick={() => setComposer(true)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
