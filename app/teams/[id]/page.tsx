"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import TeamCrest from "../../../components/TeamCrest";

type Team = {
  id: number;
  team_name: string;
  category: string;
  pitch_address: string;
  verification_status: string;
  officially_registered?: boolean;
  football_division?: string;
  age_category?: string;
  state_name: string;
  lga_name: string;
};
type Session = { authenticated: boolean; team_id: number | null };

export default function TeamProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [team, setTeam] = useState<Team | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [verifiedSender, setVerifiedSender] = useState(false);
  const [ownCategory, setOwnCategory] = useState<{football_division:string;age_category:string;complete:boolean}|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setTeam(null);
    fetch(`/api/teams/${encodeURIComponent(id)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load team profile");
        return data as Team;
      })
      .then((data) => { if (active) setTeam(data); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load team profile"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    fetch("/api/verification/status").then(r=>r.ok?r.json():null).then(d=>setVerifiedSender(d?.verification_status==="VERIFIED"||d?.team?.verification_status==="VERIFIED")).catch(()=>{});
    fetch("/api/team/football-category").then(r=>r.ok?r.json():null).then(setOwnCategory).catch(()=>{});
    fetch("/api/auth/session")
      .then(async (response) => response.ok ? response.json() : null)
      .then(setSession)
      .catch(() => {});
  }, []);

  return <main>
    <nav className="nav shell">
      <Link href="/" className="brand"><span className="brandMark">FT</span><span>Football Team<br/><b>Network</b></span></Link>
      <div className="navActions"><Link className="textButton" href="/teams">Find teams</Link><Link className="textButton" href="/dashboard">Dashboard</Link></div>
    </nav>
    <section className="directoryHero shell">
      <Link href="/teams" className="textButton"><ArrowLeft size={18}/> Back to team directory</Link>
      <span className="formKicker">VERIFIED TEAM PROFILE</span>
      {loading ? <h1>Loading team…</h1> : error ? <div role="alert"><h1>Profile unavailable</h1><p>{error}</p></div> : team ? <>
        <div style={{background:"linear-gradient(125deg,#08281e,#15523c)",color:"#fff",borderRadius:24,padding:"clamp(24px,5vw,52px)",margin:"24px 0",display:"flex",alignItems:"center",gap:28,flexWrap:"wrap"}}>
          <TeamCrest teamId={team.id} teamName={team.team_name} style={{width:112,height:112,borderRadius:20,background:"#fff",color:"#103e2d",fontSize:28,fontWeight:800,flexShrink:0}}/>
          <div style={{flex:"1 1 240px"}}><span style={{fontSize:12,letterSpacing:2,color:"#b5f5cb"}}>NAIJA FOOTBALL NETWORK · CLUB PROFILE</span><h1 style={{color:"#fff",margin:"10px 0"}}>{team.team_name}</h1>
          <p style={{display:"flex",alignItems:"center",gap:8,color:"#d9f9e7"}}><BadgeCheck size={20}/> {team.verification_status==="VERIFIED"?"Verified Team":team.verification_status||"Football team"}</p>
          {team.officially_registered===true&&<p style={{display:"flex",alignItems:"center",gap:8,color:"#ffe3a3"}}><ShieldCheck size={18}/> Officially Registered Club</p>}
          <p style={{display:"flex",alignItems:"center",gap:8,color:"#d9f9e7"}}><MapPin size={18}/>{[team.lga_name,team.state_name].filter(Boolean).join(", ")||"Nigeria"}</p></div>
          {session?.team_id===team.id?<Link className="button" href="/my-team">Manage my profile →</Link>:session?.authenticated?(verifiedSender&&ownCategory?.complete&&team.verification_status==="VERIFIED"&&team.football_division===ownCategory.football_division&&team.age_category===ownCategory.age_category?<Link className="button" href={`/matches?opponent=${team.id}`}>Challenge team →</Link>:<p role="status" style={{color:"#fff"}}>{!verifiedSender?"Your team must be verified before challenging.":!ownCategory?.complete?"Complete your division and age category before challenging.":team.verification_status!=="VERIFIED"?"Only verified teams can be challenged.":!team.football_division||!team.age_category?"This team has not completed its category.":"Different division or age category — challenge unavailable."}</p>):<Link className="button" href="/login">Sign in to challenge →</Link>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18,marginBottom:40}}>
          <article className="directoryCard"><h2>Club information</h2><p><b>Category</b></p><span className="categoryPill">{team.category||"Not provided"}</span><p><b>Division / Age</b></p><span className="categoryPill">{team.football_division==="MENS"?"Boys / Men":team.football_division==="WOMENS"?"Girls / Women":"Division not set"} · {team.age_category||"Age not set"}</span><p><b>Verification</b></p><div className="verifiedLabel"><ShieldCheck size={18}/> {team.verification_status==="VERIFIED"?"Verified Team":team.verification_status||"Not available"}</div>{team.officially_registered===true&&<div className="verifiedLabel"><ShieldCheck size={18}/> Officially Registered Club</div>}</article>
          <article className="directoryCard"><h2>Home ground</h2><p><MapPin size={18}/> {team.pitch_address||"Not provided"}</p>{team.pitch_address&&<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(team.pitch_address)}`} target="_blank" rel="noopener noreferrer">View stadium on map ↗</a>}</article>
          <article className="directoryCard"><h2>Club activity</h2><p>Explore this club&apos;s squad, matches and performance across the network.</p><Link href="/teams">Explore teams →</Link></article>
        </div>
      </> : null}
    </section>
  </main>;
}
