import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "People",
  description: "Browse people you have imported from FamilySearch evidence packs.",
  path: "/app/people",
});

export default function PeoplePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">People</h1>
      <p className="text-stone-500 mb-6">
        This workspace is being built. Start by importing sources for a person.
      </p>
      <Button asChild className="bg-amber-700 hover:bg-amber-800">
        <Link href="/app/source-docs">Open Source Docs</Link>
      </Button>
    </div>
  );
}
