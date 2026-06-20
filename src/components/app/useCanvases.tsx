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
  recordingAvailableAfter?: boolean;
};

export type Place = {
  id: string;
  name: string;
  cuisine?: string;
  rating?: number;
  price?: string;
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
  ts: string;
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

export type OptionsAction = "call_top" | "call_priority" | "message_all" | "asmi_pick";

export type Canvas = {
  id: string;
  title: string;
  status: CanvasStatus;
  mode: CanvasMode;
  origin: CanvasOrigin;
  subtitle: string;
  createdAt: number;

  fields?: CanvasField[];
  calls?: Call[];
  parallel?: boolean;
  places?: Place[];
  options?: Option[];
  optionsSummary?: string;
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
  dismissOption: (canvasId: string, optionId: string) => void;
  anyWorks: (canvasId: string) => void;
  clearOptionsState: (canvasId: string) => void;
  runOptionsAction: (canvasId: string, action: OptionsAction) => void;
};

const CanvasesCtx = createContext<Ctx | null>(null);

export function CanvasesProvider({ children }: { children: React.ReactNode }) {
  const [canvases, setCanvases] = useState<Canvas[]>(() => seedCanvases());
  const [activeId, setActiveId] = useState<string | undefined>(() => seedCanvases()[0]?.id);

  useEffect(() => {
    const t = setInterval(() => setCanvases((cs) => cs.map(tickWorld)), 1500);
    return () => clearInterval(t);
  }, []);

  const setActive = useCallback((id: string) => setActiveId(id), []);

  const close = useCallback((id: string) => {
    setCanvases((cs) => cs.map((c) => (c.id === id ? { ...c, status: "done", mode: "done" } : c)));
    setActiveId((cur) => (cur === id ? undefined : cur));
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
    }, 850);
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

  const dismissOption: Ctx["dismissOption"] = useCallback((canvasId, optionId) => {
    setCanvases((cs) =>
      cs.map((c) =>
        c.id !== canvasId || !c.options ? c : {
          ...c,
          options: c.options.filter((o) => o.id !== optionId),
        }
      )
    );
  }, []);

  const anyWorks: Ctx["anyWorks"] = useCallback((canvasId) => {
    setCanvases((cs) =>
      cs.map((c) =>
        c.id !== canvasId || !c.options ? c : {
          ...c,
          options: c.options.map((o) => ({ ...o, selected: true, priority: null })),
        }
      )
    );
  }, []);

  const clearOptionsState: Ctx["clearOptionsState"] = useCallback((canvasId) => {
    setCanvases((cs) =>
      cs.map((c) => {
        if (c.id !== canvasId) return c;
        if (c.optionsSummary) {
          // restore from summary mode → can't recover originals without storage,
          // so just clear the summary. This is a prototype; restoring originals
          // would need a stash. For now, nudge user with chat.
          return { ...c, optionsSummary: undefined };
        }
        if (!c.options) return c;
        return { ...c, options: c.options.map((o) => ({ ...o, selected: false, priority: null })) };
      })
    );
  }, []);

  const runOptionsAction: Ctx["runOptionsAction"] = useCallback((canvasId, action) => {
    setCanvases((cs) =>
      cs.map((c) => {
        if (c.id !== canvasId || !c.options) return c;
        const selected = c.options.filter((o) => o.selected);
        const summary =
          action === "call_top"
            ? `calling top ${Math.min(3, selected.length)} now`
            : action === "call_priority"
            ? "calling in priority order"
            : action === "message_all"
            ? `messaging ${selected.length} options`
            : "asmi is picking one for you";
        const ackByAction: Record<OptionsAction, string> = {
          call_top: "on it — dialing the top picks in parallel. i'll bring back the first yes.",
          call_priority: "going in priority order. i'll skip past the no's.",
          message_all: "messages going out now. i'll show replies as they come.",
          asmi_pick: "i'll weigh ratings, price, and your tags. back in a minute.",
        };
        return {
          ...c,
          mode: "action",
          status: "live",
          options: undefined,
          optionsSummary: summary,
          timeline: [
            ...(c.timeline ?? []),
            { id: crypto.randomUUID(), ts: "now", kind: "spawned", text: summary },
          ],
          chat: [...c.chat, { id: crypto.randomUUID(), role: "asmi", text: ackByAction[action] }],
        };
      })
    );
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      canvases,
      activeId,
      setActive,
      close,
      spawn,
      sendChat,
      togglePlaceShortlist,
      callPlace,
      setOptionPriority,
      toggleOptionSelected,
      dismissOption,
      anyWorks,
      clearOptionsState,
      runOptionsAction,
    }),
    [
      canvases,
      activeId,
      setActive,
      close,
      spawn,
      sendChat,
      togglePlaceShortlist,
      callPlace,
      setOptionPriority,
      toggleOptionSelected,
      dismissOption,
      anyWorks,
      clearOptionsState,
      runOptionsAction,
    ],
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
  if (t.includes("priority") || t.includes("rank")) return "noted — biasing toward your high-priority picks.";
  if (t.includes("cancel") || t.includes("stop")) return "pausing. say go to resume.";
  if (t.includes("call") && c.places) return "tap any pin on the map and i'll dial.";
  if (c.calls?.some((x) => x.status === "voicemail")) return "i'll retry in 10. want me to text too?";
  if (c.mode === "research") return "got it — folding that in.";
  return "on it.";
}
