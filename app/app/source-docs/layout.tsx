import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Source Documentation",
  description:
    "Import evidence packs, generate raw evidence documents, and run contextualized AI analysis.",
  path: "/app/source-docs",
});

export default function SourceDocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
