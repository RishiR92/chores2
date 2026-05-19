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
  const fadeOut = Math.min(1, (TOTAL - f) / 60);
  // Smooth duck: 22-frame ramp into/out of call ranges. Deep duck so call voice sits clearly on top.
  const RAMP = 22;
  let duckAmt = 0;
  for (const [a, b] of callRanges) {
    const into = Math.max(0, Math.min(1, (f - a) / RAMP));
    const outOf = Math.max(0, Math.min(1, (b - f) / RAMP));
    duckAmt = Math.max(duckAmt, Math.min(into, outOf));
  }
  // Smooth (ease-in-out) the duck transition
  const eased = duckAmt * duckAmt * (3 - 2 * duckAmt);
  const base = 0.36 * (1 - eased) + 0.015 * eased;
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
        <Audio src={staticFile("audio/trimmed/doc.mp3")} volume={2.2} />
      </Sequence>
      <Sequence from={O.hvac} durationInFrames={D.hvac}>
        <Audio src={staticFile("audio/trimmed/hvac.mp3")} volume={2.2} />
      </Sequence>
      <Sequence from={O.gp} durationInFrames={D.gp}>
        <Audio src={staticFile("audio/trimmed/grandpa.mp3")} volume={2.2} />
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

// ============= iMessage scenes =============

type Msg = { from: "in" | "out"; text: string };

const IMessageShell: React.FC<{
  contactName: string;
  time: string;
  messages: React.ReactNode;
  composer: React.ReactNode;
}> = ({ contactName, time, messages, composer }) => (
  <AbsoluteFill style={{ background: "#000", padding: 0, justifyContent: "flex-start" }}>
    <div
      style={{
        margin: 60,
        marginTop: 80,
        borderRadius: 72,
        background: "#fff",
        flex: 1,
        overflow: "hidden",
        boxShadow: "0 40px 120px -30px rgba(0,0,0,0.6), inset 0 0 0 8px #1a1a1a",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Notch */}
      <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", width: 340, height: 38, borderRadius: 20, background: "#000", zIndex: 10 }} />

      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 60px 12px", color: "#000", fontSize: 30, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        <span>{time}</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <svg width="34" height="22" viewBox="0 0 34 22"><g fill="#000">
            <rect x="0"  y="14" width="6" height="8" rx="1"/>
            <rect x="9"  y="10" width="6" height="12" rx="1"/>
            <rect x="18" y="5"  width="6" height="17" rx="1"/>
            <rect x="27" y="0"  width="6" height="22" rx="1"/>
          </g></svg>
          <svg width="32" height="22" viewBox="0 0 32 22" fill="#000">
            <path d="M16 4 C7 4 1 10 1 10 L4 14 C4 14 9 9 16 9 C23 9 28 14 28 14 L31 10 C31 10 25 4 16 4 Z"/>
            <path d="M16 12 C11 12 7 16 7 16 L10 19 C10 19 13 17 16 17 C19 17 22 19 22 19 L25 16 C25 16 21 12 16 12 Z"/>
            <circle cx="16" cy="20" r="2"/>
          </svg>
          <svg width="50" height="22" viewBox="0 0 50 22">
            <rect x="1" y="2" width="42" height="18" rx="5" ry="5" fill="none" stroke="#000" strokeWidth="2"/>
            <rect x="45" y="8" width="4" height="6" rx="1.5" fill="#000"/>
            <rect x="4" y="5" width="36" height="12" rx="2" fill="#34C759"/>
          </svg>
        </div>
      </div>

      {/* Contact header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 22px", borderBottom: "1px solid #E5E5EA", background: "rgba(247,247,247,0.92)", position: "relative" }}>
        <div style={{ position: "absolute", left: 36, top: 52, color: IMSG_BLUE, fontSize: 40, fontWeight: 400 }}>‹ 12</div>
        <div style={{ position: "absolute", right: 36, top: 56, color: IMSG_BLUE }}>
          <svg width="44" height="28" viewBox="0 0 44 28" fill="none" stroke={IMSG_BLUE} strokeWidth="2.5" strokeLinejoin="round">
            <rect x="2" y="4" width="28" height="20" rx="5"/>
            <path d="M30 10 L42 4 L42 24 L30 18 Z" fill={IMSG_BLUE}/>
          </svg>
        </div>
        <div style={{ width: 96, height: 96, borderRadius: 999, background: "linear-gradient(135deg, #8E8E93, #C7C7CC)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 44, fontWeight: 500, marginBottom: 10 }}>
          {contactName[0]}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#000", fontSize: 28, fontWeight: 500 }}>
          {contactName}
          <span style={{ color: "#8E8E93", fontSize: 26 }}>›</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "32px 28px 24px", display: "flex", flexDirection: "column", gap: 12, justifyContent: "flex-end" }}>
        {messages}
      </div>

      {/* Input bar */}
      {composer}
    </div>
  </AbsoluteFill>
);

const Bubble: React.FC<{ msg: Msg; opacity?: number; transform?: string; tail?: boolean }> = ({ msg, opacity = 1, transform = "none", tail = true }) => {
  const isOut = msg.from === "out";
  return (
    <div style={{ display: "flex", justifyContent: isOut ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "78%",
          padding: "18px 24px",
          borderRadius: 32,
          ...(tail && isOut ? { borderBottomRightRadius: 8 } : {}),
          ...(tail && !isOut ? { borderBottomLeftRadius: 8 } : {}),
          background: isOut ? "linear-gradient(180deg, #1FA1FF 0%, #0B84FF 100%)" : "#E9E9EB",
          color: isOut ? "#fff" : "#000",
          fontSize: 32,
          lineHeight: 1.32,
          opacity,
          transform,
          transformOrigin: isOut ? "bottom right" : "bottom left",
          boxShadow: isOut ? "0 4px 14px -6px rgba(11,132,255,0.5)" : "none",
        }}
      >
        {msg.text}
      </div>
    </div>
  );
};

const IdleComposer: React.FC = () => (
  <div style={{ padding: "18px 28px 30px", borderTop: "1px solid #E5E5EA", display: "flex", gap: 14, alignItems: "center", background: "#fff" }}>
    <div style={{ width: 44, height: 44, borderRadius: 999, border: "2px solid #C7C7CC", color: "#8E8E93", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>+</div>
    <div style={{ flex: 1, height: 50, borderRadius: 25, border: "1px solid #D1D1D6", display: "flex", alignItems: "center", padding: "0 20px", color: "#C7C7CC", fontSize: 24 }}>iMessage</div>
    <div style={{ color: IMSG_BLUE, fontSize: 30 }}>🎤</div>
  </div>
);

const TypingComposer: React.FC<{ text: string; sent: boolean }> = ({ text, sent }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 2 === 0;
  return (
    <div style={{ padding: "18px 28px 30px", borderTop: "1px solid #E5E5EA", display: "flex", gap: 14, alignItems: "center", background: "#fff" }}>
      <div style={{ width: 44, height: 44, borderRadius: 999, border: "2px solid #C7C7CC", color: "#8E8E93", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>+</div>
      <div style={{ flex: 1, minHeight: 50, borderRadius: 25, border: "1px solid #D1D1D6", display: "flex", alignItems: "center", padding: "10px 22px", color: "#000", fontSize: 26, lineHeight: 1.25 }}>
        {sent ? <span style={{ color: "#C7C7CC" }}>iMessage</span> : (
          <span>
            {text}
            <span style={{ opacity: blink ? 1 : 0, color: IMSG_BLUE, marginLeft: 2 }}>|</span>
          </span>
        )}
      </div>
      <div
        style={{
          width: 46, height: 46, borderRadius: 999,
          background: text.length > 0 && !sent ? IMSG_BLUE : "#D1D1D6",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700,
        }}
      >
        ↑
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
    <IMessageShell
      contactName={contactName}
      time={time}
      composer={<IdleComposer />}
      messages={
        <>
          <div style={{ textAlign: "center", color: "#8E8E93", fontSize: 22, marginBottom: 6 }}>
            iMessage · Today {time}
          </div>
          {history.map((m, i) => {
            // historical messages settle in fast then stay
            const e = spring({ frame: frame - i * 4, fps, config: { damping: 18, stiffness: 220 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [16, 0]);
            return <Bubble key={i} msg={m} opacity={op} transform={`translateY(${y}px)`} />;
          })}

          {frame > 28 && frame < replyDelay && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}><TypingDots /></div>
          )}

          {frame >= replyDelay && (() => {
            const e = spring({ frame: frame - replyDelay, fps, config: { damping: 14, stiffness: 200 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [24, 0]);
            const sc = interpolate(e, [0, 1], [0.9, 1]);
            return (
              <>
                <Bubble msg={{ from: "in", text: reply }} opacity={op} transform={`translateY(${y}px) scale(${sc})`} />
                <div style={{ textAlign: "left", color: "#8E8E93", fontSize: 20, marginTop: 2, opacity: op, paddingLeft: 8 }}>
                  Asmi
                </div>
              </>
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

  // Typing animation: char-by-char from frame 6 to frame 6 + len*2
  const typeStart = 8;
  const typeSpeed = 1.6; // frames per char
  const typeChars = Math.max(0, Math.min(typedMessage.length, Math.floor((frame - typeStart) / typeSpeed)));
  const sentFrame = typeStart + Math.ceil(typedMessage.length * typeSpeed) + 6;
  const isSent = frame >= sentFrame;
  const replyDelay = sentFrame + 28;

  return (
    <IMessageShell
      contactName={contactName}
      time={time}
      composer={
        <TypingComposer text={typedMessage.slice(0, typeChars)} sent={isSent} />
      }
      messages={
        <>
          <div style={{ textAlign: "center", color: "#8E8E93", fontSize: 22, marginBottom: 6 }}>
            iMessage · Today {time}
          </div>

          {/* Faint earlier context so thread isn't empty */}
          <Bubble msg={{ from: "out", text: "hey asmi" }} opacity={0.55} />
          <Bubble msg={{ from: "in",  text: "here — what do you need?" }} opacity={0.55} />


          {isSent && (() => {
            const e = spring({ frame: frame - sentFrame, fps, config: { damping: 16, stiffness: 220 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [40, 0]);
            const sc = interpolate(e, [0, 1], [0.7, 1]);
            return <Bubble msg={{ from: "out", text: typedMessage }} opacity={op} transform={`translateY(${y}px) scale(${sc})`} />;
          })()}

          {frame > sentFrame + 8 && frame < replyDelay && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}><TypingDots /></div>
          )}

          {frame >= replyDelay && (() => {
            const e = spring({ frame: frame - replyDelay, fps, config: { damping: 14, stiffness: 200 } });
            const op = interpolate(e, [0, 1], [0, 1]);
            const y = interpolate(e, [0, 1], [20, 0]);
            return (
              <Bubble msg={{ from: "in", text: reply }} opacity={op} transform={`translateY(${y}px)`} />
            );
          })()}
        </>
      }
    />
  );
};



const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        background: "#E9E9EB",
        borderRadius: 26,
        borderBottomLeftRadius: 8,
        padding: "18px 24px",
        display: "flex",
        gap: 10,
      }}
    >
      {[0, 1, 2].map((i) => {
        const o = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 5 - i * 0.8));
        return (
          <span
            key={i}
            style={{ width: 14, height: 14, borderRadius: 999, background: "#8E8E93", opacity: o }}
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

