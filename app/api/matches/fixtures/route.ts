import {proxy} from "@/lib/club-api";
export async function GET(){return proxy("/api/matches/fixtures","GET")}
