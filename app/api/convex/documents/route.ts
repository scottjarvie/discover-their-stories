/**
 * Convex Documents API Route
 *
 * Purpose: Fetch documents for a person (PS/CST) from Convex
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const isDocumentType = (value: string | null): value is "PS" | "CST" =>
  value === "PS" || value === "CST";

export async function GET(request: NextRequest) {
  if (!convexUrl) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_CONVEX_URL" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const personId = searchParams.get("personId");
  const type = searchParams.get("type");

  if (!personId) {
    return NextResponse.json(
      { error: "Missing personId" },
      { status: 400 }
    );
  }

  if (type && !isDocumentType(type)) {
    return NextResponse.json(
      { error: "Invalid document type" },
      { status: 400 }
    );
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    if (type) {
      const document = await client.query(api.documents.getDocument, {
        personId,
        type,
      });

      return NextResponse.json({
        success: true,
        document,
      });
    }

    const documents = await client.query(api.documents.getDocumentsByPerson, {
      personId,
    });

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Convex documents error:", error);
    return NextResponse.json(
      { error: "Failed to load documents" },
      { status: 500 }
    );
  }
}
