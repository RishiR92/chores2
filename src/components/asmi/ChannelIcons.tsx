// Inline SVG channel marks — no third-party logo images.

export function IMessageMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-[28%]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(180deg, #4FA3FF, #0A72E8)",
        boxShadow: "0 6px 16px -8px rgba(10,114,232,0.7)",
      }}
      aria-hidden
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3.4c-4.9 0-8.9 3.3-8.9 7.4 0 2.4 1.4 4.6 3.5 6-.2 1.3-.8 2.5-1.7 3.4 1.7-.2 3.3-.9 4.6-2 .8.2 1.7.3 2.5.3 4.9 0 8.9-3.3 8.9-7.4S16.9 3.4 12 3.4Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

export function WhatsAppMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-[28%]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(180deg, #3AC34A, #128C33)",
        boxShadow: "0 6px 16px -8px rgba(18,140,51,0.7)",
      }}
      aria-hidden
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        <path
          d="M12.1 3.5a8.4 8.4 0 0 0-7.2 12.7L3.7 20.5l4.4-1.1a8.4 8.4 0 1 0 4-15.9Zm4.7 11.8c-.2.6-1.1 1.1-1.6 1.2-.4.1-.9.1-1.5-.1a12 12 0 0 1-4.9-3.7c-1-1.3-1.6-2.7-1.4-3.6.1-.5.6-1.2 1.1-1.4.2-.1.5-.1.6 0l.9 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6.6 1 1.5 1.8 2.6 2.3.3.1.4.1.6-.1l.5-.6c.2-.2.3-.2.5-.1l1.6.8c.2.1.2.4.1.6Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

export function ChannelRow({ caption = "no app. no signup. just text her." }: { caption?: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex items-center gap-3">
        <IMessageMark />
        <WhatsAppMark />
      </div>
      <p className="font-sans" style={{ color: "var(--color-stone-dim)", fontSize: 13.5 }}>
        {caption}
      </p>
    </div>
  );
}

export type ChannelKind = "call" | "text" | "email" | "web";

export function ChannelGlyph({ kind, size = 13 }: { kind: ChannelKind; size?: number }) {
  const s = { width: size, height: size, strokeWidth: 1.7, stroke: "currentColor", fill: "none" as const };
  if (kind === "call")
    return (
      <svg viewBox="0 0 24 24" {...s} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
      </svg>
    );
  if (kind === "text")
    return (
      <svg viewBox="0 0 24 24" {...s} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 12a7 7 0 0 1-7.5 7c-.9 0-1.8-.1-2.6-.4L5 20l1.3-3.4A7 7 0 1 1 20 12Z" />
      </svg>
    );
  if (kind === "email")
    return (
      <svg viewBox="0 0 24 24" {...s} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
        <path d="m4 7 8 5.5L20 7" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" {...s} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
    </svg>
  );
}

const CHANNEL_LABEL: Record<ChannelKind, string> = {
  call: "called",
  text: "texted",
  email: "emailed",
  web: "their form",
};

export function ChannelChips({ kinds }: { kinds: ChannelKind[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {kinds.map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans"
          style={{
            fontSize: 11.5,
            color: "var(--color-stone)",
            background: "rgba(44,37,32,0.045)",
            border: "1px solid rgba(44,37,32,0.06)",
          }}
        >
          <ChannelGlyph kind={k} />
          {CHANNEL_LABEL[k]}
        </span>
      ))}
    </div>
  );
}
