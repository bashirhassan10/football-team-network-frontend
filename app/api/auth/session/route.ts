import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionToken } from "@/lib/session";

export async function GET() {
  const token = await sessionToken();
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  const store = await cookies();
  const teamID = Number(store.get("ftn_team_id")?.value || 0);
  const teamName = store.get("ftn_team_name")?.value || "";

  return NextResponse.json({
    authenticated: true,
    team_id: teamID || null,
    team_name: teamName || null,
  });
}
