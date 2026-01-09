/**
 * People API Route
 * 
 * Purpose: List all imported people
 * 
 * Key Elements:
 * - GET: List all people with metadata
 * 
 * Dependencies:
 * - @/lib/storage/fileStorage
 * 
 * Last Updated: Initial setup
 */

import { NextResponse } from "next/server";
import { listPeople } from "@/lib/storage/fileStorage";

export async function GET() {
  try {
    const people = await listPeople();
    
    return NextResponse.json({
      success: true,
      people,
      count: people.length,
    });
  } catch (error) {
    console.error("Error listing people:", error);
    return NextResponse.json(
      { 
        error: "Failed to list people",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
