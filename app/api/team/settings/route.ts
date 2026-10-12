import {proxy} from "@/lib/club-api";export async function GET(){return proxy("/api/team/settings","GET")}export async function PATCH(req:Request){return proxy("/api/team/settings","PATCH",req)}
