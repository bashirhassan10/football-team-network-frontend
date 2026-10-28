import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";

type DirectoryTeam = {
  category?: string | null;
  [key: string]: unknown;
};

// Older team records use "Normal Team" and "Academy". The directory UI
// uses "Football Club" and "Football Academy" instead.
function canonicalCategory(value: unknown): string {
  if (value === "Normal Team" || value === "Football Club") return "Football Club";
  if (value === "Academy" || value === "Football Academy") return "Football Academy";
  return typeof value === "string" ? value : "";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const selectedCategory = url.searchParams.get("category");
  const backendParams = new URLSearchParams(url.searchParams);
  // Filter categories after fetching: the database still contains legacy values.
  // Preserve state, LGA, division and age filters on the backend.
  backendParams.delete("category");
  const query = backendParams.toString();

  try {
    const response = await fetch(backendUrl("/api/teams" + (query ? `?${query}` : "")), {
      cache: "no-store",
    });
    const body = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { error: body.trim() || "Unable to load teams" },
        { status: response.status },
      );
    }
    const teams: unknown = JSON.parse(body);
    if (!Array.isArray(teams)) {
      return NextResponse.json({ error: "Invalid team directory response" }, { status: 502 });
    }
    const normalized: DirectoryTeam[] = teams.map((team: DirectoryTeam) => ({
      ...team,
      category: canonicalCategory(team.category),
    }));
    return NextResponse.json(
      selectedCategory
        ? normalized.filter((team) => team.category === canonicalCategory(selectedCategory))
        : normalized,
    );
  } catch {
    return NextResponse.json({ error: "Team directory is temporarily unavailable" }, { status: 502 });
  }
}
