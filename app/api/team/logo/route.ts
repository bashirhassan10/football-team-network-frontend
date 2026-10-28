import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";
export async function POST(req:Request){
 const token=await sessionToken();
 if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const form=await req.formData();
  const logo=form.get("logo");
  if(!(logo instanceof File)||logo.size===0||logo.size>1048576||!["image/png","image/jpeg"].includes(logo.type))
   return NextResponse.json({error:"Choose a PNG or JPEG logo up to 1 MB"},{status:400});
  const outgoing=new FormData();outgoing.set("logo",logo);
  const response=await fetch(backendUrl("/api/team/logo"),{method:"POST",headers:{Authorization:`Bearer ${token}`},body:outgoing,cache:"no-store",signal:AbortSignal.timeout(30000)});
  if(!response.ok)return NextResponse.json({error:(await response.text()).trim()||"Upload failed"},{status:response.status});
  return NextResponse.json({message:"Logo saved"});
 }catch{return NextResponse.json({error:"Logo upload unavailable"},{status:502})}
}
export async function DELETE(){
 const token=await sessionToken();
 if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const response=await fetch(backendUrl("/api/team/logo"),{method:"DELETE",headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15000)});
  if(!response.ok)return NextResponse.json({error:"Unable to remove logo"},{status:response.status});
  return new NextResponse(null,{status:204});
 }catch{return NextResponse.json({error:"Logo removal unavailable"},{status:502})}
}
