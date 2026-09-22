import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {loadFont} from "@remotion/google-fonts/InstrumentSans";

const {fontFamily} = loadFont("normal", {weights: ["400", "500", "600", "700"], subsets: ["latin"]});
const C = {void:"#080A0B", soft:"#F4F1E8", dim:"#8B918E", signal:"#6FF3A5", amber:"#FFB55F", line:"#25302B"};
const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const r=(f:number,input:number[],output:number[])=>interpolate(f,input,output,clamp);
const fade=(f:number,a:number,b:number,c:number,d:number)=>r(f,[a,b],[0,1])*r(f,[c,d],[1,0]);
const pop=(f:number,at:number)=>spring({frame:f-at,fps:30,config:{damping:200,stiffness:155}});
type Format={vertical:boolean};

const seeds=Array.from({length:96},(_,i)=>({
  x:(Math.sin(i*74.17)*43758.5%1+1)%1,
  y:(Math.sin(i*31.91+4)*23421.8%1+1)%1,
  phase:i*.73,
  ai:i%5===0||i%11===0,
}));

const Field:React.FC<Format&{expanded?:boolean;labels?:boolean}>=({vertical,expanded=false,labels=false})=>{
 const f=useCurrentFrame(),w=vertical?1080:1920,h=vertical?1920:1080;
 return <AbsoluteFill><svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
  <defs><radialGradient id="v3g"><stop stopColor={C.signal} stopOpacity=".12"/><stop offset="1" stopColor={C.void} stopOpacity="0"/></radialGradient></defs>
  <rect width={w} height={h} fill={C.void}/><ellipse cx={w*.5} cy={h*.5} rx={w*.55} ry={h*.56} fill="url(#v3g)"/>
  {seeds.map((p,i)=>{const spread=expanded?1:.72;const x=w*.5+(p.x-.5)*w*.92*spread;const y=h*.5+(p.y-.5)*h*.78*spread;const pulse=.5+.5*Math.sin(f/7+p.phase)**2;return <g key={i}>
   {i%4===0&&<path d={`M${x} ${y} Q ${x+34} ${y-16} ${x+66} ${y+3}`} fill="none" stroke={p.ai?C.signal:C.line} strokeWidth={vertical?2.5:1.5} opacity={p.ai?.4:.22}/>} 
   <circle cx={x} cy={y} r={p.ai?4.5+3*pulse:2.1} fill={p.ai?C.signal:C.soft} opacity={p.ai?.72:.28}/>
   {labels&&p.ai&&i%11===0&&<text x={x+12} y={y-10} fill={C.signal} fontFamily={fontFamily} fontSize={vertical?17:13}>AI answered</text>}
  </g>})}
 </svg></AbsoluteFill>;
};

const Text:React.FC<{children:React.ReactNode;vertical:boolean;size?:number;color?:string;style?:React.CSSProperties}>=({children,vertical,size,color,style})=><div style={{fontFamily,fontWeight:600,fontSize:size??(vertical?86:108),lineHeight:.96,letterSpacing:0,color:color??C.soft,...style}}>{children}</div>;

const Opening:React.FC<Format>=({vertical})=>{const f=useCurrentFrame();return <AbsoluteFill>
 <Field vertical={vertical}/>
 <div style={{position:"absolute",left:vertical?62:120,right:vertical?62:120,top:vertical?570:330}}>
  <Text vertical={vertical} style={{opacity:fade(f,6,16,54,64),transform:`translateY(${(1-pop(f,4))*26}px)`}}>thousands of people<br/>use <span style={{color:C.signal}}>asmi</span></Text>
  <Text vertical={vertical} size={vertical?78:102} style={{position:"absolute",top:0,opacity:fade(f,64,74,112,122)}}>to deal with<br/>the real world.</Text>
 </div>
 </AbsoluteFill>};

const Observation:React.FC<Format>=({vertical})=>{const f=useCurrentFrame();const l=f-120;return <AbsoluteFill style={{opacity:fade(f,116,124,232,242)}}>
 <Field vertical={vertical} expanded labels={l>48}/>
 <div style={{position:"absolute",left:vertical?62:120,right:vertical?62:120,top:vertical?535:315}}>
  <Text vertical={vertical} size={vertical?70:90} style={{opacity:fade(l,4,12,45,55)}}>lately, we’ve<br/>noticed something.</Text>
  <Text vertical={vertical} size={vertical?82:106} style={{position:"absolute",top:0,opacity:fade(l,55,66,108,120)}}>more calls are being<br/>answered by <span style={{color:C.signal}}>AI.</span></Text>
 </div>
 </AbsoluteFill>};

const Node:React.FC<{vertical:boolean;side:"asmi"|"host";active:boolean}>=({vertical,side,active})=>{const f=useCurrentFrame();const asmi=side==="asmi";const size=vertical?150:170;return <div style={{position:"absolute",left:vertical?"50%":asmi?"25%":"75%",top:vertical?asmi?"28%":"61%":"43%",transform:"translate(-50%,-50%)",width:size,height:size}}>
 {[1,1.42,1.82].map((s,i)=><div key={s} style={{position:"absolute",inset:0,borderRadius:"50%",border:`1px solid ${asmi?C.signal:C.amber}`,opacity:active?.26-i*.06:.06,transform:`scale(${s+(active?Math.sin(f/4)**2*.08:0)})`}}/>)}
 <div style={{position:"absolute",inset:size*.31,borderRadius:"50%",background:asmi?C.signal:C.amber,opacity:active?1:.35,boxShadow:active?`0 0 40px ${asmi?C.signal:C.amber}`:"none"}}/>
 <div style={{position:"absolute",top:size+20,left:"50%",width:vertical?310:350,transform:"translateX(-50%)",textAlign:"center",fontFamily,color:active?C.soft:C.dim,fontWeight:600,fontSize:vertical?23:20}}>{asmi?"ASMI · AI CALLER":"HERMAN’S · AI HOST"}</div>
 </div>};

const Caption:React.FC<{vertical:boolean,speaker:string,color:string,text:string,progress:number}>=({vertical,speaker,color,text,progress})=>{const words=text.split(" "),n=Math.max(1,Math.ceil(words.length*progress));return <div style={{position:"absolute",left:vertical?58:300,right:vertical?58:300,bottom:vertical?235:66,minHeight:vertical?235:128}}>
 <div style={{fontFamily,color,fontWeight:700,fontSize:vertical?20:16,marginBottom:12}}>ONE REAL ASMI CALL · {speaker}</div>
 <div style={{fontFamily,color:C.soft,fontWeight:500,fontSize:vertical?46:38,lineHeight:1.1}}>{words.slice(0,n).join(" ")}</div>
 </div>};

const Proof:React.FC<Format>=({vertical})=>{const f=useCurrentFrame(),l=f-240;const answer=l>=15&&l<55,request=l>=75&&l<290,vegan=l>=305&&l<380;let caption:React.ReactNode=null;
 if(answer)caption=<Caption vertical={vertical} speaker="HERMAN’S" color={C.amber} text="What can I do for John today?" progress={r(l,[15,50],[0,1])}/>;
 if(request)caption=<Caption vertical={vertical} speaker="ASMI" color={C.signal} text="John is looking to visit on August 21st and wanted to check what vegetarian menu options you’ll have available that day." progress={r(l,[75,280],[0,1])}/>;
 if(vegan)caption=<Caption vertical={vertical} speaker="HERMAN’S" color={C.amber} text="Just to clarify, Herman’s is fully vegan." progress={r(l,[305,374],[0,1])}/>;
 return <AbsoluteFill style={{opacity:fade(f,235,244,620,630)}}><Field vertical={vertical}/>
 <svg style={{position:"absolute",inset:0}} width="100%" height="100%" viewBox={vertical?"0 0 1080 1920":"0 0 1920 1080"}><defs><linearGradient id="v3path"><stop stopColor={C.signal}/><stop offset="1" stopColor={C.amber}/></linearGradient></defs><path d={vertical?"M540 630 C250 850 825 980 540 1170":"M565 465 C850 260 1120 665 1440 465"} fill="none" stroke="url(#v3path)" strokeWidth={vertical?7:5} strokeDasharray="1400" strokeDashoffset={1400*(1-r(l,[0,90],[0,1]))}/></svg>
 <Node vertical={vertical} side="asmi" active={request}/><Node vertical={vertical} side="host" active={answer||vegan}/>{caption}
 </AbsoluteFill>};

const SilentInsight:React.FC<Format>=({vertical})=>{const f=useCurrentFrame(),l=f-630;const beats=[
 {a:12,b:68,text:<>an <span style={{color:C.signal}}>AI</span> asked.</>},
 {a:72,b:128,text:<>an <span style={{color:C.amber}}>AI</span> answered.</>},
 {a:132,b:198,text:<>the task kept moving.</>},
 {a:202,b:270,text:<>this is already happening.</>},
 ];return <AbsoluteFill><Field vertical={vertical} expanded labels/>{beats.map((x,i)=><Text key={i} vertical={vertical} size={vertical?86:112} style={{position:"absolute",left:vertical?62:120,right:vertical?62:120,top:vertical?590:345,opacity:fade(l,x.a,x.a+9,x.b-9,x.b)}}>{x.text}</Text>)}</AbsoluteFill>};

const Shift:React.FC<Format>=({vertical})=>{const f=useCurrentFrame(),l=f-900;return <AbsoluteFill style={{opacity:fade(f,896,904,1064,1074)}}><Field vertical={vertical} expanded labels/>
 <div style={{position:"absolute",left:vertical?62:120,right:vertical?62:120,top:vertical?545:300}}>
  <Text vertical={vertical} size={vertical?72:98} style={{opacity:fade(l,8,18,82,92)}}>the real world is becoming<br/><span style={{color:C.signal}}>agent-to-agent.</span></Text>
  <Text vertical={vertical} size={vertical?94:124} style={{position:"absolute",top:0,opacity:fade(l,96,108,158,170)}}>asmi is already there.</Text>
 </div></AbsoluteFill>};

const End:React.FC<Format>=({vertical})=>{const f=useCurrentFrame(),l=f-1070,p=pop(l,0);return <AbsoluteFill style={{background:C.void,opacity:r(l,[0,9],[0,1]),display:"flex",alignItems:"center",justifyContent:"center"}}>
 <Img src={staticFile("brand/asmi-logo-white.png")} style={{width:vertical?850:1080,height:vertical?340:300,objectFit:"contain",opacity:p,transform:`scale(${.9+.1*p})`}}/>
 <div style={{position:"absolute",top:vertical?1160:735,fontFamily,color:C.soft,fontSize:vertical?34:30,fontWeight:400,opacity:r(l,[10,25],[0,1])}}>built for whoever answers.</div>
 </AbsoluteFill>};

export const AiToAiFilmV3:React.FC<Format>=({vertical})=><AbsoluteFill style={{background:C.void,overflow:"hidden"}}>
 <Opening vertical={vertical}/><Observation vertical={vertical}/><Proof vertical={vertical}/><SilentInsight vertical={vertical}/><Shift vertical={vertical}/><End vertical={vertical}/>
 <Sequence from={0} durationInFrames={618}><Audio src={staticFile("audio/ai-to-ai-v3/score.mp3")} volume={f=>r(f,[0,225,240,600,617],[.72,.72,.12,.12,0])}/></Sequence>
 <Sequence from={255} durationInFrames={36}><Audio src={staticFile("audio/ai-to-ai-v3/01-answer-short.mp3")} volume={1.18}/></Sequence>
 <Sequence from={315} durationInFrames={206}><Audio src={staticFile("audio/ai-to-ai-v3/02-request-short.mp3")} volume={1.18}/></Sequence>
 <Sequence from={545} durationInFrames={69}><Audio src={staticFile("audio/ai-to-ai-v3/03-vegan-only.mp3")} volume={1.18}/></Sequence>
</AbsoluteFill>;
