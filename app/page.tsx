import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, MessageCircle, ShieldCheck, Swords, Trophy, Users } from "lucide-react";

const features = [
  { icon: BadgeCheck, title: "Verified teams", text: "Build trust with a clear club verification process." },
  { icon: Swords, title: "Arrange matches", text: "Discover teams and organize fixtures without the usual friction." },
  { icon: MessageCircle, title: "Match chat", text: "Keep match conversations focused, secure and in one place." },
];

export default function Home() {
  return <main>
    <nav className="nav shell">
      <Link href="/" className="brand"><span className="brandMark">FT</span><span>Football Team<br/><b>Network</b></span></Link>
      <div className="navLinks"><a href="#features">Features</a><a href="#network">Network</a><Link href="/admin/login">Admin portal</Link></div>
      <div className="navActions"><Link className="textButton" href="/login">Sign in</Link><Link className="button small" href="/register">Register team <ArrowRight size={16}/></Link></div>
    </nav>

    <section className="hero shell">
      <div className="heroCopy">
        <div className="eyebrow"><span></span> Built for Nigerian football</div>
        <h1>Where football teams <em>connect.</em></h1>
        <p className="lead">A trusted network for grassroots teams to get verified, discover opponents, arrange matches and grow their football community.</p>
        <div className="heroActions"><Link className="button" href="/register">Join the network <ArrowRight size={18}/></Link><Link className="ghostButton" href="/teams"><Users size={18}/> Explore teams</Link></div>
        <div className="trust"><div className="avatars"><i>FT</i><i>NG</i><i>FC</i></div><span><b>Nationwide coverage</b><br/>37 states & FCT · 774 LGAs</span></div>
      </div>
      <div className="heroVisual">
        <div className="glow"></div>
        <div className="pitch">
          <div className="pitchLine"></div><div className="circle"></div>
          <div className="teamCard cardOne"><div className="crest">KA</div><div><b>Kano Athletic</b><span><MapPin size={12}/> Kano, Nigeria</span></div><BadgeCheck className="verified" size={19}/></div>
          <div className="teamCard cardTwo"><div className="crest alt">JF</div><div><b>Jigawa Falcons</b><span><MapPin size={12}/> Dutse, Nigeria</span></div><BadgeCheck className="verified" size={19}/></div>
          <div className="matchChip"><Trophy size={16}/><div><small>NETWORK MATCH</small><b>Find your next opponent</b></div></div>
        </div>
      </div>
    </section>

    <section id="features" className="features shell">
      <div className="sectionIntro"><span>ONE NETWORK. MORE FOOTBALL.</span><h2>Everything your team needs to <em>move forward.</em></h2></div>
      <div className="featureGrid">{features.map(({icon: Icon,title,text},i)=><article className="featureCard" key={title}><div className="featureNumber">0{i+1}</div><div className="iconBox"><Icon size={23}/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section id="network" className="network"><div className="shell networkInner"><div><div className="eyebrow light"><span></span> One football community</div><h2>From your local pitch<br/>to a <em>national network.</em></h2></div><div className="networkStats"><div><b>37+</b><span>States & FCT</span></div><div><b>774</b><span>Local governments</span></div><div><ShieldCheck size={29}/><span>Verification first</span></div></div></div></section>

    <footer className="shell footer"><div className="brand"><span className="brandMark">FT</span><span>Football Team <b>Network</b></span></div><p>Built for the future of grassroots football in Nigeria.</p><span>© 2026 Football Team Network</span></footer>
  </main>;
}
