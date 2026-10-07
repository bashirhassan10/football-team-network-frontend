"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {BadgeCheck,Bell,CalendarDays,ChevronRight,FileCheck2,LayoutDashboard,MapPin,MessageCircle,Search,ShieldCheck,Trophy,Users,Settings,BarChart3} from "lucide-react";

type V={overall_status:string;documents:{document_type:string;status:string}[]};
type M={id:number;sender_team_id:number;receiver_team_id:number;match_date:string;location:string;status:string;viewer_role?:"SENDER"|"RECEIVER"};
type T={id:number;team_name:string};
type S={authenticated:boolean;team_id:number|null;team_name:string|null};

export default function Dashboard(){
 const[v,setV]=useState<V|null>(null),[matches,setMatches]=useState<M[]>([]),[teams,setTeams]=useState<T[]>([]),[session,setSession]=useState<S|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{Promise.all([fetch("/api/verification/status"),fetch("/api/matches"),fetch("/api/teams"),fetch("/api/auth/session")]).then(async([vr,mr,tr,sr])=>{
  if(vr.status===401||mr.status===401||sr.status===401){location.href="/login";return}
  if(vr.ok)setV(await vr.json());if(mr.ok)setMatches(await mr.json());if(tr.ok){const d=await tr.json();if(Array.isArray(d))setTeams(d)}if(sr.ok)setSession(await sr.json());
  if(!vr.ok&&vr.status!==403)setError("Some dashboard data could not be loaded.");setLoading(false)
 }).catch(()=>{setError("Unable to refresh your workspace.");setLoading(false)})},[]);
 const required=["REGISTRATION","TEAM_ID","OWNER_ID"],approved=required.filter(t=>v?.documents?.some(d=>d.document_type===t&&d.status==="APPROVED")).length;
 const received=matches.filter(m=>m.status==="PENDING"&&m.viewer_role==="RECEIVER"),sent=matches.filter(m=>m.status==="PENDING"&&m.viewer_role==="SENDER"),accepted=matches.filter(m=>m.status==="ACCEPTED"),completed=matches.filter(m=>m.status==="COMPLETED");
 const status=v?.overall_status||"NOT SUBMITTED",teamName=(id:number)=>teams.find(t=>t.id===id)?.team_name||`Team #${id}`;
 const nextMatch=useMemo(()=>accepted.filter(m=>new Date(m.match_date).getTime()>=Date.now()).sort((a,b)=>+new Date(a.match_date)-+new Date(b.match_date))[0],[accepted]);
 const recent=useMemo(()=>[...matches].sort((a,b)=>b.id-a.id).slice(0,4),[matches]);
 const initials=(session?.team_name||"NFN").split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase();
 return <main className="proDash">
  <aside className="proSide dashSide restoredSide">
   <Link href="/" className="brand brandLight"><span className="brandMark lime">NF</span><span>Naija Football<br/><b>Network</b></span></Link>
   <nav>
    <Link className="active" href="/dashboard"><LayoutDashboard/>Overview</Link>
    <Link href="/verification"><FileCheck2/>Verification</Link>
    <Link href="/teams"><Search/>Find teams</Link>
    <Link href="/matches"><CalendarDays/>Matches{received.length>0&&<i>{received.length}</i>}</Link>
    <Link href="/matches"><MessageCircle/>Messages</Link>
    <span className="proNavLabel">CLUB MANAGEMENT</span>
    <span className="proNavSoon"><Users/>Squad<small>Soon</small></span>
    <span className="proNavSoon"><BarChart3/>Statistics<small>Soon</small></span>
    <span className="proNavSoon"><Settings/>Settings<small>Soon</small></span>
   </nav>
   <div className="dashSecurity"><ShieldCheck/><span><b>Secure workspace</b><small>Protected team session</small></span></div>
  </aside>
  <section className="proMain">
   <header className="proTop"><div><span className="proMobileBrand">NFN</span><p>TEAM WORKSPACE</p><h1>Welcome back, <em>{session?.team_name||"Team"}</em></h1></div><div className="proTopActions"><button className="proBell" aria-label="Notifications"><Bell/>{received.length>0&&<i/>}</button><div className="proAvatar">{initials}</div><form action="/api/auth/logout" method="post"><button className="proSignout">Sign out</button></form></div></header>
   {error&&<div className="formError">{error}</div>}
   <div className="proStudioGrid"><div className="proStudioMain"><div className="proStats">
    <article><span>ALL MATCHES</span><strong>{loading?"—":matches.length}</strong><small>Network fixtures</small></article>
    <article><span>ACCEPTED</span><strong>{loading?"—":accepted.length}</strong><small>Ready to play</small></article>
    <article><span>PENDING</span><strong>{loading?"—":received.length}</strong><small>{sent.length} request{sent.length===1?"":"s"} sent</small></article>
    <article><span>COMPLETED</span><strong>{loading?"—":completed.length}</strong><small>Match history</small></article>
   </div>
   <div className="proDashboardGrid">
    <section className="proNext">
     <div className="proSectionHead"><div><span>NEXT FIXTURE</span><h2>Next match</h2></div><Link href="/matches">Match centre <ChevronRight/></Link></div>
     {nextMatch?<div className="proFixture"><div className="proFixtureTeam"><div className="proTeamBadge">{teamName(nextMatch.sender_team_id).slice(0,2).toUpperCase()}</div><b>{teamName(nextMatch.sender_team_id)}</b></div><div className="proFixtureMid"><span>{new Date(nextMatch.match_date).toLocaleDateString("en-NG",{day:"2-digit",month:"short"})}</span><strong>VS</strong><time>{new Date(nextMatch.match_date).toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"})}</time></div><div className="proFixtureTeam"><div className="proTeamBadge alt">{teamName(nextMatch.receiver_team_id).slice(0,2).toUpperCase()}</div><b>{teamName(nextMatch.receiver_team_id)}</b></div><p><MapPin/>{nextMatch.location}</p></div>:<div className="proEmptyFixture"><Trophy/><h3>No accepted fixture yet</h3><p>Find a verified team and arrange your next match.</p><Link href="/teams">Find an opponent</Link></div>}
    </section>
    <aside className="proActivity"><div className="proSectionHead"><div><span>LIVE WORKSPACE</span><h2>Recent activity</h2></div></div>
     {recent.length?recent.map(m=><Link href="/matches" className="proActivityItem" key={m.id}><div className={"proActivityIcon "+m.status}><CalendarDays/></div><div><b>{m.status==="PENDING"?(m.viewer_role==="RECEIVER"?"New match request":"Request sent"):m.status==="ACCEPTED"?"Match accepted":m.status==="COMPLETED"?"Match completed":m.status.toLowerCase().replaceAll("_"," ")}</b><p>{teamName(m.sender_team_id)} vs {teamName(m.receiver_team_id)}</p></div><ChevronRight/></Link>):<div className="proActivityEmpty">Your match activity will appear here.</div>}
    </aside>
   </div>
   </div><aside className="proStudioRail"><div className="proSecurityCard"><ShieldCheck/><div><span>SECURE WORKSPACE</span><b>Protected team session</b><small>{session?.team_name||"Team"} workspace</small></div></div>
   <section className="proLower">
    <div className="proVerifyCard"><div className="proVerifyIcon"><BadgeCheck/></div><div><span>TEAM VERIFICATION</span><h3>{status.replaceAll("_"," ")}</h3><p>{approved} of 3 identity documents approved</p><div className="proProgress"><i style={{width:`${approved/3*100}%`}}/></div></div><Link href="/verification">Manage <ChevronRight/></Link></div>
    <div className="proQuick"><span>QUICK ACTIONS</span><div><Link href="/matches"><CalendarDays/>New match</Link><Link href="/teams"><Search/>Find teams</Link><Link href="/verification"><FileCheck2/>Verification</Link></div></div>
   </section></aside></div>
  </section>
 </main>
}