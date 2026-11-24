"use client";
import {useCallback,useEffect,useState} from "react";
import DeletionReview from "./DeletionReview";
type RequestItem={id:number;team_name:string;email:string;reason:string;status:string;ownership_verified:boolean;admin_notes:string;created_at:string};
const lockedStatuses=new Set(["COMPLETED","APPROVED_FOR_DELETION","CANCELLED"]);
const choices=["PENDING","UNDER_REVIEW","AWAITING_VERIFICATION","REJECTED"];
export default function DeletionQueue(){
 const [items,setItems]=useState<RequestItem[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState<number|null>(null);
 const [drafts,setDrafts]=useState<Record<number,{status:string;admin_notes:string}>>({});
 const load=useCallback(async()=>{setLoading(true);setError("");try{const r=await fetch("/api/admin/account-deletion",{cache:"no-store"});const d=await r.json();if(!r.ok)throw Error(d.error||"Unable to load requests");if(!Array.isArray(d))throw Error("Invalid server response");setItems(d);setDrafts(Object.fromEntries(d.map((x:RequestItem)=>[x.id,{status:x.status,admin_notes:x.admin_notes}])))}catch(e){setError(e instanceof Error?e.message:"Unable to load requests")}finally{setLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);
 async function save(id:number){setBusy(id);setError("");setMessage("");try{const r=await fetch("/api/admin/account-deletion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,...drafts[id]})});const d=await r.json();if(!r.ok)throw Error(d.error||"Unable to save");setMessage("Request status saved.");await load()}catch(e){setError(e instanceof Error?e.message:"Unable to save")}finally{setBusy(null)}}
 return <section style={{marginTop:24}}>
 <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}><h2>Deletion request queue</h2><button className="ghostButton" onClick={()=>void load()}>Refresh</button></div>
 <p>Requests are stored in the configured backend database. Updating a status does not delete an account or prove ownership.</p>
 {error&&<p role="alert" className="formError">{error}</p>}{message&&<p role="status" className="formSuccess">{message}</p>}
 {loading?<p>Loading requests…</p>:items.length===0?<p>No deletion requests recorded yet.</p>:<div style={{display:"grid",gap:16}}>{items.map(x=><article key={x.id} style={{background:"white",border:"1px solid #dce6dd",padding:20,borderRadius:14}}>
 <p><strong>Request #{x.id} — {x.team_name}</strong></p><p>Requester email: {x.email}</p><p>Submitted: {new Date(x.created_at).toLocaleString()}</p><p>Reason: {x.reason||"Not provided"}</p><p>Ownership verified: <strong>{x.ownership_verified?"Yes":"No"}</strong></p>
 <label>Status<select style={{display:"block",padding:10,marginTop:8}} value={drafts[x.id]?.status||x.status} onChange={e=>setDrafts(v=>({...v,[x.id]:{...v[x.id],status:e.target.value}}))} disabled={lockedStatuses.has(x.status)}>{choices.map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}{x.status==="CANCELLED"&&<option value="CANCELLED">CANCELLED BY OWNER</option>}{x.status==="COMPLETED"&&<option value="COMPLETED">COMPLETED</option>}{x.status==="APPROVED_FOR_DELETION"&&<option value="APPROVED_FOR_DELETION">APPROVED FOR DELETION (review only)</option>}</select></label>
 <label>Admin notes<textarea style={{display:"block",width:"100%",padding:10,marginTop:8}} maxLength={2000} rows={3} disabled={lockedStatuses.has(x.status)} value={drafts[x.id]?.admin_notes||""} onChange={e=>setDrafts(v=>({...v,[x.id]:{...v[x.id],admin_notes:e.target.value}}))}/></label>
 <button className="button" onClick={()=>void save(x.id)} disabled={busy===x.id||lockedStatuses.has(x.status)}>{busy===x.id?"Saving…":"Save review status"}</button>
 <DeletionReview id={x.id} verified={x.ownership_verified} status={x.status} onApproved={load}/>
 </article>)}</div>}
 </section>;
}
