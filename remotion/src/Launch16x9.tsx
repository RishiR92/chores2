import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { MainVideo } from "./MainVideo";

const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// Mirror MainVideo timing (kept in sync manually — both files use 30fps)
const D = {
  intro: 60,
  imDoc: 75,
  doc: 240,
  imHvac: 75,
  hvac: 240,
  imGp: 75,
  gp: 240,
  done: 180,
  outro: 105,
};
const O = {
  intro: 0,
  imDoc: D.intro,
  doc: D.intro + D.imDoc,
  imHvac: D.intro + D.imDoc + D.doc,
  hvac: D.intro + D.imDoc + D.doc + D.imHvac,
  imGp: D.intro + D.imDoc + D.doc + D.imHvac + D.hvac,
  gp: D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp,
  done: D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp,
  outro: D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp + D.done,
};
const TOTAL =
  D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp + D.done + D.outro;

// Brand palette
const LINEN = "#F6F1EB";
const SAND = "#EDE6DC";
const MORNING = "#F2EDE7";
const ESPRESSO = "#2C2520";
const STONE = "#6B6560";
const TERRACOTTA = "#C25B3F";
const SAGE = "#5F8365";
const CLAY = "#D4A574";
const SKY = "#7EADC2";

type Beat = {
  start: number;
  end: number;
  headline: string;
  accent: string;
};

const BEATS: Beat[] = [
  { start: O.intro,  end: O.imDoc,         headline: "MEET ASMI",                       accent: TERRACOTTA },
  { start: O.imDoc,  end: O.imHvac,        headline: "MAKE CALLS.",                     accent: TERRACOTTA },
  { start: O.imHvac, end: O.imGp,          headline: "GET THINGS DONE\nIN REAL WORLD.", accent: SAGE },
  { start: O.imGp,   end: O.done,          headline: "REMEMBERS\nEVERYTHING.",          accent: CLAY },
  { start: O.done,   end: O.outro,         headline: "WORKS IN\nBACKGROUND.",           accent: SKY },
  { start: O.outro,  end: TOTAL,           headline: "MEET ASMI",                       accent: TERRACOTTA },
];

const findBeat = (f: number): { beat: Beat; idx: number; localFrame: number } => {
  for (let i = 0; i < BEATS.length; i++) {
    if (f >= BEATS[i].start && f < BEATS[i].end) {
      return { beat: BEATS[i], idx: i, localFrame: f - BEATS[i].start };
    }
  }
  const last = BEATS.length - 1;
  return { beat: BEATS[last], idx: last, localFrame: f - BEATS[last].start };
};

// hex -> rgba
const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const Launch16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat, idx, localFrame } = findBeat(frame);

  // Smooth accent crossfade between beats
  const prevBeat = BEATS[Math.max(0, idx - 1)];
  const crossfade = interpolate(localFrame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const accent = beat.accent;
  const accentPrev = prevBeat.accent;

  // Phone entrance
  const phoneIn = spring({ frame, fps, config: { damping: 18, stiffness: 90, mass: 1.1 } });
  const phoneY = interpolate(phoneIn, [0, 1], [180, 0]);
  const phoneOp = interpolate(phoneIn, [0, 1], [0, 1]);

  // Phone bob + drift
  const bob = Math.sin(frame / 50) * 6;
  const driftY = Math.sin(frame / 90) * 1.2;
  const driftX = Math.cos(frame / 120) * 1;

  // Headline timing
  const headlineSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 26, stiffness: 130 },
  });
  const headlineY = interpolate(headlineSpring, [0, 1], [40, 0]);
  const headlineOp = interpolate(localFrame, [0, 14, Math.max(20, beat.end - beat.start - 16), beat.end - beat.start], [0, 1, 1, 0]);

  // Phone sizing — fit ~92% of 1080 canvas height
  const PHONE_FIT_HEIGHT = 1000;
  const phoneScale = PHONE_FIT_HEIGHT / 1920;

  return (
    <AbsoluteFill style={{ fontFamily: sans, background: LINEN, overflow: "hidden" }}>
      {/* === Painterly warm backdrop === */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(70% 60% at 50% 30%, ${MORNING} 0%, ${LINEN} 55%, ${SAND} 100%)
          `,
        }}
      />

      {/* Soft top key-light pool */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(40% 35% at 65% 0%, rgba(255,247,232,0.9), transparent 70%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Accent wash (crossfades) — previous beat fading out */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 45% at 70% 80%, ${rgba(accentPrev, 0.22)}, transparent 70%),
                       radial-gradient(40% 35% at 20% 25%, ${rgba(accentPrev, 0.14)}, transparent 70%)`,
          opacity: 1 - crossfade,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
      {/* Accent wash — current beat fading in */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 45% at 70% 80%, ${rgba(accent, 0.22)}, transparent 70%),
                       radial-gradient(40% 35% at 20% 25%, ${rgba(accent, 0.14)}, transparent 70%)`,
          opacity: crossfade,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Painterly desk props — coffee silhouette (bottom-left) */}
      <div
        style={{
          position: "absolute",
          left: -60,
          bottom: -40,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 40%, ${rgba(ESPRESSO, 0.05)} 0%, ${rgba(ESPRESSO, 0.025)} 40%, transparent 70%)`,
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />
      {/* Notebook edge (bottom-right behind phone area) */}
      <div
        style={{
          position: "absolute",
          right: -100,
          bottom: -120,
          width: 700,
          height: 380,
          transform: "rotate(-6deg)",
          borderRadius: 24,
          background: `linear-gradient(180deg, ${rgba(ESPRESSO, 0.04)}, ${rgba(ESPRESSO, 0.08)})`,
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />

      {/* Dust motes in the key light */}
      <DustMotes />

      {/* === Editorial headline (left third) === */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 0,
          bottom: 0,
          width: 760,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          zIndex: 2,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: STONE,
            fontWeight: 500,
            opacity: headlineOp * 0.9,
          }}
        >
          <span style={{ color: accent, fontWeight: 600 }}>●</span>{"  "}asmi · chief of staff
        </div>

        {/* Big serif headline */}
        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 132,
            lineHeight: 0.98,
            color: ESPRESSO,
            letterSpacing: -2,
            whiteSpace: "pre-line",
            transform: `translateY(${headlineY}px)`,
            opacity: headlineOp,
            textShadow: `0 1px 0 ${rgba(LINEN, 0.5)}`,
          }}
        >
          {beat.headline.toLowerCase()}
        </div>

        {/* Underline accent */}
        <div
          style={{
            marginTop: 8,
            width: interpolate(headlineSpring, [0, 1], [0, 220]),
            height: 4,
            borderRadius: 2,
            background: accent,
            opacity: headlineOp,
          }}
        />
      </div>

      {/* === Phone stage (right side, tilted, levitating) === */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          width: 1080 * phoneScale,
          height: 1920 * phoneScale,
          transform: `translateY(calc(-50% + ${phoneY + bob + driftY}px)) translateX(${driftX}px)`,
          opacity: phoneOp,
          perspective: 2400,
          perspectiveOrigin: "50% 50%",
          zIndex: 3,
        }}
      >
        {/* Soft contact shadow (floor glow tinted with accent) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -40,
            width: "85%",
            height: 80,
            transform: "translateX(-50%)",
            background: `radial-gradient(ellipse at center, ${rgba(ESPRESSO, 0.45)} 0%, ${rgba(accent, 0.18)} 35%, transparent 70%)`,
            filter: "blur(28px)",
            pointerEvents: "none",
          }}
        />

        {/* 3D-tilted phone wrapper */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotateY(-9deg) rotateX(5deg)`,
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
            filter: `drop-shadow(0 60px 80px ${rgba(ESPRESSO, 0.35)})`,
          }}
        >
          {/* Render the existing 1080x1920 demo, scaled down. Clip to phone body shape
              so MainVideo's dark backdrop doesn't show as a rectangle. */}
          <div
            style={{
              position: "absolute",
              width: 1080,
              height: 1920,
              left: 0,
              top: 0,
              transform: `scale(${phoneScale})`,
              transformOrigin: "top left",
              clipPath: "inset(110px 90px 110px 90px round 130px)",
            }}
          >
            <MainVideo />
          </div>

        </div>
      </div>

      {/* === Subtle vignette === */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(80% 80% at 50% 50%, transparent 55%, rgba(44,37,32,0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* === Lower-third corner brand mark === */}
      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 64,
          display: "flex",
          alignItems: "center",
          gap: 16,
          color: STONE,
          fontSize: 16,
          letterSpacing: 4,
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        <div style={{ width: 40, height: 1, background: rgba(ESPRESSO, 0.3) }} />
        <span>asmi · launches soon</span>
      </div>
    </AbsoluteFill>
  );
};

// ============= Dust motes =============
const DustMotes: React.FC = () => {
  const frame = useCurrentFrame();
  const motes = Array.from({ length: 18 }, (_, i) => {
    const seedX = (i * 137.5) % 100;
    const seedY = (i * 73.3) % 100;
    const drift = Math.sin((frame + i * 30) / 80) * 30;
    const driftY = Math.cos((frame + i * 20) / 100) * 40;
    const size = 2 + (i % 4);
    const opacity = 0.18 + ((i % 5) / 5) * 0.25;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${seedX}%`,
          top: `${seedY}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "rgba(255, 240, 215, 1)",
          opacity,
          transform: `translate(${drift}px, ${driftY}px)`,
          filter: "blur(0.5px)",
        }}
      />
    );
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {motes}
    </AbsoluteFill>
  );
};
