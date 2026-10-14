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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid login request" }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(backendUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    return NextResponse.json(
      { error: "Login service is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }

  const text = await response.text();
  if (!response.ok) return NextResponse.json(
    { error: response.status >= 500 ? "Login service is temporarily unavailable. Please try again shortly." : text.trim() || "Login failed" },
    { status: response.status },
  );

  let data: { message: string; team_id: number; team_name: string; token: string };
  try {
    data = JSON.parse(text);
    if (!data.token || !data.team_id) throw new Error("Incomplete login response");
  } catch {
    return NextResponse.json({ error: "Login service returned an invalid response" }, { status: 502 });
  }

  const result = NextResponse.json({ message: data.message, team_id: data.team_id, team_name: data.team_name });
  result.cookies.set("ftn_session", data.token, cookieOptions);
  result.cookies.set("ftn_team_id", String(data.team_id), cookieOptions);
  result.cookies.set("ftn_team_name", String(data.team_name), cookieOptions);
  return result;
}
