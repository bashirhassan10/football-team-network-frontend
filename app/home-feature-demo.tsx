import {ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, MapPin, MessageCircle, Search, Swords} from "lucide-react";
import Link from "next/link";

const sections=[
 {id:"find",number:"01",title:"Find a team",description:"Discover verified football teams. Check their division, age group and location before arranging a friendly match.",icon:Search},
 {id:"request",number:"02",title:"Request a match",description:"Propose a friendly match with a date, kick-off time and venue. The other team can accept your request.",icon:Swords},
 {id:"chat",number:"03",title:"Match chat",description:"Stay in touch with your opponents and coordinate the details before match day.",icon:MessageCircle},
 {id:"fixtures",number:"04",title:"View fixtures",description:"See confirmed fixtures, match dates, kick-off times and venues in one place.",icon:CalendarDays},
] as const;
export default function HomeFeatureDemo(){
 return <section className="nfnDemo shell" aria-labelledby="nfn-demo-title">
  <div className="nfnDemoHeading"><div><span className="nfnDemoKicker">SEE HOW IT WORKS</span><h2 id="nfn-demo-title">From finding a team to <em>match day.</em></h2><p>Scroll through real-looking examples of how Naija Football Network works — no clicks needed.</p></div><span className="nfnDemoBadge">FEATURE PREVIEWS · SAMPLE DATA</span></div>
  <div className="nfnDemoStack">{sections.map(({id,number,title,description,icon:Icon})=><article className="nfnDemoBody nfnDemoRow" key={id} aria-labelledby={id+"-title"}>
   <div className="nfnDemoInfo"><div className="nfnDemoIcon"><Icon/></div><span className="nfnDemoStep">STEP {number} / 04</span><h3 id={id+"-title"}>{title}</h3><p>{description}</p><Link href="/register" className="nfnDemoCTA">Register your team <ArrowRight size={16}/></Link></div>
   <div className="nfnDemoPreview">
    <div className="nfnDemoWindowTop"><span><i/> NFN FEATURE PREVIEW</span><span>Example only</span></div>
    {id==="find"&&<div className="nfnDemoContent"><div className="nfnDemoMiniLabel">DISCOVER VERIFIED TEAMS</div><div className="nfnDemoTeam"><div className="nfnDemoCrest">KS</div><div><strong>Kano Stars FC</strong><small><MapPin size={13}/> Kano · Men’s · Senior</small></div><BadgeCheck size={20} className="nfnDemoVerified"/></div><div className="nfnDemoTeam"><div className="nfnDemoCrest secondary">JU</div><div><strong>Jigawa United FC</strong><small><MapPin size={13}/> Jigawa · Men’s · Senior</small></div><BadgeCheck size={20} className="nfnDemoVerified"/></div><div className="nfnDemoExampleNote"><Search size={16}/> Find verified teams in your football category</div></div>}
    {id==="request"&&<div className="nfnDemoContent"><div className="nfnDemoMiniLabel">FRIENDLY MATCH · SAMPLE</div><div className="nfnDemoVersus"><div><span className="nfnDemoCrest">KS</span><strong>Kano Stars FC</strong></div><b>VS</b><div><span className="nfnDemoCrest secondary">JU</span><strong>Jigawa United FC</strong></div></div><div className="nfnDemoDetails"><span><CalendarDays size={17}/> Saturday, 14 Nov 2026 · 4:00 PM</span><span><MapPin size={17}/> Kano, Nigeria</span></div><div className="nfnDemoStatus accepted"><CheckCircle2 size={18}/> Match accepted</div></div>}
    {id==="chat"&&<div className="nfnDemoContent"><div className="nfnDemoChatHeader"><span className="nfnDemoCrest">KS</span><div><strong>Kano Stars FC · Jigawa United FC</strong><small>Friendly match conversation · sample</small></div></div><div className="nfnDemoBubble left">Hello! Are we still on for Saturday?</div><div className="nfnDemoBubble right">Yes! Kick-off is 4:00 PM. ⚽</div><div className="nfnDemoBubble left">Great, see you at the pitch!</div><div className="nfnDemoBubble right">See you there! 👋</div></div>}
    {id==="fixtures"&&<div className="nfnDemoContent"><div className="nfnDemoMiniLabel">MY FIXTURES · SAMPLE</div><div className="nfnDemoFixture"><div className="nfnDemoDate"><strong>14</strong><small>NOV</small></div><div><strong>Kano Stars FC vs Jigawa United FC</strong><small>Saturday · 4:00 PM</small><small><MapPin size={13}/> Kano, Nigeria</small></div><span className="nfnDemoConfirmed">Confirmed</span></div><div className="nfnDemoCalendar"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span className="marked">SAT 14 ⚽</span><span>SUN</span></div><div className="nfnDemoExampleNote"><CalendarDays size={16}/> All your confirmed matches in one place</div></div>}
   </div>
  </article>)}</div>
 </section>;
}
