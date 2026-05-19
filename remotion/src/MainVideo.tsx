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

const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const CREAM = "#F5EFE6";
const ESPRESSO = "#2C2520";
const STONE = "#7A6F64";
const TERRACOTTA = "#C25B3F";
const CLAY = "#D4A574";
const SAGE = "#5F8365";
const IMSG_BLUE = "#1FA1FF";
const IMSG_GRAY = "#E6E2DA";

// Frames @ 30fps — sums to 1500 (50s)
const D = {
  intro: 90,    // 3s
  imDoc: 120,   // 4s
  doc: 240,     // 8s
  imHvac: 120,  // 4s
  hvac: 240,    // 8s
  imGp: 120,    // 4s
  gp: 240,      // 8s
  done: 240,    // 8s
  outro: 90,    // 3s
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

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: sans }}>
      <DriftingBloom />
      <Grain />

      <Sequence from={O.intro} durationInFrames={D.intro}><Intro /></Sequence>

      <Sequence from={O.imDoc} durationInFrames={D.imDoc}>
        <SceneIMessage
          contactName="Sarah"
          time="9:03 AM"
          incoming="Hey, can you book Jonathan a checkup with Dr. Weng's office?"
          reply="On it — calling them now."
        />
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
        <SceneIMessage
          contactName="Marco"
          time="11:18 AM"
          incoming="AC is dead. Need a tech ASAP."
          reply="Getting quotes from 5 HVAC companies."
        />
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
        <SceneIMessage
          contactName="Sarah"
          time="6:42 PM"
          incoming="Can you check on grandpa in Sevilla? In Spanish."
          reply="Calling abuelo now."
        />
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

      {/* Call voice tracks — louder while on screen */}
      <Sequence from={O.doc} durationInFrames={D.doc}>
        <Audio src={staticFile("audio/trimmed/doc.mp3")} volume={1} />
      </Sequence>
      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <Audio src={staticFile("audio/trimmed/hvac.mp3")} volume={1} />
      </Sequence>
      <Sequence from={O.gp} durationInFrames={D.gp}>
        <Audio src={staticFile("audio/trimmed/grandpa.mp3")} volume={1} />
      </Sequence>

      {/* Background music — ducks under call scenes */}
      <Audio src={staticFile("audio/bgm.mp3")} volume={(f) => bgmVolume(f)} />
    </AbsoluteFill>
  );
};

// ============= Persistent =============

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
          background: `radial-gradient(60% 40% at ${50 + x / 8}% ${30 + y / 8}%, rgba(194,91,63,0.16), transparent 70%),
                       radial-gradient(55% 38% at ${30 + x / 6}% ${75 + y / 6}%, rgba(212,165,116,0.14), transparent 70%),
                       radial-gradient(50% 35% at ${75 - x / 6}% ${60 - y / 6}%, rgba(95,131,101,0.10), transparent 70%)`,
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

// ============= Intro =============

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 220,
          color: ESPRESSO,
          transform: `scale(${0.94 + s * 0.06})`,
        }}
      >
        asmi
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 30,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: STONE,
          fontWeight: 500,
        }}
      >
        handles the real world
      </div>
    </AbsoluteFill>
  );
};

// ============= iMessage scene =============

const SceneIMessage: React.FC<{
  contactName: string;
  time: string;
  incoming: string;
  reply: string;
}> = ({ contactName, time, incoming, reply }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const replyDelay = 55;

  const inEnter = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 180 } });
  const inOpacity = interpolate(inEnter, [0, 1], [0, 1]);
  const inY = interpolate(inEnter, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ padding: "120px 60px", justifyContent: "flex-start" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: ESPRESSO,
          fontWeight: 600,
          fontSize: 36,
          marginBottom: 24,
          opacity: 0.85,
        }}
      >
        <span>{time}</span>
        <span style={{ letterSpacing: 4 }}>●●●●●</span>
      </div>

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
        <div style={{ fontSize: 38, color: ESPRESSO, fontWeight: 500 }}>
          {contactName} ↔ Asmi
        </div>
        <div style={{ fontSize: 24, color: STONE, marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>
          iMessage
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: "78%",
            padding: "26px 34px",
            borderRadius: 38,
            background: IMSG_GRAY,
            color: ESPRESSO,
            fontSize: 36,
            lineHeight: 1.32,
            opacity: inOpacity,
            transform: `translateY(${inY}px)`,
            boxShadow: "0 8px 24px -12px rgba(44,37,32,0.18)",
          }}
        >
          {incoming}
        </div>

        {frame > 28 && frame < replyDelay && <TypingDots />}

        {frame >= replyDelay && (() => {
          const e = spring({ frame: frame - replyDelay, fps, config: { damping: 14, stiffness: 180 } });
          const op = interpolate(e, [0, 1], [0, 1]);
          const y = interpolate(e, [0, 1], [24, 0]);
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
                opacity: op,
                transform: `translateY(${y}px)`,
                boxShadow: "0 8px 24px -12px rgba(44,37,32,0.18)",
              }}
            >
              {reply}
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        alignSelf: "flex-end",
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

  // pick current caption (whichever has the latest `at` <= frame)
  const active = captions.reduce<Caption | null>(
    (acc, c) => (frame >= c.at ? c : acc),
    null,
  );
  const captionEnter = active
    ? spring({ frame: frame - active.at, fps, config: { damping: 16, stiffness: 180 } })
    : 0;

  // call timer
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

        {/* live caption */}
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
      {chip("Pacific HVAC · Marco", "Saturday · 9:00 AM · $150", SAGE, 30)}
      {chip("Abuelo · Sevilla", "took medicine · feeling OK", CLAY, 54)}
    </AbsoluteFill>
  );
};

// ============= Outro =============

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, 70, 90], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 180, color: ESPRESSO }}>
        asmi
      </div>
      <div style={{ marginTop: 24, fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: STONE }}>
        you text. asmi handles it.
      </div>
    </AbsoluteFill>
  );
};
