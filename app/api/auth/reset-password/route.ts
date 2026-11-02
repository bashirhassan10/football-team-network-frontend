import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  try {
    const response = await fetch(backendUrl("/api/auth/reset-password"), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(15000)
    });
    const raw = await response.text();
    let data: { message?: string; error?: string } = {};
    try { data = JSON.parse(raw); } catch { /* Backend may return plain text errors. */ }
    if (!response.ok) return NextResponse.json({ error: data.error || raw.trim() || "Unable to process request" }, { status: response.status });
    return NextResponse.json({ message: data.message || "Request processed." });
  } catch {
    return NextResponse.json({ error: "Password service is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
