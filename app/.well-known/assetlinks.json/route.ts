import { androidAssociation } from "@/lib/android-association";

export const dynamic = "force-dynamic";
export function GET() {
  const association = androidAssociation(process.env.ANDROID_APP_SIGNING_SHA256);
  if (!association) return Response.json({ error: "Android app association is not configured" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  return Response.json(association, { headers: { "Cache-Control": "public, max-age=300" } });
}
