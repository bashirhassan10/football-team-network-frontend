import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
import { sessionToken } from "@/lib/session";

const REQUEST_TIMEOUT_MS = 30_000;

async function token() {
  return sessionToken();
}

async function backendFetch(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(backendUrl(path), {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const t = await token();
  if (!t) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const r = await backendFetch("/api/matches/team", {
      headers: { Authorization: `Bearer ${t}` },
    });
    const x = await r.text();
    if (!r.ok) {
      return NextResponse.json(
        { error: x.trim() || "Unable to load matches" },
        { status: r.status },
      );
    }
    return NextResponse.json(JSON.parse(x));
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { error: timedOut ? "Match service timed out. Please try again." : "Match service is unavailable. Please try again." },
      { status: timedOut ? 504 : 502 },
    );
  }
}

export async function POST(req: Request) {
  const t = await token();
  if (!t) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const r = await backendFetch("/api/matches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const x = await r.text();
    if (!r.ok) {
      return NextResponse.json(
        { error: x.trim() || "Unable to create match" },
        { status: r.status },
      );
    }

    try {
      return NextResponse.json(JSON.parse(x), { status: r.status });
    } catch {
      return NextResponse.json(
        { error: "Match service returned an invalid response." },
        { status: 502 },
      );
    }
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { error: timedOut ? "Match request timed out. Please check your matches before trying again." : "Match service is unavailable. Please try again." },
      { status: timedOut ? 504 : 502 },
    );
  }
}
