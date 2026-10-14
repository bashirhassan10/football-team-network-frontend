import {proxy} from "@/lib/club-api";
export async function POST(req:Request){return proxy("/api/auth/request-email-change","POST",req)}
