"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, MapPin, ShieldCheck } from "lucide-react";

type Team = {
  id: number;
  team_name: string;
  category: string;
  pitch_address: string;
  verification_status: string;
  state_name: string;
  lga_name: string;
};
type Session = { authenticated: boolean; team_id: number | null };

export default function TeamProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [team, setTeam] = useState<Team | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
        <h1>{team.team_name}</h1>
        <p><BadgeCheck size={20}/> Verified football team</p>
        <div className="teamsGrid">
          <article className="directoryCard">
            <div className="directoryCrest">{team.team_name.split(" ").slice(0, 2).map(part => part[0]).join("").toUpperCase()}</div>
            <div className="verifiedLabel"><ShieldCheck/> VERIFIED</div>
            <h2>{team.team_name}</h2>
            <span className="categoryPill">{team.category}</span>
            <p><MapPin/> {team.lga_name}, {team.state_name}</p>
            <p><MapPin/> Home pitch: {team.pitch_address}</p>
            {session?.team_id === team.id ? <p>This is your team.</p> : session?.authenticated ?
              <Link className="button" href={`/matches?opponent=${team.id}`}>Challenge Team →</Link> :
              <Link className="button" href="/login">Sign in to challenge →</Link>}
          </article>
        </div>
      </> : null}
    </section>
  </main>;
}
