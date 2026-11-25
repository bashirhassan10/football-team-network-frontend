import {communityProxy} from "@/lib/community-proxy";
export async function GET(){return communityProxy("/api/auth/sessions","GET");}
