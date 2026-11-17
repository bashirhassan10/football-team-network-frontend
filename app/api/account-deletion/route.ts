import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
export const runtime="nodejs";
export async function POST(req:Request){
 const origin=req.headers.get("origin");
 if(origin){try{if(new URL(origin).host!==req.headers.get("host"))return NextResponse.json({error:"Invalid request origin"},{status:403})}catch{return NextResponse.json({error:"Invalid origin"},{status:403})}}
 const body=await req.json().catch(()=>null);
 if(!body||typeof body.team_name!=="string"||typeof body.email!=="string")return NextResponse.json({error:"Invalid request"},{status:400});
 try{
 const r=await fetch(backendUrl("/api/account-deletion/requests"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store",signal:AbortSignal.timeout(12000)});
 const data=await r.json().catch(()=>({}));
 if(!r.ok)return NextResponse.json(data,{status:r.status});
 // Notify support server-side, without invoking the general contact-form rate limit.
 // Never expose the Resend key or support destination to the browser.
 let notified=false;
 const key=process.env.RESEND_API_KEY,from=process.env.CONTACT_FROM_EMAIL,to=process.env.SUPPORT_EMAIL;
 if(key&&from&&to&&!body.website){
  const team=body.team_name.trim().slice(0,100),email=body.email.trim().slice(0,254);
  const reason=typeof body.reason==="string"?body.reason.trim().slice(0,500):"";
  const message=["NFN ACCOUNT DELETION REQUEST — VERIFY OWNERSHIP BEFORE ACTION","Team: "+team,"Registered email: "+email,"Reason: "+(reason||"Not provided"),"Request is saved in the admin deletion queue.","Do not delete account until ownership is verified."].join("\n");
  try{const mail=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],subject:"[NFN Support] Account Deletion",text:message}),signal:AbortSignal.timeout(12000)});notified=mail.ok}catch{/* persisted request remains available to admins */}
 }
 return NextResponse.json({message:"Deletion request saved",notification_sent:notified},{status:201});
 }catch(e){console.error("Account deletion backend request failed",e instanceof Error?e.message:"Unknown error");return NextResponse.json({error:"Deletion request service temporarily unavailable. Please try again later."},{status:503})}
}
