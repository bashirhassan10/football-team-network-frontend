import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
export async function POST(request: Request){const body=await request.json();const r=await fetch(backendUrl("/api/auth/forgot-password"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store"});const text=await r.text();if(!r.ok)return NextResponse.json({error:text.trim()||"Unable to process request"},{status:r.status});return NextResponse.json(JSON.parse(text));}
