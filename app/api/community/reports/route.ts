import {communityProxy} from "@/lib/community-proxy";
export async function POST(req:Request){return communityProxy("/api/community/reports","POST",req,false)}
