import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Source Tools",
  description: "Use supporting source tools and workflows connected to Source Documentation.",
  path: "/app/tools",
});

export default function ToolsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Source Tools</h1>
      <p className="text-stone-500 mb-6">
        Additional source tooling is coming soon. The Source Docs workflow is ready today.
      </p>
      <Button asChild className="bg-amber-700 hover:bg-amber-800">
        <Link href="/app/source-docs">Go to Source Docs</Link>
      </Button>
    </div>
  );
}
