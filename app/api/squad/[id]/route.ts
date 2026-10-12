import {proxy} from "@/lib/club-api";
type C={params:Promise<{id:string}>};
function valid(id:string){return Number.isSafeInteger(Number(id))&&Number(id)>0&&String(Number(id))===id}
export async function PUT(req:Request,{params}:C){const{id}=await params;if(!valid(id))return Response.json({error:"Invalid ID"},{status:400});return proxy("/api/squad/"+id,"PUT",req)}
export async function DELETE(_req:Request,{params}:C){const{id}=await params;if(!valid(id))return Response.json({error:"Invalid ID"},{status:400});return proxy("/api/squad/"+id,"DELETE")}
