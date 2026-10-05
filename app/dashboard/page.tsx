"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {BadgeCheck,CalendarDays,FileCheck2,LayoutDashboard,MessageCircle,Search,ShieldCheck} from "lucide-react";

type V={overall_status:string;documents:{document_type:string;status:string}[]};
type M={id:number;sender_team_id:number;receiver_team_id:number;match_date:string;location:string;status:string;viewer_role?:"SENDER"|"RECEIVER"};
type T={id:number;team_name:string};

export default function Dashboard(){
  const[v,setV]=useState<V|null>(null),[matches,setMatches]=useState<M[]>([]),[teams,setTeams]=useState<T[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  useEffect(()=>{
    Promise.all([fetch("/api/verification/status"),fetch("/api/matches"),fetch("/api/teams")]).then(async([vr,mr,tr])=>{
      if(vr.status===401||mr.status===401){location.href="/login";return}
      if(vr.ok)setV(await vr.json());
      if(mr.ok)setMatches(await mr.json());
      if(tr.ok){const d=await tr.json();if(Array.isArray(d))setTeams(d)}
      if(!vr.ok&&vr.status!==403)setError("Some dashboard data could not be loaded.");
      setLoading(false)
    }).catch(()=>{setError("Unable to refresh your workspace.");setLoading(false)})
  },[]);
  const required=["REGISTRATION","TEAM_ID","OWNER_ID"],approved=required.filter(t=>v?.documents?.some(d=>d.document_type===t&&d.status==="APPROVED")).length;
  const received=matches.filter(m=>m.status==="PENDING"&&m.viewer_role==="RECEIVER");
  const sent=matches.filter(m=>m.status==="PENDING"&&m.viewer_role==="SENDER");
  const accepted=matches.filter(m=>m.status==="ACCEPTED");
  const status=v?.overall_status||"NOT SUBMITTED";
  const teamName=(id:number)=>teams.find(t=>t.id===id)?.team_name||`Team #${id}`;
  return <main className="dashPage"><aside className="dashSide"><Link href="/" className="brand brandLight"><span className="brandMark lime">FT</span><span>Football Team<br/><b>Network</b></span></Link><nav><a className="active"><LayoutDashboard/>Overview</a><Link href="/verification"><FileCheck2/>Verification</Link><Link href="/teams"><Search/>Find teams</Link><Link href="/matches"><CalendarDays/>Matches</Link><Link href="/matches"><MessageCircle/>Messages</Link></nav><div className="dashSecurity"><ShieldCheck/><span><b>Secure workspace</b><small>Protected team session</small></span></div></aside><section className="dashMain"><header><div><span className="formKicker">TEAM WORKSPACE</span><h2>Welcome to your dashboard.</h2><p>Your verification and match activity, updated from the network.</p></div><form action="/api/auth/logout" method="post"><button className="logoutButton" type="submit">Sign out</button></form></header>{error&&<div className="formError">{error}</div>}
  {!loading&&received.length>0&&<div className="statusBanner"><div className="statusIcon"><CalendarDays/></div><div><span>NEW MATCH REQUEST{received.length>1?"S":""}</span><h3>{received.length} request{received.length>1?"s":""} waiting for your response</h3><p>{teamName(received[0].sender_team_id)} wants to play {new Date(received[0].match_date).toLocaleDateString("en-NG",{day:"2-digit",month:"short"})}{received.length>1?` · +${received.length-1} more`:""}.</p></div><Link href="/matches" className="button">Review request{received.length>1?"s":""}</Link></div>}
  <div className="statusBanner"><div className="statusIcon"><BadgeCheck/></div><div><span>{loading?"SYNCING WORKSPACE":status.replaceAll("_"," ")}</span><h3>{status==="APPROVED"?"Your documents are approved":status==="PENDING"?"Verification is being reviewed":"Build your verified team profile"}</h3><p>{approved}/3 required identity documents approved. Complete verification to unlock trusted team activity.</p></div><Link href="/verification" className="button">{approved===3?"View verification":"Continue verification"}</Link></div>
  <div className="dashGrid"><article><span className="cardLabel">VERIFICATION</span><b>{loading?"—":status.replaceAll("_"," ")}</b><p>{approved} of 3 documents approved</p><div className="progress"><i style={{width:`${approved/3*100}%`}}/></div></article><article><span className="cardLabel">MATCH REQUESTS</span><b>{loading?"—":received.length}</b><p>{received.length} received · {sent.length} sent</p><Link href="/matches" className="dashCardLink">{received.length?"Review requests →":"Open match centre →"}</Link></article><article><span className="cardLabel">UPCOMING MATCHES</span><b>{loading?"—":accepted.length}</b><p>{accepted.length?"Accepted fixtures ready for chat":"No accepted fixtures yet"}</p><Link href="/matches" className="dashCardLink">View matches →</Link></article><article><span className="cardLabel">NETWORK</span><b>Nationwide</b><p>37 states & FCT · 774 LGAs</p><Link href="/teams" className="dashCardLink">Find verified teams →</Link></article></div></section></main>
}
