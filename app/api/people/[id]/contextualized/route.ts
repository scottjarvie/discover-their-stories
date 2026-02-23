import { NextRequest, NextResponse } from "next/server";
import {
  getContextualizedDocument,
  getLatestRun,
  getPerson,
  saveContextualizedDocument,
} from "@/lib/storage/fileStorage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: personId } = await params;
    const runParam = request.nextUrl.searchParams.get("run");
    let runId = runParam;

    if (!runId) {
      const latest = await getLatestRun(personId);
      runId = latest?.runId || null;
    }

    if (!runId) {
      return NextResponse.json({
        success: false,
        status: "no_runs",
        error: "No runs found for this person",
      });
    }

    const markdown = await getContextualizedDocument(personId, runId);
    if (!markdown) {
      return NextResponse.json({
        success: false,
        status: "not_generated",
        runId,
        error: "Contextualized dossier has not been generated for this run yet",
      });
    }

    const person = await getPerson(personId);
    return NextResponse.json({
      success: true,
      markdown,
      personName: person?.name || personId,
      runId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load contextualized dossier",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: personId } = await params;
    const body = await request.json();
    const runId = typeof body.runId === "string" ? body.runId : "";
    const markdown = typeof body.markdown === "string" ? body.markdown : "";

    if (!runId || !markdown.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: runId and markdown" },
        { status: 400 }
      );
    }

    await saveContextualizedDocument(personId, runId, markdown);
    return NextResponse.json({ success: true, runId });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to save contextualized dossier",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
