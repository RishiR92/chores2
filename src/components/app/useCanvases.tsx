import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedCanvases, scriptedSpawn, advanceScript } from "./mock/scripts";

export type CanvasKind = "call" | "message" | "booking" | "errand";
export type CanvasStatus = "live" | "waiting" | "done";

export type TranscriptLine = { speaker: "asmi" | "them"; text: string };
export type Artifact = { id: string; kind: "summary" | "confirmation" | "calendar" | "receipt"; title: string; body: string };
export type ChatMsg = { id: string; role: "user" | "asmi"; text: string; pending?: boolean };

export type CanvasField = { label: string; value?: string };

export type Canvas = {
  id: string;
  title: string;
  kind: CanvasKind;
  status: CanvasStatus;
  subtitle: string;
  fields: CanvasField[];
  transcript: TranscriptLine[];
  transcriptCursor: number; // how many transcript lines revealed
  fullTranscript: TranscriptLine[];
  artifacts: Artifact[];
  chat: ChatMsg[];
  createdAt: number;
};

type Ctx = {
  canvases: Canvas[];
  activeId: string | undefined;
  setActive: (id: string) => void;
  close: (id: string) => void;
  spawn: (prompt: string) => string;
  sendChat: (id: string, text: string) => void;
};

const CanvasesCtx = createContext<Ctx | null>(null);

export function CanvasesProvider({ children }: { children: React.ReactNode }) {
  const [canvases, setCanvases] = useState<Canvas[]>(() => seedCanvases());
  const [activeId, setActiveId] = useState<string | undefined>(() => seedCanvases()[0]?.id);

  // Tick scripted timelines: reveal transcript lines + artifacts over time
  useEffect(() => {
    const t = setInterval(() => {
      setCanvases((cs) => cs.map(advanceScript));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const setActive = useCallback((id: string) => setActiveId(id), []);

  const close = useCallback(
    (id: string) => {
      setCanvases((cs) =>
        cs.map((c) => (c.id === id ? { ...c, status: "done" as const } : c)),
      );
      setActiveId((cur) => {
        if (cur !== id) return cur;
        const next = canvases.find((c) => c.id !== id && c.status !== "done");
        return next?.id;
      });
    },
    [canvases],
  );

  const spawn = useCallback((prompt: string) => {
    const newCanvas = scriptedSpawn(prompt);
    setCanvases((cs) => [newCanvas, ...cs]);
    return newCanvas.id;
  }, []);

  const sendChat = useCallback((id: string, text: string) => {
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", text };
    const pendingId = crypto.randomUUID();
    setCanvases((cs) =>
      cs.map((c) =>
        c.id === id
          ? { ...c, chat: [...c.chat, userMsg, { id: pendingId, role: "asmi", text: "", pending: true }] }
          : c,
      ),
    );
    // Scripted asmi reply
    setTimeout(() => {
      setCanvases((cs) =>
        cs.map((c) => {
          if (c.id !== id) return c;
          const reply = pickReply(c, text);
          return {
            ...c,
            chat: c.chat.map((m) => (m.id === pendingId ? { ...m, text: reply, pending: false } : m)),
          };
        }),
      );
    }, 1100);
  }, []);

  const value = useMemo(
    () => ({ canvases, activeId, setActive, close, spawn, sendChat }),
    [canvases, activeId, setActive, close, spawn, sendChat],
  );

  return <CanvasesCtx.Provider value={value}>{children}</CanvasesCtx.Provider>;
}

export function useCanvases() {
  const ctx = useContext(CanvasesCtx);
  if (!ctx) throw new Error("useCanvases must be inside CanvasesProvider");
  return ctx;
}

function pickReply(c: Canvas, text: string): string {
  const t = text.toLowerCase();
  if (t.includes("saturday") || t.includes("weekend")) return "on it — i'll ask marco if saturday morning works.";
  if (t.includes("cancel") || t.includes("stop")) return "pausing this. say the word to pick it back up.";
  if (t.includes("price") || t.includes("cost") || t.includes("quote")) return "i'll ask for a ballpark before he commits.";
  if (c.kind === "call") return "got it. weaving that into the call now.";
  return "noted — adjusting on the fly.";
}
