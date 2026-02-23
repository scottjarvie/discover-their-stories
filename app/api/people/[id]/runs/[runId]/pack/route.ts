import { NextRequest, NextResponse } from "next/server";
import { getEvidencePack } from "@/lib/storage/fileStorage";
import { EvidencePackSchema } from "@/features/source-docs/lib/schemas";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; runId: string }> }
) {
  try {
    const { id: personId, runId } = await params;
    const evidencePack = await getEvidencePack(personId, runId);

    if (!evidencePack) {
      return NextResponse.json({ error: "Evidence pack not found" }, { status: 404 });
    }

    const parseResult = EvidencePackSchema.safeParse(evidencePack);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Evidence pack is invalid", details: parseResult.error.issues },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pack: parseResult.data,
      sourceCount: parseResult.data.sources.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load evidence pack",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
