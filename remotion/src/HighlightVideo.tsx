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
  useVideoConfig,
} from "remotion";
import {loadFont as loadDisplay} from "@remotion/google-fonts/BricolageGrotesque";
import {loadFont as loadSerif} from "@remotion/google-fonts/InstrumentSerif";
import {loadFont as loadMono} from "@remotion/google-fonts/SpaceMono";

const {fontFamily: display} = loadDisplay("normal", {weights: ["500", "600", "700", "800"], subsets: ["latin"]});
const {fontFamily: serif} = loadSerif("normal", {weights: ["400"], subsets: ["latin"]});
const {fontFamily: mono} = loadMono("normal", {weights: ["400", "700"], subsets: ["latin"]});

const C = {
  paper: "#FBF7F0",
  ink: "#141318",
  blue: "#2F5BFF",
  coral: "#FF5A47",
  citrus: "#E8FF5A",
  mint: "#35D6A4",
  cream: "#FFFDF8",
  dim: "#7C7887",
};

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const SCENES = {hook: 0, plan: 60, act: 180, chase: 300, end: 420};
const TOTAL = 540;

const Grain = () => (
  <AbsoluteFill style={{pointerEvents: "none", opacity: 0.13, mixBlendMode: "multiply", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")"}} />
);

const Grid = () => (
  <AbsoluteFill style={{pointerEvents: "none", opacity: 0.35, backgroundImage: "linear-gradient(rgba(20,19,24,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(20,19,24,.07) 1px,transparent 1px)", backgroundSize: "32px 32px"}} />
);

const enter = (frame: number, fps: number, delay = 0) => spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 240, mass: 0.72}});

const ChaosChip: React.FC<{text: string; x: number; y: number; rotate: number; delay: number; vertical: boolean}> = ({text, x, y, rotate, delay, vertical}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(f, fps, delay);
  const fly = interpolate(f, [42, 58], [0, 1], clamp);
  return <div style={{position: "absolute", left: `${x}%`, top: `${y}%`, padding: vertical ? "14px 19px" : "11px 18px", background: C.cream, border: `2px solid ${C.ink}`, boxShadow: `5px 5px 0 ${C.ink}`, borderRadius: 8, fontFamily: mono, fontSize: vertical ? 23 : 20, fontWeight: 700, transform: `translate(${(1-s)*80 + fly*900}px, ${(1-s)*30 - fly*100}px) rotate(${rotate + fly*14}deg)`, opacity: s * (1-fly)}}>{text}</div>;
};

const Hook: React.FC<{vertical: boolean}> = ({vertical}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = enter(f, fps, 20);
  const stamp = enter(f, fps, 31);
  return <AbsoluteFill style={{background: C.paper, overflow: "hidden"}}>
    <Grid/><Grain/>
    <ChaosChip text="ON HOLD" x={vertical ? 4 : 8} y={vertical ? 14 : 12} rotate={-7} delay={0} vertical={vertical}/>
    <ChaosChip text="VOICEMAIL" x={vertical ? 50 : 61} y={vertical ? 8 : 18} rotate={5} delay={4} vertical={vertical}/>
    <ChaosChip text="NO SLOTS" x={vertical ? 10 : 70} y={vertical ? 70 : 70} rotate={4} delay={8} vertical={vertical}/>
    <ChaosChip text="CALL US BACK" x={vertical ? 45 : 14} y={vertical ? 79 : 66} rotate={-4} delay={12} vertical={vertical}/>
    <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: vertical ? 74 : 120, textAlign: "center", transform: `translateY(${(1-title)*50}px) scale(${0.9 + title*0.1})`, opacity: title}}>
      <div style={{fontFamily: display, fontWeight: 800, fontSize: vertical ? 104 : 116, lineHeight: 0.9, letterSpacing: 0, maxWidth: vertical ? 900 : 1320}}>the most <span style={{color: C.coral}}>irritating</span> assistant in the world.</div>
      <div style={{marginTop: vertical ? 48 : 34, background: C.citrus, border: `3px solid ${C.ink}`, padding: "13px 22px", transform: `rotate(-1.5deg) scale(${stamp})`, fontFamily: mono, fontSize: vertical ? 24 : 20, fontWeight: 700}}>annoying to them. invisible to you.</div>
    </div>
  </AbsoluteFill>;
};

const places = [
  {name: "The Harlequin", img: "images/place-veg.jpg", rating: "4.3", meta: "0.3 mi · open till 11"},
  {name: "Wayfare Tavern", img: "images/place-tavern.jpg", rating: "4.9", meta: "highest rated · $$"},
  {name: "Horsefeather", img: "images/place-bar.jpg", rating: "4.4", meta: "big tables · 1.2 mi"},
];

const Plan: React.FC<{vertical: boolean}> = ({vertical}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubble = enter(f, fps, 0);
  return <AbsoluteFill style={{background: C.paper, padding: vertical ? "150px 54px 90px" : "80px 110px", overflow: "hidden"}}>
    <Grid/><Grain/>
    <div style={{display: "flex", flexDirection: vertical ? "column" : "row", height: "100%", alignItems: "center", justifyContent: "center", gap: vertical ? 72 : 90}}>
      <div style={{width: vertical ? "100%" : 660, zIndex: 2}}>
        <div style={{marginLeft: "auto", width: "fit-content", maxWidth: vertical ? 820 : 620, background: C.blue, color: C.cream, borderRadius: 34, borderBottomRightRadius: 8, padding: vertical ? "24px 30px" : "20px 25px", fontFamily: display, fontWeight: 600, fontSize: vertical ? 39 : 31, transform: `translateY(${(1-bubble)*40}px) scale(${0.9+bubble*0.1})`, opacity: bubble}}>dinner for 5. actual veg food.</div>
        <div style={{marginTop: 34, fontFamily: display, fontWeight: 800, fontSize: vertical ? 78 : 82, lineHeight: 0.95}}>she plans it<br/><span style={{color: C.blue}}>with you.</span></div>
        <div style={{fontFamily: mono, fontSize: vertical ? 21 : 18, marginTop: 22, color: C.dim}}>no ten tabs. no wall of text.</div>
      </div>
      <div style={{width: vertical ? "100%" : 780, display: "flex", flexDirection: vertical ? "column" : "row", gap: vertical ? 18 : 16, zIndex: 2}}>
        {places.map((p, i) => {
          const s = enter(f, fps, 16+i*6);
          const selected = i === 1 && f > 62;
          return <div key={p.name} style={{display: "flex", flexDirection: vertical ? "row" : "column", width: vertical ? "100%" : 245, height: vertical ? 168 : 330, padding: 12, gap: 14, borderRadius: 16, background: selected ? C.citrus : C.cream, border: `${selected ? 4 : 2}px solid ${C.ink}`, boxShadow: selected ? `8px 8px 0 ${C.ink}` : "none", transform: `translateX(${(1-s)*180}px) rotate(${selected ? -1.2 : 0}deg)`, opacity: s}}>
            <Img src={staticFile(p.img)} style={{width: vertical ? 142 : "100%", height: vertical ? "100%" : 185, objectFit: "cover", borderRadius: 10}}/>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0}}>
              <div style={{fontFamily: display, fontWeight: 800, fontSize: vertical ? 27 : 25, lineHeight: 1}}>{p.name}</div>
              <div style={{fontFamily: mono, fontSize: vertical ? 17 : 15, marginTop: 11}}>★ {p.rating}</div>
              <div style={{fontFamily: mono, fontSize: vertical ? 15 : 13, color: C.dim, marginTop: 6}}>{p.meta}</div>
              {selected && <div style={{fontFamily: mono, fontWeight: 700, fontSize: vertical ? 15 : 13, color: C.coral, marginTop: 10}}>HER PICK ✓</div>}
            </div>
          </div>;
        })}
      </div>
    </div>
  </AbsoluteFill>;
};

const Wave: React.FC<{frame: number; vertical: boolean}> = ({frame, vertical}) => <div style={{height: vertical ? 100 : 74, display: "flex", gap: vertical ? 7 : 6, justifyContent: "center", alignItems: "center"}}>{Array.from({length: vertical ? 52 : 46}).map((_,i)=><div key={i} style={{width: vertical ? 7 : 6, height: 12 + Math.abs(Math.sin(frame/3.8+i*0.67))* (vertical ? 76 : 52), borderRadius: 7, background: C.coral}}/>)}</div>;

const Act: React.FC<{vertical: boolean}> = ({vertical}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = enter(f, fps, 2);
  const status = f < 45 ? "calling now" : f < 83 ? "on hold" : "booked. 7:30.";
  const done = f >= 83;
  return <AbsoluteFill style={{background: C.ink, color: C.cream, padding: vertical ? "170px 62px 100px" : "90px 120px", overflow: "hidden"}}>
    <Grain/>
    <div style={{display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "center", justifyContent: "center", gap: vertical ? 90 : 150, height: "100%"}}>
      <div style={{fontFamily: display, fontWeight: 800, fontSize: vertical ? 95 : 110, lineHeight: 0.9, width: vertical ? "100%" : 650}}>then she<br/><span style={{color: C.citrus}}>gets it done.</span></div>
      <div style={{width: vertical ? "100%" : 720, border: `2px solid ${C.cream}33`, borderRadius: 22, padding: vertical ? 40 : 34, background: "rgba(255,253,248,.06)", transform: `scale(${0.9+card*0.1})`, opacity: card}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}><span style={{fontFamily: mono, fontSize: vertical ? 21 : 18, color: C.citrus}}>ASMI → WAYFARE TAVERN</span><span style={{fontFamily: mono, fontSize: vertical ? 21 : 18}}>{done ? "✓" : "● 00:"+String(Math.floor(f/3)).padStart(2,"0")}</span></div>
        <div style={{width: vertical ? 180 : 140, height: vertical ? 180 : 140, margin: vertical ? "72px auto 44px" : "45px auto 26px", borderRadius: "50%", display: "grid", placeItems: "center", background: done ? C.mint : C.coral, color: C.ink, fontFamily: serif, fontStyle: "italic", fontSize: vertical ? 100 : 78, boxShadow: `0 0 0 ${10 + Math.sin(f/5)*7}px ${done ? C.mint : C.coral}33`}}>a</div>
        <Wave frame={f} vertical={vertical}/>
        <div style={{marginTop: 30, background: done ? C.mint : C.cream, color: C.ink, borderRadius: 12, padding: vertical ? "22px 26px" : "17px 22px", fontFamily: display, fontWeight: 800, fontSize: vertical ? 36 : 30, textAlign: "center"}}>{status}</div>
      </div>
    </div>
  </AbsoluteFill>;
};

const receipts = [
  {text: "dentist", sub: "tues 8:30", color: C.blue},
  {text: "HVAC", sub: "saturday 9am", color: C.coral},
  {text: "$60 back", sub: "refund landed", color: C.mint},
];
const langs = ["English", "中文", "हिन्दी", "Español", "العربية", "Français", "বাংলা", "Português", "日本語", "한국어"];

const Chase: React.FC<{vertical: boolean}> = ({vertical}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const langT = interpolate(f, [68, 98], [0, 1], clamp);
  return <AbsoluteFill style={{background: C.paper, overflow: "hidden", padding: vertical ? "130px 44px" : "70px 95px"}}>
    <Grid/><Grain/>
    <div style={{fontFamily: mono, fontWeight: 700, fontSize: vertical ? 22 : 20, color: C.coral, textAlign: "center"}}>CALL → VOICEMAIL → EMAIL → CALL AGAIN</div>
    <div style={{height: vertical ? 680 : 420, marginTop: vertical ? 95 : 60, display: "flex", flexDirection: vertical ? "column" : "row", justifyContent: "center", alignItems: "center", gap: vertical ? 22 : 30}}>
      {receipts.map((r,i)=>{const s=enter(f,fps,8+i*9); return <div key={r.text} style={{width: vertical ? "86%" : 390, padding: vertical ? "28px 32px" : "25px 28px", border: `3px solid ${C.ink}`, borderRadius: 12, background: C.cream, boxShadow: `7px 7px 0 ${C.ink}`, transform: `translateY(${(1-s)*70}px) rotate(${[-2,1,-1][i]}deg)`, opacity: s*(1-langT)}}><div style={{fontFamily: display, fontSize: vertical ? 42 : 38, fontWeight: 800}}>{r.text}</div><div style={{fontFamily: mono, fontSize: vertical ? 20 : 17, marginTop: 7, color: r.color}}>✓ {r.sub}</div></div>})}
    </div>
    <div style={{position: "absolute", inset: 0, opacity: langT, transform: `scale(${0.8+langT*0.2})`}}>
      {langs.map((l,i)=>{const angle=i/langs.length*Math.PI*2; const rx=vertical?360:650; const ry=vertical?500:340; return <div key={l} style={{position:"absolute", left:`calc(50% + ${Math.cos(angle)*rx}px)`, top:`calc(50% + ${Math.sin(angle)*ry}px)`, transform:"translate(-50%,-50%)", fontFamily: i>0&&i<5?display:serif, fontSize: vertical ? 34+(i%3)*8 : 30+(i%3)*8, fontWeight: i<5?700:400, color:i<5?C.coral:C.ink, whiteSpace:"nowrap"}}>{l}</div>})}
      <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",textAlign:"center",fontFamily:display,fontWeight:800,fontSize:vertical?105:118,lineHeight:.88}}>50+<br/><span style={{color:C.coral}}>languages.</span></div>
    </div>
    <div style={{position:"absolute",left:0,right:0,bottom:vertical?95:48,textAlign:"center",fontFamily:display,fontWeight:800,fontSize:vertical?42:42}}>whatever it takes is kind of the point.</div>
  </AbsoluteFill>;
};

const IMessage = () => <div style={{width: 52,height:52,borderRadius:15,background:C.blue,color:C.cream,display:"grid",placeItems:"center",fontSize:30}}>●</div>;
const WhatsApp = () => <div style={{width:52,height:52,borderRadius:"50%",background:"#25D366",color:C.cream,display:"grid",placeItems:"center",fontSize:28}}>☎</div>;

const End: React.FC<{vertical:boolean}> = ({vertical}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const s=enter(f,fps,0); const icons=enter(f,fps,42); const line=interpolate(f,[20,46],[0,1],clamp);
  return <AbsoluteFill style={{background:C.paper,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:vertical?70:120,overflow:"hidden"}}><Grid/><Grain/><div style={{opacity:s,transform:`translateY(${(1-s)*50}px)`}}><div style={{fontFamily:serif,fontStyle:"italic",fontSize:vertical?250:280,lineHeight:.8}}>asmi</div><div style={{height:14,width:vertical?530:650,background:C.coral,transform:`rotate(-1deg) scaleX(${line})`,transformOrigin:"left",margin:"30px auto 42px",borderRadius:8}}/><div style={{fontFamily:display,fontWeight:800,fontSize:vertical?68:72,lineHeight:.95}}>she doesn't stop<br/>until it's done.</div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:18,marginTop:52,opacity:icons,transform:`scale(${0.8+icons*.2})`}}><span style={{fontFamily:mono,fontWeight:700,fontSize:vertical?22:19}}>TEXT ASMI</span><IMessage/><WhatsApp/></div></div></AbsoluteFill>;
};

export const HighlightVideo: React.FC<{vertical?: boolean}> = ({vertical=false}) => {
  const frame=useCurrentFrame();
  const musicVolume=(f:number)=>{
    const fadeIn=interpolate(f,[0,10],[0,0.62],clamp); const fadeOut=interpolate(f,[TOTAL-28,TOTAL-2],[1,0],clamp);
    const callDuck=interpolate(f,[SCENES.act-10,SCENES.act+8,SCENES.chase-15,SCENES.chase+4],[1,.06,.06,1],clamp);
    return fadeIn*fadeOut*callDuck;
  };
  return <AbsoluteFill style={{fontFamily:display,background:C.paper}}>
    <Sequence from={SCENES.hook} durationInFrames={60}><Hook vertical={vertical}/></Sequence>
    <Sequence from={SCENES.plan} durationInFrames={120}><Plan vertical={vertical}/></Sequence>
    <Sequence from={SCENES.act} durationInFrames={120}><Act vertical={vertical}/></Sequence>
    <Sequence from={SCENES.chase} durationInFrames={120}><Chase vertical={vertical}/></Sequence>
    <Sequence from={SCENES.end} durationInFrames={120}><End vertical={vertical}/></Sequence>
    <Sequence from={12} durationInFrames={25}><Audio src={staticFile("audio/sfx/imessage-receive.mp3")} volume={0.7}/></Sequence>
    <Sequence from={SCENES.plan+10} durationInFrames={25}><Audio src={staticFile("audio/sfx/imessage-receive.mp3")} volume={0.75}/></Sequence>
    <Sequence from={SCENES.act+8} durationInFrames={112}><Audio src={staticFile("audio/trimmed/hvac.mp3")} trimBefore={16} volume={1.65}/></Sequence>
    <Sequence from={SCENES.end+48} durationInFrames={24}><Audio src={staticFile("audio/sfx/wa-pop.mp3")} volume={0.8}/></Sequence>
    <Audio src={staticFile("audio/bgm.mp3")} volume={musicVolume}/>
    <div style={{position:"absolute",left:vertical?26:35,bottom:vertical?30:22,fontFamily:mono,fontSize:vertical?14:12,color:frame<SCENES.act?C.ink:C.dim,opacity:.48}}>ASMI / PERSONAL AI</div>
  </AbsoluteFill>;
};