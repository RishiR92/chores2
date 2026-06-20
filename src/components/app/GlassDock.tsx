import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, X, Sparkles, Mic, PhoneCall, ListOrdered, MessageSquare, Wand2 } from "lucide-react";
import { AsmiOrb } from "./AsmiOrb";
import type { Canvas, OptionsAction } from "./useCanvases";
import { categoryFor } from "@/lib/categoryIcon";

const SUGGESTIONS: { text: string; id: string }[] = [
  { text: "call my plumber for saturday", id: "plumber-sat" },
  { text: "find ramen near mission", id: "dinner-sf" },
  { text: "remind dad sunday at 11", id: "dad-checkin" },
  { text: "get 3 quotes for the garage door", id: "contractors" },
];

const ACTIONS: { id: OptionsAction; label: string; Icon: typeof PhoneCall }[] = [
  { id: "call_top",      label: "call top 3",       Icon: PhoneCall },
  { id: "call_priority", label: "by priority",      Icon: ListOrdered },
  { id: "message_all",   label: "message all",      Icon: MessageSquare },
  { id: "asmi_pick",     label: "let asmi pick",    Icon: Wand2 },
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

  const selected = (active?.options ?? []).filter((o) => o.selected).length;
  const hasOptions = !!active?.options && active.options.length > 0;
  const actionMode = hasOptions && selected > 0 && !composer;

  useEffect(() => {
    if (composer) setTimeout(() => inputRef.current?.focus(), 50);
  }, [composer]);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    if (composer) { onSpawn(t); setComposer(false); }
    else if (active) { onSend(t); }
    setText("");
  };

  const spring = { type: "spring" as const, stiffness: 500, damping: 28 };

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
              transition={spring}
              className="glass-pill rounded-[28px] p-3"
            >
              <div className="flex items-start gap-2">
                <span className="mt-2 ml-1 grid place-items-center" style={{ color: "#7C3AED" }}>
                  <Sparkles size={16} strokeWidth={1.8} />
                </span>
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
                    if (e.key === "Escape") setComposer(false);
                  }}
                  rows={2}
                  placeholder="hand asmi a task…"
                  className="min-h-[48px] flex-1 resize-none bg-transparent px-1 pt-1.5 text-[15px] leading-snug outline-none placeholder:text-[color:var(--color-ink-soft)]"
                  style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setComposer(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[color:var(--color-ink-soft)] hover:bg-violet-50"
                  aria-label="close"
                >
                  <X size={14} />
                </motion.button>
              </div>
              <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {SUGGESTIONS.map((s) => {
                  const cat = categoryFor({ id: s.id, title: s.text });
                  const Icon = cat.Icon;
                  return (
                    <motion.button
                      key={s.text}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setText(s.text)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[12px] text-[color:var(--color-ink)] hover:bg-white"
                      style={{ border: "1px solid rgba(124,58,237,0.10)" }}
                    >
                      <Icon size={11} strokeWidth={1.8} style={{ color: "#7C3AED" }} />
                      {s.text}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-1 flex items-center justify-between px-1">
                <span className="chip-mono">enter to send</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={submit}
                  disabled={!text.trim()}
                  className="grid h-9 w-9 place-items-center rounded-full transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #E64BFF)",
                    color: "white",
                    boxShadow: "0 8px 20px -6px rgba(124,58,237,0.55)",
                  }}
                  aria-label="send"
                >
                  <ArrowUp size={15} strokeWidth={2.2} />
                </motion.button>
              </div>
            </motion.div>
          ) : actionMode ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={spring}
              className="glass-pill flex items-center gap-1.5 rounded-full p-1.5"
            >
              <span
                className="label-mono shrink-0 rounded-full px-2.5 py-1"
                style={{ background: "rgba(124,58,237,0.12)", color: "#6D28D9", fontSize: 9.5 }}
              >
                {selected} selected
              </span>
              <div className="flex flex-1 gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {ACTIONS.map((a, i) => {
                  const Icon = a.Icon;
                  return (
                    <motion.button
                      key={a.id}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => onRunAction(a.id)}
                      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] font-medium transition-all"
                      style={
                        i === 0
                          ? {
                              background: "linear-gradient(135deg, #7C3AED, #E64BFF)",
                              color: "white",
                              boxShadow: "0 6px 18px -6px rgba(230,75,255,0.55)",
                            }
                          : { background: "rgba(255,255,255,0.7)", color: "var(--color-ink)" }
                      }
                    >
                      <Icon size={12} strokeWidth={1.9} />
                      {a.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={spring}
              className="glass-pill flex items-center gap-2 rounded-full py-2 pl-4 pr-2"
            >
              <Sparkles size={15} strokeWidth={1.8} style={{ color: "#7C3AED", flexShrink: 0 }} />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
                placeholder={active ? "ask asmi…" : "hand asmi a task…"}
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[color:var(--color-ink-soft)]"
                style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
              />
              {text.trim() ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={submit}
                  className="grid h-9 w-9 place-items-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #E64BFF)",
                    color: "white",
                    boxShadow: "0 8px 20px -6px rgba(124,58,237,0.55)",
                  }}
                  aria-label="send"
                >
                  <ArrowUp size={15} strokeWidth={2.2} />
                </motion.button>
              ) : (
                <>
                  <button
                    className="grid h-9 w-9 place-items-center rounded-full text-[color:var(--color-ink-soft)] hover:bg-violet-50"
                    aria-label="voice"
                    type="button"
                  >
                    <Mic size={15} strokeWidth={1.8} />
                  </button>
                  <AsmiOrb state={orbState} size={36} onClick={() => setComposer(true)} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
