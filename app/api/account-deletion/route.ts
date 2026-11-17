import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
export async function POST(req:Request){
 const body=await req.json().catch(()=>null);
 if(!body||typeof body.team_name!=="string"||typeof body.email!=="string")return NextResponse.json({error:"Invalid request"},{status:400});
 try{
 const r=await fetch(backendUrl("/api/account-deletion/requests"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store",signal:AbortSignal.timeout(12000)});
 const data=await r.json().catch(()=>({}));
 return NextResponse.json(data,{status:r.status});
 }catch{return NextResponse.json({error:"Deletion request service unavailable"},{status:502})}
}
