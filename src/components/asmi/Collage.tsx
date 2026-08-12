import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

export interface CollageLayer {
  src: string;
  alt?: string;
  /** left offset, any css length (%, px, vw) */
  x: string;
  /** top offset */
  y: string;
  /** rendered width */
  w: string;
  /** 0 = pinned far back, 1 = closest to the reader */
  depth: number;
  rot: number;
  /** hide on small screens */
  desktopOnly?: boolean;
  /** hide on md and up */
  mobileOnly?: boolean;
  flip?: boolean;
  opacity?: number;
}

/**
 * Cutout objects pinned over the paper. Depth drives parallax rate,
 * shadow weight and scale — nothing is a card, everything is an object.
 */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);
  return fine;
}

export function Collage({
  layers,
  eager = false,
  className = "",
}: {
  layers: CollageLayer[];
  eager?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {layers.map((l) => (
        <Piece key={l.src + l.x + l.y} layer={l} scrollY={scrollY} sx={sx} sy={sy} reduced={!!reduced} eager={eager} />
      ))}
    </div>
  );
}

function Piece({
  layer: l,
  scrollY,
  sx,
  sy,
  reduced,
  eager,
}: {
  layer: CollageLayer;
  scrollY: ReturnType<typeof useScroll>["scrollY"];
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  reduced: boolean;
  eager: boolean;
}) {
  const fine = useFinePointer();
  const drift = fine ? 40 + l.depth * 150 : 0;
  const tilt = 6 + l.depth * 22;
  const scrollShift = useTransform(scrollY, [0, 900], [0, -drift]);
  const mx = useTransform(sx, (v) => v * tilt);
  const my = useTransform(sy, (v) => v * tilt * 0.6);

  return (
    <motion.img
      src={l.src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      initial={reduced ? false : { opacity: 0, y: 26, scale: 0.96 }}
      whileInView={{ opacity: l.opacity ?? 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: l.depth * 0.15 }}
      className={`absolute select-none ${l.desktopOnly ? "hidden lg:block" : ""}${l.mobileOnly ? "lg:hidden" : ""}`}
      style={{
        left: l.x,
        top: l.y,
        width: l.w,
        rotate: l.rot,
        x: reduced ? 0 : mx,
        y: reduced ? 0 : (scrollShift as unknown as number),
        translateY: reduced ? 0 : my,
        opacity: l.opacity ?? 1,
        scaleX: l.flip ? -1 : 1,
        willChange: "transform",
        filter: `drop-shadow(${(2 + l.depth * 8).toFixed(0)}px ${(3 + l.depth * 10).toFixed(0)}px 0 rgba(20,19,24,0.10)) saturate(0.82)`,
      }}
    />
  );
}
