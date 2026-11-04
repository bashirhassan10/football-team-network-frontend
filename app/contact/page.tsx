"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const topics = ["Payment", "Verification", "Login / Account", "Matches", "Other"];

export default function ContactPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setResult("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your message");
      setResult(data.message);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to send your message");
    } finally { setBusy(false); }
  }
  return <main style={{maxWidth:680,margin:"3rem auto",padding:"1.5rem"}}>
    <Link href="/">← Naija Football Network</Link>
    <h1>Contact Us / Help &amp; Support</h1>
    <p>Need help with your account, payment, verification or a match? Send us a message.</p>
    {result && <p role="status" style={{color:"green"}}>{result}</p>}
    {error && <p role="alert" style={{color:"darkred"}}>{error}</p>}
    <form onSubmit={submit} style={{display:"grid",gap:14}}>
      <label>Full name<input name="name" required maxLength={100} autoComplete="name" style={{display:"block",width:"100%",padding:12}} /></label>
      <label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" style={{display:"block",width:"100%",padding:12}} /></label>
      <label>Issue type<select name="topic" required style={{display:"block",width:"100%",padding:12}}>{topics.map(t=><option key={t}>{t}</option>)}</select></label>
      <label>Message<textarea name="message" required minLength={10} maxLength={3000} rows={7} style={{display:"block",width:"100%",padding:12}} /></label>
      <div aria-hidden="true" style={{position:"absolute",left:"-9999px"}}><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p style={{fontSize:13}}>Do not include passwords, card details, OTPs or sensitive identity documents.</p>
      <button className="button" type="submit" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
    </form>
  </main>;
}
