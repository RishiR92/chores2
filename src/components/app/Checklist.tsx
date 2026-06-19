import { Check, Loader2, Circle } from "lucide-react";
import type { ChecklistItem } from "./useCanvases";

export function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => {
        const Icon = it.status === "done" ? Check : it.status === "doing" ? Loader2 : Circle;
        const tone =
          it.status === "done" ? "var(--color-sage-deep)" :
          it.status === "doing" ? "var(--color-terracotta)" :
          "var(--color-stone-dim)";
        return (
          <li key={it.id} className="flex items-start gap-2.5 rounded-xl bg-white/30 px-3 py-2">
            <span
              className="mt-0.5 grid h-5 w-5 place-items-center rounded-full"
              style={{
                background: it.status === "done" ? "rgba(139,168,136,0.22)" : it.status === "doing" ? "rgba(194,91,63,0.18)" : "transparent",
                border: it.status === "todo" ? `1px dashed ${tone}` : "none",
                color: tone,
              }}
            >
              <Icon size={11} className={it.status === "doing" ? "animate-spin" : ""} />
            </span>
            <div className="min-w-0 flex-1">
              <div
                className="text-[13.5px]"
                style={{ color: "var(--color-espresso)", textDecoration: it.status === "done" ? "line-through" : "none", opacity: it.status === "done" ? 0.7 : 1 }}
              >
                {it.label}
              </div>
              {it.detail && (
                <div className="text-[11.5px]" style={{ color: "var(--color-stone)" }}>
                  {it.detail}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
