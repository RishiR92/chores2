import { useEffect, useState } from "react";

/** Tiny sparkle burst — 6 dots flying out. Mounted once, auto-cleans. */
export function SparkleBurst({ size = 80, color = "#E64BFF" }: { size?: number; color?: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 700);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  const dots = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const dist = size / 2;
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, delay: i * 30 };
  });
  return (
    <span
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "grid", placeItems: "center" }}
    >
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: 6, height: 6, borderRadius: 9999,
            background: color,
            ["--dx" as never]: `${d.dx}px`,
            ["--dy" as never]: `${d.dy}px`,
            animation: `spark-fly 600ms ${d.delay}ms cubic-bezier(0.2,0.8,0.2,1) forwards`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      ))}
    </span>
  );
}

/** Animated call-wave (4 bars) — for live calls. */
export function CallWave({ color = "#7C3AED", size = 14 }: { color?: string; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, height: size }}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: 2, height: size, background: color, borderRadius: 2,
            transformOrigin: "center",
            animation: `wave-bar 1s ease-in-out ${i * 120}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}
