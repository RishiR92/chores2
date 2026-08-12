import { IMessageMark, WhatsAppMark } from "./ChannelIcons";

export const IMSG_LINK = "https://asmi-ai.link/imsg";
export const WA_LINK = "https://asmi-ai.link/whatsapp";

interface Props {
  className?: string;
  size?: "md" | "lg";
  variant?: "light" | "dark";
  align?: "start" | "center";
  caption?: string;
}

export function ChannelCTA({
  className = "",
  size = "md",
  variant = "light",
  align = "start",
  caption = "text her on",
}: Props) {
  const btn = size === "lg" ? "h-[62px] w-[86px] sm:w-[104px]" : "h-[54px] w-[78px] sm:w-[92px]";
  const icon = size === "lg" ? 30 : 26;
  const darkEdge =
    variant === "dark"
      ? { border: "none", boxShadow: "0 10px 30px -12px rgba(0,0,0,0.6)" }
      : undefined;

  return (
    <div className={`flex flex-col gap-2.5 ${align === "center" ? "items-center" : "items-start"} ${className}`}>
      <span
        className="font-mono"
        style={{
          fontSize: 11.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: variant === "dark" ? "rgba(255,253,248,0.55)" : "var(--ink-dim)",
        }}
      >
        {caption}
      </span>
      <div className="flex gap-3">
        <a
          href={IMSG_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="text asmi on imessage"
          className={`pill-btn pill-blue !px-0 ${btn}`}
          style={darkEdge}
        >
          <IMessageMark size={icon} />
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="text asmi on whatsapp"
          className={`pill-btn pill-mint !px-0 ${btn}`}
          style={darkEdge}
        >
          <WhatsAppMark size={icon} />
        </a>
      </div>
    </div>
  );
}
