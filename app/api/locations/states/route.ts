import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
export async function GET(){try{const r=await fetch(backendUrl("/api/states"),{next:{revalidate:86400}});if(!r.ok)throw new Error();return NextResponse.json(await r.json())}catch{return NextResponse.json({error:"Unable to load states"},{status:502})}}
