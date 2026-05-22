import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { MainVideo } from "./MainVideo";

const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// Mirror MainVideo timing (30fps)
const D = {
  intro: 60, imDoc: 75, doc: 240, imHvac: 75, hvac: 240,
  imGp: 75, gp: 240, done: 180, outro: 105,
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

const LINEN = "#F6F1EB";
const SAND = "#EDE6DC";
const MORNING = "#F2EDE7";
const ESPRESSO = "#2C2520";
const STONE = "#6B6560";
const TERRACOTTA = "#C25B3F";
const SAGE = "#5F8365";
const CLAY = "#D4A574";
const SKY = "#7EADC2";

type Pose = { px: number; py: number; rx: number; ry: number; sc: number };
type Beat = {
  start: number; end: number;
  headline: string; wordmark?: boolean;
  accent: string; pose: Pose; energy: number; outro?: boolean;
};

const POSES = {
  hero:  { px:    0, py: -10, rx: 4, ry:  -6, sc: 1.02 } as Pose,
  left:  { px: -320, py:  10, rx: 5, ry: -13, sc: 0.96 } as Pose,
  right: { px:  320, py:  10, rx: 5, ry:  11, sc: 0.96 } as Pose,
  back:  { px:    0, py: -30, rx: 2, ry:  -4, sc: 0.90 } as Pose,
  lean:  { px: -120, py:  20, rx: 9, ry:  -9, sc: 1.04 } as Pose,
};

const BEATS: Beat[] = [
  { start: O.intro,  end: O.imDoc,  headline: "meet asmi",                wordmark: true, accent: TERRACOTTA, pose: POSES.hero,  energy: 0.6 },
  { start: O.imDoc,  end: O.imHvac, headline: "book appointments.",       accent: TERRACOTTA, pose: POSES.left,  energy: 0.95 },
  { start: O.imHvac, end: O.imGp,   headline: "find vendors.",            accent: SAGE,       pose: POSES.right, energy: 0.95 },
  { start: O.imGp,   end: O.done,   headline: "check in on\nloved ones.", accent: CLAY,       pose: POSES.back,  energy: 0.5 },
  { start: O.done,   end: O.outro,  headline: "remembers\neverything.",   accent: SKY,        pose: POSES.lean,  energy: 0.7 },
  { start: O.outro,  end: TOTAL,    headline: "",                         accent: TERRACOTTA, pose: POSES.hero,  energy: 0.4, outro: true },
];

const findBeatIdx = (f: number) => {
  for (let i = 0; i < BEATS.length; i++) if (f >= BEATS[i].start && f < BEATS[i].end) return i;
  return BEATS.length - 1;
};

const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}, ${a})`;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  px: lerp(a.px,b.px,t), py: lerp(a.py,b.py,t),
  rx: lerp(a.rx,b.rx,t), ry: lerp(a.ry,b.ry,t), sc: lerp(a.sc,b.sc,t),
});
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
  const pose = lerpPose(prev.pose, beat.pose, blend);
  const accent = beat.accent;
  const accentPrev = prev.accent;

  const phoneIn = spring({ frame, fps, config: { damping: 16, stiffness: 80, mass: 1.1 } });
  const entryY = interpolate(phoneIn, [0, 1], [260, 0]);
  const entryRotX = interpolate(phoneIn, [0, 1], [30, 0]);
  const entryRotY = interpolate(phoneIn, [0, 1], [-22, 0]);
  const entryScale = interpolate(phoneIn, [0, 1], [0.6, 1]);
  const entryOp = interpolate(phoneIn, [0, 1], [0, 1]);

  const bob = Math.sin(frame / 50) * 6;
  const drift = Math.cos(frame / 90) * 4;

  const PHONE_FIT_HEIGHT = 1010;
  const phoneScale = PHONE_FIT_HEIGHT / 1920;

  const isOutro = !!beat.outro;
  const dissolveT = isOutro
    ? interpolate(localFrame, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const dissolveScale = 1 + dissolveT * 0.18;
  const dissolveBlur = dissolveT * 18;
  const dissolveOp = 1 - dissolveT;

  const totalScale = entryScale * pose.sc * dissolveScale;
  const totalRotX = entryRotX + pose.rx;
  const totalRotY = entryRotY + pose.ry;
  const totalX = pose.px + drift;
  const totalY = pose.py + entryY + bob;

  const lightX = 50 + (pose.px / 1920) * 100;
  const stageDarken = isOutro
    ? interpolate(localFrame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ fontFamily: sans, background: LINEN, overflow: "hidden" }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(70% 60% at 50% 30%, ${MORNING} 0%, ${LINEN} 55%, ${SAND} 100%)` }}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 42% at ${lightX}% 38%, rgba(255,247,232,0.9), transparent 70%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
          opacity: 1 - stageDarken * 0.7,
        }}
      />

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
            background: `radial-gradient(60% 60% at 50% 50%, ${rgba(TERRACOTTA, 0.18)}, ${rgba(ESPRESSO, 0.92)} 70%)`,
            opacity: stageDarken,
            pointerEvents: "none",
          }}
        />
      )}

      <DustMotes energy={beat.energy} darken={stageDarken} />

      {!isOutro && (
        <KineticHeadline
          key={`hl-${idx}`}
          headline={beat.headline}
          wordmark={!!beat.wordmark}
          accent={accent}
          localFrame={localFrame}
          beatLen={beat.end - beat.start}
        />
      )}

      {(!isOutro || dissolveOp > 0.02) && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 1080 * phoneScale,
            height: 1920 * phoneScale,
            marginLeft: -(1080 * phoneScale) / 2,
            marginTop: -(1920 * phoneScale) / 2,
            transform: `translate(${totalX}px, ${totalY}px)`,
            opacity: entryOp * dissolveOp,
            perspective: 2600,
            perspectiveOrigin: "50% 50%",
            zIndex: 5,
            filter: isOutro ? `blur(${dissolveBlur}px)` : undefined,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: -50 - bob * 0.4,
              width: `${82 + bob * 0.3}%`,
              height: 96,
              transform: "translateX(-50%)",
              background: `radial-gradient(ellipse at center, ${rgba(ESPRESSO, 0.5)} 0%, ${rgba(accent, 0.22)} 35%, transparent 70%)`,
              filter: "blur(32px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${totalScale}) rotateY(${totalRotY}deg) rotateX(${totalRotX}deg)`,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 50%",
              filter: `drop-shadow(0 60px 80px ${rgba(ESPRESSO, 0.38)}) drop-shadow(0 0 40px ${rgba(accent, 0.25)})`,
            }}
          >
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

            <div
              style={{
                position: "absolute",
                inset: "110px 90px 110px 90px",
                borderRadius: 130,
                boxShadow: `inset 0 0 0 2px ${rgba(accent, 0.35)}, inset 0 0 80px ${rgba(accent, 0.18)}`,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      )}

      {isOutro && dissolveT > 0.05 && dissolveT < 0.95 && (
        <ParticleBurst accent={accent} t={dissolveT} />
      )}

      {isOutro && <OutroHero localFrame={localFrame} accent={TERRACOTTA} />}

      <AbsoluteFill
        style={{
          background: "radial-gradient(80% 80% at 50% 50%, transparent 55%, rgba(44,37,32,0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      {!isOutro && (
        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: STONE,
            fontSize: 15,
            letterSpacing: 5,
            textTransform: "uppercase",
            fontWeight: 500,
            zIndex: 6,
          }}
        >
          <span style={{ color: accent }}>●</span>
          <span>asmi · personal AI</span>
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
    </AbsoluteFill>
  );
};

const KineticHeadline: React.FC<{
  headline: string; wordmark: boolean; accent: string;
  localFrame: number; beatLen: number;
}> = ({ headline, wordmark, accent, localFrame, beatLen }) => {
  const { fps } = useVideoConfig();
  const lines = headline.split("\n");
  const outOp = interpolate(localFrame, [Math.max(0, beatLen - 18), beatLen], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  if (wordmark) {
    const sp = spring({ frame: localFrame, fps, config: { damping: 22, stiffness: 110 } });
    const op = interpolate(sp, [0, 1], [0, 1]) * outOp;
    const y = interpolate(sp, [0, 1], [50, 0]);
    return (
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2, opacity: op, transform: `translateY(${y}px)`,
        }}
      >
        <div
          style={{
            fontFamily: serif, fontStyle: "italic",
            fontSize: 460, lineHeight: 0.9, color: ESPRESSO,
            letterSpacing: -14, display: "flex", alignItems: "flex-end",
          }}
        >
          <span>asmi</span>
          <span
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: accent, marginLeft: 18, marginBottom: 60,
              display: "inline-block",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2, pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: serif, fontStyle: "italic",
          fontSize: 230, lineHeight: 0.92, color: ESPRESSO,
          letterSpacing: -8, textAlign: "center", opacity: outOp,
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
              const y = interpolate(sp, [0, 1], [60, 0]);
              const s = interpolate(sp, [0, 1], [0.92, 1]);
              const op = interpolate(sp, [0, 1], [0, 1]);
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    transform: `translateY(${y}px) scale(${s})`,
                    opacity: op, marginRight: 28,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
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
        background: `linear-gradient(110deg, transparent ${x - 30}%, ${rgba(accent, 0.35)} ${x}%, transparent ${x + 30}%)`,
        opacity: op, mixBlendMode: "soft-light",
      }}
    />
  );
};

const OutroHero: React.FC<{ localFrame: number; accent: string }> = ({ localFrame, accent }) => {
  const { fps } = useVideoConfig();
  const lines: { text: string; highlight?: boolean }[][] = [
    [{ text: "AI that handles" }],
    [{ text: "your " }, { text: "personal chores", highlight: true }],
    [{ text: "in the " }, { text: "real world", highlight: true }, { text: "." }],
  ];
  const startAt = 22;

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 7, gap: 6,
      }}
    >
      <div
        style={{
          fontFamily: serif, fontStyle: "italic",
          fontSize: 108, lineHeight: 1.04,
          color: "#F7EFE6", letterSpacing: -3,
          textAlign: "center", maxWidth: 1500,
        }}
      >
        {lines.map((segs, li) => {
          const delay = startAt + li * 8;
          const sp = spring({
            frame: localFrame - delay, fps,
            config: { damping: 18, stiffness: 95 },
          });
          const y = interpolate(sp, [0, 1], [50, 0]);
          const op = interpolate(sp, [0, 1], [0, 1]);
          const underlineW = interpolate(
            localFrame - delay - 8, [0, 14], [0, 100],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={li}
              style={{
                transform: `translateY(${y}px)`,
                opacity: op, position: "relative",
                display: "inline-block",
              }}
            >
              {segs.map((seg, si) => (
                <span key={si} style={{ color: seg.highlight ? accent : "#F7EFE6" }}>
                  {seg.text}
                </span>
              ))}
              {li === 2 && (
                <div
                  style={{
                    height: 3, background: accent,
                    width: `${underlineW}%`,
                    margin: "8px auto 0", borderRadius: 2, opacity: 0.7,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 56,
          opacity: interpolate(localFrame, [60, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        }}
      >
        <div
          style={{
            fontFamily: serif, fontStyle: "italic",
            fontSize: 96, color: "#F7EFE6", letterSpacing: -3,
            display: "flex", alignItems: "flex-end", lineHeight: 0.9,
          }}
        >
          <span>asmi</span>
          <span
            style={{
              width: 12, height: 12, borderRadius: "50%",
              background: accent, marginLeft: 6, marginBottom: 14,
            }}
          />
        </div>
        <div
          style={{
            color: "#D9CFC2", fontSize: 14,
            letterSpacing: 6, textTransform: "uppercase", fontWeight: 500,
          }}
        >
          launches soon
        </div>
      </div>
    </div>
  );
};

const ParticleBurst: React.FC<{ accent: string; t: number }> = ({ accent, t }) => {
  const N = 44;
  const particles = Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2 + (i % 3) * 0.4;
    const dist = 200 + (i % 7) * 60 + t * 220;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist * 1.1;
    const size = 4 + (i % 5);
    const op = interpolate(t, [0, 0.5, 1], [0.9, 0.7, 0]);
    return (
      <div
        key={i}
        style={{
          position: "absolute", left: "50%", top: "50%",
          width: size, height: size, borderRadius: "50%",
          background: i % 3 === 0 ? accent : "rgba(255,240,215,1)",
          opacity: op,
          transform: `translate(${x}px, ${y}px)`,
          filter: "blur(1px)",
          boxShadow: `0 0 12px ${rgba(accent, 0.6)}`,
        }}
      />
    );
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 6, mixBlendMode: "screen" }}>
      {particles}
    </AbsoluteFill>
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
