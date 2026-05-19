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

const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// Palette (matches Asmi site)
const CREAM = "#F5EFE6";
const ESPRESSO = "#2C2520";
const STONE = "#7A6F64";
const TERRACOTTA = "#C25B3F";
const CLAY = "#D4A574";
const SAGE = "#5F8365";
const IMSG_BLUE = "#1FA1FF";
const IMSG_GRAY = "#E6E2DA";

// Scene durations (frames @ 30fps) — sums to 450
const D = {
  s1: 90,   // iMessage doc — 3s
  s2: 90,   // Asmi calls user — 3s
  s3: 90,   // Asmi calls office — 3s
  s4: 60,   // iMessage grandpa — 2s
  s5: 90,   // grandpa call — 3s
  s6: 30,   // done card — 1s
};

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: sans }}>
      <DriftingBloom />
      <Grain />

      <Sequence from={0} durationInFrames={D.s1}>
        <SceneIMessage
          contactName="Sarah"
          time="9:03 AM"
          bubbles={[
            { from: "user", text: "Hey can you book Jonathan a checkup with Dr. Weng?" },
          ]}
          reply={{ text: "On it. Calling you in 10s to confirm details.", delay: 50 }}
        />
      </Sequence>

      <Sequence from={D.s1} durationInFrames={D.s2}>
        <SceneCall
          label="Asmi → You"
          name="Asmi"
          accent={TERRACOTTA}
          transcript="quick check — Jonathan's insurance is still BCBS, mornings preferred?"
        />
      </Sequence>

      <Sequence from={D.s1 + D.s2} durationInFrames={D.s3}>
        <SceneCall
          label="Asmi → Dr. Weng's office"
          name="Dr. Weng — Front Desk"
          accent={TERRACOTTA}
          transcript="booking Jonathan for Tuesday, 10am. pre-auth cleared."
        />
      </Sequence>

      <Sequence from={D.s1 + D.s2 + D.s3} durationInFrames={D.s4}>
        <SceneIMessage
          contactName="Sarah"
          time="6:42 PM"
          bubbles={[
            { from: "user", text: "Can you check on grandpa in Spain?" },
          ]}
          reply={{ text: "Calling abuelo now — in Spanish.", delay: 35 }}
        />
      </Sequence>

      <Sequence from={D.s1 + D.s2 + D.s3 + D.s4} durationInFrames={D.s5}>
        <SceneCall
          label="Asmi → Abuelo · Sevilla"
          name="Abuelo"
          accent={CLAY}
          transcript="¿cómo estás hoy? ¿tomaste tu medicina?"
        />
      </Sequence>

      <Sequence from={D.s1 + D.s2 + D.s3 + D.s4 + D.s5} durationInFrames={D.s6}>
        <SceneDone />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============= Persistent layers =============

const DriftingBloom: React.FC = () => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 120) * 80;
  const y = Math.cos(frame / 140) * 60;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 40% at ${50 + x / 8}% ${30 + y / 8}%, rgba(194,91,63,0.18), transparent 70%),
                       radial-gradient(50% 35% at ${30 + x / 6}% ${75 + y / 6}%, rgba(212,165,116,0.16), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity: 0.06,
      mixBlendMode: "multiply",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
    }}
  />
);

// ============= iMessage scene =============

type Bubble = { from: "user" | "asmi"; text: string };

const SceneIMessage: React.FC<{
  contactName: string;
  time: string;
  bubbles: Bubble[];
  reply?: { text: string; delay: number };
}> = ({ contactName, time, bubbles, reply }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ padding: "120px 60px", justifyContent: "flex-start" }}>
      {/* Phone status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: ESPRESSO,
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 36,
          marginBottom: 24,
          opacity: 0.85,
        }}
      >
        <span>{time}</span>
        <span style={{ letterSpacing: 4 }}>●●●●●</span>
      </div>

      {/* Contact header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          paddingBottom: 28,
          borderBottom: "1px solid rgba(44,37,32,0.08)",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 999,
            background: "linear-gradient(135deg, #C25B3F, #D4A574)",
            margin: "0 auto 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: CREAM,
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 54,
          }}
        >
          a
        </div>
        <div style={{ fontFamily: sans, fontSize: 38, color: ESPRESSO, fontWeight: 500 }}>
          {contactName} ↔ Asmi
        </div>
        <div style={{ fontSize: 24, color: STONE, marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>
          iMessage
        </div>
      </div>

      {/* Bubbles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {bubbles.map((b, i) => {
          const enter = spring({ frame: frame - i * 10 - 8, fps, config: { damping: 14, stiffness: 180 } });
          const opacity = interpolate(enter, [0, 1], [0, 1]);
          const y = interpolate(enter, [0, 1], [24, 0]);
          return (
            <div
              key={i}
              style={{
                alignSelf: b.from === "user" ? "flex-start" : "flex-end",
                maxWidth: "78%",
                padding: "26px 34px",
                borderRadius: 38,
                background: b.from === "user" ? IMSG_GRAY : IMSG_BLUE,
                color: b.from === "user" ? ESPRESSO : "#fff",
                fontSize: 36,
                lineHeight: 1.32,
                opacity,
                transform: `translateY(${y}px)`,
                boxShadow: "0 8px 24px -12px rgba(44,37,32,0.18)",
              }}
            >
              {b.text}
            </div>
          );
        })}

        {/* Typing indicator before reply */}
        {reply && frame > 22 && frame < reply.delay && (
          <TypingDots align="right" />
        )}

        {/* Asmi reply bubble */}
        {reply && frame >= reply.delay && (() => {
          const enter = spring({ frame: frame - reply.delay, fps, config: { damping: 14, stiffness: 180 } });
          const opacity = interpolate(enter, [0, 1], [0, 1]);
          const y = interpolate(enter, [0, 1], [24, 0]);
          return (
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "78%",
                padding: "26px 34px",
                borderRadius: 38,
                background: IMSG_BLUE,
                color: "#fff",
                fontSize: 36,
                lineHeight: 1.32,
                opacity,
                transform: `translateY(${y}px)`,
                boxShadow: "0 8px 24px -12px rgba(44,37,32,0.18)",
              }}
            >
              {reply.text}
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};

const TypingDots: React.FC<{ align: "left" | "right" }> = ({ align }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        alignSelf: align === "right" ? "flex-end" : "flex-start",
        background: IMSG_GRAY,
        borderRadius: 30,
        padding: "20px 28px",
        display: "flex",
        gap: 10,
      }}
    >
      {[0, 1, 2].map((i) => {
        const o = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 6 - i * 0.7));
        return (
          <span
            key={i}
            style={{ width: 16, height: 16, borderRadius: 999, background: STONE, opacity: o }}
          />
        );
      })}
    </div>
  );
};

// ============= Call scene =============

const SceneCall: React.FC<{
  label: string;
  name: string;
  accent: string;
  transcript: string;
}> = ({ label, name, accent, transcript }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const scale = interpolate(intro, [0, 1], [0.94, 1]);

  // typewriter on transcript
  const charsTotal = transcript.length;
  const charStart = 20;
  const charsShown = Math.max(0, Math.min(charsTotal, Math.floor((frame - charStart) * 1.4)));
  const shown = transcript.slice(0, charsShown);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          width: "100%",
          maxWidth: 900,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          borderRadius: 56,
          padding: "70px 60px",
          border: "1px solid rgba(44,37,32,0.06)",
          boxShadow: "0 30px 80px -30px rgba(44,37,32,0.25)",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: accent,
            fontWeight: 600,
            marginBottom: 30,
          }}
        >
          {label}
        </div>

        {/* Avatar + rings */}
        <div style={{ display: "flex", justifyContent: "center", margin: "30px 0 40px", position: "relative", height: 280 }}>
          <Rings accent={accent} />
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${accent}, ${CLAY})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CREAM,
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 100,
              zIndex: 2,
              boxShadow: `0 20px 60px -20px ${accent}88`,
            }}
          >
            {name[0].toLowerCase()}
          </div>
        </div>

        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 56,
            color: ESPRESSO,
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          {name}
        </div>

        {/* Waveform */}
        <Waveform accent={accent} />

        {/* Transcript */}
        <div
          style={{
            marginTop: 40,
            fontSize: 32,
            color: ESPRESSO,
            textAlign: "center",
            minHeight: 100,
            lineHeight: 1.4,
            fontFamily: serif,
            fontStyle: "italic",
          }}
        >
          "{shown}
          {charsShown < charsTotal && (
            <span style={{ opacity: (frame % 20) < 10 ? 1 : 0 }}>|</span>
          )}
          {charsShown >= charsTotal && '"'}
        </div>
      </div>

      {/* progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "10%",
          right: "10%",
          height: 6,
          borderRadius: 6,
          background: "rgba(44,37,32,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / durationInFrames) * 100}%`,
            background: accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Rings: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 25) % 75) / 75;
        const size = 220 + t * 240;
        const opacity = (1 - t) * 0.45;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: 999,
              border: `2px solid ${accent}`,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

const Waveform: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const bars = 48;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 80 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 12 + Math.abs(Math.sin(frame / 5 + i * 0.6)) * 60 + Math.abs(Math.sin(frame / 9 + i * 0.3)) * 14;
        return (
          <div
            key={i}
            style={{
              width: 6,
              height: h,
              background: accent,
              borderRadius: 6,
              opacity: 0.75,
            }}
          />
        );
      })}
    </div>
  );
};

// ============= Done scene =============

const SceneDone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 16, stiffness: 160 } });
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const y = interpolate(intro, [0, 1], [20, 0]);

  const chip = (label: string, sub: string, color: string, delay: number) => {
    const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
    return (
      <div
        style={{
          opacity: s,
          transform: `translateY(${(1 - s) * 24}px)`,
          background: "rgba(255,255,255,0.85)",
          border: `1px solid ${color}55`,
          borderRadius: 36,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: `0 18px 50px -22px ${color}99`,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: SAGE,
            color: CREAM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          ✓
        </div>
        <div>
          <div style={{ fontSize: 32, color: ESPRESSO, fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 24, color: STONE, marginTop: 4 }}>{sub}</div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 28, opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 90, color: ESPRESSO, marginBottom: 30 }}>
        done.
      </div>
      {chip("Dr. Weng · Jonathan", "Tuesday · 10:00 AM", TERRACOTTA, 4)}
      {chip("Abuelo · check-in logged", "took medicine · feeling OK", CLAY, 14)}
      <div style={{ marginTop: 40, fontFamily: serif, fontStyle: "italic", fontSize: 44, color: STONE }}>
        asmi
      </div>
    </AbsoluteFill>
  );
};
