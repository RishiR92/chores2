import { IMSG_LINK } from "./ChannelCTA";

export function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(251, 247, 240, 0.78)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(20,19,24,0.07)",
      }}
    >
      <div
        className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 md:px-6"
        style={{ minHeight: 58 }}
      >
        <div className="flex min-w-0 items-center gap-7">
          <a
            href="#"
            className="font-display shrink-0"
            style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}
          >
            asmi
          </a>
          <div className="hidden items-center gap-6 font-sans text-[0.9rem] md:flex" style={{ color: "var(--ink-soft)" }}>
            <a href="#why" style={{ color: "inherit" }}>why</a>
            <a href="#how" style={{ color: "inherit" }}>how she chases</a>
            <a href="#stories" style={{ color: "inherit" }}>what she'll do</a>
            <a href="#languages" style={{ color: "inherit" }}>languages</a>
          </div>
        </div>
        <a
          href={IMSG_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn pill-blue shrink-0"
          style={{ minHeight: 42, padding: "0.5rem 1.1rem", fontSize: "0.9rem", boxShadow: "3px 3px 0 var(--ink)" }}
        >
          text asmi
        </a>
      </div>
    </nav>
  );
}
