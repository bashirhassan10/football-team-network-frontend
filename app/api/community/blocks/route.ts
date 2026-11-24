import {communityProxy} from "@/lib/community-proxy";
export async function GET(req:Request){return communityProxy("/api/community/blocks","GET",req,false)}
export async function POST(req:Request){return communityProxy("/api/community/blocks","POST",req,false)}
export async function DELETE(req:Request){return communityProxy("/api/community/blocks","DELETE",req,false)}
