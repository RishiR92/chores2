import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {loadFont as loadArchivo} from "@remotion/google-fonts/ArchivoBlack";
import {loadFont as loadInstrument} from "@remotion/google-fonts/InstrumentSans";

const {fontFamily: display} = loadArchivo("normal", {weights:["400"], subsets:["latin"]});
const {fontFamily: body} = loadInstrument("normal", {weights:["400","500","600","700"], subsets:["latin"]});
const C={ink:"#11110F",paper:"#F4F1E8",cobalt:"#2457FF",acid:"#C8FF45",coral:"#FF625C",grey:"#A6A69E",deep:"#20201D"};
const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const r=(f:number,i:number[],o:number[])=>interpolate(f,i,o,clamp);
const sp=(f:number,at:number,damping=18,stiffness=165)=>spring({frame:f-at,fps:30,config:{damping,stiffness}});
type Format={vertical:boolean};
const tasks=["book a dentist","cancel a gym membership","book a gardener","chase my landlord","move a salon appointment"];
const records=[
  {task:"DENTIST",detail:"appointment confirmed",col:C.cobalt},
  {task:"GYM",detail:"membership cancelled",col:C.coral},
  {task:"GARDENER",detail:"visit booked",col:C.acid},
  {task:"LANDLORD",detail:"repair chased",col:C.cobalt},
  {task:"SALON",detail:"appointment moved",col:C.coral},
];

const Noise:React.FC=()=> <AbsoluteFill style={{opacity:.07,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E\")",mixBlendMode:"soft-light"}}/>;

const Wave:React.FC<{width:number;height:number;frame:number;color?:string;calm?:boolean}>=({width,height,frame,color=C.paper,calm=false})=>{
  const bars=Array.from({length:48},(_,i)=>{
    const envelope=.25+.75*Math.sin(Math.PI*i/47);
    const motion=calm?.35:.55+.45*Math.sin(i*1.71+frame*.32+Math.sin(i*.41)*2);
    return 4+height*envelope*Math.abs(motion)*.82;
  });
  return <div style={{width,height,display:"flex",alignItems:"center",gap:Math.max(2,width/260)}}>{bars.map((h,i)=><div key={i} style={{height:h,width:Math.max(2,width/110),borderRadius:9,background:color,opacity:.38+(i%4)*.13}}/>)}</div>;
};

const Opening:React.FC<Format>=({vertical})=>{
  const f=useCurrentFrame();
  const w=vertical?1080:1920,h=vertical?1920:1080;
  const push=r(f,[0,150],[1.02,1.18]);
  const sentenceIn=r(f,[8,35],[0,1]);
  const changeIn=r(f,[62,88],[0,1]);
  const listen=sp(f,112,20,220);
  const aperture=r(f,[0,145],[vertical?310:220,vertical?130:80]);
  return <AbsoluteFill style={{background:`radial-gradient(circle at 50% 46%,${C.deep},${C.ink} 64%)`,overflow:"hidden",opacity:r(f,[140,154],[1,0])}}>
    <div style={{position:"absolute",left:"50%",top:"50%",width:w*1.15,height:h*.48,transform:`translate(-50%,-50%) scale(${push})`,clipPath:`inset(${aperture}px 0 ${aperture}px 0)`,borderTop:`1px solid ${C.grey}`,borderBottom:`1px solid ${C.grey}`,opacity:.55}}>
      <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)"}}><Wave width={vertical?860:1500} height={vertical?240:180} frame={f} calm/></div>
      <div style={{position:"absolute",left:vertical?65:150,top:vertical?46:34,fontFamily:body,fontSize:vertical?22:17,fontWeight:700,color:C.grey}}>OUTBOUND CALL · LIVE</div>
      <div style={{position:"absolute",right:vertical?65:150,bottom:vertical?46:34,fontFamily:body,fontSize:vertical?22:17,fontWeight:700,color:C.grey}}>00:{String(Math.floor(f/30)).padStart(2,"0")}</div>
    </div>
    <div style={{position:"absolute",left:vertical?58:116,right:vertical?58:116,top:vertical?170:118,color:C.paper,fontFamily:display,fontSize:vertical?78:92,lineHeight:.95,opacity:sentenceIn,transform:`translateY(${(1-sentenceIn)*35}px)`}}>asmi makes thousands of calls<br/>into the real world.</div>
    <div style={{position:"absolute",left:vertical?58:116,right:vertical?58:116,bottom:vertical?320:118,fontFamily:body,color:C.paper,fontSize:vertical?48:48,fontWeight:600,opacity:changeIn,transform:`translateY(${(1-changeIn)*22}px)`}}>lately, something changed<br/>on the other end.</div>
    <div style={{position:"absolute",right:vertical?58:116,bottom:vertical?160:92,fontFamily:display,color:C.acid,fontSize:vertical?76:72,opacity:listen,transform:`scale(${.72+.28*listen})`}}>listen.</div>
    <Noise/>
  </AbsoluteFill>;
};

const Caption:React.FC<{vertical:boolean,label:string;text:string,progress:number}>=({vertical,label,text,progress})=>{
  const words=text.split(" ");
  const n=Math.max(1,Math.ceil(words.length*progress));
  return <div style={{position:"absolute",left:vertical?56:150,right:vertical?56:150,bottom:vertical?160:65,minHeight:vertical?260:118}}>
    <div style={{fontFamily:body,fontSize:vertical?22:17,fontWeight:700,color:C.grey,marginBottom:12,letterSpacing:1.1}}>{label}</div>
    <div style={{fontFamily:body,fontSize:vertical?52:46,lineHeight:1.08,fontWeight:600,color:C.paper}}>{words.slice(0,n).join(" ")}</div>
  </div>;
};

const CallArtifact:React.FC<Format>=({vertical})=>{
  const f=useCurrentFrame();
  const local=f-145;
  const answer=local>=15&&local<57;
  const request=local>=60&&local<270;
  const vegan=local>=275&&local<348;
  const callOut=r(f,[145,156],[0,1])*r(f,[492,510],[1,0]);
  const pulse=1+.018*Math.sin(f/7);
  let cap:React.ReactNode=null;
  if(answer) cap=<Caption vertical={vertical} label="HERMAN’S · CALL" text="What can I do for John today?" progress={r(local,[15,52],[0,1])}/>;
  if(request) cap=<Caption vertical={vertical} label="ASMI · CALL" text="John is looking to visit on August 21st and wanted to check what vegetarian menu options you’ll have available that day." progress={r(local,[60,258],[0,1])}/>;
  if(vegan) cap=<Caption vertical={vertical} label="HERMAN’S · CALL" text="Just to clarify, Herman’s is fully vegan." progress={r(local,[275,342],[0,1])}/>;
  return <AbsoluteFill style={{background:`linear-gradient(145deg,${C.deep},${C.ink} 68%)`,opacity:callOut,overflow:"hidden"}}>
    <div style={{position:"absolute",left:vertical?52:120,right:vertical?52:120,top:vertical?92:58,display:"flex",justifyContent:"space-between",fontFamily:body,color:C.grey,fontSize:vertical?24:18,fontWeight:600}}><span>REAL ASMI CALL</span><span>00:{String(Math.max(0,Math.floor(local/30))).padStart(2,"0")}</span></div>
    <div style={{position:"absolute",left:"50%",top:vertical?760:400,transform:`translate(-50%,-50%) scale(${pulse})`,width:vertical?940:1420,height:vertical?440:320,borderTop:`1px solid ${C.grey}`,borderBottom:`1px solid ${C.grey}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Wave width={vertical?850:1280} height={vertical?170:130} frame={f} calm={!answer&&!request&&!vegan}/>
    </div>
    <div style={{position:"absolute",left:vertical?55:130,top:vertical?1100:640,fontFamily:body,fontSize:vertical?24:18,color:C.grey}}>AUG 21 · DINNER OPTIONS · LIVE</div>
    {cap}<Noise/>
  </AbsoluteFill>;
};

const Reveal:React.FC<Format>=({vertical})=>{
  const f=useCurrentFrame(),l=f-490;
  if(l<0||l>180)return null;
  const split=sp(l,3,15,210);
  const title=sp(l,22,18,175);
  const w=vertical?1080:1920,h=vertical?1920:1080;
  const divider=vertical?{left:90,right:90,top:h/2,height:2}:{top:80,bottom:80,left:w/2,width:2};
  return <AbsoluteFill style={{background:C.paper,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:C.cobalt,clipPath:vertical?`inset(0 0 ${50+50*(1-split)}% 0)`:`inset(0 ${50+50*(1-split)}% 0 0)`}}/>
    <div style={{position:"absolute",inset:0,background:C.coral,clipPath:vertical?`inset(${50+50*(1-split)}% 0 0 0)`:`inset(0 0 0 ${50+50*(1-split)}%)`}}/>
    <div style={{position:"absolute",...divider,background:C.ink,transform:vertical?`scaleX(${split})`:`scaleY(${split})`}}/>
    <div style={{position:"absolute",left:vertical?60:90,top:vertical?300:170,fontFamily:body,fontSize:vertical?27:24,fontWeight:700,color:C.paper,opacity:split}}>ASMI AGENT</div>
    <div style={{position:"absolute",right:vertical?60:90,bottom:vertical?300:170,fontFamily:body,fontSize:vertical?27:24,fontWeight:700,color:C.ink,opacity:split}}>BUSINESS AGENT</div>
    <div style={{position:"absolute",left:vertical?55:130,right:vertical?55:130,top:"50%",transform:`translateY(-50%) scale(${.76+.24*title})`,opacity:title,textAlign:"center",fontFamily:display,fontSize:vertical?112:142,lineHeight:.88,color:C.ink,textShadow:`0 3px 0 ${C.paper}`}}>an AI just<br/>called an AI.</div>
    <Noise/>
  </AbsoluteFill>;
};

const Evidence:React.FC<Format>=({vertical})=>{
  const f=useCurrentFrame(),l=f-640;
  if(l<0||l>250)return null;
  const w=vertical?1080:1920;
  const headline=sp(l,8,20,160);
  return <AbsoluteFill style={{background:C.ink,overflow:"hidden"}}>
    <div style={{position:"absolute",left:vertical?54:92,right:vertical?54:92,top:vertical?160:92,fontFamily:display,fontSize:vertical?72:92,lineHeight:.92,color:C.paper,transform:`translateY(${(1-headline)*45}px)`,opacity:headline}}>more calls are being<br/>answered by agents.</div>
    <div style={{position:"absolute",left:vertical?54:92,right:vertical?54:92,top:vertical?460:300,fontFamily:body,fontSize:vertical?42:46,fontWeight:700,color:C.acid,opacity:r(l,[82,100],[0,1])}}>agent-to-agent isn’t coming. <span style={{color:C.paper}}>it’s already happening.</span></div>
    {records.map((x,i)=>{
      const born=sp(l,55+i*18,21,180);
      const yy=(vertical?750:500)+i*(vertical?168:102);
      const rot=(i%2?.45:-.35)*(1-born);
      return <div key={x.task} style={{position:"absolute",left:vertical?54:(170+i*35),top:yy,width:vertical?970:1190,height:vertical?128:82,background:C.paper,color:C.ink,transform:`translateX(${(1-born)*(i%2?140:-140)}px) rotate(${rot}deg)`,opacity:born,display:"grid",gridTemplateColumns:vertical?"210px 1fr 180px":"190px 1fr 190px",alignItems:"center",padding:vertical?"0 28px":"0 24px",boxShadow:`8px 8px 0 ${x.col}`}}>
        <span style={{fontFamily:display,fontSize:vertical?28:24}}>{x.task}</span><span style={{fontFamily:body,fontSize:vertical?28:23,fontWeight:600}}>{x.detail}</span><span style={{fontFamily:body,fontSize:vertical?20:17,fontWeight:700,color:C.cobalt,textAlign:"right"}}>AGENT ANSWERED</span>
      </div>;
    })}
    <div style={{position:"absolute",right:vertical?54:110,bottom:vertical?100:58,fontFamily:display,fontSize:vertical?58:52,color:C.acid,opacity:r(l,[180,200],[0,1])}}>this is the shift.</div>
    <Noise/>
  </AbsoluteFill>;
};

const TaskBoard:React.FC<Format>=({vertical})=>{
  const f=useCurrentFrame(),l=f-850;
  if(l<0)return null;
  const flow=sp(l,5,20,180);
  const leadership=sp(l,142,18,180);
  const stageFade=r(l,[135,154],[1,.08]);
  const w=vertical?1080:1920;
  const laneTop=vertical?680:390;
  return <AbsoluteFill style={{background:C.paper,color:C.ink,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,opacity:stageFade}}>
      <div style={{position:"absolute",left:vertical?54:92,right:vertical?54:92,top:vertical?110:65,fontFamily:display,fontSize:vertical?70:82,lineHeight:.92}}>businesses have agents answering.<br/><span style={{color:C.cobalt}}>consumers have asmi calling.</span></div>
      <div style={{position:"absolute",left:vertical?70:150,top:laneTop,width:vertical?280:420,fontFamily:body,fontSize:vertical?27:23,fontWeight:700}}>CONSUMER REQUESTS</div>
      <div style={{position:"absolute",right:vertical?70:150,top:laneTop,width:vertical?250:360,textAlign:"right",fontFamily:body,fontSize:vertical?27:23,fontWeight:700}}>REAL WORLD</div>
      {[0,1,2,3,4].map(i=>{
        const y=laneTop+(vertical?150:92)+i*(vertical?126:82);
        const travel=r(l,[18+i*10,95+i*7],[0,1]);
        const x0=vertical?95:180,x1=vertical?840:1600;
        const x=x0+(x1-x0)*travel;
        return <React.Fragment key={i}>
          <div style={{position:"absolute",left:x0,top:y,width:(x1-x0)*flow,height:vertical?4:3,background:i%2?C.coral:C.cobalt,opacity:.24}}/>
          <div style={{position:"absolute",left:x,top:y,transform:`translate(-50%,-50%) rotate(${travel*360}deg)`,width:vertical?72:52,height:vertical?72:52,background:i===2?C.acid:C.paper,border:`3px solid ${C.ink}`,boxShadow:`5px 5px 0 ${i%2?C.coral:C.cobalt}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:display,fontSize:vertical?24:18}}>{travel>.82?"✓":"→"}</div>
        </React.Fragment>;
      })}
      <div style={{position:"absolute",left:"50%",top:vertical?1060:650,transform:`translate(-50%,-50%) scale(${.82+.18*flow})`,width:vertical?210:178,height:vertical?210:178,borderRadius:"50%",background:C.cobalt,border:`12px solid ${C.paper}`,boxShadow:`0 0 0 4px ${C.ink}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:display,fontSize:vertical?42:34,color:C.paper}}>asmi</div>
      <div style={{position:"absolute",left:vertical?70:180,right:vertical?70:180,bottom:vertical?170:65,fontFamily:body,fontSize:vertical?34:29,fontWeight:700,textAlign:"center"}}>one consumer agent. the real world on the other side.</div>
    </div>
    <div style={{position:"absolute",left:vertical?54:150,right:vertical?54:150,top:"50%",transform:`translateY(-50%) scale(${.78+.22*leadership})`,opacity:leadership,textAlign:"center",fontFamily:display,fontSize:vertical?84:94,lineHeight:.9}}>asmi is leading<br/><span style={{color:C.cobalt}}>the consumer side</span><br/>of the agent-to-agent world.</div>
    <Noise/>
  </AbsoluteFill>;
};

const End:React.FC<Format>=({vertical})=>{
  const f=useCurrentFrame(),l=f-1045,p=sp(l,4,17,175);
  if(l<0)return null;
  return <AbsoluteFill style={{background:C.cobalt,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:C.acid,clipPath:`circle(${r(l,[0,28],[0,78])}% at 50% 50%)`}}/>
    <Img src={staticFile("brand/asmi-logo-white.png")} style={{position:"relative",width:vertical?840:1060,height:vertical?330:270,objectFit:"contain",filter:"brightness(0)",transform:`scale(${.78+.22*p})`,opacity:p}}/>
    <div style={{position:"absolute",top:vertical?1190:735,fontFamily:display,fontSize:vertical?46:42,color:C.ink,opacity:r(l,[26,44],[0,1])}}>your agent for the real world.</div>
  </AbsoluteFill>;
};

export const AiToAiFilmV6:React.FC<Format>=({vertical})=>{
  return <AbsoluteFill style={{background:C.ink}}>
    <Opening vertical={vertical}/>
    <CallArtifact vertical={vertical}/>
    <Reveal vertical={vertical}/>
    <Evidence vertical={vertical}/>
    <TaskBoard vertical={vertical}/>
    <End vertical={vertical}/>

    <Sequence from={0} durationInFrames={1170}><Audio src={staticFile("audio/ai-to-ai-v6/score.mp3")} volume={fr=>r(fr,[0,18,145,160,455,478,492,540,1035,1168],[0,.78,.82,.3,.3,.18,1,1,1,0])}/></Sequence>
    <Sequence from={160} durationInFrames={36}><Audio src={staticFile("audio/ai-to-ai-v5/01-answer-short.mp3")} volume={1.18}/></Sequence>
    <Sequence from={205} durationInFrames={206}><Audio src={staticFile("audio/ai-to-ai-v5/02-request-short.mp3")} volume={1.18}/></Sequence>
    <Sequence from={420} durationInFrames={69}><Audio src={staticFile("audio/ai-to-ai-v5/03-vegan-only.mp3")} volume={1.18}/></Sequence>
  </AbsoluteFill>;
};
