import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoSC } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadNotoJP } from "@remotion/google-fonts/NotoSansJP";
import { loadFont as loadNotoKR } from "@remotion/google-fonts/NotoSansKR";
import { loadFont as loadNotoDeva } from "@remotion/google-fonts/NotoSansDevanagari";
import { loadFont as loadNotoTamil } from "@remotion/google-fonts/NotoSansTamil";
import { loadFont as loadNotoBengali } from "@remotion/google-fonts/NotoSansBengali";
import { loadFont as loadNotoArabic } from "@remotion/google-fonts/NotoSansArabic";
import { loadFont as loadNotoHebrew } from "@remotion/google-fonts/NotoSansHebrew";
import { loadFont as loadNotoGurmukhi } from "@remotion/google-fonts/NotoSansGurmukhi";
import { MainVideo } from "./MainVideo";

const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const { fontFamily: notoSC } = loadNotoSC("normal", { weights: ["500"] });
const { fontFamily: notoJP } = loadNotoJP("normal", { weights: ["500"] });
const { fontFamily: notoKR } = loadNotoKR("normal", { weights: ["500"] });
const { fontFamily: notoDeva } = loadNotoDeva("normal", { weights: ["500"] });
const { fontFamily: notoTamil } = loadNotoTamil("normal", { weights: ["500"] });
const { fontFamily: notoBengali } = loadNotoBengali("normal", { weights: ["500"] });
const { fontFamily: notoArabic } = loadNotoArabic("normal", { weights: ["500"] });
const { fontFamily: notoHebrew } = loadNotoHebrew("normal", { weights: ["500"] });
const { fontFamily: notoGurmukhi } = loadNotoGurmukhi("normal", { weights: ["500"] });

// Mirror MainVideo timing (30fps). New fast-paced beats added after `done`.
const D = {
  intro: 60, imDoc: 75, doc: 240, imHvac: 75, hvac: 240,
  imGp: 75, gp: 240, done: 180,
  tasks: 130, langs: 130,
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
  tasks: D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp + D.done,
  langs: D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp + D.done + D.tasks,
  outro: D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp + D.done + D.tasks + D.langs,
};
const TOTAL =
  D.intro + D.imDoc + D.doc + D.imHvac + D.hvac + D.imGp + D.gp + D.done + D.tasks + D.langs + D.outro;

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
  start: number; end: number;
  headline: string; wordmark?: boolean;
  accent: string; energy: number; outro?: boolean;
  hideHeadline?: boolean;
  scene?: "tasks" | "langs";
};

const BEATS: Beat[] = [
  { start: O.intro,  end: O.imDoc,  headline: "meet asmi",                wordmark: true, accent: TERRACOTTA, energy: 0.6 },
  { start: O.imDoc,  end: O.imHvac, headline: "book\nappointments.",      accent: TERRACOTTA, energy: 0.95 },
  { start: O.imHvac, end: O.imGp,   headline: "find\nvendors.",           accent: SAGE,       energy: 0.95 },
  { start: O.imGp,   end: O.done,   headline: "check in on\nloved ones.", accent: CLAY,       energy: 0.5 },
  { start: O.done,   end: O.tasks,  headline: "handles\nyour day.",       accent: SKY,        energy: 0.7 },
  { start: O.tasks,  end: O.langs,  headline: "your personal\nchores handled.", accent: CLAY,    energy: 1.0, scene: "tasks" },
  { start: O.langs,  end: O.outro,  headline: "50+ languages.\nyour way.",        accent: SAGE,    energy: 1.0, scene: "langs" },
  { start: O.outro,  end: TOTAL,    headline: "",                         accent: TERRACOTTA, energy: 0.4, outro: true },
];

const findBeatIdx = (f: number) => {
  for (let i = 0; i < BEATS.length; i++) if (f >= BEATS[i].start && f < BEATS[i].end) return i;
  return BEATS.length - 1;
};

const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}, ${a})`;
};

const easeInOut = (t: number) => (t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2);

export const Launch16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const idx = findBeatIdx(frame);
  const beat = BEATS[idx];
  const prev = BEATS[Math.max(0, idx - 1)];
  const localFrame = frame - beat.start;

  const blend = easeInOut(
    interpolate(localFrame, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const accent = beat.accent;
  const accentPrev = prev.accent;

  // Phone entrance — delayed a touch so wordmark reads first
  const phoneIn = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80, mass: 1.1 } });
  const entryY = interpolate(phoneIn, [0, 1], [240, 0]);
  const entryRotX = interpolate(phoneIn, [0, 1], [22, 0]);
  const entryRotY = interpolate(phoneIn, [0, 1], [-18, 0]);
  const entryScale = interpolate(phoneIn, [0, 1], [0.7, 1]);
  const entryOp = interpolate(phoneIn, [0, 1], [0, 1]);

  // Continuous levitation — kicks in after entry spring resolves.
  const settle = interpolate(phoneIn, [0.7, 1], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const floatY = Math.sin(frame / 55) * 14 * settle;
  const yawDeg = Math.sin(frame / 90) * 2.5 * settle;
  const pitchDeg = Math.sin(frame / 110 + 1.2) * 1.5 * settle;
  const breath = 1 + Math.sin(frame / 75) * 0.012 * settle;
  // Sheen offset for the glass/metal highlight.
  const sheen = ((frame / 4) % 200) - 100;

  const PHONE_FIT_HEIGHT = 980;
  const phoneScale = PHONE_FIT_HEIGHT / 1920;

  // Outro dissolve
  const isOutro = !!beat.outro;
  const dissolveT = isOutro
    ? interpolate(localFrame, [0, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const dissolveScale = 1 + dissolveT * 0.16;
  const dissolveBlur = dissolveT * 16;
  const dissolveOp = 1 - dissolveT;

  // Phone fixed center-right
  const phoneCenterX = 1920 * 0.68; // ~1305
  const phoneW = 1080 * phoneScale;
  const phoneH = 1920 * phoneScale;

  const totalScale = entryScale * breath * dissolveScale;
  const totalRotX = entryRotX + pitchDeg;
  const totalRotY = entryRotY + yawDeg;

  // Shadow breathes with the float — grows when phone rises.
  const liftN = (floatY + 14) / 28; // 0..1 ish
  const shadowY = 50 + (1 - liftN) * 30;
  const shadowBlur = 70 + liftN * 30;
  const shadowAlpha = 0.22 + (1 - liftN) * 0.18;


  const stageDarken = isOutro
    ? interpolate(localFrame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ fontFamily: sans, background: LINEN, overflow: "hidden" }}>
      {/* Painterly warm backdrop */}
      <AbsoluteFill
        style={{ background: `radial-gradient(70% 60% at 50% 30%, ${MORNING} 0%, ${LINEN} 55%, ${SAND} 100%)` }}
      />

      {/* Stationary top light pool */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 42% at 55% 28%, rgba(255,247,232,0.9), transparent 70%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
          opacity: 1 - stageDarken * 0.7,
        }}
      />

      {/* Accent washes — crossfade */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 45% at 70% 80%, ${rgba(accentPrev, 0.22)}, transparent 70%),
                       radial-gradient(40% 35% at 20% 25%, ${rgba(accentPrev, 0.14)}, transparent 70%)`,
          opacity: (1 - blend) * (1 - stageDarken),
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 45% at 70% 80%, ${rgba(accent, 0.22)}, transparent 70%),
                       radial-gradient(40% 35% at 20% 25%, ${rgba(accent, 0.14)}, transparent 70%)`,
          opacity: blend * (1 - stageDarken),
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      <AccentSweep accent={accent} localFrame={localFrame} />

      {isOutro && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(70% 65% at 50% 45%, ${rgba(MORNING, 0.0)} 0%, ${rgba(SAND, 0.55)} 80%, ${rgba(ESPRESSO, 0.18)} 100%)`,
            opacity: stageDarken,
            pointerEvents: "none",
          }}
        />
      )}

      <DustMotes energy={beat.energy} darken={stageDarken} />

      {/* === LEFT COLUMN — headline === */}
      {!isOutro && !beat.hideHeadline && (
        <HeadlineColumn
          key={`hl-${idx}`}
          headline={beat.headline}
          wordmark={!!beat.wordmark}
          accent={accent}
          localFrame={localFrame}
          beatLen={beat.end - beat.start}
        />
      )}

      {/* === PHONE — fixed center-right (hidden during scene beats) === */}
      {!beat.scene && !isOutro && (
        <div
          style={{
            position: "absolute",
            left: phoneCenterX - phoneW / 2,
            top: 1080 / 2 - phoneH / 2,
            width: phoneW,
            height: phoneH,
            transform: `translateY(${entryY + floatY}px)`,
            opacity: entryOp * dissolveOp,
            perspective: 2600,
            perspectiveOrigin: "50% 50%",
            zIndex: 5,
            filter: isOutro
              ? `blur(${dissolveBlur}px) drop-shadow(0 ${shadowY}px ${shadowBlur}px ${rgba(ESPRESSO, shadowAlpha)})`
              : `drop-shadow(0 ${shadowY}px ${shadowBlur}px ${rgba(ESPRESSO, shadowAlpha)}) drop-shadow(0 0 36px ${rgba(accent, 0.22)})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${totalScale}) rotateY(${totalRotY}deg) rotateX(${totalRotX}deg)`,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 50%",
            }}
          >
            {/* Titanium phone shell */}
            <div
              style={{
                position: "absolute",
                width: 1080, height: 1920, left: 0, top: 0,
                transform: `scale(${phoneScale})`,
                transformOrigin: "top left",
                borderRadius: 168,
                background: `linear-gradient(180deg, #3a3a3e 0%, #2a2a2e 32%, #1c1c1f 62%, #2a2a2e 100%)`,
                boxShadow: `
                  inset 0 2px 0 rgba(255,255,255,0.18),
                  inset 0 -2px 0 rgba(0,0,0,0.55),
                  inset 3px 0 4px rgba(0,0,0,0.4),
                  inset -3px 0 4px rgba(0,0,0,0.4)
                `,
              }}
            />

            {/* Accent rim-light on the shell */}
            <div
              style={{
                position: "absolute",
                width: 1080, height: 1920, left: 0, top: 0,
                transform: `scale(${phoneScale})`,
                transformOrigin: "top left",
                borderRadius: 168,
                boxShadow: `0 0 0 2px ${rgba(accent, 0.22)} inset`,
                pointerEvents: "none",
              }}
            />

            {/* Diagonal glass sheen — slowly moving */}
            <div
              style={{
                position: "absolute",
                width: 1080, height: 1920, left: 0, top: 0,
                transform: `scale(${phoneScale})`,
                transformOrigin: "top left",
                borderRadius: 168,
                overflow: "hidden",
                pointerEvents: "none",
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(115deg, transparent ${30 + sheen * 0.2}%, rgba(255,255,255,0.08) ${50 + sheen * 0.2}%, transparent ${70 + sheen * 0.2}%)`,
                }}
              />
            </div>

            {/* Screen content */}
            <div
              style={{
                position: "absolute",
                width: 1080, height: 1920, left: 0, top: 0,
                transform: `scale(${phoneScale})`,
                transformOrigin: "top left",
                clipPath: "inset(110px 90px 110px 90px round 130px)",
              }}
            >
              <MainVideo />
            </div>

            {/* Thin accent border on the screen rect */}
            <div
              style={{
                position: "absolute",
                width: 1080, height: 1920, left: 0, top: 0,
                transform: `scale(${phoneScale})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "110px 90px 110px 90px",
                  borderRadius: 130,
                  border: `1px solid ${rgba(accent, 0.35)}`,
                  boxShadow: `inset 0 0 0 4px rgba(0,0,0,0.6)`,
                }}
              />
            </div>
          </div>
        </div>
      )}


      {/* === SCENE — task cloud === */}
      {beat.scene === "tasks" && (
        <TaskCloud localFrame={localFrame} beatLen={beat.end - beat.start} accent={accent} />
      )}
      {beat.scene === "langs" && (
        <LangCloud localFrame={localFrame} beatLen={beat.end - beat.start} accent={accent} />
      )}

      {/* Outro warm flare in place of where phone was */}
      {isOutro && dissolveT > 0.1 && dissolveT < 0.95 && (
        <div
          style={{
            position: "absolute",
            left: phoneCenterX,
            top: 1080 / 2,
            width: 1, height: 1,
            zIndex: 6,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -400, top: -400,
              width: 800, height: 800,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(accent, 0.5)} 0%, ${rgba(accent, 0.18)} 30%, transparent 70%)`,
              transform: `scale(${0.6 + dissolveT * 1.4})`,
              opacity: interpolate(dissolveT, [0.1, 0.4, 1], [0, 0.8, 0]),
              filter: "blur(20px)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      )}

      {isOutro && <OutroHero localFrame={localFrame} accent={TERRACOTTA} />}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(80% 80% at 50% 50%, transparent 55%, rgba(44,37,32,0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Lower-third progress mark */}
      {!isOutro && (
        <div
          style={{
            position: "absolute",
            left: 96, bottom: 56,
            display: "flex", alignItems: "center", gap: 16,
            color: STONE, fontSize: 15,
            letterSpacing: 5, textTransform: "uppercase", fontWeight: 500,
            zIndex: 6,
          }}
        >
          <span style={{ color: accent }}>●</span>
          <span>personal AI</span>
          <div style={{ width: 240, height: 1, background: rgba(ESPRESSO, 0.15), position: "relative", marginLeft: 12 }}>
            <div
              style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: `${(frame / TOTAL) * 100}%`,
                background: accent,
              }}
            />
          </div>
        </div>
      )}

      {/* Global background music spanning the full 16:9 cut.
          Fades out across the last ~30 frames of the outro. */}
      <Audio
        src={staticFile("audio/bgm.mp3")}
        volume={(f) =>
          interpolate(f, [0, 20, TOTAL - 30, TOTAL - 2], [0, 0.55, 0.55, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};

// ============= Headline column (left) =============
const HeadlineColumn: React.FC<{
  headline: string; wordmark: boolean; accent: string;
  localFrame: number; beatLen: number;
}> = ({ headline, wordmark, accent, localFrame, beatLen }) => {
  const { fps } = useVideoConfig();
  const outOp = interpolate(localFrame, [Math.max(0, beatLen - 18), beatLen], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 96, top: 0, bottom: 0,
        width: 820,
        display: "flex", flexDirection: "column", justifyContent: "center",
        gap: 28,
        zIndex: 3,
      }}
    >

      {wordmark ? (
        <WordmarkHeadline accent={accent} localFrame={localFrame} outOp={outOp} />
      ) : (
        <KineticLines
          headline={headline}
          localFrame={localFrame}
          fps={fps}
          outOp={outOp}
        />
      )}

      {/* Underline accent grows in */}
      <div
        style={{
          marginTop: 8,
          width: interpolate(
            spring({ frame: localFrame, fps, config: { damping: 22, stiffness: 110 } }),
            [0, 1], [0, 260]
          ),
          height: 4, borderRadius: 2, background: accent,
          opacity: outOp,
        }}
      />
    </div>
  );
};

const WordmarkHeadline: React.FC<{ accent: string; localFrame: number; outOp: number }> = ({
  accent, localFrame, outOp,
}) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame: localFrame, fps, config: { damping: 22, stiffness: 110 } });
  const op = interpolate(sp, [0, 1], [0, 1]) * outOp;
  const y = interpolate(sp, [0, 1], [40, 0]);
  return (
    <div
      style={{
        fontFamily: serif, fontStyle: "italic",
        fontSize: 260, lineHeight: 0.95,
        color: ESPRESSO, letterSpacing: -8,
        display: "flex", alignItems: "flex-end",
        opacity: op, transform: `translateY(${y}px)`,
      }}
    >
      <span>meet asmi</span>
      <span
        style={{
          width: 18, height: 18, borderRadius: "50%",
          background: accent, marginLeft: 14, marginBottom: 36,
          display: "inline-block",
        }}
      />
    </div>
  );
};

const KineticLines: React.FC<{
  headline: string; localFrame: number; fps: number; outOp: number;
}> = ({ headline, localFrame, fps, outOp }) => {
  const lines = headline.split("\n");
  return (
    <div
      style={{
        fontFamily: serif, fontStyle: "italic",
        fontSize: 180, lineHeight: 0.94,
        color: ESPRESSO, letterSpacing: -6,
        textAlign: "left", opacity: outOp,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: "block", whiteSpace: "nowrap" }}>
          {line.split(" ").map((word, wi) => {
            const delay = li * 6 + wi * 5;
            const sp = spring({
              frame: localFrame - delay, fps,
              config: { damping: 20, stiffness: 120 },
            });
            const y = interpolate(sp, [0, 1], [50, 0]);
            const s = interpolate(sp, [0, 1], [0.94, 1]);
            const op = interpolate(sp, [0, 1], [0, 1]);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  transform: `translateY(${y}px) scale(${s})`,
                  opacity: op, marginRight: 24,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const AccentSweep: React.FC<{ accent: string; localFrame: number }> = ({ accent, localFrame }) => {
  if (localFrame > 22) return null;
  const t = interpolate(localFrame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(t, [0, 1], [-100, 130]);
  const op = interpolate(t, [0, 0.3, 1], [0, 0.5, 0]);
  return (
    <div
      style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", zIndex: 4,
        background: `linear-gradient(110deg, transparent ${x - 30}%, ${rgba(accent, 0.32)} ${x}%, transparent ${x + 30}%)`,
        opacity: op, mixBlendMode: "soft-light",
      }}
    />
  );
};

const OutroHero: React.FC<{ localFrame: number; accent: string }> = ({ localFrame, accent }) => {
  const { fps } = useVideoConfig();

  // Two balanced lines. Highlights are inline <span> with NO inline-block,
  // so natural whitespace between words is preserved.
  type Seg = { text: string; highlight?: boolean };
  const lines: Seg[][] = [
    [
      { text: "AI that handles your " },
      { text: "personal chores", highlight: true },
    ],
    [
      { text: "in the " },
      { text: "real world", highlight: true },
      { text: "." },
    ],
  ];

  const heroStart = 18;

  // Top asmi stamp
  const stampOp = interpolate(localFrame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Hairline rule under second line
  const ruleW = interpolate(
    localFrame - (heroStart + 2 * 10 + 14), [0, 18], [0, 220],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom caption
  const captionOp = interpolate(localFrame, [60, 82], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 7,
      }}
    >
      {/* Top stamp: asmi wordmark + dot, hairline below */}
      <div
        style={{
          position: "absolute", top: "16%", left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 14, opacity: stampOp,
        }}
      >
        <div
          style={{
            display: "flex", alignItems: "flex-end",
            fontFamily: serif, fontStyle: "italic",
            fontSize: 56, color: ESPRESSO, letterSpacing: -2, lineHeight: 0.9,
          }}
        >
          <span>asmi</span>
          <span
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: accent, marginLeft: 5, marginBottom: 10,
              display: "inline-block",
            }}
          />
        </div>
        <div style={{ width: 64, height: 1, background: rgba(ESPRESSO, 0.25) }} />
      </div>

      {/* Hero line */}
      <div
        style={{
          fontFamily: serif, fontStyle: "italic",
          fontSize: 118, lineHeight: 1.12,
          color: ESPRESSO, letterSpacing: -3,
          textAlign: "center", maxWidth: 1500,
        }}
      >
        {lines.map((segs, li) => {
          const delay = heroStart + li * 10;
          const sp = spring({
            frame: localFrame - delay, fps,
            config: { damping: 24, stiffness: 80 },
          });
          const y = interpolate(sp, [0, 1], [14, 0]);
          const op = interpolate(sp, [0, 1], [0, 1]);
          return (
            <div
              key={li}
              style={{
                transform: `translateY(${y}px)`,
                opacity: op,
              }}
            >
              {segs.map((seg, si) => (
                <span
                  key={si}
                  style={{
                    color: seg.highlight ? accent : ESPRESSO,
                    fontStyle: "italic",
                  }}
                >
                  {seg.text}
                </span>
              ))}
            </div>
          );
        })}

        {/* Hairline rule under the hero */}
        <div
          style={{
            margin: "28px auto 0",
            width: `${ruleW}px`,
            height: 1, background: accent, opacity: 0.85,
          }}
        />
      </div>

      {/* Bottom caption */}
      <div
        style={{
          position: "absolute", bottom: "10%", left: 0, right: 0,
          textAlign: "center",
          fontSize: 14, letterSpacing: 6, textTransform: "uppercase",
          color: STONE, fontWeight: 500,
          opacity: captionOp,
        }}
      >
        personal AI · launches soon
      </div>
    </div>
  );
};

const DustMotes: React.FC<{ energy: number; darken: number }> = ({ energy, darken }) => {
  const frame = useCurrentFrame();
  const count = Math.round(14 + energy * 14);
  const speed = 0.6 + energy * 0.9;
  const motes = Array.from({ length: count }, (_, i) => {
    const seedX = (i * 137.5) % 100;
    const seedY = (i * 73.3) % 100;
    const drift = Math.sin((frame * speed + i * 30) / 80) * 30;
    const driftY = Math.cos((frame * speed + i * 20) / 100) * 40;
    const size = 2 + (i % 4);
    const opacity = (0.18 + ((i % 5) / 5) * 0.25) * (1 - darken * 0.8);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${seedX}%`, top: `${seedY}%`,
          width: size, height: size, borderRadius: "50%",
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

// ============= Rotating reel (shared by tasks + langs scenes) =============
// One hero word at a time, large italic serif. Two soft secondary words
// drift in above and below, lagging the hero. ~14 frames per beat.
const I18N_FONT_STACK = `${serif}, ${notoDeva}, ${notoBengali}, ${notoTamil}, ${notoArabic}, ${notoHebrew}, ${notoGurmukhi}, ${notoSC}, ${notoJP}, ${notoKR}, serif`;

const TASK_LIST = [
  "book dentist", "dispute charge", "call plumber", "check on mom",
  "refill prescription", "moving quotes", "insurance claim", "find electrician",
  "schedule vet", "compare flights", "reverse bank fee", "restaurant reservation",
];

const LANG_LIST = [
  "Español", "हिन्दी", "中文", "Français", "العربية", "日本語",
  "Português", "Deutsch", "한국어", "Italiano", "বাংলা", "Türkçe",
];

const RotatingReel: React.FC<{
  localFrame: number;
  beatLen: number;
  accent: string;
  items: string[];
  fontFamily: string;
  italic?: boolean;
  heroSize: number;
  secondarySize: number;
}> = ({ localFrame, beatLen, accent, items, fontFamily, italic, heroSize, secondarySize }) => {
  const { fps } = useVideoConfig();
  const stageX = 940;
  const stageY = 90;
  const stageW = 920;
  const stageH = 900;

  const outOp = interpolate(localFrame, [Math.max(0, beatLen - 16), beatLen], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const inOp = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Per-beat cycling. First reveal at frame 6, then every BEAT frames.
  const BEAT = 16;
  const startOffset = 6;
  const elapsed = Math.max(0, localFrame - startOffset);
  const beatIdx = Math.floor(elapsed / BEAT);
  const beatLocal = elapsed - beatIdx * BEAT;

  const renderHero = (idx: number, localT: number) => {
    const word = items[((idx % items.length) + items.length) % items.length];
    // localT: 0 → fresh, BEAT → next
    const inSp = spring({
      frame: localT, fps,
      config: { damping: 18, stiffness: 220, mass: 0.7 },
    });
    const exitT = Math.max(0, localT - (BEAT - 5));
    const exitSp = spring({
      frame: exitT, fps,
      config: { damping: 20, stiffness: 200, mass: 0.6 },
    });
    const op = interpolate(inSp, [0, 1], [0, 1]) * (1 - exitSp);
    const ty = interpolate(inSp, [0, 1], [28, 0]) + interpolate(exitSp, [0, 1], [0, -34]);
    const blur = interpolate(inSp, [0, 1], [10, 0]) + interpolate(exitSp, [0, 1], [0, 6]);
    const scale = interpolate(inSp, [0, 1], [0.92, 1]);
    return (
      <div
        key={`hero-${idx}`}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily,
          fontStyle: italic ? "italic" : "normal",
          fontWeight: 500,
          fontSize: heroSize,
          color: TERRACOTTA,
          letterSpacing: -1.5,
          textAlign: "center",
          padding: "0 40px",
          lineHeight: 1.02,
          opacity: op,
          transform: `translateY(${ty}px) scale(${scale})`,
          filter: `blur(${blur}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {word}
      </div>
    );
  };

  const renderSecondary = (idx: number, localT: number, side: "top" | "bottom") => {
    const word = items[((idx % items.length) + items.length) % items.length];
    const t = localT - 3; // lag
    const inSp = spring({
      frame: t, fps,
      config: { damping: 22, stiffness: 180, mass: 0.7 },
    });
    const exitT = Math.max(0, localT - (BEAT - 7));
    const exitSp = spring({
      frame: exitT, fps,
      config: { damping: 22, stiffness: 180, mass: 0.6 },
    });
    const op = interpolate(inSp, [0, 1], [0, 0.32]) * (1 - exitSp);
    const tx = side === "top" ? -120 : 140;
    const tyBase = side === "top" ? -heroSize * 0.7 : heroSize * 0.7;
    const ty = tyBase + interpolate(inSp, [0, 1], [18, 0]);
    return (
      <div
        key={`sec-${side}-${idx}`}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily,
          fontStyle: italic ? "italic" : "normal",
          fontSize: secondarySize,
          color: ESPRESSO,
          letterSpacing: -0.8,
          textAlign: "center",
          opacity: op,
          transform: `translate(${tx}px, ${ty}px)`,
          whiteSpace: "nowrap",
          filter: "blur(0.4px)",
        }}
      >
        {word}
      </div>
    );
  };

  // Hairline rule under hero, breathes with the beat.
  const ruleSp = spring({
    frame: beatLocal - 2, fps,
    config: { damping: 22, stiffness: 200, mass: 0.6 },
  });
  const ruleExit = spring({
    frame: Math.max(0, beatLocal - (BEAT - 5)), fps,
    config: { damping: 22, stiffness: 200, mass: 0.6 },
  });
  const ruleW = interpolate(ruleSp, [0, 1], [0, 220]) * (1 - ruleExit);

  // Counter "01 / 12" style — gives editorial pacing cue.
  const totalShown = Math.min(items.length, Math.floor(beatLen / BEAT));
  const counter = `${String(Math.min(beatIdx + 1, totalShown)).padStart(2, "0")} / ${String(totalShown).padStart(2, "0")}`;

  return (
    <div
      style={{
        position: "absolute",
        left: stageX, top: stageY,
        width: stageW, height: stageH,
        zIndex: 4, pointerEvents: "none",
        opacity: outOp * inOp,
      }}
    >
      {/* Render current + next hero so exit/entry can overlap cleanly */}
      {renderHero(beatIdx, beatLocal)}
      {renderHero(beatIdx + 1, beatLocal - BEAT)}

      {/* Secondary words offset by ±2 in the cycle */}
      {renderSecondary(beatIdx + 2, beatLocal, "top")}
      {renderSecondary(beatIdx - 1, beatLocal, "bottom")}

      {/* Hairline rule */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: stageH / 2 + heroSize * 0.55,
          width: ruleW,
          height: 2,
          background: accent,
          transform: "translateX(-50%)",
          borderRadius: 2,
        }}
      />

      {/* Counter — top-right of stage */}
      <div
        style={{
          position: "absolute",
          right: 36, top: 28,
          fontFamily: sans,
          fontSize: 14,
          letterSpacing: 4,
          color: STONE,
          fontWeight: 500,
          opacity: 0.7,
        }}
      >
        {counter}
      </div>
    </div>
  );
};

const TaskCloud: React.FC<{ localFrame: number; beatLen: number; accent: string }> = (p) => (
  <RotatingReel
    {...p}
    items={TASK_LIST}
    fontFamily={serif}
    italic
    heroSize={132}
    secondarySize={42}
  />
);

const LangCloud: React.FC<{ localFrame: number; beatLen: number; accent: string }> = (p) => (
  <RotatingReel
    {...p}
    items={LANG_LIST}
    fontFamily={I18N_FONT_STACK}
    italic
    heroSize={148}
    secondarySize={48}
  />
);
