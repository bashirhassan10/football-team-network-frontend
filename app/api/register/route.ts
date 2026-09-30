import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
export async function POST(request: Request) { const body = await request.json(); const response = await fetch(backendUrl("/api/teams"), { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body), cache:"no-store" }); const text=await response.text(); if(!response.ok) return NextResponse.json({error:text.trim()||"Registration failed"},{status:response.status}); return NextResponse.json(JSON.parse(text),{status:response.status}); }
