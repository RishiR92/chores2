import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {loadFont} from "@remotion/google-fonts/InstrumentSans";

const {fontFamily} = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const C = {
  void: "#090B0C",
  graphite: "#111516",
  soft: "#F4F1E8",
  dim: "#898F8C",
  signal: "#72F2A6",
  amber: "#FFB45C",
  line: "#29302E",
};
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const r = (f: number, input: number[], output: number[]) => interpolate(f, input, output, clamp);
const ease = (f: number, at: number, duration = 28) => r(f, [at, at + duration], [0, 1]);
const fade = (f: number, a: number, b: number, c: number, d: number) =>
  r(f, [a, b], [0, 1]) * r(f, [c, d], [1, 0]);
const enter = (f: number, at: number) =>
  spring({frame: f - at, fps: 30, config: {damping: 200, stiffness: 150}});

type Format = {vertical: boolean};
type Vec = {x: number; y: number; z: number; phase: number};

const seeded = (n: number) => {
  const x = Math.sin(n * 91.733 + 19.19) * 43758.5453;
  return x - Math.floor(x);
};

const points: Vec[] = Array.from({length: 220}, (_, i) => ({
  x: seeded(i * 4) * 2 - 1,
  y: seeded(i * 4 + 1) * 2 - 1,
  z: seeded(i * 4 + 2),
  phase: seeded(i * 4 + 3) * Math.PI * 2,
}));

const WorldField: React.FC<Format & {pullBack?: number; focus?: number}> = ({vertical, pullBack = 0, focus = 0}) => {
  const f = useCurrentFrame();
  const w = vertical ? 1080 : 1920;
  const h = vertical ? 1920 : 1080;
  const cx = w * (vertical ? 0.5 : 0.58);
  const cy = h * 0.5;
  const spread = (vertical ? 620 : 880) * (1 + pullBack * 1.8);
  return <AbsoluteFill style={{overflow: "hidden"}}>
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <radialGradient id="fieldGlow">
          <stop offset="0" stopColor={C.signal} stopOpacity=".14"/>
          <stop offset=".5" stopColor={C.signal} stopOpacity=".025"/>
          <stop offset="1" stopColor={C.void} stopOpacity="0"/>
        </radialGradient>
        <filter id="softGlow"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={spread * .8} ry={spread * .55} fill="url(#fieldGlow)"/>
      {points.map((p, i) => {
        const depth = .18 + p.z * .82;
        const drift = Math.sin(f / 33 + p.phase) * (5 + depth * 9);
        const x = cx + p.x * spread * depth + drift;
        const y = cy + p.y * spread * (vertical ? .88 : .52) * depth + Math.cos(f / 41 + p.phase) * 6;
        const active = (i * 17) % 53 < 5;
        const pulse = active ? .55 + .45 * Math.sin(f / 6 + p.phase) : .24;
        const radius = (active ? 3.2 : 1.7) * depth * (1 + pullBack * .2);
        return <g key={i} opacity={pulse * (1 - focus * .55)}>
          {i % 9 === 0 && <path d={`M ${x - 22 * depth} ${y} Q ${x} ${y - 14 * depth} ${x + 22 * depth} ${y}`} fill="none" stroke={active ? C.signal : C.line} strokeWidth={Math.max(1, depth * 1.5)}/>} 
          <circle cx={x} cy={y} r={radius} fill={active ? C.signal : C.soft}/>
        </g>;
      })}
      <circle cx={cx} cy={cy} r={18 + Math.sin(f / 5) * 3} fill={C.signal} opacity={.9}/>
      <circle cx={cx} cy={cy} r={35 + Math.sin(f / 8) * 5} fill="none" stroke={C.signal} strokeWidth="2" opacity={.35}/>
    </svg>
  </AbsoluteFill>;
};

const Grain: React.FC = () => <AbsoluteFill style={{
  opacity: .035,
  mixBlendMode: "screen",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='2' seed='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
}}/>;

const Headline: React.FC<{children: React.ReactNode; size: number; style?: React.CSSProperties; accent?: boolean}> = ({children, size, style, accent}) =>
  <div style={{fontFamily, fontWeight: 600, fontSize: size, lineHeight: .95, letterSpacing: 0, color: accent ? C.signal : C.soft, ...style}}>{children}</div>;

const ScaleOpen: React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame();
  const zoom = r(f, [0, 145], [.66, 1.22]);
  const first = fade(f, 8, 18, 54, 64);
  const second = fade(f, 64, 76, 132, 147);
  return <AbsoluteFill style={{opacity: r(f, [142, 150], [1, 0]), transform: `scale(${zoom})`}}>
    <WorldField vertical={vertical}/>
    <div style={{position: "absolute", left: vertical ? 64 : 120, right: vertical ? 64 : 120, top: vertical ? 590 : 350}}>
      <Headline size={vertical ? 112 : 152} style={{opacity: first, transform: `translateY(${(1 - enter(f, 4)) * 36}px)`}}>
        thousands of people<br/>use <span style={{color: C.signal}}>asmi</span>
      </Headline>
      <Headline size={vertical ? 92 : 122} style={{opacity: second, position: "absolute", top: 0}}>
        to deal with<br/>the real world.
      </Headline>
    </div>
  </AbsoluteFill>;
};

const SpeakerNode: React.FC<{side: "asmi" | "business"; vertical: boolean; active: boolean; intensity: number}> = ({side, vertical, active, intensity}) => {
  const isLeft = side === "asmi";
  const size = vertical ? 170 : 200;
  return <div style={{position: "absolute", left: vertical ? "50%" : isLeft ? "24%" : "76%", top: vertical ? (isLeft ? "27%" : "65%") : "43%", transform: "translate(-50%,-50%)", width: size, height: size}}>
    {[1, 1.34, 1.7].map((s, i) => <div key={s} style={{position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${isLeft ? C.signal : C.amber}`, opacity: active ? .25 - i * .055 : .07, transform: `scale(${s + intensity * (.08 + i * .04)})`}}/>)}
    <div style={{position: "absolute", inset: size * .28, borderRadius: "50%", background: isLeft ? C.signal : C.amber, boxShadow: active ? `0 0 ${28 + intensity * 38}px ${isLeft ? C.signal : C.amber}` : "none", opacity: active ? 1 : .35}}/>
    <div style={{position: "absolute", top: size + 24, width: vertical ? 300 : 360, left: "50%", transform: "translateX(-50%)", textAlign: "center", fontFamily, color: active ? C.soft : C.dim, fontSize: vertical ? 25 : 22, fontWeight: 500}}>
      {isLeft ? "asmi · AI caller" : "Herman’s · AI host"}
    </div>
  </div>;
};

const Transcript: React.FC<{vertical: boolean; speaker: "ASMI" | "HERMAN’S"; text: string; progress: number}> = ({vertical, speaker, text, progress}) => {
  const words = text.split(" ");
  const count = Math.max(1, Math.ceil(words.length * progress));
  return <div style={{position: "absolute", left: vertical ? 62 : 330, right: vertical ? 62 : 330, bottom: vertical ? 285 : 86, minHeight: vertical ? 220 : 150}}>
    <div style={{fontFamily, color: speaker === "ASMI" ? C.signal : C.amber, fontSize: vertical ? 22 : 18, fontWeight: 600, marginBottom: 13}}>{speaker} · REAL CALL</div>
    <div style={{fontFamily, color: C.soft, fontWeight: 500, fontSize: vertical ? 48 : 42, lineHeight: 1.12, letterSpacing: 0}}>{words.slice(0, count).join(" ")}</div>
  </div>;
};

const CallWorld: React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame();
  const local = f - 145;
  const answer = local >= 5 && local < 226;
  const request = local >= 230 && local < 490;
  const vegan = local >= 495 && local < 675;
  const rotation = local >= 680 && local < 905;
  const activeLeft = request;
  const activeRight = answer || vegan || rotation;
  const intensity = .5 + .5 * Math.sin(f / 3.2) ** 2;
  const reveal = ease(local, 125, 20);
  const facts = [
    {at: 470, label: "AUG 21", color: C.signal},
    {at: 555, label: "FULLY VEGAN", color: C.amber},
    {at: 755, label: "MENU CHANGES DAILY", color: C.soft},
  ];
  let transcript: React.ReactNode = null;
  if (answer) transcript = <Transcript vertical={vertical} speaker="HERMAN’S" text="Yes, of course. I can help you with a booking, cancellation, or any questions about Herman’s. What can I do for John today?" progress={r(local, [5, 220], [0, 1])}/>;
  if (request) transcript = <Transcript vertical={vertical} speaker="ASMI" text="That’s great. John is looking to visit on August 21st and wanted to check what vegetarian menu options you’ll have available that day." progress={r(local, [230, 484], [0, 1])}/>;
  if (vegan) transcript = <Transcript vertical={vertical} speaker="HERMAN’S" text="I appreciate you asking. Just to clarify, Herman’s is fully vegan, so every dish on the buffet is plant-based." progress={r(local, [495, 668], [0, 1])}/>;
  if (rotation) transcript = <Transcript vertical={vertical} speaker="HERMAN’S" text="As for what’s available on August 21st specifically, the buffet rotates daily, so I can’t promise which exact dishes will be on the menu that day." progress={r(local, [680, 898], [0, 1])}/>;
  const dive = r(local, [0, 70], [1.7, 1]);
  return <AbsoluteFill style={{opacity: fade(f, 140, 148, 1050, 1062), transform: `scale(${dive})`}}>
    <WorldField vertical={vertical} focus={.8}/>
    <svg style={{position: "absolute", inset: 0}} width="100%" height="100%" viewBox={vertical ? "0 0 1080 1920" : "0 0 1920 1080"}>
      <defs><linearGradient id="signalPath"><stop stopColor={C.signal}/><stop offset="1" stopColor={C.amber}/></linearGradient></defs>
      <path d={vertical ? "M540 610 C 230 860 850 1030 540 1245" : "M560 465 C 820 260 1100 670 1460 465"} fill="none" stroke={C.line} strokeWidth={vertical ? 5 : 4}/>
      <path d={vertical ? "M540 610 C 230 860 850 1030 540 1245" : "M560 465 C 820 260 1100 670 1460 465"} fill="none" stroke="url(#signalPath)" strokeWidth={vertical ? 7 : 6} strokeDasharray="1400" strokeDashoffset={1400 * (1 - r(local, [0, 180], [0, 1]))}/>
    </svg>
    <SpeakerNode side="asmi" vertical={vertical} active={activeLeft} intensity={intensity}/>
    <SpeakerNode side="business" vertical={vertical} active={activeRight} intensity={intensity}/>
    <div style={{position: "absolute", left: vertical ? 62 : 110, top: vertical ? 170 : 64, opacity: fade(local, 70, 100, 215, 230)}}>
      <Headline size={vertical ? 52 : 55} style={{color: C.dim}}>the voice that answered?</Headline>
      <Headline size={vertical ? 90 : 94} accent style={{marginTop: 10, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`}}>also AI.</Headline>
    </div>
    {facts.map((fact) => {
      const p = enter(local, fact.at);
      return <div key={fact.label} style={{position: "absolute", left: vertical ? "50%" : "50%", top: vertical ? 915 + facts.indexOf(fact) * 95 : 270 + facts.indexOf(fact) * 72, transform: `translate(-50%,-50%) scale(${.65 + .35 * p})`, opacity: p, fontFamily, color: fact.color, borderBottom: `2px solid ${fact.color}`, paddingBottom: 8, fontWeight: 600, fontSize: vertical ? 29 : 24, letterSpacing: 0}}>{fact.label}</div>;
    })}
    {transcript}
  </AbsoluteFill>;
};

const Insight: React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame();
  const local = f - 1055;
  const pull = r(local, [0, 75], [.2, 1]);
  return <AbsoluteFill style={{opacity: fade(f, 1052, 1060, 1110, 1120)}}>
    <WorldField vertical={vertical} pullBack={pull}/>
    <div style={{position: "absolute", left: vertical ? 62 : 120, right: vertical ? 62 : 120, top: vertical ? 565 : 345}}>
      <Headline size={vertical ? 82 : 110} style={{opacity: fade(local, 6, 14, 47, 58)}}>AI is starting to<br/>answer the phone.</Headline>
      <Headline size={vertical ? 78 : 106} accent style={{position: "absolute", top: 0, opacity: ease(local, 51, 12)}}>asmi already knows<br/>how to talk to it.</Headline>
    </div>
  </AbsoluteFill>;
};

const End: React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame();
  const local = f - 1118;
  const p = enter(local, 0);
  return <AbsoluteFill style={{background: C.void, opacity: ease(f, 1118, 10), display: "flex", alignItems: "center", justifyContent: "center"}}>
    <div style={{position: "absolute", width: vertical ? 850 : 1080, height: vertical ? 340 : 300, transform: `scale(${.84 + .16 * p})`, opacity: p}}>
      <Img src={staticFile("brand/asmi-logo-white.png")} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
    </div>
    <div style={{position: "absolute", top: vertical ? 1160 : 735, fontFamily, color: C.soft, fontSize: vertical ? 36 : 32, fontWeight: 400, opacity: ease(local, 8, 16)}}>built for whoever answers.</div>
    <div style={{position: "absolute", width: 8, height: 8, borderRadius: "50%", background: C.signal, top: vertical ? 1045 : 670, boxShadow: `0 0 28px ${C.signal}`, opacity: .7 + .3 * Math.sin(f / 8)}}/>
  </AbsoluteFill>;
};

export const AiToAiFilmV2: React.FC<Format> = ({vertical}) => <AbsoluteFill style={{background: C.void, overflow: "hidden"}}>
  <ScaleOpen vertical={vertical}/>
  <CallWorld vertical={vertical}/>
  <Insight vertical={vertical}/>
  <End vertical={vertical}/>
  <Grain/>
  <Audio src={staticFile("audio/ai-to-ai-v2/score.mp3")} volume={(f) => r(f, [0, 120, 145, 1038, 1048, 1060, 1110, 1145, 1169], [.72, .8, .13, .13, .13, .55, .8, .52, .28])}/>
  <Sequence from={150} durationInFrames={217}><Audio src={staticFile("audio/ai-to-ai-v2/01-answer.mp3")} volume={1.18}/></Sequence>
  <Sequence from={375} durationInFrames={255}><Audio src={staticFile("audio/ai-to-ai-v2/02-request.mp3")} volume={1.18}/></Sequence>
  <Sequence from={640} durationInFrames={175}><Audio src={staticFile("audio/ai-to-ai-v2/03-vegan.mp3")} volume={1.18}/></Sequence>
  <Sequence from={825} durationInFrames={221}><Audio src={staticFile("audio/ai-to-ai-v2/04-rotation.mp3")} volume={1.18}/></Sequence>
</AbsoluteFill>;