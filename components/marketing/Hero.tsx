/**
 * Hero Component
 * 
 * Purpose: Main hero section for marketing homepage
 * 
 * Key Elements:
 * - Headline and tagline
 * - Value proposition text
 * - CTA buttons
 * - Visual elements (decorative)
 * 
 * Dependencies:
 * - next/link
 * - @/components/ui/button
 * - lucide-react icons
 * 
 * Last Updated: Initial setup
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b45309' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Family History</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 mb-6 tracking-tight">
          Discover Their{" "}
          <span className="text-amber-700 relative">
            Stories
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8C50 2 150 2 198 8"
                stroke="#b45309"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-stone-600 mb-4 font-medium">
          A Family History AI Toolset
        </p>

        {/* Description */}
        <p className="text-lg text-stone-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Go beyond names and dates. Research deeply into your ancestors&apos; lives. 
          Create compelling content. Transform genealogical data into the stories 
          your family deserves.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild 
            size="lg" 
            className="bg-amber-700 hover:bg-amber-800 text-lg px-8 py-6"
          >
            <Link href="/app" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-6 border-stone-300"
          >
            <Link href="/features">
              See Features
            </Link>
          </Button>
        </div>

        {/* Trust Indicator */}
        <p className="mt-12 text-sm text-stone-400">
          Free to use • Your data stays local • Export everything
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
