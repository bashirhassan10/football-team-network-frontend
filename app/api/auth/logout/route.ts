import { NextResponse } from "next/server";
export async function POST() { const response = NextResponse.json({ message: "Signed out" }); response.cookies.set("ftn_session", "", { httpOnly: true, expires: new Date(0), path: "/" }); return response; }
