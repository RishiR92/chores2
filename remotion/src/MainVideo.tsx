import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  staticFile,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont } from "@remotion/fonts";

const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

loadFont({
  family: "Noto Color Emoji",
  url: staticFile("fonts/NotoColorEmoji.ttf"),
  format: "truetype",
}).catch(() => {});

const EMOJI_STACK = `${sans}, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

const CREAM = "#F2EDE3";
const ESPRESSO = "#1A1714";
const STONE_DARK = "#6B6259";
const STONE = "#7A6F64";
const TERRACOTTA = "#C25B3F";
const CLAY = "#D4A574";
const SAGE = "#5F8365";
const WA_GREEN_HI = "#25D366";
const WA_GREEN_LO = "#128C7E";

// Tightened, launch-trailer pacing @ 30fps
const D = {
  intro: 60,    // 2.0s
  imDoc: 75,    // 2.5s
  doc: 240,     // 8.0s (voice-locked)
  imHvac: 75,
  hvac: 240,
  imGp: 75,
  gp: 240,
  done: 180,    // 6.0s
  outro: 105,   // 3.5s
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
  D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp + D.done + D.outro; // 1260

// Music: smooth equal-power fade only during the outro; gentle duck under voice.
const callRanges: Array<[number, number]> = [
  [O.doc, O.doc + D.doc],
  [O.hvac, O.hvac + D.hvac],
  [O.gp, O.gp + D.gp],
];
const bgmVolume = (f: number) => {
  const fadeIn = Math.min(1, f / 36);
  // Fade only across the outro window; cosine for musical decay.
  let fadeOut = 1;
  if (f >= O.outro) {
    const t = Math.min(1, (f - O.outro) / D.outro);
    fadeOut = Math.cos((t * Math.PI) / 2); // 1 -> 0 smoothly
  }
  const RAMP = 22;
  let duckAmt = 0;
  for (const [a, b] of callRanges) {
    const into = Math.max(0, Math.min(1, (f - a) / RAMP));
    const outOf = Math.max(0, Math.min(1, (b - f) / RAMP));
    duckAmt = Math.max(duckAmt, Math.min(into, outOf));
  }
  const eased = duckAmt * duckAmt * (3 - 2 * duckAmt);
  // Gentler duck — keep music present (0.10 floor instead of 0.018).
  const base = 0.42 * (1 - eased) + 0.10 * eased;
  return Math.max(0, base * fadeIn * fadeOut);
};

const POP = "audio/sfx/imessage-receive.mp3";

// Chat lines per beat
const LINE_DOC = "book Jonathan a checkup with Dr. Weng";
const LINE_HVAC = "AC is dead. Need a tech ASAP 🥵";
const LINE_GP = "check on grandpa in Sevilla — in Spanish 🙏";

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: sans }}>
      <DriftingBloom />
      <Grain />

      <Sequence from={O.intro} durationInFrames={D.intro}><Intro /></Sequence>

      <Sequence from={O.imDoc} durationInFrames={D.imDoc}>
        <HeroBubble text={LINE_DOC} time="9:03" />
      </Sequence>
      <Sequence from={O.doc} durationInFrames={D.doc}>
        <SceneCall
          label="Asmi → Dr. Weng's office"
          name="Dr. Weng — Front Desk"
          accent={TERRACOTTA}
          captions={[
            { at: 0,   text: "Hi, I'm calling on behalf of Sarah Kim." },
            { at: 60,  text: "I'd like to book a checkup for her son Jonathan." },
            { at: 130, text: "Insurance is Blue Cross, ID on file." },
            { at: 195, text: "Tuesday at 10am works — confirmed." },
          ]}
        />
      </Sequence>

      <Sequence from={O.imHvac} durationInFrames={D.imHvac}>
        <HeroBubble text={LINE_HVAC} time="11:18" />
      </Sequence>
      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <SceneCall
          label="Asmi → Pacific HVAC"
          name="Pacific HVAC"
          accent={SAGE}
          captions={[
            { at: 0,   text: "Hi, calling for Marco — AC stopped working." },
            { at: 60,  text: "Two-story home in Oakland, central system." },
            { at: 130, text: "What's your earliest diagnostic visit?" },
            { at: 195, text: "Saturday 9am, $150 diagnostic — booked." },
          ]}
        />
      </Sequence>

      <Sequence from={O.imGp} durationInFrames={D.imGp}>
        <HeroBubble text={LINE_GP} time="6:42" />
      </Sequence>
      <Sequence from={O.gp} durationInFrames={D.gp}>
        <SceneCall
          label="Asmi → Abuelo · Sevilla"
          name="Abuelo"
          accent={CLAY}
          captions={[
            { at: 0,   text: "Hola abuelo, soy Asmi. ¿Cómo estás hoy?" },
            { at: 60,  text: "¿Tomaste tu medicina esta mañana?" },
            { at: 130, text: "¿Cómo va el dolor de espalda?" },
            { at: 195, text: "Perfecto — le aviso a Sarah. Te quiero." },
          ]}
        />
      </Sequence>

      <Sequence from={O.done} durationInFrames={D.done}><SceneDone /></Sequence>
      <Sequence from={O.outro} durationInFrames={D.outro}><Outro /></Sequence>

      {/* Call voice tracks */}
      <Sequence from={O.doc} durationInFrames={D.doc}>
        <Audio src={staticFile("audio/trimmed/doc.mp3")} volume={1.4} />
      </Sequence>
      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <Audio src={staticFile("audio/trimmed/hvac.mp3")} volume={1.4} />
      </Sequence>
      <Sequence from={O.gp} durationInFrames={D.gp}>
        <Audio src={staticFile("audio/trimmed/grandpa.mp3")} volume={1.4} />
      </Sequence>

      {/* Bubble pop on each chat beat — bubble enters at frame ~8 */}
      <Sequence from={O.imDoc + 6} durationInFrames={20}>
        <Audio src={staticFile(POP)} volume={0.7} />
      </Sequence>
      <Sequence from={O.imHvac + 6} durationInFrames={20}>
        <Audio src={staticFile(POP)} volume={0.7} />
      </Sequence>
      <Sequence from={O.imGp + 6} durationInFrames={20}>
        <Audio src={staticFile(POP)} volume={0.7} />
      </Sequence>

      <Audio src={staticFile("audio/bgm.mp3")} volume={(f) => bgmVolume(f)} />
    </AbsoluteFill>
  );
};

// ============= Atmosphere =============

const DriftingBloom: React.FC = () => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 200) * 80;
  const y = Math.cos(frame / 220) * 60;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 40% at ${50 + x / 8}% ${30 + y / 8}%, rgba(194,91,63,0.14), transparent 70%),
                       radial-gradient(55% 38% at ${30 + x / 6}% ${75 + y / 6}%, rgba(212,165,116,0.12), transparent 70%),
                       radial-gradient(50% 35% at ${75 - x / 6}% ${60 - y / 6}%, rgba(95,131,101,0.09), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity: 0.05,
      mixBlendMode: "multiply",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
    }}
  />
);

// ============= Intro (brand bookend) =============

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 220 } });
  const tag = spring({ frame: frame - 10, fps, config: { damping: 26, stiffness: 180 } });
  const opacity = interpolate(frame, [0, 10, D.intro - 14, D.intro], [0, 1, 1, 0]);
  const y = interpolate(s, [0, 1], [28, 0]);
  const tagY = interpolate(tag, [0, 1], [18, 0]);
  const tagOp = interpolate(tag, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 260,
          color: ESPRESSO,
          letterSpacing: -2,
          lineHeight: 1,
          transform: `translateY(${y}px)`,
        }}
      >
        asmi
      </div>
      <div
        style={{
          marginTop: 36,
          fontSize: 30,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: STONE_DARK,
          fontWeight: 500,
          opacity: tagOp,
          transform: `translateY(${tagY}px)`,
        }}
      >
        handles the real world
      </div>
    </AbsoluteFill>
  );
};

// ============= HeroBubble (single floating green bubble) =============

const WATick: React.FC = () => (
  <svg width="44" height="22" viewBox="0 0 22 14" fill="none">
    <path d="M1 7 L5 11 L12 3" stroke="#9FE3F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7 L12 11 L19 3" stroke="#9FE3F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeroBubble: React.FC<{ text: string; time: string }> = ({ text, time }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Enter
  const enter = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 200 } });
  const enterY = interpolate(enter, [0, 1], [60, 0]);
  const enterSc = interpolate(enter, [0, 1], [0.86, 1]);
  const enterBlur = interpolate(enter, [0, 1], [14, 0], { extrapolateRight: "clamp" });

  // Exit (last 12 frames)
  const exitStart = durationInFrames - 12;
  const exitT = Math.max(0, Math.min(1, (frame - exitStart) / 12));
  const exitOp = 1 - exitT;
  const exitSc = interpolate(exitT, [0, 1], [1, 0.96]);
  const exitBlur = interpolate(exitT, [0, 1], [0, 8]);

  // Micro float
  const float = Math.sin(frame / 14) * 3;

  const sc = enterSc * exitSc;
  const blur = Math.max(enterBlur, exitBlur);
  const opacity = Math.min(enter, exitOp);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      {/* Soft green glow tying bubble to brand color */}
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: 9999,
          background: "radial-gradient(closest-side, rgba(37,211,102,0.22), rgba(37,211,102,0) 70%)",
          filter: "blur(20px)",
          opacity: enter * (1 - exitT * 0.6),
          transform: `translateY(${float * 4}px)`,
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 900,
          padding: "48px 56px 44px",
          borderRadius: 56,
          borderBottomRightRadius: 14,
          background: `linear-gradient(155deg, ${WA_GREEN_HI} 0%, ${WA_GREEN_LO} 100%)`,
          boxShadow: [
            "0 60px 140px -40px rgba(18,140,126,0.55)",
            "0 30px 70px -30px rgba(0,0,0,0.35)",
            "inset 0 1px 0 rgba(255,255,255,0.22)",
            "inset 0 -1px 0 rgba(0,0,0,0.12)",
          ].join(", "),
          color: "#fff",
          fontFamily: EMOJI_STACK,
          fontWeight: 600,
          fontSize: 60,
          lineHeight: 1.22,
          letterSpacing: -0.5,
          opacity,
          transform: `translateY(${enterY + float}px) scale(${sc})`,
          filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
        }}
      >
        {/* Inner highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ paddingBottom: 28 }}>{text}</div>
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: 22,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(255,255,255,0.82)",
            fontSize: 24,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: 0,
          }}
        >
          <span>{time}</span>
          <WATick />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============= Call scene (unchanged) =============

type Caption = { at: number; text: string };

const SceneCall: React.FC<{
  label: string;
  name: string;
  accent: string;
  captions: Caption[];
}> = ({ label, name, accent, captions }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const scale = interpolate(intro, [0, 1], [0.94, 1]);

  const active = captions.reduce<Caption | null>(
    (acc, c) => (frame >= c.at ? c : acc),
    null,
  );
  const captionEnter = active
    ? spring({ frame: frame - active.at, fps, config: { damping: 16, stiffness: 180 } })
    : 0;

  const sec = Math.floor(frame / fps);
  const mm = Math.floor(sec / 60).toString().padStart(1, "0");
  const ss = (sec % 60).toString().padStart(2, "0");

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          width: "100%",
          maxWidth: 940,
          background: "rgba(255,255,255,0.78)",
          borderRadius: 56,
          padding: "60px 56px",
          border: "1px solid rgba(44,37,32,0.06)",
          boxShadow: "0 30px 80px -30px rgba(44,37,32,0.28)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: accent,
              fontWeight: 600,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 24,
              color: STONE,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ● {mm}:{ss}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 30px", position: "relative", height: 260 }}>
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
              boxShadow: `0 20px 60px -20px ${accent}aa`,
            }}
          >
            {name[0].toLowerCase()}
          </div>
        </div>

        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 52,
            color: ESPRESSO,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {name}
        </div>

        <Waveform accent={accent} />

        <div
          style={{
            marginTop: 36,
            minHeight: 160,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {active && (
            <div
              style={{
                opacity: captionEnter,
                transform: `translateY(${(1 - captionEnter) * 12}px)`,
                background: `${accent}14`,
                border: `1px solid ${accent}33`,
                borderRadius: 28,
                padding: "22px 30px",
                fontSize: 32,
                color: ESPRESSO,
                fontFamily: serif,
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 1.4,
                maxWidth: "92%",
              }}
            >
              "{active.text}"
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 90,
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
        const opacity = (1 - t) * 0.4;
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
  const bars = 56;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 80 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 10 + Math.abs(Math.sin(frame / 5 + i * 0.55)) * 56 + Math.abs(Math.sin(frame / 9 + i * 0.3)) * 14;
        return (
          <div
            key={i}
            style={{
              width: 6,
              height: h,
              background: accent,
              borderRadius: 6,
              opacity: 0.78,
            }}
          />
        );
      })}
    </div>
  );
};

// ============= Done =============

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
        key={label}
        style={{
          opacity: s,
          transform: `translateY(${(1 - s) * 24}px)`,
          background: "rgba(255,255,255,0.9)",
          border: `1px solid ${color}55`,
          borderRadius: 36,
          padding: "30px 38px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: `0 18px 50px -22px ${color}99`,
          width: "82%",
          maxWidth: 760,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: SAGE,
            color: CREAM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          ✓
        </div>
        <div>
          <div style={{ fontSize: 34, color: ESPRESSO, fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 26, color: STONE, marginTop: 6 }}>{sub}</div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 28, opacity, transform: `translateY(${y}px)`, padding: 60 }}
    >
      <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 110, color: ESPRESSO, marginBottom: 40 }}>
        done.
      </div>
      {chip("Dr. Weng · Jonathan", "Tuesday · 10:00 AM", TERRACOTTA, 6)}
      {chip("Pacific HVAC · Marco", "Saturday · 9:00 AM · $150", SAGE, 24)}
      {chip("Abuelo · Sevilla", "took medicine · feeling OK", CLAY, 42)}
    </AbsoluteFill>
  );
};

// ============= Outro (brand bookend) =============

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12, D.outro - 16, D.outro], [0, 1, 1, 0]);

  const lines = [
    { text: "AI That Handles",       delay: 0,  accent: false },
    { text: "Your Personal Chores",  delay: 12, accent: false },
    { text: "In The Physical World", delay: 24, accent: true  },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, padding: 80 }}>
      <div
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 56,
          color: STONE_DARK,
          marginBottom: 36,
          letterSpacing: -1,
        }}
      >
        asmi
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lines.map((l, i) => {
          const s = spring({ frame: frame - l.delay, fps, config: { damping: 22, stiffness: 180 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [28, 0]);
          return (
            <div
              key={i}
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 112,
                lineHeight: 1.05,
                color: l.accent ? TERRACOTTA : ESPRESSO,
                textAlign: "center",
                opacity: op,
                transform: `translateY(${y}px)`,
                letterSpacing: -2,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 50,
          fontSize: 26,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: STONE_DARK,
          fontWeight: 500,
        }}
      >
        you text · asmi calls · it's done
      </div>
    </AbsoluteFill>
  );
};

export { TOTAL };
