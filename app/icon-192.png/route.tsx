import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#087443", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: 58, fontWeight: 800, letterSpacing: -5, borderRadius: 31 }}>NFN</div>,
    { width: 192, height: 192 }
  );
}
