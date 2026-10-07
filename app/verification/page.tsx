"use client";
import Link from "next/link";
import {useCallback,useEffect,useState} from "react";
import {ArrowLeft,CheckCircle2,Clock3,FileText,ShieldCheck,UploadCloud,XCircle,CreditCard} from "lucide-react";

type Doc={id:number;document_type:string;original_filename:string;status:string;rejection_reason?:string;uploaded_at:string};
type Status={overall_status:string;documents:Doc[]};
type Session={authenticated:boolean;team_id:number|null;team_name:string|null};
const required=[["REGISTRATION","Registration document"],["TEAM_ID","Team identification"],["OWNER_ID","Owner identification"]] as const;

export default function Verification(){
 const[data,setData]=useState<Status|null>(null),[session,setSession]=useState<Session|null>(null),[busy,setBusy]=useState(""),[error,setError]=useState(""),[message,setMessage]=useState("");
 const load=useCallback(async()=>{const [vr,sr]=await Promise.all([fetch("/api/verification/status"),fetch("/api/auth/session")]);if(vr.status===401||sr.status===401){location.href="/login";return}const [vd,sd]=await Promise.all([vr.json(),sr.json()]);if(vr.ok)setData(vd);if(sr.ok)setSession(sd)},[]);
 useEffect(()=>{load()},[load]);
 async function upload(type:string,file:File){setBusy(type);setError("");setMessage("");const f=new FormData();f.set("document_type",type);f.set("document",file);const r=await fetch("/api/verification/upload",{method:"POST",body:f});const d=await r.json();if(!r.ok)setError(d.error||"Upload failed");else await load();setBusy("")}
 const latest=(type:string)=>data?.documents.find(d=>d.document_type===type);
 const allApproved=required.every(([type])=>latest(type)?.status==="APPROVED");

 async function startPayment(){
  if(!session?.team_id)return setError("Team session is missing. Please sign in again.");
  setBusy("payment");setError("");setMessage("");
  const r=await fetch("/api/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({team_id:session.team_id})});
  const d=await r.json();
  setBusy("");
  if(!r.ok)return setError(d.error||"Unable to initialize payment");
  if(d.authorization_url){sessionStorage.setItem("ftn_payment_reference",d.reference||"");location.href=d.authorization_url;return}
  setError("Payment provider did not return a checkout URL.");
 }

 async function confirmPayment(){
  const reference=sessionStorage.getItem("ftn_payment_reference");
  if(!reference)return setError("No payment reference was found. Start the test payment first.");
  if(!session?.team_id)return setError("Team session is missing. Please sign in again.");
  setBusy("confirm");setError("");setMessage("");
  const vr=await fetch("/api/payments/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reference})});
  const vd=await vr.json();
  if(!vr.ok){setBusy("");return setError(vd.error||"Payment confirmation failed")}
  const sr=await fetch("/api/verification/submit-review",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({team_id:session.team_id})});
  const sd=await sr.json();setBusy("");
  if(!sr.ok)return setError(sd.error||"Payment succeeded, but review submission failed");
  sessionStorage.removeItem("ftn_payment_reference");
  setMessage("Payment confirmed. Your team has been submitted for final admin review.");
 }

 return <main className="verifyPage"><header className="verifyHeader shell"><Link href="/dashboard" className="backLink"><ArrowLeft/> Dashboard</Link><div className="brand"><span className="brandMark">FT</span><b>Team Verification</b></div></header><section className="verifyShell"><div className="verifyIntro"><span className="formKicker">TRUST & SAFETY</span><h1>Verify your<br/><em>team.</em></h1><p>Upload the three required documents. Files are stored privately and reviewed before your team can enter the verified network.</p><div className="privacyNote"><ShieldCheck/><span><b>Private by design</b><small>PDF, JPG or PNG · maximum 10 MiB per document.</small></span></div></div><div className="verifyPanel"><div className="verifyTop"><div><span>OVERALL STATUS</span><h2>{data?.overall_status?.replaceAll("_"," ")||"Loading…"}</h2></div><div className={"statusDot "+(data?.overall_status||"")}></div></div>{error&&<div className="formError">{error}</div>}{message&&<div className="privacyNote"><CheckCircle2/><span><b>{message}</b></span></div>}<div className="documentList">{required.map(([type,label],i)=>{const doc=latest(type);return <div className="documentRow" key={type}><div className="docNumber">0{i+1}</div><div className="docIcon"><FileText/></div><div className="docInfo"><b>{label}</b><small>{doc?doc.original_filename:"Not uploaded yet"}</small>{doc?.rejection_reason&&<em>{doc.rejection_reason}</em>}</div><div className={"docStatus "+(doc?.status||"missing")}>{doc?.status==="APPROVED"?<CheckCircle2/>:doc?.status==="PENDING"?<Clock3/>:doc?.status==="REJECTED"?<XCircle/>:null}{doc?.status||"REQUIRED"}</div>{(!doc||doc.status==="REJECTED")&&<label className="uploadButton"><UploadCloud/>{busy===type?"Uploading…":"Upload"}<input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" disabled={!!busy} onChange={e=>{const f=e.target.files?.[0];if(f)upload(type,f)}}/></label>}</div>})}</div>{allApproved&&<div className="verifyFoot" style={{display:"block"}}><p><b>Documents approved.</b> Complete the ₦5,000 verification payment to submit your team for final admin review. During testing, use Paystack test mode only.</p><div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:16}}><button className="uploadButton" disabled={!!busy} onClick={startPayment}><CreditCard/>{busy==="payment"?"Opening checkout…":"Continue to test payment"}</button><button className="uploadButton" disabled={!!busy} onClick={confirmPayment}><CheckCircle2/>{busy==="confirm"?"Confirming…":"I completed the test payment"}</button></div></div>}<div className="verifyFoot"><ShieldCheck/><p>Documents remain private and are accessible only through the authorized verification workflow.</p></div></div></section></main>
}