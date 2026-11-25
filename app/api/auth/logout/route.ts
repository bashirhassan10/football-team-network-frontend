import { NextResponse } from "next/server";
import {communityProxy} from "@/lib/community-proxy";

export async function POST(req: Request) {
  // Always clear this device, even when remote revocation cannot be confirmed.
  const remote=await communityProxy("/api/auth/logout","POST",new Request(req.url,{method:"POST",body:"{}"}));
  const data=await remote.json().catch(()=>({}));
  const confirmed=(remote.ok&&data.revoked===true)||remote.status===401;
  const response = NextResponse.redirect(new URL(confirmed?"/login":"/login?logout=local", req.url), 303);
  response.headers.set("Cache-Control","no-store");
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires: new Date(0),
    path: "/",
  };

  response.cookies.set("ftn_session", "", options);
  response.cookies.set("ftn_team_id", "", options);
  response.cookies.set("ftn_team_name", "", options);
  return response;
}
