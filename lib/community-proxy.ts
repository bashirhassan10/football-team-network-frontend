import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";
import {hasAdminSession} from "@/lib/admin-session";
export async function communityProxy(path:string,method:string,request?:Request,admin=false,timeoutMs=15000){
 const token=admin?null:await sessionToken();
 if(admin?!(await hasAdminSession()):!token)return NextResponse.json({error:"Unauthorized"},{status:401,headers:{"Cache-Control":"no-store"}});
 if(admin&&!process.env.ADMIN_API_KEY)return NextResponse.json({error:"Admin not configured"},{status:503,headers:{"Cache-Control":"no-store"}});
 try{
  const body=method==="GET"?undefined:await request?.text();
  if(body&&body.length>8192)return NextResponse.json({error:"Request too large"},{status:413,headers:{"Cache-Control":"no-store"}});
  const response=await fetch(backendUrl(path),{method,body,headers:{"Content-Type":"application/json",...(admin?{"X-Admin-Key":process.env.ADMIN_API_KEY!}:{Authorization:`Bearer ${token}`})},cache:"no-store",signal:AbortSignal.timeout(timeoutMs)});
  const text=await response.text();if(!response.ok){let message=text.trim()||"Service unavailable";try{const parsed=JSON.parse(text);if(typeof parsed.error==="string")message=parsed.error}catch{}return NextResponse.json({error:message},{status:response.status,headers:{"Cache-Control":"no-store"}});}
  return NextResponse.json(JSON.parse(text),{status:response.status,headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Safety service unavailable"},{status:502,headers:{"Cache-Control":"no-store"}})}
}
