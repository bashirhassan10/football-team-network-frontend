import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[1-9]\d*$/.test(id)) {
    return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
  }
  try {
    const response = await fetch(backendUrl(`/api/teams/${id}`), { cache: "no-store", signal: AbortSignal.timeout(15000) });
    const body = await response.text();
    if (!response.ok) {
      return NextResponse.json({ error: response.status === 404 ? "Verified team not found" : "Unable to load team profile" }, { status: response.status });
    }
    return NextResponse.json(JSON.parse(body));
  } catch {
    return NextResponse.json({ error: "Team profile service is temporarily unavailable" }, { status: 502 });
  }
}
