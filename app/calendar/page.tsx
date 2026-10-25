"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import TeamCrest from "../../components/TeamCrest";
type Fixture={id:number;sender_team_id:number;receiver_team_id:number;match_date:string;location:string;status:string};
type Team={id:number;team_name:string};
export default function CalendarPage(){
 const[tab,setTab]=useState<"my"|"all">("my"),[mine,setMine]=useState<Fixture[]>([]),[all,setAll]=useState<Fixture[]>([]),[teams,setTeams]=useState<Team[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{let active=true;Promise.all([fetch("/api/matches"),fetch("/api/matches/fixtures"),fetch("/api/teams")]).then(async([mr,ar,tr])=>{
 if(mr.status===401||ar.status===401){location.assign("/login");return}
 if(!mr.ok||!ar.ok)throw Error("Unable to load fixtures");
 const [m,a,t]=await Promise.all([mr.json(),ar.json(),tr.ok?tr.json():[]]);
 if(active){setMine(Array.isArray(m)?m.filter((x:Fixture)=>x.status==="ACCEPTED"):[]);setAll(Array.isArray(a)?a:[]);setTeams(Array.isArray(t)?t:[])}
 }).catch(()=>{if(active)setError("Unable to load fixtures. Try again.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const name=(id:number)=>teams.find(t=>t.id===id)?.team_name||`Team #${id}`;
 const fixtures=useMemo(()=>[...(tab==="my"?mine:all)].filter(f=>f.status==="ACCEPTED"&&!Number.isNaN(new Date(f.match_date).getTime())).sort((a,b)=>+new Date(a.match_date)-+new Date(b.match_date)),[tab,mine,all]);
 const days=useMemo(()=>{const result=new Map<string,Fixture[]>();for(const f of fixtures){const d=new Date(f.match_date).toLocaleDateString("en-NG",{weekday:"long",day:"numeric",month:"long",year:"numeric"});result.set(d,[...(result.get(d)||[]),f])}return [...result.entries()]},[fixtures]);
 return <main style={{minHeight:"100vh",background:"#0b1220",color:"#f8fafc",padding:"24px 16px 80px"}}><div style={{maxWidth:920,margin:"auto"}}>
 <Link href="/dashboard" style={{color:"#93c5fd"}}>← Dashboard</Link><header style={{margin:"32px 0 20px"}}><p style={{color:"#86efac",fontWeight:700}}>NFN MATCH CENTRE</p><h1 style={{fontSize:"clamp(30px,5vw,44px)"}}>Fixtures</h1><p style={{color:"#94a3b8"}}>Confirmed matches only. Pending requests stay in Match Centre.</p></header>
 <div role="tablist" aria-label="Fixture scope" style={{display:"flex",gap:12,marginBottom:24}}>
 <button role="tab" aria-selected={tab==="my"} onClick={()=>setTab("my")} style={{padding:"12px 22px",borderRadius:10,border:"1px solid #475569",background:tab==="my"?"#16a34a":"#1e293b",color:"#fff",cursor:"pointer"}}>My Fixtures</button>
 <button role="tab" aria-selected={tab==="all"} onClick={()=>setTab("all")} style={{padding:"12px 22px",borderRadius:10,border:"1px solid #475569",background:tab==="all"?"#16a34a":"#1e293b",color:"#fff",cursor:"pointer"}}>All Fixtures</button></div>
 {loading&&<p role="status">Loading fixtures…</p>}{error&&<p role="alert">{error}</p>}
 {!loading&&!error&&days.length===0&&<section style={{padding:32,background:"#172235",borderRadius:14}}>No accepted fixtures yet. <Link href="/matches" style={{color:"#86efac"}}>Go to Match Centre →</Link></section>}
 {days.map(([day,list])=><section key={day} style={{marginBottom:24,background:"#172235",borderRadius:14,overflow:"hidden"}}><h2 style={{fontSize:16,padding:"18px 20px",margin:0,background:"#243247",color:"#e2e8f0"}}>{day}</h2>
 {list.map(f=><article key={f.id} style={{display:"grid",gridTemplateColumns:"65px minmax(0,1fr) 35px",gap:12,alignItems:"center",padding:"18px 14px",borderBottom:"1px solid #334155"}}>
 <time style={{fontWeight:700,color:"#86efac",fontSize:14}}>{new Date(f.match_date).toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"})}</time>
 <div style={{minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><TeamCrest teamId={f.sender_team_id} teamName={name(f.sender_team_id)}/><b style={{overflowWrap:"anywhere"}}>{name(f.sender_team_id)}</b></div>
 <div style={{display:"flex",alignItems:"center",gap:10}}><TeamCrest teamId={f.receiver_team_id} teamName={name(f.receiver_team_id)}/><b style={{overflowWrap:"anywhere"}}>{name(f.receiver_team_id)}</b></div>
 <small style={{color:"#94a3b8"}}>📍 {f.location||"Venue pending"}</small></div>
 <Link href="/matches" aria-label="Match details" style={{color:"#cbd5e1",fontSize:22}}>›</Link></article>)}</section>)}
 </div></main>
}
