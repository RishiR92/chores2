import { IMessageMark, WhatsAppMark } from "./ChannelIcons";

export const IMSG_LINK = "https://asmi-ai.link/imsg";
export const WA_LINK = "https://asmi-ai.link/whatsapp";

interface Props {
  className?: string;
  size?: "md" | "lg";
  variant?: "light" | "dark";
}

export function ChannelCTA({ className = "", size = "md", variant = "light" }: Props) {
  const pad = size === "lg" ? "px-7 py-4 text-[1.05rem]" : "px-5 py-3.5";
  return (
    <div className={`flex flex-col sm:flex-row gap-3 w-full sm:w-auto ${className}`}>
      <a
        href={IMSG_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={`pill-btn pill-blue w-full sm:w-auto ${pad}`}
      >
        <IMessageMark size={22} />
        text her on imessage
      </a>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={`pill-btn pill-mint w-full sm:w-auto ${pad}`}
        style={variant === "dark" ? { borderColor: "var(--cream)", boxShadow: "4px 4px 0 var(--cream)" } : undefined}
      >
        <WhatsAppMark size={22} />
        whatsapp
      </a>
    </div>
  );
}

export function StickyChannelBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-3 pb-3 pt-2"
      style={{
        background: "linear-gradient(to top, var(--paper) 62%, transparent)",
      }}
    >
      <div className="flex gap-2">
        <a
          href={IMSG_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn pill-blue flex-1 text-[0.95rem] px-3"
        >
          <IMessageMark size={20} />
          imessage
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn pill-mint flex-1 text-[0.95rem] px-3"
        >
          <WhatsAppMark size={20} />
          whatsapp
        </a>
      </div>
    </div>
  );
}
