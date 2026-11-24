import {communityProxy} from "@/lib/community-proxy";
export async function GET(req:Request){return communityProxy("/api/account-deletion/my-requests","GET",req,false,45000)}
