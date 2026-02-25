/**
 * FeatureShowcase Component
 * 
 * Purpose: Section displaying all available and upcoming features
 * 
 * Key Elements:
 * - Section header
 * - Grid of feature cards
 * - Mix of available and coming soon features
 * 
 * Dependencies:
 * - @/components/layout/FeatureCard
 * - lucide-react icons
 * 
 * Last Updated: Initial setup
 */

import { FeatureCard } from "@/components/layout/FeatureCard";
import { 
  FileText, 
  BookOpen, 
  Image, 
  Clock, 
  Target, 
  FileSearch,
  Users
} from "lucide-react";

const features = [
  {
    title: "Source Documentation",
    description: "Turn FamilySearch sources into clean evidence docs and dossiers.",
    icon: FileText,
    status: "available" as const,
    href: "/features/source-docs",
  },
  {
    title: "Story Writer",
    description: "Convert documented facts into readable narrative drafts.",
    icon: BookOpen,
    status: "coming-soon" as const,
  },
  {
    title: "Photo Analyzer",
    description: "Extract people, place, and time clues from old photos.",
    icon: Image,
    status: "planned" as const,
  },
  {
    title: "Timeline Builder",
    description: "Map life events into one visual timeline.",
    icon: Clock,
    status: "planned" as const,
  },
  {
    title: "Research Planner",
    description: "Track next steps with AI-assisted research prompts.",
    icon: Target,
    status: "planned" as const,
  },
  {
    title: "Document Transcriber",
    description: "Transcribe handwritten records into searchable text.",
    icon: FileSearch,
    status: "planned" as const,
  },
  {
    title: "Family Group Sheets",
    description: "Generate polished family group sheets from your data.",
    icon: Users,
    status: "planned" as const,
  },
];

export function FeatureShowcase() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,#ffffff8a_0%,transparent_50%),radial-gradient(circle_at_85%_0%,#d7c6a966_0%,transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-[#5f665f]">The Discover Stack</p>
          <h2 className="mt-5 text-4xl leading-tight text-[#1d212a] sm:text-5xl" data-display="true">
            Tools for discovery, context, and story
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#4e5a64]">
            AI tools to find more, connect evidence, and write better stories.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-4 rounded-2xl border border-[#b79f7a66] bg-[#efe4cdcc] px-5 py-4 shadow-[0_20px_35px_-34px_#111]">
          <span className="rounded-full bg-[#234d5e] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#f7f3e8]">
            FIND
          </span>
          <span className="text-[#6d6249]">→</span>
          <span className="rounded-full bg-[#9f5a2d] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#f7f3e8]">
            CONTEXTUALIZE
          </span>
          <span className="text-[#6d6249]">→</span>
          <span className="rounded-full bg-[#476553] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#f7f3e8]">
            NARRATE
          </span>
          <span className="text-[#6d6249]">→</span>
          <span className="rounded-full bg-[#35506a] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#f7f3e8]">
            PRESERVE
          </span>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
