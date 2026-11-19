import {NextResponse} from "next/server";
import {hasAdminSession} from "@/lib/admin-session";
import {backendUrl} from "@/lib/backend";
export async function POST(req:Request){
 if(!(await hasAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});
 const key=process.env.ADMIN_API_KEY;
 if(!key)return NextResponse.json({error:"Admin not configured"},{status:503});
 const body=await req.json().catch(()=>null);
 if(!body||!Number.isSafeInteger(body.id)||body.id<1||body.confirmation!=="ERASE PRIVATE TEAM DATA")return NextResponse.json({error:"Invalid confirmation"},{status:400});
 try{
  const r=await fetch(backendUrl("/api/admin/account-deletion/execute"),{method:"POST",headers:{"X-Admin-Key":key,"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(55000),cache:"no-store"});
  return NextResponse.json(await r.json(),{status:r.status});
 }catch{return NextResponse.json({error:"Deletion service unavailable"},{status:502})}
}
