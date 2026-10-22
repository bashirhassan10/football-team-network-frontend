import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
export async function GET(req:Request){
 const value=new URL(req.url).searchParams.get("team_id")||"";
 if(!/^[1-9][0-9]{0,9}$/.test(value))return NextResponse.json({error:"Invalid team ID"},{status:400});
 try{
  const response=await fetch(backendUrl("/api/teams/logo?team_id="+value),{cache:"no-store",signal:AbortSignal.timeout(15000)});
  if(!response.ok)return new NextResponse(null,{status:response.status});
  const type=response.headers.get("content-type");
  if(type!=="image/png"&&type!=="image/jpeg")return new NextResponse(null,{status:502});
  const image=await response.arrayBuffer();
  if(image.byteLength>1048576)return new NextResponse(null,{status:502});
  return new NextResponse(image,{headers:{"Content-Type":type,"Cache-Control":"public, max-age=60","X-Content-Type-Options":"nosniff"}});
 }catch{return new NextResponse(null,{status:502})}
}
