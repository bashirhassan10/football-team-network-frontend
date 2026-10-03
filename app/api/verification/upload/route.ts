import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";

export async function POST(request:Request){
  const token=await sessionToken();
  if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});

  let form:FormData;
  try{
    form=await request.formData();
  }catch(error){
    console.error("verification upload: failed to parse form data",error);
    return NextResponse.json({error:"Could not read the selected document. Please try again."},{status:400});
  }

  const file=form.get("document");
  if(!(file instanceof File)||file.size===0)return NextResponse.json({error:"Choose a document to upload"},{status:400});
  if(file.size>10*1024*1024)return NextResponse.json({error:"Document must be 10 MiB or smaller"},{status:400});

  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),30000);
  try{
    console.info("verification upload: forwarding document to backend",{size:file.size,type:file.type||"unknown"});
    const r=await fetch(backendUrl("/api/verification/documents"),{
      method:"POST",
      headers:{Authorization:`Bearer ${token}`},
      body:form,
      signal:controller.signal,
      cache:"no-store",
    });
    const text=await r.text();
    if(!r.ok){
      console.error("verification upload: backend rejected upload",{status:r.status});
      return NextResponse.json({error:text.trim()||"Upload failed"},{status:r.status});
    }
    console.info("verification upload: backend accepted upload",{status:r.status});
    try{
      return NextResponse.json(JSON.parse(text),{status:r.status});
    }catch{
      console.error("verification upload: backend returned invalid JSON");
      return NextResponse.json({error:"Upload completed but the server returned an invalid response."},{status:502});
    }
  }catch(error){
    if(error instanceof Error&&error.name==="AbortError"){
      console.error("verification upload: backend request timed out");
      return NextResponse.json({error:"Upload timed out while contacting the verification server. Please try again."},{status:504});
    }
    console.error("verification upload: backend request failed",error);
    return NextResponse.json({error:"Could not contact the verification server. Please try again."},{status:502});
  }finally{
    clearTimeout(timeout);
  }
}
