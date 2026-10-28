import NFNBrand from "../components/NFNBrand";
import Link from "next/link";
import MobileHomeNav from "./mobile-home-nav";
import { ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, MapPin, MessageCircle, ShieldCheck, Swords, Trophy, Users, BarChart3, Bell, UserRoundPlus, Search } from "lucide-react";

const features = [
  { icon: Search, title: "Find matching opponents", text: "Discover verified teams in your football division and age category across Nigeria." },
  { icon: Users, title: "Men’s and women’s football", text: "Register boys’ and men’s teams or girls’ and women’s teams with their own dedicated accounts." },
  { icon: ShieldCheck, title: "Age-based football", text: "Choose U-13, U-15, U-17, U-20 or Senior so challenges stay within the same age group." },
  { icon: Swords, title: "Challenge opponents", text: "Send match requests and let the other team accept or decline." },
  { icon: CalendarDays, title: "My Fixtures & All Fixtures", text: "Explore confirmed matches in a clear fixture list, with dates, kick-off times and venues." },
  { icon: MessageCircle, title: "Match chat", text: "Talk directly with your opponents and see unread message alerts." },
  { icon: BadgeCheck, title: "Team verification", text: "Build confidence with a document-based club verification process." },
  { icon: Users, title: "Squad management", text: "Keep your players and club information organized." },
  { icon: Trophy, title: "Match results", text: "Submit scores independently; results are confirmed when both teams agree." },
  { icon: BarChart3, title: "Team statistics", text: "Follow wins, draws and losses from confirmed match results." },
  { icon: Bell, title: "Stay connected", text: "Keep match conversations open even after completing a fixture." },
];

const steps = [
  { icon: UserRoundPlus, title: "Register your team", text: "Register a Football Club or Football Academy, choose Men’s or Women’s football and select your age category." },
  { icon: Search, title: "Discover opponents", text: "Find verified opponents in the same division and age category as your team." },
  { icon: Swords, title: "Send a challenge", text: "Propose a friendly match with a date, time and venue." },
  { icon: CheckCircle2, title: "Play and track", text: "Chat, complete your match and optionally confirm the result." },
];

export default function Home() {
  return <main>
    <nav className="nav shell">
      <Link href="/" className="brand"><NFNBrand/></Link>
      <div className="navLinks"><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#network">Network</a><Link href="/admin/login">Admin portal</Link></div>
      <div className="navActions"><Link className="textButton" href="/login">Sign in</Link><Link className="button small" href="/register">Register team <ArrowRight size={16}/></Link></div>
      <MobileHomeNav />
    </nav>

    <section className="hero shell">
      <div className="heroCopy">
        <div className="eyebrow"><span></span> Built for Nigerian football</div>
        <h1>Find teams. Challenge opponents. <em>Play football.</em></h1>
        <p className="lead">Naija Football Network connects football clubs and football academies across Nigeria. Register men’s or women’s teams in U-13, U-15, U-17, U-20 or Senior football, discover matching opponents, arrange friendly matches and follow confirmed fixtures.</p>
        <div className="heroActions"><Link className="button" href="/teams">Find football teams <ArrowRight size={18}/></Link><Link className="ghostButton" href="/register"><Users size={18}/> Register your team</Link></div>
        <div className="trust"><div className="avatars"><i>NF</i><i>NG</i><i>FC</i></div><span><b>Built for clubs across Nigeria</b><br/>Find verified opponents in your division and age group.</span></div>
      </div>
      <div className="heroVisual">
        <div className="glow"></div>
        <div className="pitch">
          <div className="pitchLine"></div><div className="circle"></div>
          <div className="teamCard cardOne"><div className="crest">FC</div><div><b>Your football club</b><span><MapPin size={12}/> Nigeria</span></div><BadgeCheck className="verified" size={19}/></div>
          <div className="teamCard cardTwo"><div className="crest alt">FC</div><div><b>Your next opponent</b><span><MapPin size={12}/> Discover nearby teams</span></div><Swords className="verified" size={19}/></div>
          <div className="matchChip"><Trophy size={16}/><div><small>FRIENDLY MATCHES</small><b>Find your next opponent</b></div></div>
        </div>
      </div>
    </section>

    <section className="features shell" style={{paddingTop: "45px"}}>
      <div className="sectionIntro"><span>LESS SEARCHING. MORE FOOTBALL.</span><h2>Finding your next opponent should be <em>simple.</em></h2></div>
      <p className="lead" style={{maxWidth: "780px"}}>Tired of struggling to find suitable opponents? Register your football club or academy, select your football division and age category, then discover verified teams that match. Arrange games and view confirmed fixtures in one place.</p>
    </section>

    <section id="features" className="features shell" style={{paddingTop: "35px"}}>
      <div className="sectionIntro"><span>ONE NETWORK. MORE FOOTBALL.</span><h2>Everything your club needs to <em>connect and play.</em></h2></div>
      <div className="featureGrid">{features.map(({icon: Icon,title,text},i)=><article className="featureCard" key={title}><div className="featureNumber">{String(i+1).padStart(2,"0")}</div><div className="iconBox"><Icon size={23}/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section id="how-it-works" className="features shell" style={{paddingTop: "25px"}}>
      <div className="sectionIntro"><span>GET STARTED IN FOUR STEPS</span><h2>How Naija Football Network <em>works.</em></h2></div>
      <div className="featureGrid">{steps.map(({icon: Icon,title,text},i)=><article className="featureCard" key={title}><div className="featureNumber">STEP {i+1}</div><div className="iconBox"><Icon size={23}/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="heroActions" style={{marginTop:"32px"}}><Link className="button" href="/register">Create your team <ArrowRight size={18}/></Link><Link className="ghostButton" href="/teams">Explore teams</Link></div>
    </section>

    <section id="network" className="network"><div className="shell networkInner"><div><div className="eyebrow light"><span></span> Built for Nigerian football</div><h2>From local pitches<br/>to <em>nationwide connections.</em></h2><p style={{color:"#c6d2c9",lineHeight:1.7,maxWidth:540}}>Whether your football club or academy is in Kano, Jigawa, Lagos, Abuja or elsewhere in Nigeria, find verified opponents in the same football division and age category.</p></div><div className="networkStats"><div><MapPin size={29}/><span>Location-based discovery</span></div><div><ShieldCheck size={29}/><span>Team verification</span></div><div><MessageCircle size={29}/><span>Direct match chat</span></div></div></div></section>

    <section className="features shell" style={{textAlign:"center",paddingTop:"85px",paddingBottom:"95px"}}>
      <div className="sectionIntro" style={{margin:"auto"}}><span>YOUR NEXT MATCH STARTS HERE</span><h2>Your next opponent is <em>just a click away.</em></h2></div>
      <p className="lead" style={{margin:"0 auto 26px"}}>Register your Football Club or Football Academy, choose Men’s or Women’s football and an age group, then connect with matching verified teams.</p>
      <div className="heroActions" style={{justifyContent:"center"}}><Link className="button" href="/register">Register your team <ArrowRight size={18}/></Link><Link className="ghostButton" href="/teams">Find teams</Link></div>
    </section>

    <footer className="shell footer"><div className="brand"><NFNBrand/></div><p>Connecting football clubs and academies, men’s and women’s teams, across Nigeria.</p><span>© 2026 Naija Football Network</span></footer>
  </main>;
}
