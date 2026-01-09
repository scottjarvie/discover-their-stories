/**
 * Person API Route
 * 
 * Purpose: Get details for a specific person
 * 
 * Key Elements:
 * - GET: Get person metadata and runs
 * 
 * Dependencies:
 * - @/lib/storage/fileStorage
 * 
 * Last Updated: Initial setup
 */

import { NextRequest, NextResponse } from "next/server";
import { getPerson, listRuns, getLatestRun } from "@/lib/storage/fileStorage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: personId } = await params;
    
    const person = await getPerson(personId);
    
    if (!person) {
      return NextResponse.json(
        { error: "Person not found" },
        { status: 404 }
      );
    }

    const runs = await listRuns(personId);
    const latest = await getLatestRun(personId);

    return NextResponse.json({
      success: true,
      person,
      runs,
      latestRunId: latest?.runId,
    });
  } catch (error) {
    console.error("Error getting person:", error);
    return NextResponse.json(
      { 
        error: "Failed to get person",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
