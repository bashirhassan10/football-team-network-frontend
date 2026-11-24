import {communityProxy} from "@/lib/community-proxy";
export async function GET(req:Request){return communityProxy("/api/community/terms","GET",req,false)}
export async function POST(req:Request){return communityProxy("/api/community/terms","POST",req,false)}
