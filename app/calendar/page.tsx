"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {ArrowLeft,CalendarDays,MapPin} from "lucide-react";

type Match={id:number;sender_team_id:number;receiver_team_id:number;match_date:string;location:string;status:string};
type Team={id:number;team_name:string};

export default function CalendarPage(){
 const [matches,setMatches]=useState<Match[]>([]);
 const [teams,setTeams]=useState<Team[]>([]);
 const [month,setMonth]=useState(()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1)});
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 useEffect(()=>{
  let active=true;
  Promise.all([fetch("/api/matches"),fetch("/api/teams")]).then(async([mr,tr])=>{
   if(mr.status===401){window.location.assign("/login");return}
   if(!mr.ok)throw new Error("Unable to load matches");
   const m=await mr.json();const t=tr.ok?await tr.json():[];
   if(active){setMatches(Array.isArray(m)?m:[]);setTeams(Array.isArray(t)?t:[])}
  }).catch(()=>{if(active)setError("Unable to load calendar. Please try again.")}).finally(()=>{if(active)setLoading(false)});
  return()=>{active=false};
 },[]);
 const name=(id:number)=>teams.find(t=>t.id===id)?.team_name||`Team #${id}`;
 const byDay=useMemo(()=>{
  const result=new Map<number,Match[]>();
  for(const m of matches){const d=new Date(m.match_date);if(Number.isNaN(d.getTime())||d.getFullYear()!==month.getFullYear()||d.getMonth()!==month.getMonth())continue;
   const list=result.get(d.getDate())||[];list.push(m);result.set(d.getDate(),list)}
  return result;
 },[matches,month]);
 const firstDay=new Date(month.getFullYear(),month.getMonth(),1).getDay();
 const days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
 return <main className="matchesPage"><header className="matchHeader shell"><Link href="/dashboard" className="backLink"><ArrowLeft/> Dashboard</Link><div className="brand"><span className="brandMark">FT</span><b>Match Calendar</b></div></header>
 <section className="matchShell"><div className="matchTitle"><div><span className="formKicker">FIXTURE SCHEDULE</span><h1>Match calendar.</h1><p>Browse your team fixtures by month.</p></div><Link href="/matches" className="ghostButton">Match Centre →</Link></div>
 <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,margin:"24px 0"}}>
 <button type="button" className="ghostButton" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} aria-label="Previous month">← Previous</button>
 <h2 style={{textAlign:"center"}}>{month.toLocaleDateString("en-NG",{month:"long",year:"numeric"})}</h2>
 <button type="button" className="ghostButton" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} aria-label="Next month">Next →</button></div>
 {loading?<p>Loading fixtures…</p>:error?<p role="alert">{error}</p>:<>
 <div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:6}}>
 {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><strong key={d} style={{textAlign:"center"}}>{d}</strong>)}
 {Array.from({length:firstDay},(_,i)=><div key={`blank-${i}`}/>)}
 {Array.from({length:days},(_,i)=>{const day=i+1;const count=byDay.get(day)?.length||0;return <a key={day} href={count?`#day-${day}`:undefined} style={{border:"1px solid #7775",borderRadius:8,padding:"12px 4px",minHeight:65,textAlign:"center",textDecoration:"none",color:"inherit",background:count?"#287d4d18":"transparent"}}><b>{day}</b>{count>0&&<div style={{fontSize:12}}>{count} match{count===1?"":"es"}</div>}</a>})}</div>
 {byDay.size===0?<div className="matchEmpty"><CalendarDays/><h3>No matches this month</h3><p>Matches will appear when fixtures are arranged.</p></div>:
 <div className="matchList" style={{marginTop:24}}>{[...byDay.entries()].sort((a,b)=>a[0]-b[0]).map(([day,list])=><section key={day} id={`day-${day}`} style={{scrollMarginTop:20}}><h3 style={{margin:"18px 0 10px"}}>{new Date(month.getFullYear(),month.getMonth(),day).toLocaleDateString("en-NG",{weekday:"long",day:"numeric",month:"long"})}</h3>{list.map(m=><article key={m.id} className="matchCard"><div className="matchDetails"><h3>{name(m.sender_team_id)} vs {name(m.receiver_team_id)}</h3><p>{new Date(m.match_date).toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"})} · {m.status}</p><p><MapPin/>{m.location||"Venue not set"}</p>{m.location?.trim()&&<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.location)}`} target="_blank" rel="noopener noreferrer">View on Map ↗</a>}</div><Link href="/matches" className="ghostButton">Match details →</Link></article>)}</section>)}</div>}</>}
 </section></main>;
}
