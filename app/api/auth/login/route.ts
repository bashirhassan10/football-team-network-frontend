import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24,
};

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(backendUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok) return NextResponse.json({ error: text.trim() || "Login failed" }, { status: response.status });

  const data = JSON.parse(text);
  const result = NextResponse.json({ message: data.message, team_id: data.team_id, team_name: data.team_name });
  result.cookies.set("ftn_session", data.token, cookieOptions);
  result.cookies.set("ftn_team_id", String(data.team_id), cookieOptions);
  result.cookies.set("ftn_team_name", String(data.team_name), cookieOptions);
  return result;
}
