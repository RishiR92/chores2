import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {loadFont} from "@remotion/google-fonts/InstrumentSans";

const {fontFamily} = loadFont("normal", {weights: ["400", "500", "600", "700"], subsets: ["latin"]});

const C = {void:"#080A0B", soft:"#F4F1E8", dim:"#8B918E", signal:"#6FF3A5", amber:"#FFB55F", line:"#25302B"};
const clamp = {extrapolateLeft:"clamp" as const, extrapolateRight:"clamp" as const};
const r = (f:number, i:number[], o:number[]) => interpolate(f, i, o, clamp);
const ease = (t:number) => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const pop = (f:number, at:number, damping=200, stiffness=155) => spring({frame:f-at, fps:30, config:{damping, stiffness}});
type Format = {vertical:boolean};

const rnd = (i:number, s:number) => ((Math.sin(i*127.1+s*311.7)*43758.5453)%1+1)%1;

/* ── global magnetic force curve ─────────────────────────────────────────
   +1 = dots repelled outward (clear pocket for type)
   -1 = dots rushing back toward the centre                              */
const FORCE = [0, 140, 250, 600, 636, 690, 752, 880, 902, 1060, 1090];
const FVAL  = [1, 1,   .86, .86, .48,  -.3,  .08,  .12, .92,  .92,  1.25];

const forceAt = (f:number) => {
  for (let i=0;i<FORCE.length-1;i++) {
    if (f<=FORCE[i+1]) {
      const t = ease(r(f,[FORCE[i],FORCE[i+1]],[0,1]));
      return FVAL[i]+(FVAL[i+1]-FVAL[i])*t;
    }
  }
  return FVAL[FVAL.length-1];
};

const DOTS = Array.from({length:130},(_,i)=>{
  const a = rnd(i,1)*Math.PI*2;
  const rad = .18+Math.pow(rnd(i,2),.62)*.92;
  return {a, rad, depth:.35+rnd(i,3)*.65, ai:rnd(i,4)>.74, phase:rnd(i,5)*Math.PI*2, lag:Math.floor(rnd(i,6)*16)};
});

const PAIRS = Array.from({length:11},(_,i)=>({
  x:.12+rnd(i,11)*.76, y:.14+rnd(i,12)*.72,
  dx:(rnd(i,13)-.5)*.3, dy:(rnd(i,14)-.5)*.22,
  start:770+Math.floor(rnd(i,15)*84), speed:34+rnd(i,16)*24,
}));

const MagneticField:React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame();
  const w = vertical?1080:1920, h = vertical?1920:1080;
  const cx = w/2, cy = vertical?h*.52:h*.5;
  const amp = vertical?560:700;
  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <radialGradient id="v4core"><stop stopColor={C.signal} stopOpacity=".16"/><stop offset="1" stopColor={C.void} stopOpacity="0"/></radialGradient>
          <radialGradient id="v4mask"><stop stopColor={C.void} stopOpacity=".92"/><stop offset=".62" stopColor={C.void} stopOpacity=".55"/><stop offset="1" stopColor={C.void} stopOpacity="0"/></radialGradient>
        </defs>
        <rect width={w} height={h} fill={C.void}/>
        <ellipse cx={cx} cy={cy} rx={w*.6} ry={h*.58} fill="url(#v4core)"/>
        {DOTS.map((p,i)=>{
          const force = forceAt(f-p.lag);
          const drift = Math.sin(f/46+p.phase)*18;
          const rad = (p.rad + force*p.depth*.52)*amp + drift;
          const x = cx+Math.cos(p.a)*rad*(vertical?.72:1);
          const y = cy+Math.sin(p.a)*rad*(vertical?1.12:.78);
          const pulse = .5+.5*Math.sin(f/9+p.phase)**2;
          const near = Math.max(0, 1-Math.abs(rad)/(amp*.5));
          const op = (p.ai?.78:.3)*(1-near*.75);
          return (
            <g key={i} opacity={op}>
              {p.ai && <circle cx={x} cy={y} r={(5+4*pulse)*p.depth} fill={C.signal} opacity={.35}/>}
              <circle cx={x} cy={y} r={p.ai?3.4*p.depth+1.6:2*p.depth} fill={p.ai?C.signal:C.soft}/>
            </g>
          );
        })}
        <ellipse cx={cx} cy={cy} rx={w*.62} ry={h*.46} fill="url(#v4mask)" opacity={r(forceAt(f),[.2,1],[.2,.92])}/>
      </svg>
    </AbsoluteFill>
  );
};

/* ── word-built phrase that drifts back in depth instead of cutting ───── */
const Phrase:React.FC<{
  vertical:boolean; start:number; exit:number; text:string; accent?:string;
  size?:number; top?:number; color?:string;
}> = ({vertical,start,exit,text,accent,size,top,color}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const out = r(f,[exit,exit+26],[0,1]);
  const inAll = r(f,[start,start+6],[0,1]);
  if (f < start-2 || f > exit+30) return null;
  return (
    <div style={{
      position:"absolute", left:vertical?64:132, right:vertical?64:132,
      top:top ?? (vertical?600:352),
      transformOrigin:"left center",
      transform:`scale(${1-out*.2}) translateY(${-out*62}px)`,
      opacity:(1-out*.9)*inAll,
      filter:out>0?`blur(${out*3}px)`:undefined,
    }}>
      <div style={{fontFamily,fontWeight:600,fontSize:size??(vertical?82:104),lineHeight:1.0,color:color??C.soft,display:"flex",flexWrap:"wrap",gap:vertical?"0 20px":"0 24px"}}>
        {words.map((wd,i)=>{
          const s = pop(f, start+i*2.4, 22, 150);
          const isAccent = accent && wd.replace(/[.,]/g,"").toLowerCase()===accent.toLowerCase();
          return (
            <span key={i} style={{
              display:"inline-block",
              transform:`translateY(${(1-s)*46}px) scale(${isAccent?.96+s*.1:1})`,
              opacity:s,
              color:isAccent?C.signal:undefined,
              fontWeight:isAccent?700:undefined,
            }}>{wd}</span>
          );
        })}
      </div>
    </div>
  );
};

const nodePos = (vertical:boolean, asmi:boolean) => vertical
  ? {x:540, y:asmi?640:1300}
  : {x:asmi?520:1400, y:540};

const bez = (p0:{x:number,y:number}, p1:{x:number,y:number}, bow:number, t:number) => {
  const mx=(p0.x+p1.x)/2, my=(p0.y+p1.y)/2;
  const nx=-(p1.y-p0.y), ny=(p1.x-p0.x);
  const len=Math.hypot(nx,ny)||1;
  const cxp=mx+nx/len*bow, cyp=my+ny/len*bow;
  const u=1-t;
  return {x:u*u*p0.x+2*u*t*cxp+t*t*p1.x, y:u*u*p0.y+2*u*t*cyp+t*t*p1.y};
};

const Node:React.FC<{vertical:boolean;asmi:boolean;active:boolean;label:boolean}> = ({vertical,asmi,active,label}) => {
  const f = useCurrentFrame();
  const p = nodePos(vertical,asmi);
  const col = asmi?C.signal:C.amber;
  const size = vertical?140:150;
  return (
    <div style={{position:"absolute",left:p.x,top:p.y,transform:"translate(-50%,-50%)",width:size,height:size}}>
      {[1,1.45,1.9].map((s,i)=>(
        <div key={s} style={{position:"absolute",inset:0,borderRadius:"50%",border:`1px solid ${col}`,opacity:active?.3-i*.07:.08,transform:`scale(${s+(active?Math.sin(f/5)**2*.1:0)})`}}/>
      ))}
      <div style={{position:"absolute",inset:size*.33,borderRadius:"50%",background:col,opacity:active?1:.34,boxShadow:active?`0 0 48px ${col}`:"none"}}/>
      {label && (
        <div style={{position:"absolute",top:size+18,left:"50%",width:vertical?320:360,transform:"translateX(-50%)",textAlign:"center",fontFamily,color:active?C.soft:C.dim,fontWeight:600,fontSize:vertical?22:19,letterSpacing:.6}}>
          {asmi?"ASMI · AI CALLER":"HERMAN’S · AI HOST"}
        </div>
      )}
    </div>
  );
};

const Caption:React.FC<{vertical:boolean;speaker:string;color:string;text:string;progress:number}> = ({vertical,speaker,color,text,progress}) => {
  const words = text.split(" ");
  const n = Math.max(1, Math.ceil(words.length*progress));
  return (
    <div style={{position:"absolute",left:vertical?58:300,right:vertical?58:300,bottom:vertical?250:70,minHeight:vertical?240:130}}>
      <div style={{fontFamily,color,fontWeight:700,fontSize:vertical?20:16,marginBottom:12,letterSpacing:1.2}}>ONE REAL ASMI CALL · {speaker}</div>
      <div style={{fontFamily,color:C.soft,fontWeight:500,fontSize:vertical?52:48,lineHeight:1.12}}>{words.slice(0,n).join(" ")}</div>
    </div>
  );
};

/* ── the proof call ───────────────────────────────────────────────────── */
const Proof:React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame(), l = f-240;
  const answer = l>=15&&l<58, request = l>=75&&l<292, vegan = l>=305&&l<382;
  let caption:React.ReactNode = null;
  if (answer) caption = <Caption vertical={vertical} speaker="HERMAN’S" color={C.amber} text="What can I do for John today?" progress={r(l,[15,50],[0,1])}/>;
  if (request) caption = <Caption vertical={vertical} speaker="ASMI" color={C.signal} text="John is looking to visit on August 21st and wanted to check what vegetarian menu options you’ll have available that day." progress={r(l,[75,282],[0,1])}/>;
  if (vegan) caption = <Caption vertical={vertical} speaker="HERMAN’S" color={C.amber} text="Just to clarify, Herman’s is fully vegan." progress={r(l,[305,376],[0,1])}/>;
  const a = nodePos(vertical,true), b = nodePos(vertical,false);
  const bow = vertical?260:-220;
  const draw = r(l,[0,70],[0,1]);
  const pts:string[] = [];
  for (let t=0;t<=1.0001;t+=1/48) pts.push(`${bez(a,b,bow,t).x},${bez(a,b,bow,t).y}`);
  // live signal travelling toward whoever speaks
  const travel = answer ? r(l,[15,52],[1,0]) : request ? r(l,[75,270],[0,1]) : vegan ? r(l,[305,372],[1,0]) : -1;
  const sig = travel>=0 ? bez(a,b,bow,travel) : null;
  return (
    <AbsoluteFill style={{opacity:r(f,[236,246],[0,1])*r(f,[626,640],[1,0])}}>
      <svg style={{position:"absolute",inset:0}} width="100%" height="100%" viewBox={vertical?"0 0 1080 1920":"0 0 1920 1080"}>
        <defs><linearGradient id="v4path"><stop stopColor={C.signal}/><stop offset="1" stopColor={C.amber}/></linearGradient></defs>
        <polyline points={pts.join(" ")} fill="none" stroke="url(#v4path)" strokeWidth={vertical?6:4} opacity=".55" strokeDasharray="2600" strokeDashoffset={2600*(1-draw)}/>
        {sig && <>
          <circle cx={sig.x} cy={sig.y} r={vertical?26:22} fill={travel>.5?C.amber:C.signal} opacity=".18"/>
          <circle cx={sig.x} cy={sig.y} r={vertical?11:9} fill={C.soft}/>
        </>}
      </svg>
      <Node vertical={vertical} asmi active={request} label/>
      <Node vertical={vertical} asmi={false} active={answer||vegan} label/>
      {caption}
    </AbsoluteFill>
  );
};

/* ── wordless insight: the exchange replays, then multiplies ──────────── */
const Exchange:React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame(), l = f-636;
  const a = nodePos(vertical,true), b = nodePos(vertical,false);
  const bow = vertical?260:-220;
  const trips = [
    {s:8,  e:52,  from:a, to:b, col:C.signal},
    {s:56, e:100, from:b, to:a, col:C.amber},
    {s:104,e:142, from:a, to:b, col:C.signal},
    {s:146,e:182, from:b, to:a, col:C.amber},
  ];
  const vis = r(f,[632,644],[0,1])*r(f,[840,880],[1,0]);
  return (
    <AbsoluteFill style={{opacity:vis}}>
      <svg style={{position:"absolute",inset:0}} width="100%" height="100%" viewBox={vertical?"0 0 1080 1920":"0 0 1920 1080"}>
        <polyline points={Array.from({length:49},(_,i)=>{const p=bez(a,b,bow,i/48);return `${p.x},${p.y}`;}).join(" ")} fill="none" stroke={C.line} strokeWidth={vertical?5:3} opacity=".7"/>
        {trips.map((t,i)=>{
          if (l<t.s||l>t.e+8) return null;
          const prog = r(l,[t.s,t.e],[0,1]);
          const fwd = t.from===a;
          const pt = bez(a,b,bow,fwd?prog:1-prog);
          const tail = bez(a,b,bow,Math.max(0,Math.min(1,fwd?prog-.12:1-prog+.12)));
          const land = r(l,[t.e-4,t.e+8],[0,1]);
          const endP = fwd?b:a;
          return (
            <g key={i}>
              <line x1={tail.x} y1={tail.y} x2={pt.x} y2={pt.y} stroke={t.col} strokeWidth={vertical?9:7} strokeLinecap="round" opacity={.65*(1-land)}/>
              <circle cx={pt.x} cy={pt.y} r={vertical?18:15} fill={t.col} opacity={(1-land)*.9}/>
              {land>0 && <circle cx={endP.x} cy={endP.y} r={40+land*(vertical?150:130)} fill="none" stroke={t.col} strokeWidth={3} opacity={(1-land)*.7}/>}
            </g>
          );
        })}
      </svg>
      <Node vertical={vertical} asmi active={l>=8&&l<52||l>=104&&l<142} label={l<40}/>
      <Node vertical={vertical} asmi={false} active={l>=56&&l<100||l>=146&&l<182} label={l<40}/>
    </AbsoluteFill>
  );
};

const Swarm:React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame();
  const w = vertical?1080:1920, h = vertical?1920:1080;
  const vis = r(f,[752,800],[0,1])*r(f,[884,906],[1,0]);
  if (vis<=0) return null;
  return (
    <AbsoluteFill style={{opacity:vis}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
        {PAIRS.map((p,i)=>{
          const x1=p.x*w, y1=p.y*h, x2=(p.x+p.dx)*w, y2=(p.y+p.dy)*h;
          const born = r(f,[p.start,p.start+18],[0,1]);
          const t = (Math.sin((f-p.start)/p.speed*Math.PI)+1)/2;
          const px = x1+(x2-x1)*t, py = y1+(y2-y1)*t;
          const rr = vertical?9:7;
          return (
            <g key={i} opacity={born}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth={2} opacity=".85"/>
              <circle cx={x1} cy={y1} r={rr} fill={C.signal} opacity=".85"/>
              <circle cx={x2} cy={y2} r={rr} fill={C.amber} opacity=".85"/>
              <circle cx={px} cy={py} r={rr*.8} fill={C.soft}/>
              <circle cx={px} cy={py} r={rr*2.4} fill={C.soft} opacity=".15"/>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const End:React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame(), l = f-1074, p = pop(l,0);
  if (l<-4) return null;
  return (
    <AbsoluteFill style={{background:C.void,opacity:r(l,[0,10],[0,1]),display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Img src={staticFile("brand/asmi-logo-white.png")} style={{width:vertical?850:1080,height:vertical?340:300,objectFit:"contain",opacity:p,transform:`scale(${.92+.08*p})`}}/>
      <div style={{position:"absolute",top:vertical?1160:735,fontFamily,color:C.soft,fontSize:vertical?34:30,fontWeight:400,opacity:r(l,[12,28],[0,1])}}>built for whoever answers.</div>
    </AbsoluteFill>
  );
};

export const AiToAiFilmV4:React.FC<Format> = ({vertical}) => {
  const f = useCurrentFrame();
  const push = 1+r(f,[0,1070],[0,.05]);
  const drift = Math.sin(f/210)*(vertical?16:26);
  return (
    <AbsoluteFill style={{background:C.void,overflow:"hidden"}}>
      <AbsoluteFill style={{transform:`scale(${push}) translateX(${drift}px)`}}>
        <MagneticField vertical={vertical}/>
        <Phrase vertical={vertical} start={8}   exit={72}  text="thousands of people use asmi" accent="asmi" top={vertical?590:340}/>
        <Phrase vertical={vertical} start={80}  exit={146} text="to deal with the real world." size={vertical?76:98} top={vertical?590:340}/>
        <Phrase vertical={vertical} start={158} exit={214} text="lately, we noticed something." size={vertical?58:74} color={C.dim} top={vertical?560:314}/>
        <Phrase vertical={vertical} start={176} exit={232} text="more calls are answered by AI." accent="AI" size={vertical?80:104} top={vertical?660:404}/>
        <Proof vertical={vertical}/>
        <Exchange vertical={vertical}/>
        <Swarm vertical={vertical}/>
        <Phrase vertical={vertical} start={800} exit={878} text="this is already happening." size={vertical?78:100} top={vertical?1520:880}/>
        <Phrase vertical={vertical} start={912} exit={996} text="the real world is becoming agent-to-agent." accent="agent-to-agent." size={vertical?74:96} top={vertical?560:320}/>
        <Phrase vertical={vertical} start={1004} exit={1066} text="asmi is already there." size={vertical?92:120} top={vertical?560:320}/>
      </AbsoluteFill>
      <End vertical={vertical}/>

      <Sequence from={0} durationInFrames={1170}>
        <Audio src={staticFile("audio/ai-to-ai-v4/score.mp3")} volume={fr=>r(fr,[0,60,230,250,600,614,650,1060,1168],[0,.6,.62,.14,.14,.2,.78,.78,0])}/>
      </Sequence>
      <Sequence from={255} durationInFrames={36}><Audio src={staticFile("audio/ai-to-ai-v4/01-answer-short.mp3")} volume={1.18}/></Sequence>
      <Sequence from={315} durationInFrames={206}><Audio src={staticFile("audio/ai-to-ai-v4/02-request-short.mp3")} volume={1.18}/></Sequence>
      <Sequence from={545} durationInFrames={69}><Audio src={staticFile("audio/ai-to-ai-v4/03-vegan-only.mp3")} volume={1.18}/></Sequence>
    </AbsoluteFill>
  );
};
