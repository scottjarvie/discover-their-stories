/**
 * Convex People API Route
 * 
 * Purpose: List people from Convex (server-side) for People Explorer
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
    const [people, documents] = await Promise.all([
      client.query(api.persons.list, {}),
      client.query(api.documents.list, {}),
    ]);

    const documentsByPersonId = new Map<string, Set<string>>();
    for (const document of documents) {
      const existing = documentsByPersonId.get(document.personId) ?? new Set<string>();
      existing.add(document.type);
      documentsByPersonId.set(document.personId, existing);
    }

    const peopleWithDocs = people.map((person) => {
      const docSet = person.fsId ? documentsByPersonId.get(person.fsId) : undefined;
      return {
        ...person,
        hasPS: docSet?.has("PS") ?? false,
        hasCST: docSet?.has("CST") ?? false,
      };
    });

    return NextResponse.json({
      success: true,
      people: peopleWithDocs,
      count: peopleWithDocs.length,
    });
  } catch (error) {
    console.error("Convex people list error:", error);
    return NextResponse.json(
      { error: "Failed to list people" },
      { status: 500 }
    );
  }
}
