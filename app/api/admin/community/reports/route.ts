import {communityProxy} from "@/lib/community-proxy";
export async function GET(req:Request){return communityProxy("/api/admin/community/reports","GET",req,true)}
