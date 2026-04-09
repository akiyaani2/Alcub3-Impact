import { NextRequest, NextResponse } from "next/server";
import { computeWaterScore } from "@/lib/water-data";

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip");

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: "Valid 5-digit US zip code required" },
      { status: 400 }
    );
  }

  const score = await computeWaterScore(zip);

  if (!score) {
    return NextResponse.json(
      { error: "Could not find location for this zip code" },
      { status: 404 }
    );
  }

  return NextResponse.json(score);
}
