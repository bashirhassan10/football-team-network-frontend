"use client";
import Link from "next/link";
import {useState, type FormEvent} from "react";

export default function AccountDeletion() {
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState("");
 const [error,setError]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setStatus("");setError("");
  const form=e.currentTarget;
  const values=new FormData(form);
  const team=String(values.get("team")||"").trim();
  const email=String(values.get("email")||"").trim();
  const reason=String(values.get("reason")||"").trim();
  try{
   const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    name:team,email,topic:"Account Deletion",website:String(values.get("website")||""),
    message:"ACCOUNT DELETION REQUEST\nRegistered team: "+team+"\nRegistered email: "+email+"\nReason (optional): "+(reason||"Not provided")
   })});
   const data=await res.json().catch(()=>({}));
   if(!res.ok)throw new Error(data.error||"Unable to submit request.");
   setStatus("Your request has been sent to NFN support. We will verify account ownership before taking action. Please keep a copy of your request for your records.");
   form.reset();
  }catch(err){setError(err instanceof Error?err.message:"Unable to submit request.");}
  finally{setBusy(false);}
 }
 const field={display:"block",width:"100%",padding:12,marginTop:8,border:"1px solid #cbd5e1",borderRadius:8};
 return <main className="shell" style={{maxWidth:820,padding:"48px 20px 80px",lineHeight:1.75}}>
 <Link href="/">← Back to home</Link><h1>Request account deletion</h1>
 <p>Naija Football Network (NFN), operated by Gambo Garba Karaye, allows you to request deletion of your team account and associated personal information. You do not need to sign in to submit this request.</p>
 <h2>Submit a deletion request</h2>
 <p>Enter the team name and email address used when registering. We will review your request and verify account ownership before any deletion. Do not provide passwords, payment card details or identity documents.</p>
 {status&&<p role="status" style={{padding:16,background:"#e8f6ec",borderRadius:8}}>{status}</p>}
 {error&&<p role="alert" style={{padding:16,color:"#991b1b",background:"#fee2e2",borderRadius:8}}>{error}</p>}
 <form onSubmit={submit} style={{display:"grid",gap:16,maxWidth:600}}>
 <label>Registered team name<input name="team" required maxLength={100} style={field}/></label>
 <label>Registered email address<input name="email" type="email" required maxLength={254} autoComplete="email" style={field}/></label>
 <label>Reason for deletion (optional)<textarea name="reason" maxLength={500} rows={3} style={field}/></label>
 <div aria-hidden="true" style={{position:"absolute",left:"-9999px"}}><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 <button className="button" type="submit" disabled={busy}>{busy?"Submitting…":"Submit deletion request"}</button>
 </form>
 <p>If the form is unavailable, email <a href="mailto:support@naijafootballnetwork.com?subject=NFN%20Account%20Deletion%20Request">support@naijafootballnetwork.com</a> with the subject <strong>NFN Account Deletion Request</strong> and your registered team name and email.</p>
 <h2>What happens next?</h2><p>NFN support receives your request and checks that you are authorized to manage the account. Submitting this form does not immediately delete an account. You may be contacted for additional verification through a secure channel.</p>
 <h2>Data deletion and retention</h2><p>Your request covers your account and associated personal data, including contact information and verification submissions. Match or chat records involving other teams may require separate review. Certain transaction, security or dispute records may be retained where legally justified, and backup copies may remain temporarily until normal backup expiry.</p>
 <p>Read our <Link href="/privacy-policy">Privacy Policy</Link> for more information.</p>
 <h2>Contact</h2><p>Operator: Gambo Garba Karaye — Naija Football Network, Nigeria.<br/>Email: <a href="mailto:support@naijafootballnetwork.com">support@naijafootballnetwork.com</a>.</p>
 </main>;
}
