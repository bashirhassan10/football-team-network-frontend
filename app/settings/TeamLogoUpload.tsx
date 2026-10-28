"use client";
import {useEffect,useState} from "react";
export default function TeamLogoUpload(){
 const [teamId,setTeamId]=useState<number|null>(null),[version,setVersion]=useState(0),[available,setAvailable]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
 useEffect(()=>{fetch("/api/auth/session",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(s=>{if(Number.isInteger(s?.team_id)&&s.team_id>0)setTeamId(s.team_id)}).catch(()=>{})},[]);
 useEffect(()=>{if(!teamId)return;let active=true;fetch("/api/teams/logo?team_id="+teamId,{cache:"no-store"}).then(r=>{if(active)setAvailable(r.ok)}).catch(()=>{if(active)setAvailable(false)});return()=>{active=false}},[teamId,version]);
 async function upload(file:File){
  setError("");setMessage("");
  if(!["image/png","image/jpeg"].includes(file.type)||file.size>1048576||file.size===0){setError("Choose a PNG or JPEG logo up to 1 MB.");return}
  setBusy(true);
  try{const form=new FormData();form.set("logo",file);const r=await fetch("/api/team/logo",{method:"POST",body:form});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"Upload failed");setAvailable(true);setVersion(v=>v+1);setMessage("Logo uploaded successfully!")}catch(e){setError(e instanceof Error?e.message:"Upload failed")}finally{setBusy(false)}
 }
 async function remove(){setBusy(true);setError("");setMessage("");try{const r=await fetch("/api/team/logo",{method:"DELETE"});if(!r.ok)throw Error("Unable to remove logo");setAvailable(false);setVersion(v=>v+1);setMessage("Logo removed.")}catch(e){setError(e instanceof Error?e.message:"Unable to remove logo")}finally{setBusy(false)}}
 return <section style={{border:"1px solid #dfe5dc",borderRadius:12,padding:20,marginBottom:20,background:"#f4f8f4"}}>
  <h3>🛡️ Team Logo</h3><p>Upload your club badge. PNG or JPEG, maximum 1 MB.</p>
  {teamId&&available&&<img src={`/api/teams/logo?team_id=${teamId}&v=${version}`} alt="Current team logo" style={{width:100,height:100,objectFit:"contain",borderRadius:12,background:"#fff",marginBottom:12}}/>}
  <label style={{display:"block",marginBottom:12}}>Choose logo<input type="file" accept="image/png,image/jpeg" disabled={busy||!teamId} style={{display:"block",marginTop:8}} onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file);e.target.value=""}}/></label>
  {available&&<button type="button" className="ghostButton" disabled={busy} onClick={()=>void remove()}>Remove logo</button>}
  {busy&&<p role="status">Saving logo…</p>}{message&&<p role="status" style={{color:"#166534"}}>{message}</p>}{error&&<p role="alert" style={{color:"#b91c1c"}}>{error}</p>}
 </section>
}
