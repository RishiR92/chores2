import type { LucideIcon } from "lucide-react";

export function CategoryTile({
  Icon,
  tone = "violet",
  size = "md",
}: {
  Icon: LucideIcon;
  tone?: "violet" | "magenta" | "indigo" | "sky" | "peach" | "mint" | "slate";
  size?: "xs" | "sm" | "md";
}) {
  const iconSize = size === "xs" ? 12 : size === "sm" ? 14 : 16;
  const cls = size === "md" ? "tile-status" : `tile-status ${size}`;
  return (
    <span className={cls} data-tone={tone}>
      <Icon size={iconSize} strokeWidth={1.7} />
    </span>
  );
}
