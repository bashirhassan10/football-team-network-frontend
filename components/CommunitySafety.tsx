"use client";
import Link from "next/link";
import {useCallback,useEffect,useState,type FormEvent} from "react";
import {usePathname} from "next/navigation";

export const COMMUNITY_VERSION="2026-11-24";
async function safetyRequest(path:string,body:unknown,method="POST") {
 const response=await fetch(path,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 const data=await response.json();if(!response.ok)throw Error(data.error||"Unable to save");return data;
}
export function CommunityConsent(){
 const path=usePathname();const[required,setRequired]=useState(false),[checked,setChecked]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>{let active=true;setRequired(false);if(path.startsWith("/admin"))return;fetch("/api/community/terms",{cache:"no-store"}).then(async r=>r.ok?r.json():null).then(d=>{if(active)setRequired(Boolean(d?.enabled&&!d.accepted))}).catch(()=>{});return()=>{active=false}},[path]);
 if(!required)return null;
 async function accept(e:FormEvent){e.preventDefault();setBusy(true);setError("");try{await safetyRequest("/api/community/terms",{version:COMMUNITY_VERSION,accepted:checked});setRequired(false)}catch(e){setError(e instanceof Error?e.message:"Unable to save acceptance")}finally{setBusy(false)}}
 return <aside className="communityNotice" aria-label="Community Terms"><form onSubmit={accept}><h2>Keep NFN safe for every team</h2><p>Review and accept our <Link href="/community-terms" target="_blank" rel="noopener noreferrer">Community Terms</Link> before posting, uploading or sending match requests.</p><label><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} required/> I accept the current Community Terms.</label><button className="button" disabled={!checked||busy}>{busy?"Saving…":"Accept Community Terms"}</button>{error&&<p role="alert">{error}</p>}</form></aside>;
}
export function ReportButton({teamID,messageID}:{teamID?:number;messageID?:number}){
 const[open,setOpen]=useState(false),[reason,setReason]=useState("HARASSMENT"),[details,setDetails]=useState(""),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setStatus("");try{const d=await safetyRequest("/api/community/reports",{...(messageID?{message_id:messageID}:{team_id:teamID}),reason,details});setStatus(d.message);setOpen(false);setDetails("")}catch(e){setStatus(e instanceof Error?e.message:"Unable to report")}finally{setBusy(false)}}
 return <div className="safetyControl"><button type="button" className="safetyLink" onClick={()=>{setOpen(v=>!v);setStatus("")}}>{messageID?"Report message":"Report team"}</button>{open&&<form onSubmit={submit} className="safetyForm"><h3>{messageID?"Report this message":"Report this team"}</h3><label>Reason<select value={reason} onChange={e=>setReason(e.target.value)}>{Object.entries({HARASSMENT:"Harassment or bullying",THREATS:"Threats or violence",CHILD_SAFETY:"Child safety concern",SPAM:"Spam or scam",IMPERSONATION:"Impersonation",OTHER:"Other"}).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Details (optional)<textarea value={details} onChange={e=>setDetails(e.target.value)} maxLength={1000} placeholder="Explain what happened. Do not include passwords or identity documents."/></label><p>Reports go to NFN moderators. Reporting does not automatically block the team.</p><button className="button" disabled={busy}>{busy?"Sending…":"Send report"}</button><button type="button" onClick={()=>setOpen(false)}>Cancel</button></form>}{status&&<p role="status">{status}</p>}</div>;
}
export function TeamSafety({teamID}:{teamID:number}){
 const[blocked,setBlocked]=useState(false),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{fetch("/api/community/blocks",{cache:"no-store"}).then(r=>r.ok?r.json():[]).then(d=>setBlocked(Array.isArray(d)&&d.some((x:{team_id:number})=>x.team_id===teamID))).catch(()=>{})},[teamID]);
 async function toggle(){if(!blocked&&!window.confirm("Block this team? Chat and new match interactions will be unavailable between your teams. Existing fixtures remain."))return;setBusy(true);setStatus("");try{const d=await safetyRequest("/api/community/blocks",{team_id:teamID},blocked?"DELETE":"POST");setBlocked(d.blocked);setStatus(d.blocked?"Team blocked. Manage blocked teams in Settings.":"Team unblocked.")}catch(e){setStatus(e instanceof Error?e.message:"Unable to update block")}finally{setBusy(false)}}
 return <section className="safetyControl" aria-label="Team safety"><ReportButton teamID={teamID}/><button type="button" disabled={busy} className="safetyLink" onClick={()=>void toggle()}>{blocked?"Unblock team":"Block team"}</button>{status&&<p role="status">{status}</p>}</section>;
}
export function BlockedTeams(){
 const[teams,setTeams]=useState<{team_id:number;team_name:string}[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 const load=useCallback(async()=>{setLoading(true);setError("");try{const r=await fetch("/api/community/blocks",{cache:"no-store"});const d=await r.json();if(!r.ok)throw Error(d.error||"Unable to load blocked teams");setTeams(d)}catch(e){setError(e instanceof Error?e.message:"Unable to load blocks")}finally{setLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);
 async function unblock(id:number){try{await safetyRequest("/api/community/blocks",{team_id:id},"DELETE");await load()}catch(e){setError(e instanceof Error?e.message:"Unable to unblock")}}
 return <section className="safetyForm"><h2>Blocked teams</h2><p>Blocking stops chat and new match interactions in both directions. It does not cancel fixtures or report the team.</p>{loading?<p>Loading…</p>:teams.length===0&&!error?<p>No teams blocked.</p>:teams.map(t=><div key={t.team_id}><span>{t.team_name}</span> <button onClick={()=>void unblock(t.team_id)}>Unblock</button></div>)}{error&&<p role="alert">{error}</p>}<button onClick={()=>void load()}>Refresh blocked teams</button></section>;
}
