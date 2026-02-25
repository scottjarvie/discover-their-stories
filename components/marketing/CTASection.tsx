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
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-700 to-amber-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to discover their stories?
        </h2>
        <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
          Start documenting and contextualizing your family history today. 
          Free to use, no account required.
        </p>
        
        <Button 
          asChild 
          size="lg" 
          className="bg-white text-amber-800 hover:bg-amber-50 text-lg px-8 py-6"
        >
          <Link href="/app" className="flex items-center gap-2">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>

        <p className="mt-8 text-amber-200 text-sm">
          Works with FamilySearch • Exports to Markdown • 100% Local Storage
        </p>
      </div>
    </section>
  );
}
