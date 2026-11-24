import {communityProxy} from "@/lib/community-proxy";
export async function POST(req:Request){return communityProxy("/api/admin/community/action","POST",req,true)}
