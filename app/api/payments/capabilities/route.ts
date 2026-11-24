import {proxy} from "@/lib/club-api";
export async function GET(){return proxy("/api/payments/capabilities","GET")}
