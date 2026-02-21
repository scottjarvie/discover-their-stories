/**
 * Convex Stats API Route
 * 
 * Purpose: Basic counts for dashboard/People Explorer insights
 */

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function GET() {
  if (!convexUrl) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_CONVEX_URL" },
      { status: 500 }
    );
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    const [people, sources, citations, places, events, media] = await Promise.all([
      client.query(api.persons.list, {}),
      client.query(api.sources.list, {}),
      client.query(api.citations.list, {}),
      client.query(api.places.list, {}),
      client.query(api.events.list, {}),
      client.query(api.media.list, {}),
    ]);

    return NextResponse.json({
      success: true,
      counts: {
        people: people.length,
        sources: sources.length,
        citations: citations.length,
        places: places.length,
        events: events.length,
        media: media.length,
      },
    });
  } catch (error) {
    console.error("Convex stats error:", error);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
