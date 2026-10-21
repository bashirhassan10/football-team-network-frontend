import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";
export async function GET(){
 const token=await sessionToken();
 if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const r=await fetch(backendUrl("/api/payments/status"),{headers:{Authorization:"Bearer "+token},cache:"no-store"});
  const body=await r.text();
  if(!r.ok)return NextResponse.json({error:"Payment status unavailable"},{status:r.status});
  return NextResponse.json(JSON.parse(body),{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Payment status unavailable"},{status:502})}
}
