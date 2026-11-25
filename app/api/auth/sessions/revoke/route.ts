import {communityProxy} from "@/lib/community-proxy";
export async function POST(request:Request){return communityProxy("/api/auth/sessions/revoke","POST",request);}
