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
        className="mx-auto flex max-w-7xl items-center px-4 py-2.5 md:px-6"
        style={{ minHeight: 58 }}
      >
        <a
          href="#"
          className="font-display shrink-0"
          style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}
        >
          asmi
        </a>
      </div>
    </nav>
  );
}
