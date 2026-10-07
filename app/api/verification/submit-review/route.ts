import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";

export async function POST(request:Request){
  const token=await sessionToken();
  if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {team_id}=await request.json();
  const response=await fetch(backendUrl("/api/teams/submit-review"),{
    method:"POST",
    headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
    body:JSON.stringify({team_id:Number(team_id)})
  });
  const text=await response.text();
  if(!response.ok)return NextResponse.json({error:text.trim()||"Unable to submit team for review"},{status:response.status});
  return NextResponse.json(JSON.parse(text));
}