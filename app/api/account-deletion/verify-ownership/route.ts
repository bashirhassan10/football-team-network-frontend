import {proxy} from "@/lib/club-api";
export async function POST(req:Request){return proxy("/api/account-deletion/verify-ownership","POST",req,45000)}
