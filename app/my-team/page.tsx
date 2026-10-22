"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import TeamCrest from "../../components/TeamCrest";
type Session={authenticated:boolean;team_id:number|null;team_name:string|null};
type Details={team_name:string;contact_name:string;pitch_name?:string;pitch_address:string;email:string};
export default function MyTeam(){
 const[session,setSession]=useState<Session|null>(null),[details,setDetails]=useState<Details|null>(null),[error,setError]=useState("");
 useEffect(()=>{let active=true;Promise.all([fetch("/api/auth/session",{cache:"no-store"}),fetch("/api/team/settings",{cache:"no-store"})]).then(async([s,d])=>{if(s.status===401){location.href="/login";return}if(!s.ok)throw Error("Unable to load your session");const user=await s.json();if(active)setSession(user);if(d.ok&&active)setDetails(await d.json())}).catch(e=>{if(active)setError(e instanceof Error?e.message:"Unable to load profile")});return()=>{active=false}},[]);
 return <main className="shell" style={{padding:"36px 0 90px"}}><Link href="/dashboard">← Dashboard</Link><div style={{marginTop:28,marginBottom:20}}><span className="formKicker">CLUB MANAGEMENT</span><h1>My Team Profile</h1><p>Your club identity and public presence on Naija Football Network.</p></div>
 {error?<p role="alert">{error}</p>:!session?<p role="status">Loading club profile…</p>:<><section style={{background:"linear-gradient(120deg,#092b20,#16563d)",color:"#fff",borderRadius:24,padding:"clamp(24px,5vw,50px)",display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
 <TeamCrest teamId={session.team_id||0} teamName={session.team_name||"Club"} style={{width:112,height:112,background:"#fff",color:"#103d2b",borderRadius:20,fontSize:28,fontWeight:800}}/>
 <div style={{flex:"1 1 220px"}}><small style={{letterSpacing:2,color:"#b4f2ce"}}>YOUR CLUB</small><h2 style={{fontSize:"clamp(28px,4vw,44px)",color:"#fff",margin:"8px 0"}}>{session.team_name||details?.team_name||"My team"}</h2><p style={{color:"#d8f7e5"}}>{details?.pitch_name||details?.pitch_address||"Home ground details"}</p></div>
 {session.team_id&&<Link className="button" href={`/teams/${session.team_id}`}>View public profile ↗</Link>}</section>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20,marginTop:24}}>
 <section className="directoryCard"><h2>Club identity</h2><p>Manage your badge and home ground information.</p><Link className="button" href="/my-team/edit">Edit team profile →</Link></section>
 <section className="directoryCard"><h2>Team roster</h2><p>Keep your players and squad up to date.</p><Link href="/squad">View squad →</Link></section>
 <section className="directoryCard"><h2>Matches & performance</h2><p>See fixtures and your team&apos;s results.</p><Link href="/matches">View matches →</Link><br/><Link href="/statistics">View statistics →</Link></section>
 </div></>}</main>;
}
