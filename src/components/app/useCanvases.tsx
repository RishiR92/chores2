import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedCanvases, scriptedSpawn, tickWorld } from "./mock/scripts";

// ────────────────────────────────────────────────────────────────────────────
// Types — a canvas is composable. It declares which blocks to render by
// which fields are populated. One model, many UIs.
// ────────────────────────────────────────────────────────────────────────────

export type CanvasStatus = "live" | "waiting" | "done";
export type CanvasMode = "research" | "action" | "done";
export type CanvasOrigin = "web" | "whatsapp" | "imessage";

export type CallStatus =
  | "queued"
  | "dialing"
  | "ringing"
  | "connected"
  | "wrapping"
  | "success"
  | "voicemail"
  | "failed";

export type NextAction =
  | { kind: "callback"; inMinutes: number; note: string }
  | { kind: "message"; channel: "sms" | "whatsapp"; note: string }
  | { kind: "email"; to: string; note: string }
  | { kind: "wait_user"; note: string };

export type Call = {
  id: string;
  person: string;
  role?: string;
  phone?: string;
  status: CallStatus;
  durationSec?: number;
  result?: string;
  nextAction?: NextAction;
  // recording metadata (we never show transcript live)
  recordingAvailableAfter?: boolean;
};

export type Place = {
  id: string;
  name: string;
  cuisine?: string;
  rating?: number;
  price?: string;
  // normalized 0..1 coords on the canvas map
  x: number;
  y: number;
  distance?: string;
  vibe?: string;
  status?: "shortlist" | "calling" | "booked" | null;
};

export type Option = {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  meta?: string;
  selected?: boolean;
  priority?: "high" | "med" | "low" | null;
};

export type TimelineEvent = {
  id: string;
  ts: string; // human label like "now", "2m ago"
  kind:
    | "spawned"
    | "researching"
    | "dialed"
    | "connected"
    | "voicemail"
    | "message_sent"
    | "email_sent"
    | "callback_scheduled"
    | "wrapped"
    | "user_input"
    | "handoff";
  text: string;
};

export type Artifact = {
  id: string;
  kind: "summary" | "confirmation" | "calendar" | "receipt" | "savings" | "email" | "message";
  title: string;
  body: string;
  meta?: string;
};

export type ChatMsg = { id: string; role: "user" | "asmi"; text: string; pending?: boolean };

export type CanvasField = { label: string; value?: string };

export type ChecklistItem = { id: string; label: string; status: "done" | "doing" | "todo"; detail?: string };

export type Quote = {
  id: string;
  vendor: string;
  rating?: number;
  price: string;
  availability: string;
  note?: string;
  status?: "received" | "pending" | "declined";
};

export type SchedulingGrid = {
  people: string[];
  slots: { id: string; label: string; available: boolean[]; chosen?: boolean }[];
};

export type MessageThreadT = {
  with: string;
  channel: "sms" | "whatsapp" | "imessage" | "email";
  lines: { id: string; role: "asmi" | "them"; text: string; ts?: string }[];
};

export type Canvas = {
  id: string;
  title: string;
  status: CanvasStatus;
  mode: CanvasMode;
  origin: CanvasOrigin;
  subtitle: string;
  createdAt: number;

  // optional block payloads — UI renders a block iff its data is present
  fields?: CanvasField[];
  calls?: Call[];
  parallel?: boolean; // when there are >1 calls
  places?: Place[];
  options?: Option[];
  decisionPrompt?: string;
  checklist?: ChecklistItem[];
  quotes?: Quote[];
  scheduling?: SchedulingGrid;
  thread?: MessageThreadT;
  timeline?: TimelineEvent[];
  artifacts: Artifact[];
  chat: ChatMsg[];
};

type Ctx = {
  canvases: Canvas[];
  activeId: string | undefined;
  setActive: (id: string) => void;
  close: (id: string) => void;
  spawn: (prompt: string) => string;
  sendChat: (id: string, text: string) => void;
  togglePlaceShortlist: (canvasId: string, placeId: string) => void;
  callPlace: (canvasId: string, placeId: string) => void;
  setOptionPriority: (canvasId: string, optionId: string, priority: Option["priority"]) => void;
  toggleOptionSelected: (canvasId: string, optionId: string) => void;
};

const CanvasesCtx = createContext<Ctx | null>(null);

export function CanvasesProvider({ children }: { children: React.ReactNode }) {
  const [canvases, setCanvases] = useState<Canvas[]>(() => seedCanvases());
  const [activeId, setActiveId] = useState<string | undefined>(() => seedCanvases()[0]?.id);

  // gentle world tick — only advances live call durations + a small pulse
  useEffect(() => {
    const t = setInterval(() => setCanvases((cs) => cs.map(tickWorld)), 1500);
    return () => clearInterval(t);
  }, []);

  const setActive = useCallback((id: string) => setActiveId(id), []);

  const close = useCallback((id: string) => {
    setCanvases((cs) =>
      cs.map((c) => (c.id === id ? { ...c, status: "done", mode: "done" } : c)),
    );
    setActiveId((cur) => {
      if (cur !== id) return cur;
      return undefined;
    });
  }, []);

  const spawn = useCallback((prompt: string) => {
    const nc = scriptedSpawn(prompt);
    setCanvases((cs) => [nc, ...cs]);
    return nc.id;
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
    setTimeout(() => {
      setCanvases((cs) =>
        cs.map((c) => {
          if (c.id !== id) return c;
          return {
            ...c,
            chat: c.chat.map((m) => (m.id === pendingId ? { ...m, text: pickReply(c, text), pending: false } : m)),
          };
        }),
      );
    }, 950);
  }, []);

  const togglePlaceShortlist = useCallback((canvasId: string, placeId: string) => {
    setCanvases((cs) =>
      cs.map((c) =>
        c.id !== canvasId || !c.places ? c : {
          ...c,
          places: c.places.map((p) => p.id !== placeId ? p : { ...p, status: p.status === "shortlist" ? null : "shortlist" }),
        }
      )
    );
  }, []);

  const callPlace = useCallback((canvasId: string, placeId: string) => {
    setCanvases((cs) =>
      cs.map((c) => {
        if (c.id !== canvasId || !c.places) return c;
        const place = c.places.find((p) => p.id === placeId);
        if (!place) return c;
        const newCall: Call = {
          id: crypto.randomUUID(),
          person: place.name,
          role: place.cuisine,
          status: "dialing",
        };
        return {
          ...c,
          mode: "action",
          places: c.places.map((p) => p.id === placeId ? { ...p, status: "calling" } : p),
          calls: [...(c.calls ?? []), newCall],
          timeline: [
            ...(c.timeline ?? []),
            { id: crypto.randomUUID(), ts: "now", kind: "dialed", text: `Dialing ${place.name}` },
          ],
        };
      })
    );
  }, []);

  const setOptionPriority: Ctx["setOptionPriority"] = useCallback((canvasId, optionId, priority) => {
    setCanvases((cs) =>
      cs.map((c) =>
        c.id !== canvasId || !c.options ? c : {
          ...c,
          options: c.options.map((o) => o.id !== optionId ? o : { ...o, priority }),
        }
      )
    );
  }, []);

  const toggleOptionSelected: Ctx["toggleOptionSelected"] = useCallback((canvasId, optionId) => {
    setCanvases((cs) =>
      cs.map((c) =>
        c.id !== canvasId || !c.options ? c : {
          ...c,
          options: c.options.map((o) => o.id !== optionId ? o : { ...o, selected: !o.selected }),
        }
      )
    );
  }, []);

  const value = useMemo<Ctx>(
    () => ({ canvases, activeId, setActive, close, spawn, sendChat, togglePlaceShortlist, callPlace, setOptionPriority, toggleOptionSelected }),
    [canvases, activeId, setActive, close, spawn, sendChat, togglePlaceShortlist, callPlace, setOptionPriority, toggleOptionSelected],
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
  if (t.includes("priority") || t.includes("rank")) return "noted — i'll bias toward your high-priority picks.";
  if (t.includes("cancel") || t.includes("stop")) return "pausing this canvas. say go to resume.";
  if (t.includes("call") && c.places) return "tap any pin on the map and i'll dial.";
  if (c.calls?.some((x) => x.status === "voicemail")) return "i'll try them again in 10. want me to send a text too?";
  if (c.mode === "research") return "got it — folding that into the shortlist.";
  return "on it.";
}
