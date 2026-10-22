"use client";
import {useState,type FormEvent} from "react";

type Props={busy:boolean;onGenerated:(file:File)=>Promise<void>};
export default function TeamIdentificationForm({busy,onGenerated}:Props){
 const [name,setName]=useState("");
 const [representative,setRepresentative]=useState("");
 const [role,setRole]=useState("");
 const [pitch,setPitch]=useState("");
 const [confirmed,setConfirmed]=useState(false);
 const [error,setError]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setError("");
  if(!confirmed){setError("Please confirm the information is accurate.");return;}
  const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=1000;
  const ctx=canvas.getContext("2d");if(!ctx){setError("Your browser cannot prepare this form.");return;}
  ctx.fillStyle="#fff";ctx.fillRect(0,0,1200,1000);
  ctx.fillStyle="#145b3b";ctx.fillRect(0,0,1200,135);
  ctx.fillStyle="#fff";ctx.font="bold 42px Arial";ctx.fillText("NAIJA FOOTBALL NETWORK",65,76);
  ctx.font="24px Arial";ctx.fillText("TEAM INFORMATION DECLARATION • NOT OFFICIAL REGISTRATION",65,111);
  ctx.fillStyle="#12271b";ctx.font="bold 38px Arial";ctx.fillText("Team Identification Form",65,205);
  ctx.font="24px Arial";ctx.fillText("Information supplied by the team representative for admin review.",65,252);
  const rows=[["Team name",name],["Representative",representative],["Role / position",role],["Home pitch / location",pitch],["Date submitted",new Date().toISOString().slice(0,10)]];
  let y=330;for(const [label,value] of rows){ctx.fillStyle="#5b6b60";ctx.font="22px Arial";ctx.fillText(label,65,y);ctx.fillStyle="#12271b";ctx.font="bold 29px Arial";const v=value.length>60?value.slice(0,57)+"...":value;ctx.fillText(v,65,y+40);y+=106;}
  ctx.fillStyle="#145b3b";ctx.fillRect(65,870,1070,3);
  ctx.fillStyle="#263b2e";ctx.font="23px Arial";ctx.fillText("Self-declared by the representative. Subject to independent admin verification.",65,925);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));
  if(!blob){setError("Unable to prepare the form.");return;}
  await onGenerated(new File([blob],"nfn-team-identification.png",{type:"image/png"}));
 }
 return <form onSubmit={submit} style={{display:"grid",gap:12,padding:20,background:"#f5f9f4",border:"1px solid #dce6df",borderRadius:14}}>
  <strong>Complete Team Identification online</strong>
  <p style={{margin:0,fontSize:13,color:"#52675a"}}>Fill this form in NFN. We prepare your team declaration and submit it to the existing admin review process. This is not a government ID or official registration certificate.</p>
  <label>Team name<input required maxLength={90} value={name} onChange={e=>setName(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
  <label>Authorized representative<input required maxLength={90} value={representative} onChange={e=>setRepresentative(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
  <label>Position (e.g. Manager)<input required maxLength={70} value={role} onChange={e=>setRole(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
  <label>Home pitch / location<input required maxLength={120} value={pitch} onChange={e=>setPitch(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
  <label style={{display:"flex",gap:10,alignItems:"flex-start"}}><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>I am authorized to submit this information, and it is accurate to the best of my knowledge.</label>
  {error&&<p role="alert" style={{color:"#a32920"}}>{error}</p>}
  <button className="button" type="submit" disabled={busy||!confirmed} style={{border:0,cursor:"pointer"}}>{busy?"Submitting…":"Submit team identification for review"}</button>
 </form>;
}
