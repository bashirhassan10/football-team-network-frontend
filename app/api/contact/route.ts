import { NextResponse } from "next/server";

export const runtime = "nodejs";
const topics = new Set(["Payment", "Verification", "Login / Account", "Matches", "Other"]);
const recent = new Map<string, number[]>();

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 6000) return NextResponse.json({ error: "Message too long" }, { status: 413 });
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && (!host || new URL(origin).host !== host)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (!input || typeof input !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (typeof input.website === "string" && input.website.length > 0) return NextResponse.json({ message: "Thank you. Your message has been received." });
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const topic = typeof input.topic === "string" ? input.topic : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (!name || /[\\r\\n]/.test(name) || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !topics.has(topic) || message.length < 10 || message.length > 3000)
    return NextResponse.json({ error: "Please check the form fields" }, { status: 400 });

  // Best-effort per-instance throttle. Replace with shared rate limiting before public launch.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  if (recent.size > 5000) for (const [key, times] of recent) if (times.every(t => now - t > 3600000)) recent.delete(key);
  const times = (recent.get(ip) || []).filter(t => now - t < 3600000);
  if (times.length >= 3) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  times.push(now); recent.set(ip, times);

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.SUPPORT_EMAIL;
  if (!key || !from || !to) return NextResponse.json({ error: "Support service is temporarily unavailable." }, { status: 503 });
  const body = ["New NFN support request", "Name: " + name, "Email: " + email, "Topic: " + topic, "", message].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: "[NFN Support] " + topic, text: body }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return NextResponse.json({ error: "Unable to send right now. Please try again later." }, { status: 502 });
    return NextResponse.json({ message: "Thank you. Your message has been sent to our support team." });
  } catch {
    return NextResponse.json({ error: "Support service is temporarily unavailable." }, { status: 503 });
  }
}
