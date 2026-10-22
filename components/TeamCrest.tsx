"use client";
import {useState} from "react";

type Props={teamId:number;teamName:string;className?:string;style?:React.CSSProperties};
export default function TeamCrest({teamId,teamName,className,style}:Props){
 const[failed,setFailed]=useState(false);
 const initials=teamName.trim().split(/\s+/).slice(0,2).map(word=>word[0]||"").join("").toUpperCase()||"FC";
 return <div className={className||"directoryCrest"} style={{overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",...style}}>
  {!failed&&teamId>0?<img src={`/api/teams/logo?team_id=${teamId}`} alt={`${teamName} crest`} onError={()=>setFailed(true)} style={{width:"100%",height:"100%",objectFit:"contain"}}/>:initials}
 </div>;
}
