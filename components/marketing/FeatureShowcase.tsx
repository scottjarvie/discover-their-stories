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
    description: "Extract and document FamilySearch sources with AI-powered analysis. Create raw evidence documents and contextualized dossiers.",
    icon: FileText,
    status: "available" as const,
    href: "/features/source-docs",
  },
  {
    title: "Story Writer",
    description: "Transform documented facts into compelling narratives. AI-assisted writing that turns genealogy data into readable stories.",
    icon: BookOpen,
    status: "coming-soon" as const,
  },
  {
    title: "Photo Analyzer",
    description: "Extract information from old photographs. Identify people, places, and time periods using AI vision.",
    icon: Image,
    status: "planned" as const,
  },
  {
    title: "Timeline Builder",
    description: "Create visual timelines from multiple sources. See your ancestor's life events in chronological context.",
    icon: Clock,
    status: "planned" as const,
  },
  {
    title: "Research Planner",
    description: "Track research goals and get AI-suggested next steps. Never lose track of what you're looking for.",
    icon: Target,
    status: "planned" as const,
  },
  {
    title: "Document Transcriber",
    description: "OCR and AI transcription for handwritten documents. Turn old letters and records into searchable text.",
    icon: FileSearch,
    status: "planned" as const,
  },
  {
    title: "Family Group Sheets",
    description: "Generate beautifully formatted family group sheets from your documented data.",
    icon: Users,
    status: "planned" as const,
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Our Tools
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            Purpose-built tools for family historians who want to do more than 
            collect names and dates.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
