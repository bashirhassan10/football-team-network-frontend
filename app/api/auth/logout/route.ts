import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL("/login", req.url), 303);
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
