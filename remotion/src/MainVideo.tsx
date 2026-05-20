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
import { loadFont as loadInter } from "@remotion/google-fonts/InterTight";
import { loadFont } from "@remotion/fonts";

const { fontFamily: sans } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Color emoji font — scoped to chat bubbles only
loadFont({
  family: "Noto Color Emoji",
  url: staticFile("fonts/NotoColorEmoji.ttf"),
  format: "truetype",
}).catch(() => {});

const EMOJI_STACK = `${sans}, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

// ============= Palette (one ink, one paper, one accent) =============
const BG       = "#0A0A0C";   // near-black
const INK      = "#F5F2EA";   // warm off-white
const INK_DIM  = "#7A7A85";   // muted
const INK_FAINT = "#2A2A30";  // hairline
const LIME     = "#E8FF5A";   // single accent
const SURFACE  = "#13131A";

// ============= Timing — identical to v7 =============
const D = {
  intro: 90, imDoc: 120, doc: 240, imHvac: 120, hvac: 240,
  imGp: 120, gp: 240, done: 240, outro: 90,
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

// BGM ducking — base 0.55, duck to 0.06 under calls, never exceeds 0.55
const bgmVolume = (f: number) => {
  const fadeIn = Math.min(1, f / 45);
  const fadeOut = Math.min(1, (TOTAL - f) / 18);
  const RAMP = 22;
  let duckAmt = 0;
  for (const [a, b] of callRanges) {
    const into = Math.max(0, Math.min(1, (f - a) / RAMP));
    const outOf = Math.max(0, Math.min(1, (b - f) / RAMP));
    duckAmt = Math.max(duckAmt, Math.min(into, outOf));
  }
  const eased = duckAmt * duckAmt * (3 - 2 * duckAmt);
  const base = 0.55 * (1 - eased) + 0.06 * eased;
  return Math.max(0, Math.min(0.55, base * fadeIn * fadeOut));
};

const POP = "audio/sfx/wa-pop.mp3";
const THREAD_REPLY_DELAY = 62;
const typingReplyFrame = (len: number) => 8 + Math.ceil(len * 1.6) + 6 + 32;
const HVAC_TYPED = "AC's dead. need a tech ASAP 🥵";
const GP_TYPED = "can u check on abuelo in sevilla? in spanish 🙏";

// ============= Root =============

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: sans, color: INK }}>
      <Vignette />

      <Sequence from={O.intro} durationInFrames={D.intro}><Intro /></Sequence>

      <Sequence from={O.imDoc} durationInFrames={D.imDoc}>
        <SceneWhatsAppThread
          contactName="Asmi"
          time="9:03"
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
          tag="Call 01"
          name="Dr. Weng — Front Desk"
          subtitle="mobile"
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
          tag="Call 02"
          name="Pacific HVAC"
          subtitle="mobile"
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
          tag="Call 03"
          name="Abuelo"
          subtitle="Sevilla · mobile"
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

      {/* Call voice — volume 1.0 (no clipping) */}
      <Sequence from={O.doc} durationInFrames={D.doc}>
        <Audio src={staticFile("audio/trimmed/doc.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <Audio src={staticFile("audio/trimmed/hvac.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={O.gp} durationInFrames={D.gp}>
        <Audio src={staticFile("audio/trimmed/grandpa.mp3")} volume={1.0} />
      </Sequence>

      {/* WhatsApp pop on each Asmi reply */}
      <Sequence from={O.imDoc + THREAD_REPLY_DELAY} durationInFrames={12}>
        <Audio src={staticFile(POP)} volume={0.5} />
      </Sequence>
      <Sequence from={O.imHvac + typingReplyFrame(HVAC_TYPED.length)} durationInFrames={12}>
        <Audio src={staticFile(POP)} volume={0.5} />
      </Sequence>
      <Sequence from={O.imGp + typingReplyFrame(GP_TYPED.length)} durationInFrames={12}>
        <Audio src={staticFile(POP)} volume={0.5} />
      </Sequence>

      <Audio src={staticFile("audio/bgm.mp3")} volume={(f) => bgmVolume(f)} />
    </AbsoluteFill>
  );
};

// ============= Static vignette (replaces orbs + grain) =============

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(120% 80% at 50% 40%, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);

// ============= Tiny label =============

const MicroLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children, color = INK_DIM,
}) => (
  <div
    style={{
      fontFamily: sans,
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: 4,
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </div>
);

// ============= Intro =============

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 130 } });
  const opacity = interpolate(frame, [0, 14, 75, 90], [0, 1, 1, 0]);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 90px",
        opacity,
      }}
    >
      <div style={{ transform: `translateY(${(1 - s) * 18}px)`, opacity: s }}>
        <MicroLabel color={LIME}>asmi · 2026</MicroLabel>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 220,
            color: INK,
            lineHeight: 0.95,
            marginTop: 28,
            letterSpacing: -6,
          }}
        >
          you text.
          <br />
          <span style={{ color: LIME }}>asmi calls.</span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            color: INK_DIM,
            maxWidth: 760,
            lineHeight: 1.35,
            fontWeight: 400,
            letterSpacing: -0.4,
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
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div
      style={{
        width: 780,
        height: 1540,
        borderRadius: 110,
        background: "#0a0a0c",
        padding: 16,
        boxShadow:
          "0 60px 160px -40px rgba(0,0,0,0.9), 0 0 0 2px #25252c, inset 0 0 0 1.5px #18181f",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 96,
          background: "#0B141A",
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
        top: 26,
        left: "50%",
        transform: "translateX(-50%)",
        width: 320,
        height: 40,
        borderRadius: 22,
        background: "#000",
        zIndex: 10,
      }}
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "38px 60px 14px",
        color: "#fff",
        fontSize: 28,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -0.5,
        zIndex: 5,
      }}
    >
      <span>{time}</span>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <svg width="34" height="22" viewBox="0 0 34 22"><g fill="#fff">
          <rect x="0" y="14" width="6" height="8" rx="1.5" />
          <rect x="9" y="10" width="6" height="12" rx="1.5" />
          <rect x="18" y="5" width="6" height="17" rx="1.5" />
          <rect x="27" y="0" width="6" height="22" rx="1.5" />
        </g></svg>
        <svg width="46" height="20" viewBox="0 0 50 22">
          <rect x="1" y="2" width="42" height="18" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
          <rect x="45" y="8" width="4" height="6" rx="1.5" fill="#fff" />
          <rect x="4" y="5" width="32" height="12" rx="2" fill="#fff" />
        </svg>
      </div>
    </div>
  </>
);

const Avatar: React.FC<{ size?: number }> = ({ size = 76 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: `linear-gradient(140deg, #2DD4A8, #0E7C5C)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 600,
      fontSize: size * 0.46,
      letterSpacing: -1,
      flexShrink: 0,
      boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)",
    }}
  >
    A
  </div>
);

const WAHeader: React.FC<{ name: string }> = ({ name }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "8px 22px 14px",
      background: "#1F2C34",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      gap: 16,
    }}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
    <Avatar size={76} />
    <div style={{ flex: 1, lineHeight: 1.15 }}>
      <div style={{ color: "#fff", fontSize: 30, fontWeight: 600, letterSpacing: -0.3 }}>{name}</div>
      <div style={{ color: "#8A9BA4", fontSize: 22, marginTop: 2, fontWeight: 400 }}>online</div>
    </div>
    <div style={{ display: "flex", gap: 28, color: "#fff", alignItems: "center" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </div>
  </div>
);

const ChatBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      flex: 1,
      background:
        "#0B141A url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><g fill='none' stroke='%23ffffff' stroke-opacity='0.025' stroke-width='1.2'><circle cx='30' cy='30' r='6'/><path d='M70 50 q10 -12 22 0'/><path d='M100 100 l8 8 l-8 8 l-8 -8 z'/><circle cx='130' cy='40' r='3'/><path d='M20 110 q14 8 28 0'/><circle cx='60' cy='130' r='4'/></g></svg>\")",
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

const DayDivider: React.FC<{ label: string; opacity?: number }> = ({ label, opacity = 1 }) => (
  <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 6px", opacity }}>
    <div
      style={{
        background: "#182229",
        color: "#8A9BA4",
        fontSize: 18,
        padding: "6px 16px",
        borderRadius: 12,
        letterSpacing: 0.4,
        fontWeight: 500,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  </div>
);

const Tick: React.FC = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
    <path d="M1 7 L5 11 L12 3" stroke="#53BDEB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7 L12 11 L19 3" stroke="#53BDEB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WABubble: React.FC<{
  msg: Msg; opacity?: number; transform?: string;
}> = ({ msg, opacity = 1, transform = "none" }) => {
  const isOut = msg.from === "out";
  return (
    <div style={{ display: "flex", justifyContent: isOut ? "flex-end" : "flex-start", opacity, transform }}>
      <div
        style={{
          maxWidth: "78%",
          padding: "10px 14px 8px",
          borderRadius: 16,
          ...(isOut ? { borderTopRightRadius: 4 } : { borderTopLeftRadius: 4 }),
          background: isOut ? "#005C4B" : "#1F2C34",
          color: "#E9EDEF",
          fontSize: 28,
          lineHeight: 1.28,
          letterSpacing: -0.2,
          fontFamily: EMOJI_STACK,
          fontWeight: 400,
          boxShadow: "0 1px 0 rgba(0,0,0,0.2)",
          position: "relative",
          display: "inline-flex",
          flexDirection: "column",
        }}
      >
        <div style={{ paddingRight: isOut ? 96 : 70, paddingBottom: 4 }}>{msg.text}</div>
        <div
          style={{
            position: "absolute",
            right: 12,
            bottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "rgba(233,237,239,0.5)",
            fontSize: 18,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>{msg.t ?? ""}</span>
          {isOut && <Tick />}
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
          borderRadius: 16,
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
        background: "#2A3942",
        borderRadius: 28,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        color: "#8A9BA4",
        fontSize: 24,
        gap: 14,
      }}
    >
      <span style={{ fontFamily: EMOJI_STACK }}>😊</span>
      <span style={{ flex: 1 }}>Message</span>
    </div>
    <div
      style={{
        width: 60, height: 60, borderRadius: 999,
        background: "#00A884",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
        <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z" />
      </svg>
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
          background: "#2A3942",
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
        <span style={{ opacity: 0.8 }}>😊</span>
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
      </div>
      <div
        style={{
          width: 60, height: 60, borderRadius: 999,
          background: "#00A884",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {hasText ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
            <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z" />
          </svg>
        )}
      </div>
    </div>
  );
};

// Floating overlay above the centered phone — single keyword in lime, asymmetric
const ChatOverlay: React.FC<{ tag: string; title: string; accentWord: string; sub: string }> =
  ({ tag, title, accentWord, sub }) => (
  <>
    <div style={{ position: "absolute", top: 70, left: 80, right: 80, display: "flex", justifyContent: "space-between", zIndex: 5 }}>
      <MicroLabel color={LIME}>{tag}</MicroLabel>
    </div>
    <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, zIndex: 5, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 78, color: INK, lineHeight: 0.95, letterSpacing: -2.5, maxWidth: 600 }}>
        {title} <span style={{ color: LIME }}>{accentWord}</span>
      </div>
      <div style={{ fontSize: 22, color: INK_DIM, maxWidth: 360, textAlign: "right", lineHeight: 1.4, letterSpacing: -0.2 }}>{sub}</div>
    </div>
  </>
);

const SceneWhatsAppThread: React.FC<{
  contactName: string; time: string; history: Msg[]; today: Msg[]; reply: string; replyTime: string;
}> = ({ contactName, time, history, today, reply, replyTime }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 130 } });
  const phoneOp = interpolate(enter, [0, 1], [0, 1]);
  const phoneY = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill>
      <ChatOverlay tag="01 · whatsapp" title="the" accentWord="ask" sub="text asmi like a friend. it picks up the thread." />
      <div style={{ opacity: phoneOp, transform: `translateY(${phoneY}px)` }}>
        <PhoneFrame>
          <StatusBar time={time} />
          <WAHeader name={contactName} />
          <ChatBackground>
            <DayDivider label="Yesterday" opacity={0.55} />
            {history.map((m, i) => <WABubble key={i} msg={m} opacity={0.5} />)}
            <DayDivider label="Today" />
            {today.map((m, i) => {
              const e = spring({ frame: frame - 10 - i * 6, fps, config: { damping: 18, stiffness: 220 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [16, 0]);
              const sc = interpolate(e, [0, 1], [0.95, 1]);
              return <WABubble key={i} msg={m} opacity={op} transform={`translateY(${y}px) scale(${sc})`} />;
            })}

            {frame > 32 && frame < THREAD_REPLY_DELAY && <WATypingDots />}

            {frame >= THREAD_REPLY_DELAY && (() => {
              const e = spring({ frame: frame - THREAD_REPLY_DELAY, fps, config: { damping: 18, stiffness: 220 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [10, 0]);
              const sc = interpolate(e, [0, 1], [0.95, 1]);
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

const SceneWhatsAppTyping: React.FC<{
  contactName: string; time: string; history: Msg[]; typedMessage: string; reply: string; replyTime: string;
}> = ({ contactName, time, history, typedMessage, reply, replyTime }) => {
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
      <ChatOverlay tag="02 · whatsapp" title="just" accentWord="text it." sub="no app. no menus. like texting a friend." />
      <div style={{ opacity: phoneOp, transform: `translateY(${phoneY}px)` }}>
        <PhoneFrame>
          <StatusBar time={time} />
          <WAHeader name={contactName} />
          <ChatBackground>
            <DayDivider label="Today" opacity={0.7} />
            {history.map((m, i) => <WABubble key={i} msg={m} opacity={0.55} />)}

            {isSent && (() => {
              const e = spring({ frame: frame - sentFrame, fps, config: { damping: 18, stiffness: 220 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [18, 0]);
              const sc = interpolate(e, [0, 1], [0.95, 1]);
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
              const e = spring({ frame: frame - replyDelay, fps, config: { damping: 18, stiffness: 220 } });
              const op = interpolate(e, [0, 1], [0, 1]);
              const y = interpolate(e, [0, 1], [10, 0]);
              const sc = interpolate(e, [0, 1], [0.95, 1]);
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
          <WAComposerTyping text={typedMessage.slice(0, typeChars)} sent={isSent} />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

// ============= Call scene — CallKit-style =============

type Caption = { at: number; text: string };

const SceneCall: React.FC<{
  tag: string; name: string; subtitle: string; captions: Caption[];
}> = ({ tag, name, subtitle, captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 20, stiffness: 130 } });
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const y = interpolate(intro, [0, 1], [30, 0]);

  const active = captions.reduce<Caption | null>(
    (acc, c) => (frame >= c.at ? c : acc), null,
  );
  const captionEnter = active
    ? spring({ frame: frame - active.at, fps, config: { damping: 20, stiffness: 220 } })
    : 0;

  const sec = Math.floor(frame / fps);
  const mm = Math.floor(sec / 60).toString();
  const ss = (sec % 60).toString().padStart(2, "0");

  return (
    <AbsoluteFill style={{ padding: "110px 90px 110px", opacity, transform: `translateY(${y}px)` }}>
      {/* Top: tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <MicroLabel color={LIME}>· {tag}</MicroLabel>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: sans, fontWeight: 500, fontSize: 22, color: INK_DIM,
            letterSpacing: 2, textTransform: "uppercase",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 999, background: LIME, opacity: 0.5 + 0.5 * Math.sin(frame / 6) }} />
          live · {mm}:{ss}
        </div>
      </div>

      {/* CallKit card */}
      <div style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <Avatar size={260} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 84, color: INK, letterSpacing: -2, lineHeight: 1 }}>
            {name}
          </div>
          <div style={{ marginTop: 16, fontSize: 30, color: INK_DIM, fontWeight: 400, letterSpacing: -0.3 }}>
            {subtitle}
          </div>
        </div>

        {/* Waveform */}
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 5, height: 120 }}>
          {Array.from({ length: 52 }).map((_, i) => {
            const h = 10 + Math.abs(Math.sin(frame / 6 + i * 0.55)) * 80 + Math.abs(Math.sin(frame / 10 + i * 0.3)) * 24;
            const mid = Math.abs(i - 26) < 4;
            return (
              <div
                key={i}
                style={{
                  width: 6,
                  height: h,
                  background: mid ? LIME : INK,
                  borderRadius: 6,
                  opacity: mid ? 0.9 : 0.35 + 0.25 * Math.abs(Math.sin(frame / 12 + i * 0.2)),
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Live caption */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%", minHeight: 240 }}>
          {active && (
            <div
              style={{
                opacity: captionEnter,
                transform: `translateY(${(1 - captionEnter) * 12}px)`,
                background: SURFACE,
                border: `1px solid ${INK_FAINT}`,
                borderLeft: `3px solid ${LIME}`,
                borderRadius: 20,
                padding: "32px 38px",
                fontSize: 40,
                color: INK,
                fontFamily: sans,
                fontWeight: 500,
                lineHeight: 1.3,
                letterSpacing: -0.5,
              }}
            >
              {active.text}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============= Done =============

const SceneDone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const y = interpolate(intro, [0, 1], [24, 0]);

  const row = (i: number, label: string, sub: string, delay: number) => {
    const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 180 } });
    const op = interpolate(s, [0, 1], [0, 1]);
    const dy = interpolate(s, [0, 1], [22, 0]);
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
          border: `1px solid ${INK_FAINT}`,
          borderRadius: 20,
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: 999,
            background: LIME, color: BG,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 700, flexShrink: 0,
          }}
        >
          ✓
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, color: INK, fontWeight: 500, letterSpacing: -0.4 }}>{label}</div>
          <div style={{ fontSize: 24, color: INK_DIM, marginTop: 6, letterSpacing: -0.2 }}>{sub}</div>
        </div>
        <div style={{ fontSize: 20, color: INK_DIM, letterSpacing: 3, textTransform: "uppercase", fontWeight: 500 }}>done</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ padding: "110px 90px", opacity, transform: `translateY(${y}px)` }}>
      <MicroLabel color={LIME}>· wrapped</MicroLabel>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 190,
          color: INK,
          lineHeight: 0.92,
          letterSpacing: -6,
          marginTop: 22,
          marginBottom: 70,
        }}
      >
        three calls.
        <br />
        <span style={{ color: LIME }}>zero minutes.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {row(0, "Dr. Weng · Jonathan", "Tuesday · 10:00 AM", 8)}
        {row(1, "Pacific HVAC · Marco", "Saturday · 9:00 AM · $150", 34)}
        {row(2, "Abuelo · Sevilla", "took medicine · feeling OK", 60)}
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
    { text: "you text.",   delay: 0,  accent: false },
    { text: "asmi calls.", delay: 14, accent: false },
    { text: "it's done.",  delay: 28, accent: true },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", opacity, padding: "0 90px" }}>
      <MicroLabel color={LIME}>asmi · 2026</MicroLabel>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
        {lines.map((l, i) => {
          const s = spring({ frame: frame - l.delay, fps, config: { damping: 22, stiffness: 140 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [30, 0]);
          return (
            <div
              key={i}
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 210,
                lineHeight: 1.0,
                color: l.accent ? LIME : INK,
                opacity: op,
                transform: `translateY(${y}px)`,
                letterSpacing: -6,
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
          fontSize: 24,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: INK_DIM,
          fontFamily: sans,
          fontWeight: 500,
        }}
      >
        a personal AI for the real world
      </div>
    </AbsoluteFill>
  );
};
