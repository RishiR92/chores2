import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, FileText, Calendar, CheckCircle2, Receipt } from "lucide-react";
import type { Artifact } from "./useCanvases";

const ICONS = {
  summary: FileText,
  confirmation: CheckCircle2,
  calendar: Calendar,
  receipt: Receipt,
};

export function Artifacts({ artifacts }: { artifacts: Artifact[] }) {
  return (
    <div className="space-y-2">
      <div className="label-mono" style={{ color: "var(--color-stone-dim)", fontSize: 9.5 }}>
        artifacts
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {artifacts.map((a) => (
          <ArtifactCard key={a.id} artifact={a} />
        ))}
      </div>
    </div>
  );
}

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const Icon = ICONS[artifact.kind] ?? FileText;
  const [open, setOpen] = useState(false);
  return (
    <motion.button
      layout
      onClick={() => setOpen((v) => !v)}
      className="group flex w-full flex-col items-start gap-1.5 rounded-2xl border border-[color:var(--glass-border)] bg-white/40 p-4 text-left backdrop-blur-xl transition-all hover:bg-white/60"
    >
      <div className="flex w-full items-center gap-2.5">
        <span
          className="grid h-7 w-7 place-items-center rounded-full"
          style={{ background: "rgba(139,168,136,0.18)", color: "var(--color-sage-deep)" }}
        >
          <Icon size={14} />
        </span>
        <span
          className="flex-1 font-serif italic text-[15px]"
          style={{ color: "var(--color-espresso)" }}
        >
          {artifact.title}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--color-stone-dim)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 240ms ease",
          }}
        />
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28 }}
        className="w-full overflow-hidden"
      >
        <p className="pl-9 pt-1 text-[13px]" style={{ color: "var(--color-stone)" }}>
          {artifact.body}
        </p>
      </motion.div>
    </motion.button>
  );
}
