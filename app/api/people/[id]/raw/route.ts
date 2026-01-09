/**
 * Raw Document API Route
 * 
 * Purpose: Generate and serve raw document for a person
 * 
 * Key Elements:
 * - GET: Generate raw document from evidence pack
 * 
 * Dependencies:
 * - @/lib/storage/fileStorage
 * - @/features/source-docs/lib/rawDocGenerator
 * - @/features/source-docs/lib/schemas
 * 
 * Last Updated: Initial setup
 */

import { NextRequest, NextResponse } from "next/server";
import { getLatestRun, getEvidencePack, getRawDocument, saveRawDocument, getPerson } from "@/lib/storage/fileStorage";
import { generateRawDocument } from "@/features/source-docs/lib/rawDocGenerator";
import { EvidencePackSchema } from "@/features/source-docs/lib/schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: personId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const runId = searchParams.get("run");

    // Get the run to use
    let targetRunId = runId;
    if (!targetRunId) {
      const latest = await getLatestRun(personId);
      targetRunId = latest?.runId || null;
    }

    if (!targetRunId) {
      return NextResponse.json(
        { error: "No runs found for this person" },
        { status: 404 }
      );
    }

    // Try to get existing raw document
    let markdown = await getRawDocument(personId, targetRunId);

    if (!markdown) {
      // Generate from evidence pack
      const evidencePack = await getEvidencePack(personId, targetRunId);
      
      if (!evidencePack) {
        return NextResponse.json(
          { error: "Evidence pack not found" },
          { status: 404 }
        );
      }

      // Validate and generate
      const parseResult = EvidencePackSchema.safeParse(evidencePack);
      
      if (!parseResult.success) {
        return NextResponse.json(
          { error: "Invalid evidence pack format" },
          { status: 500 }
        );
      }

      markdown = generateRawDocument(parseResult.data);

      // Save for future use
      await saveRawDocument(personId, targetRunId, markdown);
    }

    // Get person name
    const person = await getPerson(personId);

    return NextResponse.json({
      success: true,
      markdown,
      personName: person?.name || personId,
      runId: targetRunId,
    });

  } catch (error) {
    console.error("Error generating raw document:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate raw document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
