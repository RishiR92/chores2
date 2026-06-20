import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, FileText, Calendar, CheckCircle2, Receipt, Sparkles, MessageSquare, Mail, TrendingDown } from "lucide-react";
import type { Artifact } from "./useCanvases";

const ICONS: Record<Artifact["kind"], typeof FileText> = {
  summary: FileText,
  confirmation: CheckCircle2,
  calendar: Calendar,
  receipt: Receipt,
  savings: TrendingDown,
  message: MessageSquare,
  email: Mail,
};

export function Artifacts({ artifacts }: { artifacts: Artifact[] }) {
  return (
    <div className="space-y-2">
      <div className="label-mono" style={{ color: "var(--color-ink-muted)", fontSize: 9.5 }}>artifacts</div>
      <div className="grid gap-2">
        {artifacts.map((a) => <ArtifactCard key={a.id} artifact={a} />)}
      </div>
    </div>
  );
}

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const Icon = ICONS[artifact.kind] ?? FileText;
  const [open, setOpen] = useState(false);
  const isSavings = artifact.kind === "savings";
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.99 }}
      onClick={() => setOpen((v) => !v)}
      className="group flex w-full flex-col items-start gap-1.5 rounded-2xl bg-white/65 p-3.5 text-left backdrop-blur-xl transition-all hover:bg-white/85"
      style={{
        border: "1px solid rgba(124,58,237,0.10)",
        background: isSavings ? "linear-gradient(135deg, rgba(94,234,212,0.22), rgba(124,58,237,0.10))" : undefined,
      }}
    >
      <div className="flex w-full items-center gap-2.5">
        <span
          className="grid h-8 w-8 place-items-center rounded-xl"
          style={{
            background: isSavings ? "rgba(94,234,212,0.30)" : "rgba(124,58,237,0.12)",
            color: isSavings ? "#0F766E" : "#7C3AED",
          }}
        >
          <Icon size={15} strokeWidth={1.8} />
        </span>
        <span
          className="flex-1 text-[15px] font-semibold tracking-[-0.01em]"
          style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
        >
          {artifact.title}
        </span>
        {isSavings && <Sparkles size={13} strokeWidth={2} style={{ color: "#0F766E" }} />}
        {artifact.meta && (
          <span className="label-mono" style={{ color: "var(--color-ink-soft)", fontSize: 8.5 }}>{artifact.meta}</span>
        )}
        <ChevronDown
          size={14}
          style={{
            color: "var(--color-ink-muted)",
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
        <p className="pl-10 pt-1 text-[12.5px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
          {artifact.body}
        </p>
      </motion.div>
    </motion.button>
  );
}
