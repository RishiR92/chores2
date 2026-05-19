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
import { loadFont as loadInter } from "@remotion/google-fonts/InterTight";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont } from "@remotion/fonts";

const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

// Color emoji font so 🙏 🥵 etc render in the chat
loadFont({
  family: "Noto Color Emoji",
  url: staticFile("fonts/NotoColorEmoji.ttf"),
  format: "truetype",
}).catch(() => {});

const EMOJI_STACK = `${sans}, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

// ============= 2026 PALETTE =============
const BG       = "#0B0B0F";   // near-black, warm-tinted
const SURFACE  = "#15151C";   // card / panel
const SURFACE2 = "#1E1E27";   // raised
const INK      = "#F5F2EA";   // warm off-white text
const INK_DIM  = "#7A7A85";   // muted
const INK_FAINT = "#3A3A44";  // hairline
const LIME     = "#E8FF5A";   // primary accent — used sparingly
const ORANGE   = "#FF5A3C";   // urgency accent
const PERI     = "#A8B5FF";   // periwinkle atmosphere

// Accent per call
const ACC_DOC  = PERI;
const ACC_HVAC = ORANGE;
const ACC_GP   = LIME;

// ============= Timing =============
// Frames @ 30fps — sums to 1500 (50s). Same scene durations as v7.
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

const TOTAL = 1500;
const callRanges: Array<[number, number]> = [
  [O.doc, O.doc + D.doc],
  [O.hvac, O.hvac + D.hvac],
  [O.gp, O.gp + D.gp],
];
const bgmVolume = (f: number) => {
  const fadeIn = Math.min(1, f / 45);
  // Short fade-out at the very end so the music lands on its climax
  const fadeOut = Math.min(1, (TOTAL - f) / 18);
  const RAMP = 22;
  let duckAmt = 0;
  for (const [a, b] of callRanges) {
    const into = Math.max(0, Math.min(1, (f - a) / RAMP));
    const outOf = Math.max(0, Math.min(1, (b - f) / RAMP));
    duckAmt = Math.max(duckAmt, Math.min(into, outOf));
  }
  const eased = duckAmt * duckAmt * (3 - 2 * duckAmt);
  // Louder base, deep duck under calls so voice is crystal clear
  const base = 0.7 * (1 - eased) + 0.04 * eased;
  return Math.max(0, base * fadeIn * fadeOut);
};

const POP = "audio/sfx/wa-pop.mp3";
// Reply delay used inside chat scenes
const THREAD_REPLY_DELAY = 62;
const typingReplyFrame = (len: number) => 8 + Math.ceil(len * 1.6) + 6 + 32;
const HVAC_TYPED = "AC's dead. need a tech ASAP 🥵";
const GP_TYPED = "can u check on abuelo in sevilla? in spanish 🙏";

// ============= Root =============

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: sans, color: INK }}>
      <Atmosphere />
      <Grain />

      <Sequence from={O.intro} durationInFrames={D.intro}><Intro /></Sequence>

      <Sequence from={O.imDoc} durationInFrames={D.imDoc}>
        <SceneWhatsAppThread
          contactName="Asmi"
          time="9:03"
          subtitle="online"
          history={[
            { from: "in",  text: "morning ☀️ all good?", t: "Yesterday" },
            { from: "out", text: "yes, dentist done. thanks for booking!", t: "Yesterday" },
            { from: "in",  text: "anytime. let me know what's next.", t: "Yesterday" },
          ]}
          today={[
            { from: "out", text: "hey — can u book Jonathan a checkup w/ Dr. Weng?", t: "9:02" },
          ]}
          reply="on it — calling them now."
          replyTime="9:03"
        />
      </Sequence>

      <Sequence from={O.doc} durationInFrames={D.doc}>
        <SceneCall
          tag="Call · 01"
          label="Asmi → Dr. Weng's office"
          name="Dr. Weng — Front Desk"
          accent={ACC_DOC}
          captions={[
            { at: 0,   text: "Hi, I'm calling on behalf of Sarah Kim." },
            { at: 60,  text: "I'd like to book a checkup for her son, Jonathan." },
            { at: 130, text: "Insurance is Blue Cross — ID on file." },
            { at: 195, text: "Tuesday at 10am works. Confirmed." },
          ]}
        />
      </Sequence>

      <Sequence from={O.imHvac} durationInFrames={D.imHvac}>
        <SceneWhatsAppTyping
          contactName="Asmi"
          time="11:18"
          subtitle="online"
          history={[
            { from: "out", text: "appt confirmed for tues, ty 🙌", t: "9:04" },
            { from: "in",  text: "all set. invoice synced to email.", t: "9:04" },
          ]}
          typedMessage={HVAC_TYPED}
          reply="getting quotes from 5 HVAC techs."
          replyTime="11:19"
        />
      </Sequence>

      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <SceneCall
          tag="Call · 02"
          label="Asmi → Pacific HVAC"
          name="Pacific HVAC"
          accent={ACC_HVAC}
          captions={[
            { at: 0,   text: "Hi, calling for Marco — AC stopped working." },
            { at: 60,  text: "Two-story home in Oakland, central system." },
            { at: 130, text: "What's your earliest diagnostic visit?" },
            { at: 195, text: "Saturday 9am, $150 diagnostic — booked." },
          ]}
        />
      </Sequence>

      <Sequence from={O.imGp} durationInFrames={D.imGp}>
        <SceneWhatsAppTyping
          contactName="Asmi"
          time="18:42"
          subtitle="online"
          history={[
            { from: "in",  text: "HVAC booked sat 9am ✅", t: "11:21" },
            { from: "out", text: "perfect 🙏", t: "11:22" },
          ]}
          typedMessage={GP_TYPED}
          reply="calling abuelo now."
          replyTime="18:42"
        />
      </Sequence>

      <Sequence from={O.gp} durationInFrames={D.gp}>
        <SceneCall
          tag="Call · 03"
          label="Asmi → Abuelo · Sevilla"
          name="Abuelo"
          accent={ACC_GP}
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

      {/* Call voice tracks — boosted while on screen (normalized to -14 LUFS) */}
      <Sequence from={O.doc} durationInFrames={D.doc}>
        <Audio src={staticFile("audio/trimmed/doc.mp3")} volume={2.4} />
      </Sequence>
      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <Audio src={staticFile("audio/trimmed/hvac.mp3")} volume={2.4} />
      </Sequence>
      <Sequence from={O.gp} durationInFrames={D.gp}>
        <Audio src={staticFile("audio/trimmed/grandpa.mp3")} volume={2.4} />
      </Sequence>

      {/* WhatsApp pop on each Asmi reply bubble */}
      <Sequence from={O.imDoc + THREAD_REPLY_DELAY} durationInFrames={12}>
        <Audio src={staticFile(POP)} volume={0.6} />
      </Sequence>
      <Sequence from={O.imHvac + typingReplyFrame(HVAC_TYPED.length)} durationInFrames={12}>
        <Audio src={staticFile(POP)} volume={0.6} />
      </Sequence>
      <Sequence from={O.imGp + typingReplyFrame(GP_TYPED.length)} durationInFrames={12}>
        <Audio src={staticFile(POP)} volume={0.6} />
      </Sequence>

      {/* Background music */}
      <Audio src={staticFile("audio/bgm.mp3")} volume={(f) => bgmVolume(f)} />
    </AbsoluteFill>
  );
};

// ============= Persistent atmosphere =============

const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 240) * 60;
  const y = Math.cos(frame / 260) * 50;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(55% 38% at ${28 + x / 6}% ${22 + y / 6}%, rgba(168,181,255,0.10), transparent 70%),
                       radial-gradient(50% 35% at ${78 - x / 8}% ${78 - y / 8}%, rgba(255,90,60,0.08), transparent 70%),
                       radial-gradient(45% 32% at ${60 + x / 10}% ${50 + y / 10}%, rgba(232,255,90,0.05), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity: 0.08,
      mixBlendMode: "overlay",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
    }}
  />
);

// Small reusable: micro-label above titles
const MicroLabel: React.FC<{ children: React.ReactNode; color?: string; opacity?: number }> = ({
  children,
  color = INK_DIM,
  opacity = 1,
}) => (
  <div
    style={{
      fontFamily: mono,
      fontSize: 22,
      letterSpacing: 4,
      textTransform: "uppercase",
      color,
      opacity,
    }}
  >
    {children}
  </div>
);

// ============= Intro =============

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 130 } });
  const opacity = interpolate(frame, [0, 14, 75, 90], [0, 1, 1, 0]);
  const blur = interpolate(s, [0, 1], [14, 0]);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 80px",
        opacity,
      }}
    >
      <div style={{ filter: `blur(${blur}px)`, transform: `translateY(${(1 - s) * 18}px)` }}>
        <MicroLabel color={LIME}>·  asmi  /  ver 2026</MicroLabel>
        <div
          style={{
            fontFamily: serif,
            fontSize: 230,
            color: INK,
            lineHeight: 0.95,
            marginTop: 28,
            letterSpacing: -4,
          }}
        >
          you text.
          <br />
          <span style={{ fontStyle: "italic", color: LIME }}>asmi calls.</span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 34,
            color: INK_DIM,
            maxWidth: 720,
            lineHeight: 1.3,
            fontWeight: 400,
          }}
        >
          a personal AI that handles the real world — one phone call at a time.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============= WhatsApp UI =============

type Msg = { from: "in" | "out"; text: string; t?: string };

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 0 }}>
    {/* Outer device shell */}
    <div
      style={{
        width: 760,
        height: 1500,
        borderRadius: 96,
        background: "#000",
        padding: 14,
        boxShadow:
          "0 60px 160px -40px rgba(0,0,0,0.85), 0 0 0 1.5px #2a2a32, inset 0 0 0 1.5px #1a1a20",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 84,
          background: "#0B141A", // WhatsApp dark chat bg base
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  </AbsoluteFill>
);

const StatusBar: React.FC<{ time: string }> = ({ time }) => (
  <>
    {/* Dynamic Island */}
    <div
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: 340,
        height: 42,
        borderRadius: 24,
        background: "#000",
        zIndex: 10,
      }}
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "36px 64px 12px",
        color: "#fff",
        fontSize: 28,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -0.5,
        zIndex: 5,
      }}
    >
      <span style={{ marginLeft: 4 }}>{time}</span>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <svg width="32" height="20" viewBox="0 0 34 22"><g fill="#fff">
          <rect x="0" y="14" width="6" height="8" rx="1.5" />
          <rect x="9" y="10" width="6" height="12" rx="1.5" />
          <rect x="18" y="5" width="6" height="17" rx="1.5" />
          <rect x="27" y="0" width="6" height="22" rx="1.5" />
        </g></svg>
        <svg width="30" height="20" viewBox="0 0 32 22" fill="#fff">
          <path d="M16 4 C7 4 1 10 1 10 L4 14 C4 14 9 9 16 9 C23 9 28 14 28 14 L31 10 C31 10 25 4 16 4 Z" />
          <path d="M16 12 C11 12 7 16 7 16 L10 19 C10 19 13 17 16 17 C19 17 22 19 22 19 L25 16 C25 16 21 12 16 12 Z" />
          <circle cx="16" cy="20" r="2" />
        </svg>
        <svg width="46" height="20" viewBox="0 0 50 22">
          <rect x="1" y="2" width="42" height="18" rx="5" ry="5" fill="none" stroke="#fff" strokeWidth="2" />
          <rect x="45" y="8" width="4" height="6" rx="1.5" fill="#fff" />
          <rect x="4" y="5" width="36" height="12" rx="2" fill="#5CFFA8" />
        </svg>
      </div>
    </div>
  </>
);

const WAHeader: React.FC<{ name: string; subtitle: string }> = ({ name, subtitle }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "6px 22px 16px",
      background: "#1F2C34",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      gap: 18,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </div>
    <div
      style={{
        width: 78,
        height: 78,
        borderRadius: 999,
        background: `linear-gradient(140deg, ${LIME}, ${PERI})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: BG,
        fontSize: 38,
        fontWeight: 700,
        fontFamily: serif,
        fontStyle: "italic",
      }}
    >
      a
    </div>
    <div style={{ flex: 1, lineHeight: 1.15 }}>
      <div style={{ color: "#fff", fontSize: 30, fontWeight: 600, letterSpacing: -0.3 }}>{name}</div>
      <div style={{ color: "#8A9BA4", fontSize: 22, marginTop: 2 }}>{subtitle}</div>
    </div>
    <div style={{ display: "flex", gap: 26, color: "#fff", alignItems: "center" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, lineHeight: 0.5 }}>⋮</div>
    </div>
  </div>
);

// WhatsApp doodle/pattern background tile (subtle)
const ChatBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      flex: 1,
      background:
        `#0B141A url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><g fill='none' stroke='%23ffffff' stroke-opacity='0.025' stroke-width='1.2'><circle cx='30' cy='30' r='6'/><path d='M70 50 q10 -12 22 0'/><path d='M100 100 l8 8 l-8 8 l-8 -8 z'/><circle cx='130' cy='40' r='3'/><path d='M20 110 q14 8 28 0'/><circle cx='60' cy='130' r='4'/></g></svg>")`,
      display: "flex",
      flexDirection: "column",
      padding: "20px 18px 10px",
      gap: 6,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

// Time-divider chip (e.g. "Today", "Yesterday")
const DayDivider: React.FC<{ label: string; opacity?: number }> = ({ label, opacity = 1 }) => (
  <div style={{ display: "flex", justifyContent: "center", margin: "6px 0", opacity }}>
    <div
      style={{
        background: "#182229",
        color: "#8A9BA4",
        fontSize: 20,
        padding: "8px 18px",
        borderRadius: 14,
        letterSpacing: 0.3,
        fontWeight: 500,
      }}
    >
      {label}
    </div>
  </div>
);

const Tick: React.FC<{ read?: boolean }> = ({ read }) => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
    <path d="M1 7 L5 11 L12 3" stroke={read ? "#53BDEB" : "#8A9BA4"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7 L12 11 L19 3" stroke={read ? "#53BDEB" : "#8A9BA4"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WABubble: React.FC<{
  msg: Msg;
  opacity?: number;
  transform?: string;
  read?: boolean;
}> = ({ msg, opacity = 1, transform = "none", read = true }) => {
  const isOut = msg.from === "out";
  return (
    <div style={{ display: "flex", justifyContent: isOut ? "flex-end" : "flex-start", opacity, transform }}>
      <div
        style={{
          maxWidth: "78%",
          padding: "12px 16px 10px",
          borderRadius: 18,
          ...(isOut ? { borderTopRightRadius: 4 } : { borderTopLeftRadius: 4 }),
          background: isOut ? "#005C4B" : "#1F2C34",
          color: "#E9EDEF",
          fontSize: 28,
          lineHeight: 1.28,
          letterSpacing: -0.2,
          fontFamily: EMOJI_STACK,
          boxShadow: "0 1px 0 rgba(0,0,0,0.18)",
          position: "relative",
          display: "inline-flex",
          flexDirection: "column",
        }}
      >
        <div style={{ paddingRight: isOut ? 86 : 56 }}>{msg.text}</div>
        <div
          style={{
            position: "absolute",
            right: 14,
            bottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#8A9BA4",
            fontSize: 18,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>{msg.t ?? ""}</span>
          {isOut && <Tick read={read} />}
        </div>
      </div>
    </div>
  );
};

const WATypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: "#1F2C34",
          borderRadius: 18,
          borderTopLeftRadius: 4,
          padding: "16px 22px",
          display: "flex",
          gap: 8,
        }}
      >
        {[0, 1, 2].map((i) => {
          const o = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 5 - i * 0.8));
          return (
            <span key={i} style={{ width: 12, height: 12, borderRadius: 999, background: "#8A9BA4", opacity: o }} />
          );
        })}
      </div>
    </div>
  );
};

const WAComposerIdle: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px 18px",
      background: "#0B141A",
    }}
  >
    <div
      style={{
        flex: 1,
        minHeight: 56,
        background: "#1F2C34",
        borderRadius: 28,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        color: "#8A9BA4",
        fontSize: 24,
        gap: 14,
      }}
    >
      <span style={{ fontSize: 24 }}>😊</span>
      <span style={{ flex: 1 }}>Message</span>
      <span style={{ fontSize: 22 }}>📎</span>
      <span style={{ fontSize: 22 }}>📷</span>
    </div>
    <div
      style={{
        width: 60, height: 60, borderRadius: 999,
        background: "#00A884",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 30,
      }}
    >
      🎙
    </div>
  </div>
);

const WAComposerTyping: React.FC<{ text: string; sent: boolean }> = ({ text, sent }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 2 === 0;
  const hasText = text.length > 0 && !sent;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
        padding: "12px 14px 18px",
        background: "#0B141A",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 56,
          background: "#1F2C34",
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          padding: "14px 18px",
          color: "#E9EDEF",
          fontSize: 26,
          lineHeight: 1.25,
          gap: 14,
          fontFamily: EMOJI_STACK,
        }}
      >
        <span style={{ fontSize: 24, opacity: 0.8 }}>😊</span>
        <div style={{ flex: 1, wordBreak: "break-word" }}>
          {sent || text.length === 0 ? (
            <span style={{ color: "#8A9BA4" }}>Message</span>
          ) : (
            <>
              {text}
              <span style={{ opacity: blink ? 1 : 0, color: "#00A884", marginLeft: 2 }}>|</span>
            </>
          )}
        </div>
        {!hasText && <span style={{ fontSize: 22 }}>📎</span>}
        {!hasText && <span style={{ fontSize: 22 }}>📷</span>}
      </div>
      <div
        style={{
          width: 60, height: 60, borderRadius: 999,
          background: "#00A884",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 30, fontWeight: 700,
          boxShadow: hasText ? "0 6px 18px -6px rgba(0,168,132,0.6)" : "none",
        }}
      >
        {hasText ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        ) : (
          "🎙"
        )}
      </div>
    </div>
  );
};

// Floating overlay above and below the centered phone.
const ChatOverlay: React.FC<{ tag: string; title: string; sub: string }> = ({ tag, title, sub }) => (
  <>
    <div style={{ position: "absolute", top: 56, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
      <MicroLabel color={LIME}>· {tag}</MicroLabel>
      <div style={{ fontFamily: mono, fontSize: 22, color: INK_DIM, letterSpacing: 2 }}>SCREEN · REC</div>
    </div>
    <div style={{ position: "absolute", bottom: 60, left: 60, right: 60, zIndex: 5, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 30 }}>
      <div style={{ fontFamily: serif, fontSize: 68, color: INK, lineHeight: 0.95, letterSpacing: -1.5, maxWidth: 540 }}>{title}</div>
      <div style={{ fontSize: 22, color: INK_DIM, maxWidth: 380, textAlign: "right", lineHeight: 1.4 }}>{sub}</div>
    </div>
  </>
);

// Variant 1: pre-existing thread with older messages + new ask, then Asmi replies.
const SceneWhatsAppThread: React.FC<{
  contactName: string;
  time: string;
  subtitle: string;
  history: Msg[];
  today: Msg[];
  reply: string;
  replyTime: string;
}> = ({ contactName, time, subtitle, history, today, reply, replyTime }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 130 } });
  const phoneOp = interpolate(enter, [0, 1], [0, 1]);
  const phoneY = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill>
      <ChatOverlay
        tag="01 · whatsapp"
        title={"the ask."}
        sub="message asmi like a friend. it picks up the thread and starts working."
      />
      <div style={{ opacity: phoneOp, transform: `translateY(${phoneY}px)` }}>
        <PhoneFrame>
          <StatusBar time={time} />
          <WAHeader name={contactName} subtitle={subtitle} />
          <ChatBackground>
            <DayDivider label="Yesterday" opacity={0.6} />
            {history.map((m, i) => (
              <WABubble key={i} msg={m} opacity={0.5} />
            ))}
            <DayDivider label="Today" />
            {today.map((m, i) => {
              const e = spring({ frame: frame - 10 - i * 6, fps, config: { damping: 18, stiffness: 200 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [16, 0]);
              return <WABubble key={i} msg={m} opacity={op} transform={`translateY(${y}px)`} />;
            })}

            {frame > 32 && frame < THREAD_REPLY_DELAY && <WATypingDots />}

            {frame >= THREAD_REPLY_DELAY && (() => {
              const e = spring({ frame: frame - THREAD_REPLY_DELAY, fps, config: { damping: 16, stiffness: 180 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [22, 0]);
              const sc = interpolate(e, [0, 1], [0.92, 1]);
              return (
                <WABubble
                  msg={{ from: "in", text: reply, t: replyTime }}
                  opacity={op}
                  transform={`translateY(${y}px) scale(${sc})`}
                />
              );
            })()}
            <div style={{ flex: 1 }} />
          </ChatBackground>
          <WAComposerIdle />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

// Variant 2+3: user types their new request, sends it, Asmi replies.
const SceneWhatsAppTyping: React.FC<{
  contactName: string;
  time: string;
  subtitle: string;
  history: Msg[];
  typedMessage: string;
  reply: string;
  replyTime: string;
}> = ({ contactName, time, subtitle, history, typedMessage, reply, replyTime }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 130 } });
  const phoneOp = interpolate(enter, [0, 1], [0, 1]);
  const phoneY = interpolate(enter, [0, 1], [40, 0]);

  const typeStart = 8;
  const typeSpeed = 1.6;
  const typeChars = Math.max(0, Math.min(typedMessage.length, Math.floor((frame - typeStart) / typeSpeed)));
  const sentFrame = typeStart + Math.ceil(typedMessage.length * typeSpeed) + 6;
  const isSent = frame >= sentFrame;
  const replyDelay = sentFrame + 32;

  return (
    <AbsoluteFill>
      <ChatOverlay
        tag="02 · whatsapp"
        title="just text it."
        sub="no app, no form, no menus. type it like you'd text anyone."
      />
      <div style={{ opacity: phoneOp, transform: `translateY(${phoneY}px)` }}>
        <PhoneFrame>
          <StatusBar time={time} />
          <WAHeader name={contactName} subtitle={subtitle} />
          <ChatBackground>
            <DayDivider label="Today" opacity={0.7} />
            {history.map((m, i) => (
              <WABubble key={i} msg={m} opacity={0.55} />
            ))}

            {isSent && (() => {
              const e = spring({ frame: frame - sentFrame, fps, config: { damping: 16, stiffness: 220 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [40, 0]);
              const sc = interpolate(e, [0, 1], [0.7, 1]);
              return (
                <WABubble
                  msg={{ from: "out", text: typedMessage, t: time }}
                  opacity={op}
                  transform={`translateY(${y}px) scale(${sc})`}
                />
              );
            })()}

            {frame > sentFrame + 10 && frame < replyDelay && <WATypingDots />}

            {frame >= replyDelay && (() => {
              const e = spring({ frame: frame - replyDelay, fps, config: { damping: 16, stiffness: 180 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [20, 0]);
              return (
                <WABubble
                  msg={{ from: "in", text: reply, t: replyTime }}
                  opacity={op}
                  transform={`translateY(${y}px)`}
                />
              );
            })()}

            <div style={{ flex: 1 }} />
          </ChatBackground>
          <WAComposerTyping text={typedMessage.slice(0, typeChars)} sent={isSent} />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

// ============= Call scene =============

type Caption = { at: number; text: string };

const SceneCall: React.FC<{
  tag: string;
  label: string;
  name: string;
  accent: string;
  captions: Caption[];
}> = ({ tag, label, name, accent, captions }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 130 } });
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const y = interpolate(intro, [0, 1], [30, 0]);

  const active = captions.reduce<Caption | null>(
    (acc, c) => (frame >= c.at ? c : acc),
    null,
  );
  const captionEnter = active
    ? spring({ frame: frame - active.at, fps, config: { damping: 18, stiffness: 200 } })
    : 0;

  const sec = Math.floor(frame / fps);
  const mm = Math.floor(sec / 60).toString().padStart(1, "0");
  const ss = (sec % 60).toString().padStart(2, "0");

  return (
    <AbsoluteFill style={{ padding: "80px 90px", opacity, transform: `translateY(${y}px)` }}>
      {/* Top row: micro-label + timer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <MicroLabel color={accent}>· {tag}</MicroLabel>
          <div
            style={{
              fontFamily: serif,
              fontSize: 110,
              color: INK,
              marginTop: 16,
              lineHeight: 0.95,
              letterSpacing: -2,
              maxWidth: 820,
            }}
          >
            {name.split(" — ")[0]}
            <span style={{ color: accent, fontStyle: "italic" }}>.</span>
          </div>
          <div style={{ marginTop: 18, fontSize: 26, color: INK_DIM, fontFamily: mono, letterSpacing: 1 }}>
            {label}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: mono,
            fontSize: 26,
            color: accent,
            background: SURFACE,
            border: `1px solid ${accent}33`,
            borderRadius: 999,
            padding: "10px 22px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: accent,
              boxShadow: `0 0 16px ${accent}`,
              opacity: 0.5 + 0.5 * Math.sin(frame / 6),
            }}
          />
          REC  {mm}:{ss}
        </div>
      </div>

      {/* Center: avatar + waveform */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          marginTop: 30,
          marginBottom: 30,
          gap: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ position: "relative", width: 240, height: 240, flexShrink: 0 }}>
            <Rings accent={accent} />
            <div
              style={{
                position: "absolute",
                inset: 20,
                borderRadius: 999,
                background: `linear-gradient(140deg, ${accent}, ${SURFACE2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: BG,
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 120,
                boxShadow: `0 30px 90px -20px ${accent}88, inset 0 0 0 2px rgba(255,255,255,0.08)`,
              }}
            >
              {name[0].toLowerCase()}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Waveform accent={accent} />
          </div>
        </div>

        {/* Live caption */}
        <div style={{ minHeight: 220 }}>
          {active && (
            <div
              style={{
                opacity: captionEnter,
                transform: `translateY(${(1 - captionEnter) * 14}px)`,
                background: SURFACE,
                border: `1px solid ${accent}33`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 24,
                padding: "32px 36px",
                fontSize: 42,
                color: INK,
                fontFamily: serif,
                fontStyle: "italic",
                lineHeight: 1.3,
                letterSpacing: -0.5,
              }}
            >
              "{active.text}"
            </div>
          )}
        </div>
      </div>

      {/* Bottom progress + control hints */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: "auto" }}>
        <div
          style={{
            flex: 1,
            height: 4,
            borderRadius: 4,
            background: INK_FAINT,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(frame / durationInFrames) * 100}%`,
              background: accent,
              boxShadow: `0 0 10px ${accent}`,
            }}
          />
        </div>
        <div style={{ fontFamily: mono, fontSize: 22, color: INK_DIM, letterSpacing: 2 }}>
          LIVE · ENCRYPTED
        </div>
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
        const size = 180 + t * 220;
        const opacity = (1 - t) * 0.5;
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
              border: `1.5px solid ${accent}`,
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
  const bars = 64;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, height: 180 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 14 + Math.abs(Math.sin(frame / 5 + i * 0.55)) * 110 + Math.abs(Math.sin(frame / 9 + i * 0.3)) * 30;
        return (
          <div
            key={i}
            style={{
              width: 6,
              height: h,
              background: accent,
              borderRadius: 6,
              opacity: 0.55 + 0.35 * Math.abs(Math.sin(frame / 12 + i * 0.2)),
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
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const y = interpolate(intro, [0, 1], [24, 0]);

  const row = (i: number, label: string, sub: string, accent: string, delay: number) => {
    const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 160 } });
    const op = interpolate(s, [0, 1], [0, 1]);
    const dy = interpolate(s, [0, 1], [28, 0]);
    return (
      <div
        key={i}
        style={{
          opacity: op,
          transform: `translateY(${dy}px)`,
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "30px 36px",
          background: SURFACE,
          border: `1px solid ${accent}33`,
          borderLeft: `4px solid ${accent}`,
          borderRadius: 24,
        }}
      >
        <div
          style={{
            width: 70, height: 70, borderRadius: 999,
            background: accent, color: BG,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 38, fontWeight: 700, flexShrink: 0,
          }}
        >
          ✓
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, color: INK, fontWeight: 500, letterSpacing: -0.4 }}>{label}</div>
          <div style={{ fontSize: 24, color: INK_DIM, marginTop: 6, fontFamily: mono, letterSpacing: 0.5 }}>{sub}</div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 22, color: accent, letterSpacing: 2 }}>DONE</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ padding: "100px 90px", opacity, transform: `translateY(${y}px)` }}>
      <MicroLabel color={LIME}>· wrapped</MicroLabel>
      <div
        style={{
          fontFamily: serif,
          fontSize: 200,
          color: INK,
          lineHeight: 0.9,
          letterSpacing: -4,
          marginTop: 18,
          marginBottom: 60,
        }}
      >
        three calls.
        <br />
        <span style={{ fontStyle: "italic", color: LIME }}>zero minutes.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {row(0, "Dr. Weng · Jonathan", "Tuesday · 10:00 AM", ACC_DOC, 8)}
        {row(1, "Pacific HVAC · Marco", "Saturday · 9:00 AM · $150", ACC_HVAC, 34)}
        {row(2, "Abuelo · Sevilla", "took medicine · feeling OK", ACC_GP, 60)}
      </div>
    </AbsoluteFill>
  );
};

// ============= Outro =============

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 14, 80, 90], [0, 1, 1, 0]);

  const lines = [
    { text: "you text.", delay: 0,  accent: false },
    { text: "asmi calls.", delay: 14, accent: false },
    { text: "it's done.",   delay: 28, accent: true },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", opacity, padding: "0 90px" }}>
      <MicroLabel color={LIME}>· asmi  /  2026</MicroLabel>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
        {lines.map((l, i) => {
          const s = spring({ frame: frame - l.delay, fps, config: { damping: 20, stiffness: 140 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [40, 0]);
          const blur = interpolate(s, [0, 1], [10, 0]);
          return (
            <div
              key={i}
              style={{
                fontFamily: serif,
                fontStyle: l.accent ? "italic" : "normal",
                fontSize: 220,
                lineHeight: 1.0,
                color: l.accent ? LIME : INK,
                opacity: op,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
                letterSpacing: -4,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 60,
          fontSize: 26,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: INK_DIM,
          fontFamily: mono,
        }}
      >
        a personal AI for the real world
      </div>
    </AbsoluteFill>
  );
};
