import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";
import {hasAdminSession} from "@/lib/admin-session";
export async function communityProxy(path:string,method:string,request?:Request,admin=false){
 const token=admin?null:await sessionToken();
 if(admin?!(await hasAdminSession()):!token)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(admin&&!process.env.ADMIN_API_KEY)return NextResponse.json({error:"Admin not configured"},{status:503});
 try{
  const body=method==="GET"?undefined:await request?.text();
  if(body&&body.length>8192)return NextResponse.json({error:"Request too large"},{status:413});
  const response=await fetch(backendUrl(path),{method,body,headers:{"Content-Type":"application/json",...(admin?{"X-Admin-Key":process.env.ADMIN_API_KEY!}:{Authorization:`Bearer ${token}`})},cache:"no-store",signal:AbortSignal.timeout(15000)});
  const text=await response.text();if(!response.ok)return NextResponse.json({error:text.trim()||"Safety service unavailable"},{status:response.status});
  return NextResponse.json(JSON.parse(text),{status:response.status});
 }catch{return NextResponse.json({error:"Safety service unavailable"},{status:502})}
}
