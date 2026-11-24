import {communityProxy} from "@/lib/community-proxy";
export async function GET(req:Request){return communityProxy("/api/admin/release-readiness","GET",req,true)}
