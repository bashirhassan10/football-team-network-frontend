import {NextResponse} from "next/server";
import {hasAdminSession} from "@/lib/admin-session";
import {backendUrl} from "@/lib/backend";
export async function GET(){
 if(!(await hasAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});
 const key=process.env.ADMIN_API_KEY;
 if(!key)return NextResponse.json({error:"Admin access not configured"},{status:503});
 try{const r=await fetch(backendUrl("/api/admin/account-deletion/requests"),{headers:{"X-Admin-Key":key},cache:"no-store",signal:AbortSignal.timeout(12000)});
 const data=await r.json().catch(()=>({error:"Unable to load requests"}));return NextResponse.json(data,{status:r.status});
 }catch{return NextResponse.json({error:"Request service unavailable"},{status:502})}
}
export async function POST(req:Request){
 if(!(await hasAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});
 const key=process.env.ADMIN_API_KEY;
 if(!key)return NextResponse.json({error:"Admin access not configured"},{status:503});
 const body=await req.json().catch(()=>null);
 if(!body)return NextResponse.json({error:"Invalid request"},{status:400});
 try{const r=await fetch(backendUrl("/api/admin/account-deletion/requests/update"),{method:"POST",headers:{"X-Admin-Key":key,"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store",signal:AbortSignal.timeout(12000)});
 const data=await r.json().catch(()=>({error:"Unable to update request"}));return NextResponse.json(data,{status:r.status});
 }catch{return NextResponse.json({error:"Request service unavailable"},{status:502})}
}
