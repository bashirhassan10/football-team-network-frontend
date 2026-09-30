import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
export async function GET(_request:Request,{params}:{params:Promise<{stateId:string}>}){const {stateId}=await params;if(!/^\d+$/.test(stateId))return NextResponse.json({error:"Invalid state"},{status:400});try{const r=await fetch(backendUrl(`/api/states/${stateId}/lgas`),{next:{revalidate:86400}});if(!r.ok)throw new Error();return NextResponse.json(await r.json())}catch{return NextResponse.json({error:"Unable to load LGAs"},{status:502})}}
