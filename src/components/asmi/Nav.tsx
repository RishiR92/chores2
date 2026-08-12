export function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(246, 241, 235, 0.72)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(44,37,32,0.05)",
      }}
    >
      <div
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-3.5"
        style={{ minHeight: 56 }}
      >
        <a href="#" className="font-serif italic text-xl" style={{ color: "var(--color-espresso)" }}>
          asmi
        </a>
        <div className="hidden items-center gap-7 font-sans text-[0.88rem] md:flex" style={{ color: "var(--color-stone)" }}>
          <a href="#why" style={{ color: "inherit" }}>why</a>
          <a href="#how" style={{ color: "inherit" }}>how it works</a>
          <a href="#stories" style={{ color: "inherit" }}>stories</a>
          <a href="#languages" style={{ color: "inherit" }}>languages</a>
        </div>
        <a
          href="#start"
          className="rounded-full font-sans"
          style={{
            padding: "0.55rem 1.1rem",
            fontSize: "0.82rem",
            background: "var(--color-terracotta)",
            color: "var(--color-cream)",
            boxShadow: "0 12px 24px -16px rgba(194,91,63,0.9)",
          }}
        >
          get early access
        </a>
      </div>
    </nav>
  );
}
