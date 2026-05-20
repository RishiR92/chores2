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

// Color emoji font so 🙏 🥵 etc render in the chat
loadFont({
  family: "Noto Color Emoji",
  url: staticFile("fonts/NotoColorEmoji.ttf"),
  format: "truetype",
}).catch(() => {});

const EMOJI_STACK = `${sans}, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;


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

const TOTAL = 1500;
// Duck music during call scenes so voice is clear
const callRanges: Array<[number, number]> = [
  [O.doc, O.doc + D.doc],
  [O.hvac, O.hvac + D.hvac],
  [O.gp, O.gp + D.gp],
];
const bgmVolume = (f: number) => {
  const fadeIn = Math.min(1, f / 45);
  // Long, smooth tail — starts pulling down ~3.5s before end so it doesn't cut.
  const FADE_OUT_FRAMES = 105;
  const t = Math.max(0, Math.min(1, (TOTAL - f) / FADE_OUT_FRAMES));
  // Ease-in-out cubic for a musical decay
  const fadeOut = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const RAMP = 22;
  let duckAmt = 0;
  for (const [a, b] of callRanges) {
    const into = Math.max(0, Math.min(1, (f - a) / RAMP));
    const outOf = Math.max(0, Math.min(1, (b - f) / RAMP));
    duckAmt = Math.max(duckAmt, Math.min(into, outOf));
  }
  const eased = duckAmt * duckAmt * (3 - 2 * duckAmt);
  const base = 0.42 * (1 - eased) + 0.018 * eased;
  return Math.max(0, base * fadeIn * fadeOut);
};


// iMessage receive "ting" — absolute frames computed below from scene offsets + reply delays
const TING = "audio/sfx/imessage-receive.mp3";
// Thread scene reply delay (must match SceneIMessageThread)
const THREAD_REPLY_DELAY = 55;
// Typing scenes: sentFrame = 8 + ceil(len * 1.6) + 6 ; replyDelay = sentFrame + 28
const typingReplyFrame = (len: number) => 8 + Math.ceil(len * 1.6) + 6 + 28;
const HVAC_TYPED = "AC is dead. Need a tech ASAP 🥵";
const GP_TYPED = "Can you check on grandpa in Sevilla? In Spanish 🙏";



export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: sans }}>
      <DriftingBloom />
      <Grain />

      <Sequence from={O.intro} durationInFrames={D.intro}><Intro /></Sequence>

      <Sequence from={O.imDoc} durationInFrames={D.imDoc}>
        <SceneIMessageThread
          contactName="Sarah"
          time="9:03 AM"
          history={[
            { from: "out", text: "morning! quick favor 🙏" },
            { from: "in",  text: "of course — what do you need?" },
            { from: "out", text: "Hey, can you book Jonathan a checkup with Dr. Weng's office?" },
          ]}
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
        <SceneIMessageTyping
          contactName="Marco"
          time="11:18 AM"
          typedMessage="AC is dead. Need a tech ASAP 🥵"
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
        <SceneIMessageTyping
          contactName="Sarah"
          time="6:42 PM"
          typedMessage="Can you check on grandpa in Sevilla? In Spanish 🙏"
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


      {/* Call voice tracks — boosted while on screen (sources already normalized to -14 LUFS) */}
      <Sequence from={O.doc} durationInFrames={D.doc}>
        <Audio src={staticFile("audio/trimmed/doc.mp3")} volume={1.4} />
      </Sequence>
      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <Audio src={staticFile("audio/trimmed/hvac.mp3")} volume={1.4} />
      </Sequence>
      <Sequence from={O.gp} durationInFrames={D.gp}>
        <Audio src={staticFile("audio/trimmed/grandpa.mp3")} volume={1.4} />
      </Sequence>

      {/* iMessage "ting" on each Asmi reply bubble */}
      <Sequence from={O.imDoc + THREAD_REPLY_DELAY} durationInFrames={20}>
        <Audio src={staticFile(TING)} volume={0.55} />
      </Sequence>
      <Sequence from={O.imHvac + typingReplyFrame(HVAC_TYPED.length)} durationInFrames={20}>
        <Audio src={staticFile(TING)} volume={0.55} />
      </Sequence>
      <Sequence from={O.imGp + typingReplyFrame(GP_TYPED.length)} durationInFrames={20}>
        <Audio src={staticFile(TING)} volume={0.55} />
      </Sequence>

      {/* Background music — ducks hard under call scenes */}
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

// ============= WhatsApp scenes (zoomed phone) =============

type Msg = { from: "in" | "out"; text: string; t?: string };

const WA_BG = "#0B141A";
const WA_HEADER = "#1F2C34";
const WA_IN = "#1F2C34";
const WA_OUT = "#005C4B";
const WA_INK = "#E9EDEF";
const WA_INK_DIM = "#8A9BA4";

const WhatsAppShell: React.FC<{
  contactName: string;
  time: string;
  messages: React.ReactNode;
  composer?: React.ReactNode;
}> = ({ contactName, time, messages }) => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(120% 80% at 50% 30%, #11202A 0%, #0A1419 55%, #06090C 100%)",
      fontFamily: EMOJI_STACK,
    }}
  >
    {/* Minimal contact strip — keeps context without a phone frame */}
    <div
      style={{
        position: "absolute",
        top: 88,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: "linear-gradient(140deg, #2DD4A8, #0E7C5C)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: -1,
          boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.15)",
        }}
      >
        {contactName[0]}
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ color: "#fff", fontSize: 44, fontWeight: 600, letterSpacing: -0.5 }}>
          {contactName}
        </div>
        <div style={{ color: WA_INK_DIM, fontSize: 26, marginTop: 6 }}>online · {time}</div>
      </div>
    </div>

    {/* Zoomed bubbles — fill the canvas, no phone, no window chrome */}
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 220,
        bottom: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 28,
        overflow: "hidden",
      }}
    >
      {messages}
    </div>
  </AbsoluteFill>
);

const WATick: React.FC = () => (
  <svg width="40" height="22" viewBox="0 0 22 14" fill="none">
    <path d="M1 7 L5 11 L12 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7 L12 11 L19 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Bubble: React.FC<{ msg: Msg; opacity?: number; transform?: string; tail?: boolean }> = ({ msg, opacity = 1, transform = "none" }) => {
  const isOut = msg.from === "out";
  return (
    <div style={{ display: "flex", justifyContent: isOut ? "flex-end" : "flex-start", opacity, transform }}>
      <div
        style={{
          maxWidth: "86%",
          padding: "28px 34px 24px",
          borderRadius: 34,
          ...(isOut ? { borderTopRightRadius: 8 } : { borderTopLeftRadius: 8 }),
          background: isOut ? WA_OUT : WA_IN,
          color: WA_INK,
          fontSize: 56,
          lineHeight: 1.24,
          letterSpacing: -0.4,
          fontFamily: EMOJI_STACK,
          fontWeight: 400,
          boxShadow: "0 18px 40px -18px rgba(0,0,0,0.55), 0 1px 0 rgba(0,0,0,0.25)",
          position: "relative",
          display: "inline-flex",
          flexDirection: "column",
        }}
      >
        <div style={{ paddingRight: isOut ? 150 : 110, paddingBottom: 8 }}>{msg.text}</div>
        <div
          style={{
            position: "absolute",
            right: 24,
            bottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(233,237,239,0.6)",
            fontSize: 26,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>{msg.t ?? ""}</span>
          {isOut && <WATick />}
        </div>
      </div>
    </div>
  );
};

const IdleComposer: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 18px 18px",
      background: WA_BG,
    }}
  >
    <div
      style={{
        flex: 1,
        minHeight: 64,
        background: "#2A3942",
        borderRadius: 32,
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        color: WA_INK_DIM,
        fontSize: 26,
        gap: 16,
      }}
    >
      <span style={{ fontFamily: EMOJI_STACK }}>😊</span>
      <span style={{ flex: 1 }}>Message</span>
      <span style={{ fontFamily: EMOJI_STACK }}>📎</span>
    </div>
    <div
      style={{
        width: 68, height: 68, borderRadius: 999,
        background: "#00A884",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
        <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z" />
      </svg>
    </div>
  </div>
);

const TypingComposer: React.FC<{ text: string; sent: boolean }> = ({ text, sent }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 2 === 0;
  const hasText = text.length > 0 && !sent;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 14,
        padding: "14px 18px 18px",
        background: WA_BG,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 64,
          background: "#2A3942",
          borderRadius: 32,
          display: "flex",
          alignItems: "center",
          padding: "16px 22px",
          color: WA_INK,
          fontSize: 28,
          lineHeight: 1.25,
          gap: 16,
          fontFamily: EMOJI_STACK,
        }}
      >
        <span style={{ opacity: 0.85 }}>😊</span>
        <div style={{ flex: 1, wordBreak: "break-word" }}>
          {sent || text.length === 0 ? (
            <span style={{ color: WA_INK_DIM }}>Message</span>
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
          width: 68, height: 68, borderRadius: 999,
          background: "#00A884",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {hasText ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
            <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z" />
          </svg>
        )}
      </div>
    </div>
  );
};

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: WA_IN,
          borderRadius: 34,
          borderTopLeftRadius: 8,
          padding: "32px 40px",
          display: "flex",
          gap: 16,
          boxShadow: "0 18px 40px -18px rgba(0,0,0,0.55)",
        }}
      >
        {[0, 1, 2].map((i) => {
          const o = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 5 - i * 0.8));
          return (
            <span key={i} style={{ width: 22, height: 22, borderRadius: 999, background: WA_INK_DIM, opacity: o }} />
          );
        })}
      </div>
    </div>
  );
};

// Variant 1: pre-existing thread with multiple messages, latest inbound sets up the ask.
const SceneIMessageThread: React.FC<{
  contactName: string;
  time: string;
  history: Msg[];
  reply: string;
}> = ({ contactName, time, history, reply }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const replyDelay = 55;

  return (
    <WhatsAppShell
      contactName={contactName}
      time={time}
      composer={<IdleComposer />}
      messages={
        <>
          {history.map((m, i) => {
            const e = spring({ frame: frame - i * 4, fps, config: { damping: 18, stiffness: 220 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [16, 0]);
            const sc = interpolate(e, [0, 1], [0.95, 1]);
            return <Bubble key={i} msg={{ ...m, t: time }} opacity={op} transform={`translateY(${y}px) scale(${sc})`} />;
          })}

          {frame > 28 && frame < replyDelay && <TypingDots />}

          {frame >= replyDelay && (() => {
            const e = spring({ frame: frame - replyDelay, fps, config: { damping: 18, stiffness: 220 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [16, 0]);
            const sc = interpolate(e, [0, 1], [0.95, 1]);
            return (
              <Bubble msg={{ from: "in", text: reply, t: time }} opacity={op} transform={`translateY(${y}px) scale(${sc})`} />
            );
          })()}
        </>
      }
    />
  );
};

// Variants 2 & 3: user is actively typing a new request into the composer, then sends.
const SceneIMessageTyping: React.FC<{
  contactName: string;
  time: string;
  typedMessage: string;
  reply: string;
}> = ({ contactName, time, typedMessage, reply }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typeStart = 8;
  const typeSpeed = 1.6;
  const typeChars = Math.max(0, Math.min(typedMessage.length, Math.floor((frame - typeStart) / typeSpeed)));
  const sentFrame = typeStart + Math.ceil(typedMessage.length * typeSpeed) + 6;
  const isSent = frame >= sentFrame;
  const replyDelay = sentFrame + 28;

  return (
    <WhatsAppShell
      contactName={contactName}
      time={time}
      composer={<TypingComposer text={typedMessage.slice(0, typeChars)} sent={isSent} />}
      messages={
        <>
          <Bubble msg={{ from: "out", text: "hey asmi", t: time }} opacity={0.5} />
          <Bubble msg={{ from: "in",  text: "here — what do you need?", t: time }} opacity={0.5} />

          {isSent && (() => {
            const e = spring({ frame: frame - sentFrame, fps, config: { damping: 18, stiffness: 220 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [18, 0]);
            const sc = interpolate(e, [0, 1], [0.95, 1]);
            return <Bubble msg={{ from: "out", text: typedMessage, t: time }} opacity={op} transform={`translateY(${y}px) scale(${sc})`} />;
          })()}

          {frame > sentFrame + 8 && frame < replyDelay && <TypingDots />}

          {frame >= replyDelay && (() => {
            const e = spring({ frame: frame - replyDelay, fps, config: { damping: 18, stiffness: 220 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [16, 0]);
            const sc = interpolate(e, [0, 1], [0.95, 1]);
            return <Bubble msg={{ from: "in", text: reply, t: time }} opacity={op} transform={`translateY(${y}px) scale(${sc})`} />;
          })()}
        </>
      }
    />
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
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 14, 80, 90], [0, 1, 1, 0]);

  // Three lines reveal sequentially with springs
  const lines = [
    { text: "AI That Handles",       delay: 0  },
    { text: "Your Personal Chores",  delay: 14 },
    { text: "In The Physical World", delay: 28, accent: true },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, padding: 80 }}>
      {/* tiny wordmark */}
      <div
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 56,
          color: STONE,
          marginBottom: 36,
          letterSpacing: -1,
        }}
      >
        asmi
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lines.map((l, i) => {
          const s = spring({ frame: frame - l.delay, fps, config: { damping: 18, stiffness: 140 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [30, 0]);
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
          color: STONE,
          fontWeight: 500,
        }}
      >
        you text · asmi calls · it's done
      </div>
    </AbsoluteFill>
  );
};

