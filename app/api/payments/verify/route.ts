import {NextResponse} from "next/server";
import {backendUrl} from "@/lib/backend";
import {sessionToken} from "@/lib/session";
export async function POST(request:Request){const token=await sessionToken();if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});const {reference}=await request.json();const response=await fetch(backendUrl("/api/payments/verify"),{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({reference})});const text=await response.text();if(!response.ok)return NextResponse.json({error:text.trim()||"Payment confirmation failed"},{status:response.status});return NextResponse.json(JSON.parse(text));}
