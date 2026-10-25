import {proxy} from "@/lib/club-api";
export async function GET(){return proxy("/api/team/football-category","GET")}
export async function POST(req:Request){return proxy("/api/team/football-category","POST",req)}
