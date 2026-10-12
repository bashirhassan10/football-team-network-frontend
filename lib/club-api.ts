import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";
export async function proxy(path:string,method:string,req?:Request){
 const token=await sessionToken();if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const body=method==="GET"||method==="DELETE"?undefined:await req?.text();
  const res=await fetch(backendUrl(path),{method,headers:{Authorization:`Bearer ${token}`,...(body?{"Content-Type":"application/json"}:{})},body,cache:"no-store",signal:AbortSignal.timeout(15000)});
  if(res.status===204)return new NextResponse(null,{status:204});
  const text=await res.text();
  if(!res.ok)return NextResponse.json({error:text.trim()||"Request failed"},{status:res.status});
  try{return NextResponse.json(JSON.parse(text),{status:res.status})}catch{return NextResponse.json({error:"Invalid backend response"},{status:502})}
 }catch{return NextResponse.json({error:"Backend unavailable"},{status:502})}
}
