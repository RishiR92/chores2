import type { Canvas } from "./useCanvases";
import { ChannelChip } from "./ChannelChip";
import { CategoryTile } from "./CategoryTile";
import { StatusGlyph, variantFor } from "./StatusGlyph";
import { categoryFor } from "@/lib/categoryIcon";

export function CanvasHeader({ canvas }: { canvas: Canvas }) {
  const cat = categoryFor(canvas);
  const variant = variantFor(canvas.status);

  return (
    <header className="px-5 pt-7 pb-3 sm:px-7 sm:pt-7">
      <div className="flex items-start gap-3">
        <CategoryTile Icon={cat.Icon} tone={cat.tone} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusGlyph variant={variant} showLabel />
            <span className="text-[color:var(--color-ink-muted)]" style={{ fontSize: 10 }}>·</span>
            <ChannelChip origin={canvas.origin} />
          </div>
          <h2
            className="mt-1.5 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[24px]"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
          >
            {canvas.title}
          </h2>
          <div className="chip-mono mt-1">{canvas.subtitle}</div>
        </div>
      </div>
    </header>
  );
}
