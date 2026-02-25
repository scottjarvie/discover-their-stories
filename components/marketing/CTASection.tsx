/**
 * CTASection Component
 * 
 * Purpose: Call-to-action section at bottom of marketing pages
 * 
 * Key Elements:
 * - Compelling headline
 * - Primary CTA button
 * - Secondary info
 * 
 * Dependencies:
 * - next/link
 * - @/components/ui/button
 * 
 * Last Updated: Initial setup
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-[#16343f] via-[#214f5f] to-[#295648]" />
      <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#f1c58a2b] blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#a95e2b33] blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#f2d7af66] bg-[#f7f3e81a] px-4 py-2 text-sm text-[#f2e1c4]">
          <Sparkles className="h-4 w-4" />
          The Next Chapter of Family History
        </div>
        <h2 className="mt-8 text-4xl leading-tight text-[#fff6e5] sm:text-5xl" data-display="true">
          Move from names and dates to living stories
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#ecdeca] sm:text-xl">
          Use AI to gather evidence, build context, and publish stories your family can carry forward.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-[3.25rem] rounded-full bg-[#f8ebd5] px-8 text-base font-semibold text-[#1d3540] shadow-[0_20px_30px_-24px_#000] hover:bg-[#fff2df]"
          >
            <Link href="/app" className="flex items-center gap-2">
              Launch the Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-[3.25rem] rounded-full border-[#f3dfbe80] bg-transparent px-8 text-base text-[#fff4e1] hover:bg-[#f8ebd511]"
          >
            <Link href="/roadmap">View the Roadmap</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-[#e1d4bd]">
          FamilySearch-ready • AI-assisted • Portable exports
        </p>
      </div>
    </section>
  );
}
