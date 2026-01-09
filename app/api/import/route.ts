/**
 * Import API Route
 * 
 * Purpose: Accept and store Evidence Pack JSON files
 * 
 * Key Elements:
 * - POST: Import new Evidence Pack
 * - Validation with Zod
 * - Storage in versioned runs
 * 
 * Dependencies:
 * - @/features/source-docs/lib/schemas
 * - @/lib/storage/fileStorage
 * 
 * Last Updated: Initial setup
 */

import { NextRequest, NextResponse } from "next/server";
import { EvidencePackSchema } from "@/features/source-docs/lib/schemas";
import {
  savePerson,
  saveEvidencePack,
  setLatestRun,
  getPerson,
} from "@/lib/storage/fileStorage";
import { PersonMetadata } from "@/lib/storage/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the evidence pack
    const parseResult = EvidencePackSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid Evidence Pack format",
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const evidencePack = parseResult.data;
    const personId = evidencePack.person.familySearchId;
    const runId = new Date(evidencePack.capturedAt)
      .toISOString()
      .replace(/[:.]/g, "-");

    // Check if person exists, create or update
    const existingPerson = await getPerson(personId);
    const now = new Date().toISOString();

    const personMetadata: PersonMetadata = {
      familySearchId: personId,
      name: evidencePack.person.name,
      birthDate: evidencePack.person.birthDate,
      deathDate: evidencePack.person.deathDate,
      createdAt: existingPerson?.createdAt || now,
      updatedAt: now,
    };

    // Save person metadata
    await savePerson(personMetadata);

    // Save evidence pack
    const runPath = await saveEvidencePack(personId, runId, evidencePack);

    // Update latest pointer
    await setLatestRun(personId, runId);

    return NextResponse.json({
      success: true,
      personId,
      runId,
      runPath,
      sourceCount: evidencePack.sources.length,
    });

  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { 
        error: "Failed to import Evidence Pack",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
