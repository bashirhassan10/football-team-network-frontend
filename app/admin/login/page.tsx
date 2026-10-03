"use client";
import {FormEvent,useState} from "react";
import {useRouter} from "next/navigation";

export default function AdminLoginPage(){
 const router=useRouter();const [key,setKey]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");try{const r=await fetch("/api/admin/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({admin_key:key})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Unable to sign in");setKey("");router.replace("/admin/verification");router.refresh()}catch(e){setError(e instanceof Error?e.message:"Unable to sign in")}finally{setBusy(false)}}
 return <main className="adminLoginPage"><section className="adminLoginCard"><span className="formKicker">ADMIN · SECURE ACCESS</span><h1>Admin sign in</h1><p>Authorized administrators only. Your credential is sent over the secure same-origin connection and is never stored in browser storage.</p>{error&&<p className="formError">{error}</p>}<form onSubmit={submit}><label>Admin credential<input type="password" autoComplete="current-password" value={key} onChange={e=>setKey(e.target.value)} required/></label><button className="button" disabled={busy}>{busy?"Signing in…":"Sign in"}</button></form></section></main>
