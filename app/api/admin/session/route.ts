import {NextResponse} from "next/server";
import {ADMIN_SESSION_COOKIE,adminCookieOptions,createAdminSessionValue,hasAdminSession,validAdminKey} from "@/lib/admin-session";

export async function GET(){return NextResponse.json({authenticated:await hasAdminSession()})}
export async function POST(req:Request){
 if(!process.env.ADMIN_API_KEY)return NextResponse.json({error:"Admin access is not configured"},{status:503});
 const body=await req.json().catch(()=>null);
 if(!validAdminKey(typeof body?.admin_key==="string"?body.admin_key:""))return NextResponse.json({error:"Invalid admin credential"},{status:401});
 const res=NextResponse.json({authenticated:true});
 res.cookies.set(ADMIN_SESSION_COOKIE,createAdminSessionValue(),adminCookieOptions());
 return res;
}
export async function DELETE(){
 const res=NextResponse.json({authenticated:false});
 res.cookies.set(ADMIN_SESSION_COOKIE,"",{...adminCookieOptions(),maxAge:0});
 return res;
}
