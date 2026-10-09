import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";

export async function POST(req:Request){
 const token=await sessionToken();
 if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});
 let body:{match_request_id?:number;sender_score?:number;receiver_score?:number};
 try{body=await req.json()}catch{return NextResponse.json({error:"Invalid JSON"},{status:400})}
 if(typeof body.match_request_id!=="number"||typeof body.sender_score!=="number"||typeof body.receiver_score!=="number"||!Number.isSafeInteger(body.match_request_id)||!Number.isInteger(body.sender_score)||!Number.isInteger(body.receiver_score)||body.match_request_id<1||body.sender_score<0||body.receiver_score<0||body.sender_score>99||body.receiver_score>99)
  return NextResponse.json({error:"Invalid match scores"},{status:400});
 try{
  const r=await fetch(backendUrl("/api/matches/result"),{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store",signal:AbortSignal.timeout(15000)});
  const raw=await r.text();
  if(!r.ok)return NextResponse.json({error:raw.trim()||"Unable to submit result"},{status:r.status});
  return NextResponse.json(JSON.parse(raw));
 }catch{return NextResponse.json({error:"Match results service unavailable"},{status:502})}
}
