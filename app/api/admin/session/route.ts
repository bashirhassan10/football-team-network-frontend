import {NextResponse} from "next/server";
import {ADMIN_SESSION_COOKIE,adminCookieOptions,createAdminSessionValue,hasAdminSession,validAdminKey} from "@/lib/admin-session";

export async function GET(){return NextResponse.json({authenticated:await hasAdminSession()})}
export async function POST(req:Request){
 const secret=process.env.ADMIN_API_KEY||"";
 if(!secret)return NextResponse.json({error:"Admin access is not configured",code:"ADMIN_KEY_MISSING"},{status:503});
 const body=await req.json().catch(()=>null);
 const candidate=typeof body?.admin_key==="string"?body.admin_key:"";
 if(!validAdminKey(candidate)){
  const code=!candidate?"ADMIN_CREDENTIAL_EMPTY":candidate.length!==secret.length?"ADMIN_CREDENTIAL_LENGTH_MISMATCH":"ADMIN_CREDENTIAL_VALUE_MISMATCH";
  return NextResponse.json({error:"Invalid admin credential",code},{status:401});
 }
 const res=NextResponse.json({authenticated:true});
 res.cookies.set(ADMIN_SESSION_COOKIE,createAdminSessionValue(),adminCookieOptions());
 return res;
}
export async function DELETE(){
 const res=NextResponse.json({authenticated:false});
 res.cookies.set(ADMIN_SESSION_COOKIE,"",{...adminCookieOptions(),maxAge:0});
 return res;
}
