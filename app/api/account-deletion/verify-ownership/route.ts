import {communityProxy} from "@/lib/community-proxy";
export async function POST(req:Request){return communityProxy("/api/account-deletion/verify-ownership","POST",req,false,45000)}
