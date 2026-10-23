import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {hasAdminSession} from "@/lib/admin-session";
export async function POST(req:Request){
 if(!(await hasAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});
 const key=process.env.ADMIN_API_KEY;
 if(!key)return NextResponse.json({error:"Admin review is not configured"},{status:503});
 const body=await req.json().catch(()=>null);
 if(!Number.isInteger(body?.team_id)||body.team_id<=0||!["GRASSROOTS","OFFICIALLY_REGISTERED"].includes(body?.classification))return NextResponse.json({error:"Valid team and classification required"},{status:400});
 try{
 const r=await fetch(backendUrl("/api/admin/teams/registration-classification"),{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Key":key},body:JSON.stringify({team_id:body.team_id,classification:body.classification}),cache:"no-store"});
 const text=await r.text();
 if(!r.ok)return NextResponse.json({error:text.trim()||"Unable to classify registration"},{status:r.status});
 return NextResponse.json(JSON.parse(text));
 }catch{return NextResponse.json({error:"Staging backend unavailable"},{status:502})}
}
